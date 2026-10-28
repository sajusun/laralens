import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const storeDir = path.resolve('store-assets');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

console.log('🎨 Generating 4 High-Resolution 1280x800 Store Screenshots for Microsoft Edge Add-ons...');

// Common SVG Wrapper template
function renderSlide(title, subtitle, tabPillText, contentSvg) {
  return `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="25%" cy="20%" r="85%">
      <stop offset="0%" stop-color="#18153d" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#080c16" stop-opacity="1" />
      <stop offset="100%" stop-color="#030508" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="brandRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff2d20" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="800" fill="url(#bgGlow)" />

  <!-- Ambient Light Orbs -->
  <circle cx="200" cy="180" r="280" fill="#ff2d20" opacity="0.08" />
  <circle cx="1080" cy="650" r="320" fill="#06b6d4" opacity="0.07" />

  <!-- Grid Accents -->
  <line x1="0" y1="120" x2="1280" y2="120" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />
  <line x1="0" y1="720" x2="1280" y2="720" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />

  <!-- Top Hero Header -->
  <g transform="translate(180, 42)">
    <!-- Category Badge -->
    <rect x="0" y="0" width="168" height="24" rx="12" fill="#ff2d20" fill-opacity="0.15" stroke="#ff2d20" stroke-opacity="0.3" stroke-width="1" />
    <text x="84" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ff6b61" text-anchor="middle">${tabPillText}</text>

    <!-- Headline -->
    <text x="0" y="54" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="800" fill="url(#headerGrad)" letter-spacing="-0.5">${title}</text>
    
    <!-- Subtitle -->
    <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">${subtitle}</text>
  </g>

  <!-- Window Container -->
  <g transform="translate(180, 145)" filter="url(#shadow)">
    <!-- Window Outer Frame -->
    <rect width="920" height="565" rx="14" fill="#090f1d" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5" />
    
    <!-- Window Titlebar -->
    <path d="M 0 14 C 0 6.27 6.27 0 14 0 L 906 0 C 913.73 0 920 6.27 920 14 L 920 44 L 0 44 Z" fill="#0d1424" />
    <line x1="0" y1="44" x2="920" y2="44" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    
    <!-- Window Dots -->
    <circle cx="22" cy="22" r="6" fill="#ef4444" opacity="0.8" />
    <circle cx="40" cy="22" r="6" fill="#f59e0b" opacity="0.8" />
    <circle cx="58" cy="22" r="6" fill="#10b981" opacity="0.8" />

    <!-- Window Brand in Titlebar -->
    <rect x="80" y="10" width="24" height="24" rx="5" fill="url(#brandRed)" />
    <text x="92" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">L</text>
    <text x="112" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">LaraLens</text>
    <rect x="176" y="13" width="58" height="18" rx="4" fill="#ff2d20" fill-opacity="0.15" />
    <text x="205" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="700" fill="#ff6b61" text-anchor="middle">DEVTOOLS</text>

    <!-- Right detection badge in titlebar -->
    <rect x="740" y="11" width="160" height="22" rx="11" fill="#ff2d20" fill-opacity="0.15" stroke="#ff2d20" stroke-opacity="0.3" stroke-width="1" />
    <circle cx="754" cy="22" r="4" fill="#ff2d20" />
    <text x="824" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ff6b61" text-anchor="middle">Laravel App Detected</text>

    <!-- Nav Tabs Bar -->
    <rect x="0" y="44" width="920" height="40" fill="#080d19" />
    <line x1="0" y1="84" x2="920" y2="84" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />

    <!-- Injected Content -->
    ${contentSvg}

    <!-- Window Footer -->
    <path d="M 0 535 L 920 535 L 920 551 C 920 558.73 913.73 565 906 565 L 14 565 C 6.27 565 0 558.73 0 551 Z" fill="#070c17" />
    <line x1="0" y1="535" x2="920" y2="535" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="16" y="552" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">LaraLens v1.0.0 • 100% Free &amp; Open Source</text>
    <text x="904" y="552" font-family="ui-monospace, monospace" font-size="11" font-weight="500" fill="#64748b" text-anchor="end">https://robertcravatt.thewarriors.team/admin/dashboard</text>
  </g>

  <!-- Bottom Global Credits -->
  <text x="640" y="760" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">
    Crafted with ❤️ by Sakhawat Hossain • Portfolio: sajusun.github.io • GitHub: github.com/sajusun/laralens
  </text>
</svg>
`;
}

