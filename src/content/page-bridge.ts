// Page bridge injected into the page's MAIN world to extract window.Ziggy & window.Inertia

(() => {
  try {
    const customWindow = window as any;

    let ziggyData: any = null;
    if (customWindow.Ziggy) {
      ziggyData = customWindow.Ziggy;
    } else if (customWindow.route && typeof customWindow.route === 'function' && (customWindow.route() as any)?.t) {
      // Sometimes Ziggy is available via route() configuration
      ziggyData = (customWindow.route() as any).t;
    }

    let inertiaData: any = null;
    if (customWindow.__page) {
      inertiaData = customWindow.__page;
    }

    // Deep scan for JWT or Sanctum Bearer tokens in localStorage or sessionStorage
    let bearerToken: string | null = null;
    try {
      const isJwt = (str: unknown): boolean => {
        if (typeof str !== 'string') return false;
        const clean = str.replace(/^Bearer\s+/i, '').trim();
        return clean.startsWith('eyJ') && clean.split('.').length === 3;
      };

      const cleanToken = (str: string): string => str.replace(/^Bearer\s+/i, '').trim();

      // 1. Direct key lookups
      const commonKeys = [
        'token',
        'jwt',
        'access_token',
        'accessToken',
        'bearer_token',
        'auth_token',
        'sanctum_token',
        'id_token',
        'api_token'
      ];

      for (const k of commonKeys) {
        const val = localStorage.getItem(k) || sessionStorage.getItem(k);
        if (val) {
          if (isJwt(val) || (val.length > 20 && !val.startsWith('{'))) {
            bearerToken = cleanToken(val);
            break;
          }
        }
      }

      // 2. Scan all storage keys for JWT strings or JSON objects
      if (!bearerToken) {
        const storages = [localStorage, sessionStorage];
        for (const storage of storages) {
          if (bearerToken) break;
          for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (!key) continue;
            const raw = storage.getItem(key);
            if (!raw) continue;

            if (isJwt(raw)) {
              bearerToken = cleanToken(raw);
              break;
            }

            if (raw.startsWith('{')) {
              try {
                const parsed = JSON.parse(raw);
                const candidate =
                  parsed.token ||
                  parsed.access_token ||
                  parsed.accessToken ||
                  parsed.jwt ||
                  parsed?.auth?.token ||
                  parsed?.user?.token;
                if (candidate && (isJwt(candidate) || typeof candidate === 'string')) {
                  bearerToken = cleanToken(String(candidate));
                  break;
                }
              } catch {
                // not JSON
              }
            }
          }
        }
      }
    } catch {
      // Storage might be restricted
    }

    const payload = {
      ziggy: ziggyData,
      inertia: inertiaData,
      bearerToken
    };

    window.dispatchEvent(new CustomEvent('laralens:bridge-data', { detail: payload }));
  } catch (err) {
    console.debug('[LaraLens] Bridge scan error:', err);
  }
})();
