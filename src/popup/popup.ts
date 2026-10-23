import { ActiveTabCategory, PageInspectionResult, ZiggyRoute } from '../types';

let pageData: PageInspectionResult | null = null;
let cookies: Record<string, string> = {};
let activeTab: chrome.tabs.Tab | null = null;
let currentNavTab: ActiveTabCategory = 'auth';
let currentInertiaView: 'page' | 'shared' | 'raw' = 'page';
let selectedMethodFilter = 'ALL';

// DOM: Header
const detectionBadge = document.getElementById('detection-badge') as HTMLDivElement;
const detectionText = document.getElementById('detection-text') as HTMLSpanElement;
const btnRefresh = document.getElementById('btn-refresh') as HTMLButtonElement;
const footerPageUrl = document.getElementById('footer-page-url') as HTMLSpanElement;

// DOM: Nav Tabs
const navTabs = document.querySelectorAll<HTMLButtonElement>('.nav-tab');
const tabPanes = document.querySelectorAll<HTMLElement>('.tab-pane');
const badgeInertia = document.getElementById('badge-inertia') as HTMLSpanElement;
const badgeRoutes = document.getElementById('badge-routes') as HTMLSpanElement;

// DOM: Tab 1 (Auth)
const valCsrf = document.getElementById('val-csrf') as HTMLDivElement;
const valXsrf = document.getElementById('val-xsrf') as HTMLDivElement;
const valSession = document.getElementById('val-session') as HTMLDivElement;
const valBearer = document.getElementById('val-bearer') as HTMLDivElement;
const authUserCard = document.getElementById('auth-user-card') as HTMLDivElement;
const userInfoText = document.getElementById('user-info-text') as HTMLSpanElement;
const btnCopyCurl = document.getElementById('btn-copy-curl') as HTMLButtonElement;
const btnCopyPostman = document.getElementById('btn-copy-postman') as HTMLButtonElement;
const btnCopyUser = document.getElementById('btn-copy-user') as HTMLButtonElement;

// DOM: Tab 2 (Inertia)
const inertiaCompName = document.getElementById('inertia-comp-name') as HTMLSpanElement;
const inertiaVersionTag = document.getElementById('inertia-version-tag') as HTMLSpanElement;
const inertiaUrlTag = document.getElementById('inertia-url-tag') as HTMLSpanElement;
const btnCopyProps = document.getElementById('btn-copy-props') as HTMLButtonElement;
const subTabs = document.querySelectorAll<HTMLButtonElement>('.sub-tab');
const inputFilterProps = document.getElementById('input-filter-props') as HTMLInputElement;
const propsJsonViewer = document.getElementById('props-json-viewer') as HTMLPreElement;
const propsEmpty = document.getElementById('props-empty') as HTMLDivElement;

// DOM: Tab 3 (Ziggy)
const inputFilterRoutes = document.getElementById('input-filter-routes') as HTMLInputElement;
const methodBtns = document.querySelectorAll<HTMLButtonElement>('.method-btn');
const routesCountLabel = document.getElementById('routes-count-label') as HTMLSpanElement;
const btnCopyAllRoutes = document.getElementById('btn-copy-all-routes') as HTMLButtonElement;
const routesList = document.getElementById('routes-list') as HTMLDivElement;

// DOM: Tab 4 (API)
const apiMethod = document.getElementById('api-method') as HTMLSelectElement;
const apiEndpoint = document.getElementById('api-endpoint') as HTMLInputElement;
const btnSendApi = document.getElementById('btn-send-api') as HTMLButtonElement;
const apiStatusBadge = document.getElementById('api-status-badge') as HTMLSpanElement;
const apiResponseViewer = document.getElementById('api-response-viewer') as HTMLPreElement;

// DOM: Toast
const toast = document.getElementById('toast') as HTMLDivElement;

function init(): void {
  setupEventListeners();
  loadActiveTabInspection();
}