// -------------------------------------------------------------
// 1. Screenshot 1: Auth & CSRF Hub
// -------------------------------------------------------------
const authContent = `
  <!-- Nav tabs -->
  <g transform="translate(16, 51)">
    <rect x="0" y="0" width="130" height="26" rx="6" fill="#131d33" stroke="#ff2d20" stroke-opacity="0.4" stroke-width="1" />
    <text x="65" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">🛡️ Auth &amp; CSRF</text>

    <text x="190" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">⚡ Inertia Props</text>
    <text x="320" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🗺️ Ziggy Routes</text>
    <text x="440" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🌐 API Tester</text>
  </g>

  <!-- Top Banner -->
  <g transform="translate(20, 100)">
    <rect width="880" height="58" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="16" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">Authentication &amp; Security Hub</text>
    <text x="16" y="44" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="500" fill="#64748b">Instantly extract CSRF tokens, session cookies, and cURL headers.</text>

    <!-- Action Buttons -->
    <rect x="520" y="14" width="105" height="30" rx="6" fill="#162035" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="572" y="33" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">cURL Headers</text>

    <rect x="635" y="14" width="120" height="30" rx="6" fill="#162035" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="695" y="33" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">Postman Headers</text>

    <rect x="765" y="14" width="105" height="30" rx="6" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-opacity="0.3" stroke-width="1" />
    <text x="817" y="33" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#f87171" text-anchor="middle">🧹 Reset Session</text>
  </g>

  <!-- 4 Token Cards Grid -->
  <g transform="translate(20, 172)">
    <!-- Card 1: X-CSRF-TOKEN -->
    <rect x="0" y="0" width="430" height="74" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#64748b">X-CSRF-TOKEN (META TAG)</text>
    <rect x="365" y="10" width="50" height="20" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="390" y="24" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">Copy</text>
    <rect x="14" y="36" width="402" height="26" rx="5" fill="#131c33" />
    <text x="24" y="53" font-family="ui-monospace, monospace" font-size="11" fill="#e2e8f0">roa9g1mJ4gkrhTL72AaTuvDitp5XjWxr2SR7S2Bw</text>

    <!-- Card 2: XSRF-TOKEN -->
    <rect x="450" y="0" width="430" height="74" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="464" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#64748b">XSRF-TOKEN (DECODED COOKIE)</text>
    <rect x="815" y="10" width="50" height="20" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="840" y="24" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">Copy</text>
    <rect x="464" y="36" width="402" height="26" rx="5" fill="#131c33" />
    <text x="474" y="53" font-family="ui-monospace, monospace" font-size="11" fill="#e2e8f0">eyJpdiI6IlpDMW9v...ZDFiNTg4ZTk4ZDkyMzE4</text>

    <!-- Card 3: laravel_session -->
    <rect x="0" y="86" width="430" height="74" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="14" y="108" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#64748b">LARAVEL_SESSION (ENCRYPTED COOKIE)</text>
    <rect x="365" y="96" width="50" height="20" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="390" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">Copy</text>
    <rect x="14" y="122" width="402" height="26" rx="5" fill="#131c33" />
    <text x="24" y="139" font-family="ui-monospace, monospace" font-size="11" fill="#e2e8f0">eyJpdiI6IkRPKzhXb...d0Z2xmZlpxM1E2UUIwQ</text>

    <!-- Card 4: Bearer / JWT Token -->
    <rect x="450" y="86" width="430" height="74" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="464" y="108" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#64748b">BEARER TOKEN (SANCTUM / JWT)</text>
    <rect x="760" y="96" width="48" height="20" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="784" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">✏️ Edit</text>
    <rect x="815" y="96" width="50" height="20" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="840" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">Copy</text>
    <rect x="464" y="122" width="402" height="26" rx="5" fill="#131c33" />
    <text x="474" y="139" font-family="ui-monospace, monospace" font-size="11" fill="#38bdf8">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0...</text>
  </g>

  <!-- Logged in User Card -->
  <g transform="translate(20, 345)">
    <rect width="880" height="52" rx="8" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3" stroke-width="1" />
    <circle cx="34" cy="26" r="14" fill="#10b981" fill-opacity="0.2" />
    <text x="34" y="31" font-size="14" text-anchor="middle">👤</text>
    <text x="60" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="800" fill="#34d399">LOGGED-IN USER</text>
    <text x="60" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sakhawat Hossain (saju@example.com • Role: SuperAdmin)</text>
    <rect x="790" y="14" width="76" height="24" rx="4" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
    <text x="828" y="30" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#6ee7b7" text-anchor="middle">Copy JSON</text>
  </g>
`;

