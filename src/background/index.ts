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

    try {
      chrome.cookies.getAll({ url }, (cookies) => {
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

        let removedCount = 0;
        toRemove.forEach((c) => {
          const protocol = c.secure ? 'https:' : 'http:';
          const domain = c.domain.startsWith('.') ? c.domain.slice(1) : c.domain;
          const cookieUrl = `${protocol}//${domain}${c.path}`;

          chrome.cookies.remove({ url: cookieUrl, name: c.name }, () => {
            removedCount++;
            if (removedCount === toRemove.length) {
              sendResponse({ success: true, count: removedCount });
            }
          });
        });
      });
    } catch (err) {
      console.error('[LaraLens] Clear cookies error:', err);
      sendResponse({ success: false, count: 0, error: String(err) });
    }
    return true; // async sendResponse
  }
});