function setupEventListeners(): void {
  // Refresh button
  btnRefresh.addEventListener('click', () => {
    btnRefresh.style.transform = 'rotate(180deg)';
    setTimeout(() => (btnRefresh.style.transform = 'none'), 300);
    loadActiveTabInspection();
  });

  // Nav Tabs switching
  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      navTabs.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab') as ActiveTabCategory;
      currentNavTab = tabId;

      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Copy individual tokens
  document.querySelectorAll<HTMLButtonElement>('.btn-copy-token').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      let textToCopy = '';

      if (target === 'csrf') textToCopy = valCsrf.textContent || '';
      else if (target === 'xsrf') textToCopy = valXsrf.textContent || '';
      else if (target === 'session') textToCopy = valSession.textContent || '';
      else if (target === 'bearer') textToCopy = valBearer.textContent || '';

      if (textToCopy && !textToCopy.startsWith('Scanning') && !textToCopy.startsWith('No token')) {
        copyToClipboard(textToCopy, 'Token copied!');
      } else {
        showToast('No token value available');
      }
    });
  });

  // cURL & Postman generators
  btnCopyCurl.addEventListener('click', copyCurlHeaders);
  btnCopyPostman.addEventListener('click', copyPostmanHeaders);
  btnCopyUser.addEventListener('click', () => {
    if (pageData?.auth.authUser) {
      copyToClipboard(JSON.stringify(pageData.auth.authUser, null, 2), 'User object copied!');
    }
  });

  // Inertia Sub-tabs
  subTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      subTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentInertiaView = btn.getAttribute('data-view') as 'page' | 'shared' | 'raw';
      renderInertiaProps();
    });
  });

  inputFilterProps.addEventListener('input', renderInertiaProps);
  btnCopyProps.addEventListener('click', () => {
    if (pageData?.inertia) {
      const data =
        currentInertiaView === 'page'
          ? pageData.inertia.pageProps
          : currentInertiaView === 'shared'
          ? pageData.inertia.sharedProps
          : pageData.inertia.rawPageData;
      copyToClipboard(JSON.stringify(data, null, 2), 'Props copied!');
    }
  });

  // Ziggy Methods & Search Filter
  methodBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      methodBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMethodFilter = btn.getAttribute('data-method') || 'ALL';
      renderZiggyRoutes();
    });
  });

  inputFilterRoutes.addEventListener('input', renderZiggyRoutes);
  btnCopyAllRoutes.addEventListener('click', () => {
    if (pageData?.ziggy?.routes) {
      copyToClipboard(JSON.stringify(pageData.ziggy.routes, null, 2), 'All routes copied!');
    }
  });

  // API Tester
  btnSendApi.addEventListener('click', handleApiSend);
}

function loadActiveTabInspection(): void {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    mockDemoData();
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0 || !tabs[0].id) {
      detectionBadge.className = 'badge-status not-laravel';
      detectionText.textContent = 'No Active Tab';
      return;
    }

    activeTab = tabs[0];
    const url = activeTab.url || '';
    footerPageUrl.textContent = url;

    // 1. Fetch Cookies from background
    chrome.runtime.sendMessage({ type: 'LARALENS_FETCH_COOKIES', url }, (cookieRes) => {
      cookies = cookieRes?.cookies || {};

      // 2. Query Content Script for Page Data
      chrome.tabs.sendMessage(activeTab!.id!, { type: 'LARALENS_GET_PAGE_DATA' }, (res) => {
        if (chrome.runtime.lastError || !res) {
          // If content script was not ready, try scripting injection or fallback
          evaluatePageDirectly(activeTab!.id!, url);
        } else {
          pageData = res;
          mergeCookiesIntoData();
          renderAll();
        }
      });
    });
  });
}