// -------------------------------------------------------------
// 2. Screenshot 2: Inertia Props Explorer
// -------------------------------------------------------------
const inertiaContent = `
  <!-- Nav tabs -->
  <g transform="translate(16, 51)">
    <text x="50" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🛡️ Auth &amp; CSRF</text>
    <rect x="120" y="0" width="140" height="26" rx="6" fill="#131d33" stroke="#06b6d4" stroke-opacity="0.4" stroke-width="1" />
    <text x="190" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">⚡ Inertia Props (12)</text>
    <text x="320" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🗺️ Ziggy Routes</text>
    <text x="440" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🌐 API Tester</text>
  </g>

  <!-- Component Card -->
  <g transform="translate(20, 100)">
    <rect width="880" height="54" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <rect x="14" y="12" width="76" height="18" rx="4" fill="#06b6d4" fill-opacity="0.2" />
    <text x="52" y="25" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="800" fill="#38bdf8" text-anchor="middle">COMPONENT</text>
    <text x="98" y="27" font-family="ui-monospace, monospace" font-size="15" font-weight="700" fill="#ffffff">Pages/Admin/Dashboard</text>
    <text x="14" y="44" font-family="ui-monospace, monospace" font-size="11" fill="#64748b">Inertia v1.2.0 • /admin/dashboard</text>
    <rect x="750" y="12" width="116" height="30" rx="6" fill="#162035" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="808" y="31" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">Copy All Props</text>
  </g>

  <!-- Flash / Validation Alert -->
  <g transform="translate(20, 164)">
    <rect width="880" height="38" rx="6" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.3" stroke-width="1" />
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#34d399">💬 Flash Notification:</text>
    <text x="140" y="24" font-family="ui-monospace, monospace" font-size="11" fill="#e2e8f0">{ "message": "Welcome back Sakhawat! LaraLens DevTools is active." }</text>
  </g>

  <!-- Filter toolbar -->
  <g transform="translate(20, 212)">
    <rect x="0" y="0" width="85" height="24" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" />
    <text x="42" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">Page Props</text>
    <text x="135" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748b">Shared Props</text>
    <text x="215" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748b">Raw Payload</text>

    <rect x="280" y="0" width="600" height="26" rx="5" fill="#131c33" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="295" y="17" font-family="ui-monospace, monospace" font-size="10" fill="#64748b">Search props (key or value)...</text>
  </g>

  <!-- JSON Props Tree Viewer -->
  <g transform="translate(20, 248)">
    <rect width="880" height="270" rx="8" fill="#04070e" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="20" y="30" font-family="ui-monospace, monospace" font-size="12" fill="#e2e8f0" xml:space="preserve">
{
  <tspan fill="#38bdf8">"stats"</tspan>: {
    <tspan fill="#a5b4fc">"totalUsers"</tspan>: <tspan fill="#34d399">1420</tspan>,
    <tspan fill="#a5b4fc">"activeSubscriptions"</tspan>: <tspan fill="#34d399">890</tspan>,
    <tspan fill="#a5b4fc">"monthlyRevenue"</tspan>: <tspan fill="#fbbf24">"$42,500.00"</tspan>
  },
  <tspan fill="#38bdf8">"currentTenant"</tspan>: {
    <tspan fill="#a5b4fc">"id"</tspan>: <tspan fill="#34d399">1</tspan>,
    <tspan fill="#a5b4fc">"name"</tspan>: <tspan fill="#fbbf24">"Robert Cravatt Group"</tspan>,
    <tspan fill="#a5b4fc">"domain"</tspan>: <tspan fill="#fbbf24">"robertcravatt.thewarriors.team"</tspan>
  },
  <tspan fill="#38bdf8">"permissions"</tspan>: [
    <tspan fill="#fbbf24">"view_dashboard"</tspan>, <tspan fill="#fbbf24">"manage_users"</tspan>, <tspan fill="#fbbf24">"view_reports"</tspan>
  ]
}
    </text>
  </g>
`;

