import { InertiaData, LaravelDetection, PageInspectionResult, ZiggyData } from '../types';

let bridgeData: {
  ziggy?: any;
  inertia?: any;
  bearerToken?: string | null;
} = {};

// Listen for data dispatched from page-bridge.js
window.addEventListener('laralens:bridge-data', (event: any) => {
  if (event && event.detail) {
    bridgeData = event.detail;
  }
});

// Inject page-bridge.js into page DOM
function injectBridgeScript(): void {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('page-bridge.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  } catch (err) {
    console.debug('[LaraLens] Script injection error:', err);
  }
}

// Inspect the page DOM and build inspection payload
function inspectCurrentPage(): PageInspectionResult {
  const evidence: string[] = [];

  // 1. Check CSRF meta tag
  const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  const csrfToken = csrfMeta?.content || undefined;
  if (csrfToken) {
    evidence.push('<meta name="csrf-token">');
  }

  // 2. Check Inertia root in DOM
  const appRoot = document.getElementById('app');
  let inertiaRaw: any = null;
  if (appRoot && appRoot.dataset.page) {
    try {
      inertiaRaw = JSON.parse(appRoot.dataset.page);
      evidence.push('Inertia DOM (<div id="app" data-page="...">)');
    } catch {
      // not valid JSON
    }
  }

  // Fallback to bridgeData inertia if DOM data-page wasn't present
  if (!inertiaRaw && bridgeData.inertia) {
    inertiaRaw = bridgeData.inertia;
    evidence.push('window.__page (Inertia)');
  }

  let inertiaParsed: InertiaData | null = null;
  if (inertiaRaw) {
    const rawProps = inertiaRaw.props || {};
    const shared: Record<string, unknown> = {};
    const pageSpecific: Record<string, unknown> = {};

    // In Laravel Inertia, auth, flash, errors, ziggy are typical shared props
    const typicalSharedKeys = ['auth', 'flash', 'errors', 'ziggy', 'jetstream', 'appName'];

    Object.keys(rawProps).forEach((key) => {
      if (typicalSharedKeys.includes(key)) {
        shared[key] = rawProps[key];
      } else {
        pageSpecific[key] = rawProps[key];
      }
    });

    const errors =
      rawProps.errors && typeof rawProps.errors === 'object' && Object.keys(rawProps.errors).length > 0
        ? (rawProps.errors as Record<string, unknown>)
        : undefined;

    const flash =
      rawProps.flash && typeof rawProps.flash === 'object' && Object.keys(rawProps.flash).length > 0
        ? (rawProps.flash as Record<string, unknown>)
        : undefined;

    inertiaParsed = {
      component: inertiaRaw.component,
      url: inertiaRaw.url,
      version: inertiaRaw.version,
      pageProps: pageSpecific,
      sharedProps: shared,
      rawPageData: inertiaRaw,
      errors,
      flash
    };
  }

  // 3. Ziggy Routes
  let ziggyParsed: ZiggyData | null = null;
  const rawZiggy = bridgeData.ziggy || (inertiaRaw?.props?.ziggy as any);
  if (rawZiggy && rawZiggy.routes) {
    evidence.push('Ziggy Routes (window.Ziggy)');
    ziggyParsed = {
      url: rawZiggy.url,
      port: rawZiggy.port,
      defaults: rawZiggy.defaults,
      routes: rawZiggy.routes
    };
  }

  // 4. Token scan
  let bearerToken = bridgeData.bearerToken || undefined;
  if (!bearerToken) {
    try {
      const keys = ['token', 'bearer_token', 'auth_token', 'sanctum_token', 'jwt_token', 'access_token'];
      for (const k of keys) {
        const val = localStorage.getItem(k) || sessionStorage.getItem(k);
        if (val) {
          bearerToken = val.replace(/^Bearer\s+/i, '');
          break;
        }
      }
    } catch {
      // restricted
    }
  }

  const isLaravel = evidence.length > 0 || !!csrfToken || !!inertiaParsed || !!ziggyParsed;
  const isInertia = !!inertiaParsed;
  const hasZiggy = !!ziggyParsed;
  const hasCsrf = !!csrfToken;

  const detection: LaravelDetection = {
    isLaravel,
    isInertia,
    hasZiggy,
    hasCsrf,
    inertiaVersion: inertiaParsed?.version,
    frameworkEvidence: evidence
  };

  return {
    url: window.location.href,
    title: document.title,
    detection,
    auth: {
      csrfToken,
      bearerToken,
      authUser: (inertiaParsed?.sharedProps?.auth as any)?.user || null
    },
    inertia: inertiaParsed,
    ziggy: ziggyParsed
  };
}

// Initial injection
injectBridgeScript();

// Message listener for popup/background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'LARALENS_GET_PAGE_DATA') {
    // Re-trigger bridge to refresh latest props if SPA navigated
    injectBridgeScript();
    setTimeout(() => {
      sendResponse(inspectCurrentPage());
    }, 60);
    return true; // async sendResponse
  }
});

// Auto-report detection to background script
setTimeout(() => {
  const result = inspectCurrentPage();
  if (result.detection.isLaravel) {
    chrome.runtime.sendMessage({
      type: 'LARALENS_PAGE_DETECTED',
      data: result.detection
    });
  }
}, 400);