function evaluatePageDirectly(tabId: number, url: string): void {
  // Fallback direct execution if content script had not loaded
  chrome.scripting.executeScript(
    {
      target: { tabId },
      func: () => {
        const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        const app = document.getElementById('app');
        return {
          csrfToken: meta?.content || null,
          inertiaRaw: app?.dataset?.page ? JSON.parse(app.dataset.page) : null,
          title: document.title,
          url: window.location.href
        };
      }
    },
    (results) => {
      if (results && results[0] && results[0].result) {
        const r = results[0].result;
        const hasCsrf = !!r.csrfToken;
        const hasInertia = !!r.inertiaRaw;
        const isLaravel = hasCsrf || hasInertia || Object.keys(cookies).length > 0;

        pageData = {
          url,
          title: r.title,
          detection: {
            isLaravel,
            isInertia: hasInertia,
            hasZiggy: !!r.inertiaRaw?.props?.ziggy,
            hasCsrf,
            frameworkEvidence: ['Direct DOM Scan']
          },
          auth: {
            csrfToken: r.csrfToken || undefined,
            authUser: r.inertiaRaw?.props?.auth?.user || null
          },
          inertia: r.inertiaRaw
            ? {
                component: r.inertiaRaw.component,
                url: r.inertiaRaw.url,
                version: r.inertiaRaw.version,
                pageProps: r.inertiaRaw.props || {},
                sharedProps: r.inertiaRaw.props?.auth || {},
                rawPageData: r.inertiaRaw
              }
            : null,
          ziggy: r.inertiaRaw?.props?.ziggy
            ? {
                routes: r.inertiaRaw.props.ziggy.routes
              }
            : null
        };
      } else {
        // Fallback detection using cookies
        const hasCookies = !!cookies['laravel_session'] || !!cookies['XSRF-TOKEN'];
        pageData = {
          url,
          title: '',
          detection: {
            isLaravel: hasCookies,
            isInertia: false,
            hasZiggy: false,
            hasCsrf: false,
            frameworkEvidence: hasCookies ? ['Laravel Cookies'] : []
          },
          auth: {},
          inertia: null,
          ziggy: null
        };
      }

      mergeCookiesIntoData();
      renderAll();
    }
  );
}

function mergeCookiesIntoData(): void {
  if (!pageData) return;
  if (cookies['XSRF-TOKEN']) {
    pageData.auth.xsrfToken = cookies['XSRF-TOKEN'];
    if (!pageData.detection.isLaravel) {
      pageData.detection.isLaravel = true;
      pageData.detection.frameworkEvidence.push('XSRF-TOKEN cookie');
    }
  }
  if (cookies['laravel_session']) {
    pageData.auth.sessionCookie = cookies['laravel_session'];
    if (!pageData.detection.isLaravel) {
      pageData.detection.isLaravel = true;
      pageData.detection.frameworkEvidence.push('laravel_session cookie');
    }
  }
}