// -------------------------------------------------------------
// 3. Screenshot 3: Ziggy Routes Navigator
// -------------------------------------------------------------
const ziggyContent = `
  <!-- Nav tabs -->
  <g transform="translate(16, 51)">
    <text x="50" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🛡️ Auth &amp; CSRF</text>
    <text x="180" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">⚡ Inertia Props</text>
    <rect x="250" y="0" width="140" height="26" rx="6" fill="#131d33" stroke="#8b5cf6" stroke-opacity="0.4" stroke-width="1" />
    <text x="320" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">🗺️ Ziggy Routes (84)</text>
    <text x="440" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🌐 API Tester</text>
  </g>

  <!-- Toolbar with search & method filters -->
  <g transform="translate(20, 100)">
    <rect x="0" y="0" width="560" height="32" rx="6" fill="#131c33" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="14" y="20" font-family="ui-monospace, monospace" font-size="11" fill="#94a3b8">Search routes by name or URI (e.g. users, /api/orders)...</text>

    <!-- Method Buttons -->
    <rect x="580" y="0" width="50" height="32" rx="5" fill="#ff2d20" fill-opacity="0.2" stroke="#ff2d20" stroke-opacity="0.5" stroke-width="1" />
    <text x="605" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="800" fill="#ff6b61" text-anchor="middle">ALL</text>

    <rect x="640" y="0" width="50" height="32" rx="5" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="665" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#34d399" text-anchor="middle">GET</text>

    <rect x="700" y="0" width="50" height="32" rx="5" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="725" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#60a5fa" text-anchor="middle">POST</text>

    <rect x="760" y="0" width="50" height="32" rx="5" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="785" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#fbbf24" text-anchor="middle">PUT</text>

    <rect x="820" y="0" width="60" height="32" rx="5" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="850" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#f87171" text-anchor="middle">DELETE</text>
  </g>

  <!-- Route Cards List -->
  <g transform="translate(20, 150)">
    <!-- Route 1 -->
    <rect x="0" y="0" width="880" height="64" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <rect x="14" y="20" width="46" height="22" rx="4" fill="#10b981" fill-opacity="0.2" />
    <text x="37" y="35" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#34d399" text-anchor="middle">GET</text>
    <text x="74" y="28" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">admin.dashboard</text>
    <text x="74" y="48" font-family="ui-monospace, monospace" font-size="11" fill="#64748b">/admin/dashboard</text>
    <!-- Action buttons -->
    <rect x="680" y="18" width="50" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="705" y="36" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">URI</text>
    <rect x="740" y="18" width="60" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="770" y="36" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">route()</text>
    <rect x="810" y="18" width="56" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="838" y="36" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">visit()</text>

    <!-- Route 2 -->
    <rect x="0" y="74" width="880" height="64" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <rect x="14" y="94" width="46" height="22" rx="4" fill="#3b82f6" fill-opacity="0.2" />
    <text x="37" y="109" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#60a5fa" text-anchor="middle">POST</text>
    <text x="74" y="102" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">admin.users.store</text>
    <text x="74" y="122" font-family="ui-monospace, monospace" font-size="11" fill="#64748b">/admin/users</text>
    <rect x="680" y="92" width="50" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="705" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">URI</text>
    <rect x="740" y="92" width="60" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="770" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">route()</text>
    <rect x="810" y="92" width="56" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="838" y="110" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">visit()</text>

    <!-- Route 3 -->
    <rect x="0" y="148" width="880" height="64" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <rect x="14" y="168" width="46" height="22" rx="4" fill="#f59e0b" fill-opacity="0.2" />
    <text x="37" y="183" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#fbbf24" text-anchor="middle">PUT</text>
    <text x="74" y="176" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">admin.users.update</text>
    <text x="74" y="196" font-family="ui-monospace, monospace" font-size="11" fill="#64748b">/admin/users/{user}</text>
    <rect x="680" y="166" width="50" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="705" y="184" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">URI</text>
    <rect x="740" y="166" width="60" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="770" y="184" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">route()</text>
    <rect x="810" y="166" width="56" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="838" y="184" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">visit()</text>

    <!-- Route 4 -->
    <rect x="0" y="222" width="880" height="64" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <rect x="14" y="242" width="46" height="22" rx="4" fill="#10b981" fill-opacity="0.2" />
    <text x="37" y="257" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#34d399" text-anchor="middle">GET</text>
    <text x="74" y="250" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">api.me</text>
    <text x="74" y="270" font-family="ui-monospace, monospace" font-size="11" fill="#64748b">/api/me</text>
    <rect x="680" y="240" width="50" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="705" y="258" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">URI</text>
    <rect x="740" y="240" width="60" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="770" y="258" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">route()</text>
    <rect x="810" y="240" width="56" height="28" rx="4" fill="#162035" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="838" y="258" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">visit()</text>
  </g>
`;

