import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="laraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff2d20" />
      <stop offset="100%" stop-color="#dc2626" />
    </linearGradient>
  </defs>
  <!-- Sleek rounded squircle -->
  <rect x="4" y="4" width="120" height="120" rx="30" fill="url(#laraGrad1)" />
  
  <!-- Subtle top inner highlight for depth -->
  <path d="M 34 8 L 94 8 C 112 8 120 16 120 34 L 120 40 C 120 22 112 12 94 12 L 34 12 C 16 12 8 22 8 40 L 8 34 C 8 16 16 8 34 8 Z" fill="#ffffff" opacity="0.2" />

  <!-- Outer Precision Lens Ring -->
  <circle cx="64" cy="64" r="40" fill="none" stroke="#ffffff" stroke-width="8" />

  <!-- Bold Modern 'L' -->
  <path d="M 52 38 L 52 86 C 52 88 54 90 56 90 L 82 90" 
        fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />

  <!-- 4 Reticle Crosshair Ticks -->
  <line x1="64" y1="14" x2="64" y2="22" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
  <line x1="64" y1="106" x2="64" y2="114" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
  <line x1="14" y1="64" x2="22" y2="64" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
  <line x1="106" y1="64" x2="114" y2="64" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
</svg>
`;

const outDir = path.resolve('public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const storeDir = path.resolve('store-assets');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

for (const size of [16, 32, 48, 128, 300]) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  });
  const pngBuffer = resvg.render().asPng();
  const filePath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated high-res anti-aliased icon: ${filePath} (${size}x${size})`);

  if (size === 300 || size === 128) {
    fs.writeFileSync(path.join(storeDir, `store-icon-${size}.png`), pngBuffer);
  }
}

// Generate Microsoft Edge 440x280 Promotional Banner
const promoSvg = `
<svg width="440" height="280" viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="20%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#090d16" stop-opacity="1" />
      <stop offset="100%" stop-color="#04060a" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff2d20" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" fill="url(#bgGlow)" />

  <!-- Subtle grid lines -->
  <line x1="0" y1="70" x2="440" y2="70" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <line x1="0" y1="140" x2="440" y2="140" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <line x1="0" y1="210" x2="440" y2="210" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <line x1="110" y1="0" x2="110" y2="280" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <line x1="220" y1="0" x2="220" y2="280" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <line x1="330" y1="0" x2="330" y2="280" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />

  <!-- Ambient circles -->
  <circle cx="80" cy="90" r="120" fill="#ff2d20" opacity="0.12" filter="blur(20px)" />
  <circle cx="360" cy="200" r="100" fill="#06b6d4" opacity="0.1" filter="blur(20px)" />

  <!-- App Icon Group -->
  <g transform="translate(40, 50)">
    <rect width="76" height="76" rx="20" fill="url(#accentGlow)" />
    <!-- Reticle -->
    <circle cx="38" cy="38" r="24" fill="none" stroke="#ffffff" stroke-width="5" />
    <path d="M 31 22 L 31 52 C 31 53 32 54 34 54 L 49 54" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="38" y1="8" x2="38" y2="13" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="38" y1="63" x2="38" y2="68" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="8" y1="38" x2="13" y2="38" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="63" y1="38" x2="68" y2="38" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
  </g>

  <!-- Typography -->
  <text x="134" y="85" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="-0.5">LaraLens</text>
  <text x="134" y="112" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" fill="url(#cyanGrad)" letter-spacing="0.2">LARAVEL &amp; INERTIA.JS DEVTOOLS</text>

  <!-- Tagline -->
  <text x="40" y="165" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">
    Instant CSRF, Session Cookies, Inertia Props &amp; Ziggy Routes
  </text>

  <!-- Feature Pills -->
  <g transform="translate(40, 195)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="82" height="26" rx="13" fill="#ff2d20" fill-opacity="0.15" stroke="#ff2d20" stroke-opacity="0.3" stroke-width="1" />
    <text x="41" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#ff6b61" text-anchor="middle">🛡️ Auth Hub</text>

    <!-- Pill 2 -->
    <rect x="90" y="0" width="96" height="26" rx="13" fill="#06b6d4" fill-opacity="0.15" stroke="#06b6d4" stroke-opacity="0.3" stroke-width="1" />
    <text x="138" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">⚡ Inertia Props</text>

    <!-- Pill 3 -->
    <rect x="194" y="0" width="94" height="26" rx="13" fill="#8b5cf6" fill-opacity="0.15" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="1" />
    <text x="241" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#c084fc" text-anchor="middle">🗺️ Ziggy Routes</text>

    <!-- Pill 4 -->
    <rect x="296" y="0" width="84" height="26" rx="13" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3" stroke-width="1" />
    <text x="338" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#34d399" text-anchor="middle">🌐 API Tester</text>
  </g>

  <!-- Open Source Badge -->
  <text x="40" y="254" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748b">
    100% Free &amp; Open Source • By Sakhawat Hossain
  </text>
</svg>
`;

const promoResvg = new Resvg(promoSvg, {
  fitTo: {
    mode: 'width',
    value: 440,
  },
});
const promoBuffer = promoResvg.render().asPng();
const promoPath = path.join(storeDir, 'promo-small-440x280.png');
fs.writeFileSync(promoPath, promoBuffer);
console.log(`Generated Microsoft Edge Small Promotional Tile: ${promoPath} (440x280)`);