function renderAll(): void {
  if (!pageData) return;

  // 1. Detection Header Badge
  if (pageData.detection.isInertia) {
    detectionBadge.className = 'badge-status inertia';
    detectionText.textContent = `Inertia.js Detected (${pageData.inertia?.version || 'v1'})`;
  } else if (pageData.detection.isLaravel) {
    detectionBadge.className = 'badge-status laravel';
    detectionText.textContent = 'Laravel App Detected';
  } else {
    detectionBadge.className = 'badge-status not-laravel';
    detectionText.textContent = 'Not a Laravel App';
  }

  // 2. Auth & Security Hub
  valCsrf.textContent = pageData.auth.csrfToken || 'Not present on page';
  valCsrf.classList.toggle('empty', !pageData.auth.csrfToken);

  valXsrf.textContent = pageData.auth.xsrfToken || 'No XSRF-TOKEN cookie';
  valXsrf.classList.toggle('empty', !pageData.auth.xsrfToken);

  valSession.textContent = pageData.auth.sessionCookie || 'No laravel_session cookie';
  valSession.classList.toggle('empty', !pageData.auth.sessionCookie);

  valBearer.textContent = pageData.auth.bearerToken || 'No token found in storage';
  valBearer.classList.toggle('empty', !pageData.auth.bearerToken);

  // Authenticated User
  if (pageData.auth.authUser) {
    authUserCard.style.display = 'flex';
    const u = pageData.auth.authUser as any;
    userInfoText.textContent = `${u.name || 'User'} (${u.email || u.id || 'ID #' + u.id})`;
  } else {
    authUserCard.style.display = 'none';
  }

  // 3. Inertia Tab
  if (pageData.inertia) {
    badgeInertia.textContent = Object.keys(pageData.inertia.pageProps).length.toString();
    inertiaCompName.textContent = pageData.inertia.component || 'Unknown';
    inertiaVersionTag.textContent = pageData.inertia.version ? `v${pageData.inertia.version}` : 'v1.0';
    inertiaUrlTag.textContent = pageData.inertia.url || activeTab?.url || '';
    propsEmpty.style.display = 'none';
    renderInertiaProps();
  } else {
    badgeInertia.textContent = '0';
    inertiaCompName.textContent = 'No Inertia.js component';
    inertiaVersionTag.textContent = '-';
    inertiaUrlTag.textContent = '-';
    propsJsonViewer.textContent = '';
    propsEmpty.style.display = 'block';
  }

  // 4. Ziggy Routes
  if (pageData.ziggy && pageData.ziggy.routes) {
    const routeKeys = Object.keys(pageData.ziggy.routes);
    badgeRoutes.textContent = routeKeys.length.toString();
    renderZiggyRoutes();
  } else {
    badgeRoutes.textContent = '0';
    routesCountLabel.textContent = '0 routes found';
    routesList.innerHTML = '<div class="empty-state">No Ziggy routes detected on this page.</div>';
  }
}

function renderInertiaProps(): void {
  if (!pageData?.inertia) return;

  let targetObject: Record<string, unknown> = {};
  if (currentInertiaView === 'page') targetObject = pageData.inertia.pageProps;
  else if (currentInertiaView === 'shared') targetObject = pageData.inertia.sharedProps;
  else targetObject = pageData.inertia.rawPageData || {};

  const query = inputFilterProps.value.toLowerCase().trim();
  if (query) {
    const filtered: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(targetObject)) {
      if (key.toLowerCase().includes(query) || JSON.stringify(val).toLowerCase().includes(query)) {
        filtered[key] = val;
      }
    }
    propsJsonViewer.textContent = JSON.stringify(filtered, null, 2);
  } else {
    propsJsonViewer.textContent = JSON.stringify(targetObject, null, 2);
  }
}