// -------------------------------------------------------------
// 4. Screenshot 4: Built-in API Tester
// -------------------------------------------------------------
const apiContent = `
  <!-- Nav tabs -->
  <g transform="translate(16, 51)">
    <text x="50" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🛡️ Auth &amp; CSRF</text>
    <text x="180" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">⚡ Inertia Props</text>
    <text x="310" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">🗺️ Ziggy Routes</text>
    <rect x="390" y="0" width="130" height="26" rx="6" fill="#131d33" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
    <text x="455" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">🌐 API Tester</text>
  </g>

  <!-- Request input row -->
  <g transform="translate(20, 100)">
    <rect x="0" y="0" width="70" height="34" rx="6" fill="#131c33" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="35" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="800" fill="#34d399" text-anchor="middle">GET ▼</text>

    <rect x="80" y="0" width="700" height="34" rx="6" fill="#131c33" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="96" y="22" font-family="ui-monospace, monospace" font-size="13" font-weight="600" fill="#ffffff">/api/me</text>

    <rect x="790" y="0" width="90" height="34" rx="6" fill="url(#brandRed)" />
    <text x="835" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">Send 🚀</text>
  </g>

  <!-- Authorization bar & cookie toggle -->
  <g transform="translate(20, 144)">
    <rect width="880" height="32" rx="6" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="14" y="21" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#38bdf8">BEARER:</text>
    <text x="74" y="21" font-family="ui-monospace, monospace" font-size="10" fill="#cbd5e1">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0... (Auto-detected JWT)</text>
    
    <circle cx="720" cy="16" r="6" fill="#162035" stroke="#64748b" stroke-width="1.5" />
    <text x="734" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#94a3b8">Send Session Cookies</text>
  </g>

  <!-- Active Headers Note -->
  <g transform="translate(20, 186)">
    <circle cx="6" cy="6" r="3.5" fill="#10b981" />
    <text x="18" y="10" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" fill="#64748b">
      Active Headers: <tspan fill="#38bdf8">Accept: application/json</tspan>, <tspan fill="#38bdf8">Authorization: Bearer &lt;jwt_token&gt;</tspan> (Stateless • Web Session Protected)
    </text>
  </g>

  <!-- Response Card -->
  <g transform="translate(20, 206)">
    <rect width="880" height="312" rx="8" fill="#04070e" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    
    <!-- Response Header -->
    <path d="M 0 8 C 0 3.58 3.58 0 8 0 L 872 0 C 876.42 0 880 3.58 880 8 L 880 32 L 0 32 Z" fill="#0d1424" />
    <line x1="0" y1="32" x2="880" y2="32" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
    <text x="14" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="800" fill="#64748b">RESPONSE BODY</text>
    <rect x="760" y="6" width="106" height="20" rx="4" fill="#10b981" fill-opacity="0.15" />
    <text x="813" y="20" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="#34d399" text-anchor="middle">200 OK (28ms)</text>

    <!-- Response JSON output -->
    <text x="20" y="60" font-family="ui-monospace, monospace" font-size="12" fill="#e2e8f0" xml:space="preserve">
{
  <tspan fill="#38bdf8">"id"</tspan>: <tspan fill="#34d399">1</tspan>,
  <tspan fill="#38bdf8">"name"</tspan>: <tspan fill="#fbbf24">"Sakhawat Hossain"</tspan>,
  <tspan fill="#38bdf8">"email"</tspan>: <tspan fill="#fbbf24">"saju@example.com"</tspan>,
  <tspan fill="#38bdf8">"email_verified_at"</tspan>: <tspan fill="#fbbf24">"2026-10-24T12:00:00.000000Z"</tspan>,
  <tspan fill="#38bdf8">"roles"</tspan>: [
    <tspan fill="#fbbf24">"SuperAdmin"</tspan>,
    <tspan fill="#fbbf24">"Developer"</tspan>
  ],
  <tspan fill="#38bdf8">"permissions_count"</tspan>: <tspan fill="#34d399">48</tspan>,
  <tspan fill="#38bdf8">"tenant"</tspan>: {
    <tspan fill="#a5b4fc">"domain"</tspan>: <tspan fill="#fbbf24">"robertcravatt.thewarriors.team"</tspan>,
    <tspan fill="#a5b4fc">"plan"</tspan>: <tspan fill="#fbbf24">"Enterprise"</tspan>
  }
}
    </text>
  </g>
`;

