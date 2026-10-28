<div align="center">

# 🔍 LaraLens
### The Ultimate DevTools for Laravel & Inertia.js Developers

[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Laravel](https://img.shields.io/badge/Laravel-Ecosystem_Ready-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-Vue_%2F_React-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

**Stop digging through native browser DevTools just to find CSRF tokens, session cookies, Inertia props, or backend routes.**  
LaraLens automatically detects Laravel & Inertia.js applications and gives you an instant, 1-click inspection dashboard.

[Features](#-features) • [Quick Start](#-quick-start) • [Feature Walkthrough](#-feature-walkthrough) • [Tech Stack](#-tech-stack) • [Credits](#-developer--credits)

</div>

---

## 💡 Why LaraLens?

When building or testing modern **Laravel** and **Inertia.js (Vue/React)** web applications:

1. **The Token Hunt:** Finding the active `XSRF-TOKEN`, `laravel_session` cookie, or CSRF token to test an API endpoint in Postman or cURL requires navigating deep into `Application -> Cookies` or `Network -> Headers`.
2. **Inertia Props Obscurity:** Developers frequently need to verify which props and shared data (like `auth.user`, `flash`, or validation `errors`) are being passed from Laravel controllers into frontend components.
3. **Route Discovery:** Finding whether a named route exists or what URI parameters it accepts requires opening terminal windows to run `php artisan route:list`.

### 🚀 The LaraLens Solution
LaraLens lives right in your browser toolbar:
- **Instant Detection:** The badge lights up `LARA` or `INRT` the moment you visit any Laravel or Inertia application.
- **1-Click Auth Hub:** Copy CSRF tokens, session cookies, Sanctum Bearer tokens, or complete cURL/Postman headers with one click.
- **Inertia.js Props Explorer:** Live searchable JSON tree of page-specific and shared props.
- **Ziggy Routes Navigator:** Instant search through all registered backend routes, with HTTP method badges and 1-click URI copy.
- **Built-in API Tester:** Send instant test requests with current cookies and headers automatically attached.

---

## ✨ Features

### 1. 🛡️ Auth & CSRF Hub
- **Instant Token Extraction:** Automatically reads `<meta name="csrf-token">`, `XSRF-TOKEN` cookie, and `laravel_session` cookie.
- **Bearer Token Scanner:** Automatically scans local storage for Sanctum / JWT API tokens.
- **🧹 1-Click Session Reset:** Clears active `laravel_session`, `XSRF-TOKEN`, and remember cookies and reloads the active tab to instantly test guest workflows.
- **Logged-in User Card:** Displays current authenticated user info (Name, Email, ID) extracted from shared props.
- **cURL Header Generator:** Generates ready-to-run terminal commands:
  ```bash
  -H "Accept: application/json" -H "X-XSRF-TOKEN: ..." -H "Cookie: laravel_session=..."
  ```
- **Postman Headers JSON:** 1-Click copy formatted header arrays for instant Postman Bulk Edit.

### 2. ⚡ Inertia.js Props Explorer
- **Component Inspector:** Identifies the active Inertia page component (e.g. `Pages/Orders/Show` or `Auth/Login`).
- **Validation Errors & Flash Callout:** Prominently highlights validation errors (`errors`) and flash notifications (`flash.message`) so you immediately know why form submissions failed.
- **Interactive JSON Tree:** View props in categorized tabs (`Page Props`, `Shared Props`, and `Raw Payload`).
- **Live Search & Filter:** Search props by key name or value in real time.
- **1-Click Export:** Copy individual values or the entire props payload to your clipboard.

### 3. 🗺️ Ziggy Routes Navigator
- **Zero-Terminal Route Search:** Reads `window.Ziggy` routes directly from the page.
- **Method Filters:** Filter routes by `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Search Bar:** Real-time search by route name (e.g. `users.create`) or URI (e.g. `/api/v1/orders`).
- **Quick Helpers:**
  - Copy Route URI (`/users/{user}`)
  - Copy Ziggy helper code (`route('users.show', { id: 1 })`)
  - Copy Inertia visit call (`router.visit(route('users.show'))`)

### 4. 🌐 Quick API Tester
- Test any backend route directly from the extension popup.
- Automatically attaches current page `X-XSRF-TOKEN`, `laravel_session` cookie, and `Accept: application/json` headers.
- **JSON Request Body Editor:** Built-in collapsible JSON body input with syntax prettification for `POST`, `PUT`, and `PATCH` requests.
- Displays HTTP response status (`200 OK`, `419 Page Expired`, `401 Unauthorized`, `422 Unprocessable Entity`) and response time.

---

## 🚀 Quick Start

### 1. Clone & Build
```bash
git clone https://github.com/sajusun/laralens.git
cd laralens

pnpm install
pnpm run build
pnpm run pack
```

- `./dist`: Contains the compiled, unpacked extension.
- `./laralens-v1.0.0.zip`: Ready for direct upload to Microsoft Edge Add-ons & Chrome Web Store.
- [`STORE_SUBMISSION_DATA.txt`](STORE_SUBMISSION_DATA.txt): Complete store listing metadata.
- [`MICROSOFT_EDGE_SUBMISSION_GUIDE.md`](MICROSOFT_EDGE_SUBMISSION_GUIDE.md): Step-by-step submission guide.

### 2. Load into Chrome / Brave / Edge
1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `laralens/dist` folder.
5. Pin **LaraLens** to your browser toolbar!

---

## 🛠️ Architecture

```
[Webpage Main World] ──(reads window.Ziggy / __page)──> [page-bridge.js]
                                                               │
                                                       (CustomEvent)
                                                               ▼
[Active Tab DOM] <─────────────────────────────> [content.js] (Isolated World)
                                                               │
                                                        (Runtime Messages)
                                                               ▼
[chrome.cookies API] <─────────────────────────> [background.js] (Service Worker)
                                                               │
                                                               ▼
                                                  [popup.html / popup.ts]
                                                  (Interactive Dashboard)
```

---

## 👨‍💻 Developer & Credits

**LaraLens** is architected and built with ❤️ by:

### **Sakhawat Hossain**
- 🌐 **Portfolio & Website:** [https://sajusun.github.io](https://sajusun.github.io)
- 🐙 **GitHub:** [@sajusun](https://github.com/sajusun)
- 💼 **Role:** Full-Stack & Developer Tooling Engineer

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).  
Part of the **Laravel Developer Chrome Suite**:
- 📝 [DevFill](https://github.com/sajusun/devfill) — Smart Form Filler for Developers
- 📡 [EchoScope](https://github.com/sajusun/echo-scope) — Real-Time Reverb & WebSocket Inspector
- 🔍 [LaraLens](https://github.com/sajusun/laralens) — Ultimate Laravel & Inertia.js DevTools