function renderZiggyRoutes(): void {
  if (!pageData?.ziggy?.routes) return;

  const routesObj = pageData.ziggy.routes;
  const filterQuery = inputFilterRoutes.value.toLowerCase().trim();

  let routeEntries: [string, ZiggyRoute][] = Object.entries(routesObj).map(([name, r]: [string, any]) => {
    return [
      name,
      {
        name,
        uri: r.uri || '',
        methods: Array.isArray(r.methods) ? r.methods : ['GET'],
        parameters: r.parameters || [],
        domain: r.domain
      }
    ];
  });

  // Filter by method
  if (selectedMethodFilter !== 'ALL') {
    routeEntries = routeEntries.filter(([_, r]) => r.methods.includes(selectedMethodFilter));
  }

  // Filter by text search
  if (filterQuery) {
    routeEntries = routeEntries.filter(([name, r]) => name.toLowerCase().includes(filterQuery) || r.uri.toLowerCase().includes(filterQuery));
  }

  routesCountLabel.textContent = `${routeEntries.length} routes matching`;

  if (routeEntries.length === 0) {
    routesList.innerHTML = '<div class="empty-state">No routes match your search.</div>';
    return;
  }

  routesList.innerHTML = '';
  routeEntries.slice(0, 100).forEach(([name, route]) => {
    const card = document.createElement('div');
    card.className = 'route-card';

    const left = document.createElement('div');
    left.className = 'route-left';

    const primaryMethod = route.methods[0] || 'GET';
    const methodBadge = document.createElement('span');
    methodBadge.className = `method-badge ${primaryMethod}`;
    methodBadge.textContent = primaryMethod;

    const details = document.createElement('div');
    details.className = 'route-details';

    const routeNameEl = document.createElement('span');
    routeNameEl.className = 'route-name';
    routeNameEl.textContent = name;

    const routeUriEl = document.createElement('span');
    routeUriEl.className = 'route-uri';
    routeUriEl.textContent = `/${route.uri.replace(/^\//, '')}`;

    details.appendChild(routeNameEl);
    details.appendChild(routeUriEl);

    left.appendChild(methodBadge);
    left.appendChild(details);

    const actions = document.createElement('div');
    actions.className = 'route-actions';

    const copyUriBtn = document.createElement('button');
    copyUriBtn.className = 'btn-route-action';
    copyUriBtn.textContent = 'URI';
    copyUriBtn.title = 'Copy Route URI';
    copyUriBtn.addEventListener('click', () => {
      copyToClipboard(`/${route.uri.replace(/^\//, '')}`, 'URI copied!');
    });

    const copyZiggyBtn = document.createElement('button');
    copyZiggyBtn.className = 'btn-route-action';
    copyZiggyBtn.textContent = 'route()';
    copyZiggyBtn.title = 'Copy Ziggy JS route helper';
    copyZiggyBtn.addEventListener('click', () => {
      copyToClipboard(`route('${name}')`, 'route() copied!');
    });

    actions.appendChild(copyUriBtn);
    actions.appendChild(copyZiggyBtn);

    card.appendChild(left);
    card.appendChild(actions);
    routesList.appendChild(card);
  });
}

function copyCurlHeaders(): void {
  const xsrf = pageData?.auth.xsrfToken || cookies['XSRF-TOKEN'] || '';
  const session = pageData?.auth.sessionCookie || cookies['laravel_session'] || '';
  const bearer = pageData?.auth.bearerToken || '';

  const headers: string[] = ['-H "Accept: application/json"'];
  if (xsrf) headers.push(`-H "X-XSRF-TOKEN: ${xsrf}"`);
  if (session || xsrf) {
    const cookieParts: string[] = [];
    if (session) cookieParts.push(`laravel_session=${session}`);
    if (xsrf) cookieParts.push(`XSRF-TOKEN=${encodeURIComponent(xsrf)}`);
    headers.push(`-H "Cookie: ${cookieParts.join('; ')}"`);
  }
  if (bearer) headers.push(`-H "Authorization: Bearer ${bearer}"`);

  copyToClipboard(headers.join(' \\\n  '), 'cURL headers copied!');
}

function copyPostmanHeaders(): void {
  const xsrf = pageData?.auth.xsrfToken || cookies['XSRF-TOKEN'] || '';
  const session = pageData?.auth.sessionCookie || cookies['laravel_session'] || '';
  const bearer = pageData?.auth.bearerToken || '';

  const list: Array<{ key: string; value: string; type: string }> = [
    { key: 'Accept', value: 'application/json', type: 'text' }
  ];

  if (xsrf) list.push({ key: 'X-XSRF-TOKEN', value: xsrf, type: 'text' });
  if (session || xsrf) {
    const cookieParts: string[] = [];
    if (session) cookieParts.push(`laravel_session=${session}`);
    if (xsrf) cookieParts.push(`XSRF-TOKEN=${encodeURIComponent(xsrf)}`);
    list.push({ key: 'Cookie', value: cookieParts.join('; '), type: 'text' });
  }
  if (bearer) list.push({ key: 'Authorization', value: `Bearer ${bearer}`, type: 'text' });

  copyToClipboard(JSON.stringify(list, null, 2), 'Postman headers JSON copied!');
}