const slides = [
  {
    fileName: 'screenshot-1-auth-hub.png',
    pill: 'AUTHENTICATION &amp; CSRF',
    title: '1-Click Authentication &amp; CSRF Security Hub',
    subtitle: 'Extract CSRF meta tokens, session cookies, Sanctum/JWT tokens, and ready-to-run cURL headers.',
    content: authContent
  },
  {
    fileName: 'screenshot-2-inertia-props.png',
    pill: 'INERTIA.JS PROPS EXPLORER',
    title: 'Live Inertia.js Props &amp; Form Validation Inspector',
    subtitle: 'Explore categorized Page Props, Shared Props, and instant Form Validation Error notifications.',
    content: inertiaContent
  },
  {
    fileName: 'screenshot-3-ziggy-routes.png',
    pill: 'ZIGGY ROUTES NAVIGATOR',
    title: 'Zero-Terminal Ziggy Routes Discovery',
    subtitle: 'Browse backend routes, filter by HTTP method, and copy route() or router.visit() code snippets.',
    content: ziggyContent
  },
  {
    fileName: 'screenshot-4-api-tester.png',
    pill: 'BUILT-IN API TESTER',
    title: 'Integrated API Tester with Session Isolation',
    subtitle: 'Send test requests with JWT Bearer auth, JSON body editor, and protected browser login sessions.',
    content: apiContent
  }
];

for (const slide of slides) {
  const fullSvg = renderSlide(slide.title, slide.subtitle, slide.pill, slide.content);
  const resvg = new Resvg(fullSvg, {
    fitTo: {
      mode: 'width',
      value: 1280
    }
  });
  const pngBuffer = resvg.render().asPng();
  const destPath = path.join(storeDir, slide.fileName);
  fs.writeFileSync(destPath, pngBuffer);
  console.log(`✅ Generated Store Screenshot: ${destPath} (1280x800)`);
}

console.log('🎉 All 4 store screenshots created successfully in ./store-assets!');
