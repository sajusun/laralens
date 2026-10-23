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
});
