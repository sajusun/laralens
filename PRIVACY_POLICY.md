# Privacy Policy for LaraLens

**Effective Date:** October 28, 2026  
**Last Updated:** October 28, 2026  
**Developer:** Sakhawat Hossain ([https://sajusun.github.io](https://sajusun.github.io))  
**Repository:** [https://github.com/sajusun/laralens](https://github.com/sajusun/laralens)

---

## 1. Overview
LaraLens ("the Extension") is an open-source, developer utility extension built to assist Laravel and Inertia.js developers in inspecting local CSRF tokens, session cookies, Inertia props, and Ziggy routes.

We are firmly committed to user privacy. **LaraLens operates entirely client-side and does NOT collect, store, transmit, or sell any personal data, browsing history, or cookie values to any external server or third party.**

---

## 2. Information Handled by LaraLens
All data handled by LaraLens remains strictly within the user's local browser sandbox:

- **Cookies (`laravel_session`, `XSRF-TOKEN`, `remember_token`):**  
  Accessed only on active tabs via the `chrome.cookies` API strictly when the user opens the LaraLens popup. This data is displayed in the local dashboard so developers can copy headers for testing tools like cURL or Postman. **No cookie data is sent anywhere.**
- **Active Tab DOM & Page Scripts (`window.Ziggy`, `window.__page`, CSRF meta tag):**  
  Inspected in memory on the currently active tab to display route names, parameter definitions, and Inertia component properties. This data is discarded when the extension popup is closed.
- **Local Storage / Session Storage:**  
  Scanned strictly on the active domain for standard Sanctum or JWT bearer token keys (`token`, `sanctum_token`, etc.) solely to help developers copy authorization headers.
- **API Tester:**  
  Requests sent via the built-in API tester are executed directly from your local browser instance to the destination URL specified by you. No intermediate proxy or analytical servers are used.

---

## 3. Permissions Requested & Why
To function as a developer tool across local and remote development environments, LaraLens requests the following permissions:

| Permission | Purpose |
| :--- | :--- |
| `activeTab` | Grants temporary access to inspect the DOM of the active tab when the extension icon is clicked. |
| `cookies` | Reads `XSRF-TOKEN` and `laravel_session` on the active site to generate cURL/Postman headers and allow developers to reset session cookies. |
| `storage` | Used locally to persist developer preferences (e.g., active filters or views). |
| `scripting` | Injects a lightweight bridge script into the page's context to read `window.Ziggy` routes and `window.__page` Inertia props. |
| `host_permissions` (`http://*/*`, `https://*/*`) | Allows the extension to function across custom local development domains (e.g., `http://localhost:*`, `http://*.test`, `http://*.local`, `http://127.0.0.1:*`) as well as staging and production environments. |

---

## 4. Third-Party Sharing and Analytics
- **Zero Third-Party Trackers:** LaraLens contains no analytics SDKs (e.g., Google Analytics), no tracking pixels, and no advertising networks.
- **Zero External Telemetry:** No telemetry or diagnostics data is transmitted outside your local browser.
- **Zero Remote Code:** LaraLens does not load any external or remote JavaScript. All assets and logic are bundled in the extension package in full compliance with Manifest V3.

---

## 5. Open Source Code Transparency
LaraLens is 100% open-source software licensed under the MIT License. Anyone can inspect, audit, and verify the source code at:  
👉 [https://github.com/sajusun/laralens](https://github.com/sajusun/laralens)

---

## 6. Children's Privacy
LaraLens is a developer tool and does not knowingly collect or solicit any information from children under 13.

---

## 7. Changes to this Policy
If this Privacy Policy is updated, changes will be published directly in the GitHub repository.

---

## 8. Contact & Inquiries
For privacy questions, feature suggestions, or feedback:
- **Developer:** Sakhawat Hossain
- **Website:** [https://sajusun.github.io](https://sajusun.github.io)
- **GitHub Issues:** [https://github.com/sajusun/laralens/issues](https://github.com/sajusun/laralens/issues)
