// LaraLens Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('LaraLens Service Worker installed successfully.');
});

// Update badge when content script detects Laravel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LARALENS_PAGE_DETECTED' && sender.tab?.id) {
    const tabId = sender.tab.id;
    const isIntertia = message.data?.isInertia;

    chrome.action.setBadgeText({
      tabId,
      text: isIntertia ? 'INRT' : 'LARA'
    });

    chrome.action.setBadgeBackgroundColor({
      tabId,
      color: '#ff2d20' // Laravel Red
    });

    chrome.action.setTitle({
      tabId,
      title: isIntertia ? 'Laravel + Inertia.js App Detected' : 'Laravel Application Detected'
    });
  }

  if (message.type === 'LARALENS_FETCH_COOKIES') {
    const url = message.url;
    if (!url) {
      sendResponse({ cookies: {} });
      return true;
    }

    try {
      chrome.cookies.getAll({ url }, (cookies) => {
        const cookieMap: Record<string, string> = {};
        for (const c of cookies) {
          if (c.name === 'XSRF-TOKEN') {
            try {
              cookieMap['XSRF-TOKEN'] = decodeURIComponent(c.value);
            } catch {
              cookieMap['XSRF-TOKEN'] = c.value;
            }
          } else if (c.name === 'laravel_session' || c.name.includes('session')) {
            cookieMap['laravel_session'] = c.value;
          } else if (c.name.startsWith('remember_web_')) {
            cookieMap['remember_token'] = c.value;
          } else if (
            c.name.toLowerCase() === 'jwt' ||
            c.name.toLowerCase() === 'token' ||
            c.name.toLowerCase() === 'access_token' ||
            c.name.toLowerCase() === 'auth_token' ||
            c.value.startsWith('eyJ')
          ) {
            cookieMap['bearerToken'] = c.value.replace(/^Bearer\s+/i, '');
          }
        }
        sendResponse({ cookies: cookieMap });
      });
    } catch (err) {
      console.error('[LaraLens] Cookies error:', err);
      sendResponse({ cookies: {} });
    }
    return true; // async sendResponse
  }

  if (message.type === 'LARALENS_CLEAR_COOKIES') {
    const url = message.url;
    if (!url) {
      sendResponse({ success: false, count: 0 });
      return true;
    }

    (async () => {
      try {
        chrome.cookies.getAll({ url }, async (cookies) => {
          if (chrome.runtime.lastError || !cookies) {
            sendResponse({ success: false, count: 0, error: chrome.runtime.lastError?.message });
            return;
          }

          const toRemove = cookies.filter(
            (c) =>
              c.name === 'XSRF-TOKEN' ||
              c.name.toLowerCase().includes('session') ||
              c.name.startsWith('remember_')
          );

          if (toRemove.length === 0) {
            sendResponse({ success: true, count: 0 });
            return;
          }

          // Build possible candidate URLs to remove cookies across domain, port, and path
          const removeSingleCookie = (c: chrome.cookies.Cookie): Promise<boolean> => {
            return new Promise((resolve) => {
              const urlsToTry: string[] = [];

              // Candidate 1: Active tab origin + path
              try {
                const parsed = new URL(url);
                urlsToTry.push(`${parsed.protocol}//${parsed.host}${c.path}`);
                urlsToTry.push(`${parsed.protocol}//${parsed.hostname}${c.path}`);
              } catch {}

              // Candidate 2: Domain reconstructed URL
              const cleanDomain = c.domain.startsWith('.') ? c.domain.slice(1) : c.domain;
              const protocol = c.secure ? 'https:' : 'http:';
              urlsToTry.push(`${protocol}//${cleanDomain}${c.path}`);

              // Attempt removal sequentially across candidate URLs until one succeeds
              let index = 0;
              const attempt = () => {
                if (index >= urlsToTry.length) {
                  resolve(false);
                  return;
                }
                const targetUrl = urlsToTry[index++];
                try {
                  chrome.cookies.remove(
                    { url: targetUrl, name: c.name, storeId: c.storeId },
                    (details) => {
                      if (chrome.runtime.lastError || !details) {
                        attempt();
                      } else {
                        resolve(true);
                      }
                    }
                  );
                } catch {
                  attempt();
                }
              };
              attempt();
            });
          };

          const removalResults = await Promise.all(toRemove.map((c) => removeSingleCookie(c)));
          const successfulCount = removalResults.filter(Boolean).length;

          sendResponse({
            success: true,
            count: successfulCount
          });
        });
      } catch (err) {
        console.error('[LaraLens] Clear cookies error:', err);
        sendResponse({ success: false, count: 0, error: String(err) });
      }
    })();

    return true; // async sendResponse
  }
});
