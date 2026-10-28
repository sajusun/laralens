# 🚀 Postman-Grade API Tester & Domain Persistence Plan

**Feature Title:** Domain-Scoped Request Persistence, History & Postman-Grade Collections for LaraLens  
**Status:** Planned / Architecture Document  
**Target Release:** v1.1.0  
**Author:** Sakhawat Hossain ([sajusun.github.io](https://sajusun.github.io))  

---

## 💡 Overview & Problem Statement
Currently, whenever a developer reloads or reopens the LaraLens extension popup, the entered endpoint URL, method, and JSON body reset to defaults. Testing APIs repeatedly across sessions or testing multiple endpoints requires manually retyping or copying URIs and payloads.

This plan outlines the architecture to make LaraLens operate as an in-browser, domain-scoped mini Postman / Hoppscotch.

---

## 🏗️ 1. Data Architecture & Storage Schema
All persistence will use the browser's persistent `chrome.storage.local` engine, isolated per domain/host (e.g. `robertcravatt.thewarriors.team` or `localhost:8000`).

### Storage Key Structure
`laralens:api_workspace:<domain>`

```typescript
export interface ApiRequestItem {
  id: string;
  name?: string;               // Optional name for saved bookmarks
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;            // e.g., '/api/me' or '/api/orders'
  body?: string;               // JSON string payload
  sendCookies: boolean;        // true = session credentials; false = omit
  bearerToken?: string;        // Specific JWT override
  createdAt: number;
}

export interface HistoryItem extends ApiRequestItem {
  status: number;              // e.g. 200, 401, 422
  statusText: string;          // e.g. 'OK', 'Unauthorized'
  duration: number;            // in ms (e.g. 45ms)
}

export interface DomainApiWorkspace {
  lastActive: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    body: string;
    sendCookies: boolean;
    bearerToken?: string;
  };
  history: HistoryItem[];       // Last 15-20 requests
  savedRequests: ApiRequestItem[]; // Starred / Saved Collections
}
```

---

## 🌟 2. Key Features to Implement

### A. Auto-Restore Active Session per Domain
- Whenever the user types or selects a method, endpoint, or body, debounce-save the state to `chrome.storage.local` under the current domain key.
- When opening the popup on that domain, restore the exact endpoint, method, and body so zero retyping is needed.

### B. Recent Request History Panel
- Every time `btnSendApi` is clicked, push the request + response stats to `workspace.history` (capped at 20 items).
- Under the API Tester, provide a collapsible **History** tab.
- Each history row displays:
  - `[METHOD]` badge (color-coded)
  - Endpoint URI (`/api/me`)
  - Status badge (`200 OK`, `401`, `422`)
  - Latency (`34ms`)
  - 1-Click **"Load"** button to populate inputs instantly.

### C. Saved Requests / Bookmarks (Mini Collections)
- Add a **💾 Save** button next to the Send button.
- Prompts for a friendly name (e.g., *"Current User Profile"*, *"Create Order Validation Test"*).
- Lists saved requests under a **⭐ Saved Requests** tab with:
  - 1-click **Load & Run**
  - Delete / Rename options
  - 1-click **Export Collection as JSON**

### D. Ziggy Routes ➔ API Tester Quick Bridge
- In the **Ziggy Routes Navigator** tab, add a `⚡ Test` button on every route card.
- 1-Click on any route switches to the API Tester tab with the route's URI and HTTP Method automatically prefilled.

---

## 🎨 3. UI / UX Mockup

```
┌──────────────────────────────────────────────────────────────┐
│ [GET ▼] [/api/me                           ] [💾 Save] [Send]│
├──────────────────────────────────────────────────────────────┤
│ 🔑 Bearer: [ eyJhbGciOi... ]        [ ] Send Session Cookies │
├──────────────────────────────────────────────────────────────┤
│  Tabs: [📝 Body]  [🕒 History (8)]  [⭐ Saved Requests (5)]     │
├──────────────────────────────────────────────────────────────┤
│  History Panel:                                              │
│  • [GET]   /api/me              200 OK   (32ms)  [Load] [✕]  │
│  • [POST]  /api/users           422 Err  (68ms)  [Load] [✕]  │
│  • [GET]   /api/roles           200 OK   (28ms)  [Load] [✕]  │
├──────────────────────────────────────────────────────────────┤
│ RESPONSE: [200 OK (32ms)]                                    │
│ { "id": 1, "name": "Sakhawat Hossain", ... }                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. Phased Implementation Roadmap
- [ ] **Phase 1:** Add domain state persistence helper in `src/popup/popup.ts`.
- [ ] **Phase 2:** Build History storage & rendering component.
- [ ] **Phase 3:** Build Saved Requests modal / bookmark manager.
- [ ] **Phase 4:** Connect Ziggy Route cards with a `⚡ Test` action.
- [ ] **Phase 5:** Add Collection Export/Import feature.
