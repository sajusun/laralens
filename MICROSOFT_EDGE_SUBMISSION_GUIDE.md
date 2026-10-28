# 🚀 Microsoft Edge Add-ons Store Submission Guide

This guide walks you step-by-step through publishing **LaraLens** on the **Microsoft Edge Add-ons Store**.

---

## 🌟 Why Microsoft Edge Add-ons Store?
1. **100% Free Developer Account:** Unlike Google Chrome ($5 fee), Microsoft Edge Add-ons registration is **free**.
2. **Huge Reach:** Edge extensions run seamlessly on Microsoft Edge, Google Chrome, Brave, Opera, and Vivaldi.
3. **High Portfolio Value:** Having a published product on the official Microsoft Store gives immense credibility to your resume and developer portfolio ([sajusun.github.io](https://sajusun.github.io)).

---

## 📋 Pre-Submission Checklist
- [x] Extension built and compiled: `pnpm run build`
- [x] Production zip created: `laralens-v1.0.0.zip` (via `pnpm run pack`)
- [x] Store Icon generated: `store-assets/store-icon-300.png` (300x300)
- [x] Promotional Tile generated: `store-assets/promo-small-440x280.png` (440x280)
- [x] Privacy Policy created: [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) & [`public/privacy-policy.html`](public/privacy-policy.html)
- [x] All copy-paste text data ready: [`STORE_SUBMISSION_DATA.txt`](STORE_SUBMISSION_DATA.txt)

---

## 🛠️ Step-by-Step Submission Walkthrough

### Step 1: Sign in to Microsoft Partner Center
1. Open the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview).
2. Sign in with your Microsoft account (e.g., Outlook, Hotmail, or GitHub account).
3. Complete the free developer account registration (select Individual Developer).

### Step 2: Create a New Extension
1. On the Edge Add-ons dashboard, click **"Create new extension"**.
2. Drag and drop `laralens-v1.0.0.zip` (located in your root directory) or browse to select it.
3. The system will validate `manifest.json`. Once verified, click **Continue**.

### Step 3: Fill in Store Listing Details
Open [`STORE_SUBMISSION_DATA.txt`](STORE_SUBMISSION_DATA.txt) side-by-side:
1. **Extension Name:** `LaraLens - Laravel & Inertia.js DevTools`
2. **Short Description:** Paste the 178-character description from Section 1.
3. **Detailed Description:** Paste the complete Markdown description from Section 2.
4. **Primary Category:** `Developer Tools`
5. **Keywords / Tags:** Paste the comma-separated keywords from Section 3.
6. **Website / Support URL:** `https://sajusun.github.io` and `https://github.com/sajusun/laralens/issues`
7. **Privacy Policy URL:** Paste your privacy policy URL (e.g. `https://sajusun.github.io/laralens/public/privacy-policy.html` or the GitHub markdown link).

### Step 4: Upload Store Graphics
Under **Store logos & assets**:
1. **Store Logo (300 x 300 px):** Upload `store-assets/store-icon-300.png`.
2. **Small Promotional Tile (440 x 280 px):** Upload `store-assets/promo-small-440x280.png`.
3. **Screenshots (1280 x 800 px):** Take 1 to 3 screenshots of LaraLens in action (Auth tab, Inertia tab, Ziggy tab).

### Step 5: Fill in Certification Notes (Crucial!)
To ensure fast approval without reviewer rejection:
1. Go to the **Notes for certification** section.
2. Copy and paste the exact text from **Section 6 of [`STORE_SUBMISSION_DATA.txt`](STORE_SUBMISSION_DATA.txt)**.
3. If asked about `host_permissions` or `cookies`, paste the rationale from **Section 5 of [`STORE_SUBMISSION_DATA.txt`](STORE_SUBMISSION_DATA.txt)**.

### Step 6: Review & Submit
1. Click **Submit**.
2. Microsoft review typically takes **24 to 72 hours**.
3. Once approved, your extension will be live on the Microsoft Edge Add-ons store with a public URL!

---

## 💼 Adding to Your Portfolio & GitHub
Once published:
1. Add the Microsoft Edge badge to your `README.md`:
   ```markdown
   [![Microsoft Edge](https://img.shields.io/badge/Microsoft_Edge-Available_on_Store-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white)](YOUR_STORE_URL)
   ```
2. Feature LaraLens on your personal portfolio ([https://sajusun.github.io](https://sajusun.github.io)) under **Featured Open Source Products**.
3. Share on LinkedIn and Laravel developer communities (Reddit r/laravel, Twitter/X #laravel, Dev.to).
