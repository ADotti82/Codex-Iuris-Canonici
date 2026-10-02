/**
 * Script to generate high-resolution PWA icons and Apple Touch Icons
 * for Codex Iuris Canonici (1983).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard SVG Icon (with open codex book and golden cross)
const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#172554" />
      <stop offset="100%" stop-color="#0B132B" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="40%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
    <linearGradient id="pageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background rounded canvas -->
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)" />

  <!-- Outer gold boundary line -->
  <rect x="24" y="24" width="464" height="464" rx="84" fill="none" stroke="url(#goldGrad)" stroke-width="6" opacity="0.6" />

  <!-- Group with shadow -->
  <g filter="url(#goldGlow)">
    <!-- Latin Cross at top center -->
    <path d="M 256 70 L 256 160 M 224 100 L 288 100" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" />
    <circle cx="256" cy="100" r="4" fill="url(#goldGrad)" />

    <!-- Open Book / Codex body -->
    <!-- Left Page -->
    <path d="M 108 200 C 180 186 240 200 252 222 L 252 384 C 238 360 176 350 108 364 Z" fill="url(#pageGrad)" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>
    <!-- Right Page -->
    <path d="M 404 200 C 332 186 272 200 260 222 L 260 384 C 274 360 336 350 404 364 Z" fill="url(#pageGrad)" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>

    <!-- Spine shadow -->
    <path d="M 252 222 L 260 222 L 260 384 L 252 384 Z" fill="#94A3B8" />

    <!-- Book pages decorative text lines (left page) -->
    <line x1="140" y1="240" x2="228" y2="240" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="268" x2="228" y2="268" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="296" x2="228" y2="296" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="324" x2="198" y2="324" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />

    <!-- Book pages decorative text lines (right page) -->
    <line x1="284" y1="240" x2="372" y2="240" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="268" x2="372" y2="268" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="296" x2="372" y2="296" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="324" x2="342" y2="324" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" opacity="0.75" />

    <!-- Gold Bookmark Ribbon -->
    <path d="M 253 220 L 253 408 L 263 394 L 273 408 L 273 220 Z" fill="url(#goldGrad)" />
  </g>

  <!-- Typography: C I C -->
  <text x="256" y="446" font-family="'Cinzel', 'Times New Roman', Georgia, serif" font-size="44" font-weight="700" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="10">
    CIC 1983
  </text>
</svg>`;

// 2. Maskable SVG Icon (Safe zone margin: 15% padding on all sides, full bleed solid background)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#172554" />
      <stop offset="100%" stop-color="#0B132B" />
    </linearGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="40%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
    <linearGradient id="pageGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
  </defs>

  <!-- Full bleed solid background without rounded corners for maskable -->
  <rect width="512" height="512" fill="url(#bgGradM)" />

  <!-- Inner safe zone content scaled down to 78% and centered -->
  <g transform="translate(62, 58) scale(0.76)">
    <!-- Latin Cross at top center -->
    <path d="M 256 60 L 256 160 M 220 96 L 292 96" stroke="url(#goldGradM)" stroke-width="14" stroke-linecap="round" />

    <!-- Open Book / Codex body -->
    <path d="M 108 200 C 180 186 240 200 252 222 L 252 384 C 238 360 176 350 108 364 Z" fill="url(#pageGradM)" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 404 200 C 332 186 272 200 260 222 L 260 384 C 274 360 336 350 404 364 Z" fill="url(#pageGradM)" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 252 222 L 260 222 L 260 384 L 252 384 Z" fill="#94A3B8" />

    <line x1="140" y1="240" x2="228" y2="240" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="268" x2="228" y2="268" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="296" x2="228" y2="296" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="140" y1="324" x2="198" y2="324" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />

    <line x1="284" y1="240" x2="372" y2="240" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="268" x2="372" y2="268" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="296" x2="372" y2="296" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />
    <line x1="284" y1="324" x2="342" y2="324" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" opacity="0.75" />

    <path d="M 253 220 L 253 410 L 263 395 L 273 410 L 273 220 Z" fill="url(#goldGradM)" />

    <text x="256" y="460" font-family="'Cinzel', 'Times New Roman', Georgia, serif" font-size="48" font-weight="700" fill="url(#goldGradM)" text-anchor="middle" letter-spacing="10">
      CIC 1983
    </text>
  </g>
</svg>`;

async function run() {
  console.log('Generating PWA icons...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard, 'utf8');

  const standardBuffer = Buffer.from(svgStandard);
  const maskableBuffer = Buffer.from(svgMaskable);

  // 1. apple-touch-icon.png (180x180)
  await sharp(standardBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png generated');

  // 2. pwa-192x192.png (192x192)
  await sharp(standardBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ pwa-192x192.png generated');

  // 3. pwa-512x512.png (512x512)
  await sharp(standardBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ pwa-512x512.png generated');

  // 4. pwa-maskable-512x512.png (512x512)
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ pwa-maskable-512x512.png generated');

  // 5. favicon.ico / favicon-32x32.png
  await sharp(standardBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ favicon.ico generated');

  console.log('All icons generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