async function handleApiSend(): Promise<void> {
  let endpoint = apiEndpoint.value.trim();
  if (!endpoint) endpoint = '/api/user';

  const method = apiMethod.value;
  let fullUrl = endpoint;

  if (activeTab?.url && endpoint.startsWith('/')) {
    try {
      const parsed = new URL(activeTab.url);
      fullUrl = `${parsed.origin}${endpoint}`;
    } catch {
      // fallback
    }
  }

  apiStatusBadge.className = 'status-code-badge';
  apiStatusBadge.textContent = 'Sending...';
  apiResponseViewer.textContent = `Connecting to ${fullUrl}...`;

  try {
    const xsrf = pageData?.auth.xsrfToken || cookies['XSRF-TOKEN'];
    const bearer = pageData?.auth.bearerToken;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;
    if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

    const start = performance.now();
    const res = await fetch(fullUrl, {
      method,
      headers,
      credentials: 'include'
    });
    const duration = Math.round(performance.now() - start);

    apiStatusBadge.textContent = `${res.status} ${res.statusText} (${duration}ms)`;
    apiStatusBadge.className = `status-code-badge ${res.ok ? 'ok' : 'error'}`;

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      apiResponseViewer.textContent = JSON.stringify(json, null, 2);
    } catch {
      apiResponseViewer.textContent = text || '// Empty response body';
    }
  } catch (err: any) {
    apiStatusBadge.textContent = 'Request Failed';
    apiStatusBadge.className = 'status-code-badge error';
    apiResponseViewer.textContent = `Error: ${err.message || String(err)}\nNote: If this is a local endpoint, verify CORS settings or open the URL directly in the tab.`;
  }
}

function copyToClipboard(text: string, successMessage: string): void {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage);
  });
}

function showToast(text: string): void {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function mockDemoData(): void {
  pageData = {
    url: 'http://robertcravatt.test/dashboard',
    title: 'Laravel Inertia Dashboard',
    detection: {
      isLaravel: true,
      isInertia: true,
      hasZiggy: true,
      hasCsrf: true,
      inertiaVersion: '1.2.0',
      frameworkEvidence: ['<meta name="csrf-token">', 'Inertia DOM', 'Ziggy Routes']
    },
    auth: {
      csrfToken: 'AbCdEf1234567890XyZ_LaravelCsrfMock',
      xsrfToken: 'eyJpdiI6IlhYZF...XSRF_Cookie_Token',
      sessionCookie: 'laravel_session_mock_cookie_val_12345',
      bearerToken: '1|sanctum_token_mock_test_abc123',
      authUser: {
        id: 1,
        name: 'Sakhawat Hossain',
        email: 'saju@example.com',
        role: 'Admin'
      }
    },
    inertia: {
      component: 'Pages/Dashboard',
      url: '/dashboard',
      version: '1.2.0',
      pageProps: {
        stats: { totalOrders: 1420, revenue: '$45,200', activeUsers: 89 },
        recentActivity: ['Order #1024 paid', 'New user registered']
      },
      sharedProps: {
        auth: {
          user: { id: 1, name: 'Sakhawat Hossain', email: 'saju@example.com' }
        },
        flash: { message: 'Welcome back to LaraLens!' }
      }
    },
    ziggy: {
      routes: {
        'dashboard': { uri: 'dashboard', methods: ['GET'] },
        'users.index': { uri: 'users', methods: ['GET'] },
        'users.store': { uri: 'users', methods: ['POST'] },
        'users.show': { uri: 'users/{user}', methods: ['GET'] },
        'users.update': { uri: 'users/{user}', methods: ['PUT', 'PATCH'] },
        'users.destroy': { uri: 'users/{user}', methods: ['DELETE'] },
        'api.orders.index': { uri: 'api/orders', methods: ['GET'] },
        'api.orders.store': { uri: 'api/orders', methods: ['POST'] }
      }
    }
  };
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
