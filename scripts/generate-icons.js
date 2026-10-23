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

for (const size of [16, 32, 48, 128]) {
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
}
