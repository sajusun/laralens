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

    // Check for tokens in localStorage or sessionStorage
    let bearerToken: string | null = null;
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
      // localStorage may be restricted
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
