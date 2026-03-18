const path = require('path');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, 'media');
const outputPath = path.join(mediaDir, 'devto-cover.png');
const bannerPath = path.join(mediaDir, 'devto-states-banner.png');

async function createCover() {
  const width = 1000;
  const height = 420;

  const backgroundSvg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#07080f"/>
        <stop offset="50%" stop-color="#131b3a"/>
        <stop offset="100%" stop-color="#1e0f3f"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f5ff"/>
        <stop offset="100%" stop-color="#bf7fff"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>

    <g opacity="0.12">
      <path d="M0 40 H1000 M0 80 H1000 M0 120 H1000 M0 160 H1000 M0 200 H1000 M0 240 H1000 M0 280 H1000 M0 320 H1000 M0 360 H1000"
            stroke="#00f5ff" stroke-width="1"/>
      <path d="M80 0 V420 M160 0 V420 M240 0 V420 M320 0 V420 M400 0 V420 M480 0 V420 M560 0 V420 M640 0 V420 M720 0 V420 M800 0 V420 M880 0 V420 M960 0 V420"
            stroke="#00f5ff" stroke-width="1"/>
    </g>

    <rect x="48" y="44" width="620" height="8" rx="4" fill="url(#accent)" filter="url(#glow)"/>

    <text x="48" y="112" fill="#ffffff" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="54" font-weight="800">
      Vibe Coding in Parallel
    </text>
    <text x="48" y="164" fill="#d9dbff" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="42" font-weight="700">
      Was Chaos—So I Built Agent Buddy
    </text>

    <text x="48" y="226" fill="#9fb6ff" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="25" font-weight="500">
      Real-time visual states for AI coding flow in VS Code
    </text>

    <rect x="48" y="254" width="350" height="44" rx="22" fill="#00f5ff" opacity="0.16"/>
    <text x="74" y="283" fill="#9ff9ff" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="22" font-weight="700">
      9 states • at-a-glance signal
    </text>

    <circle cx="920" cy="86" r="20" fill="#43ffa8" opacity="0.7"/>
    <circle cx="955" cy="122" r="14" fill="#ffdd43" opacity="0.7"/>
    <circle cx="890" cy="130" r="12" fill="#ff4365" opacity="0.7"/>
  </svg>`;

  const bannerMeta = await sharp(bannerPath).metadata();
  const bannerTargetWidth = 904;
  const bannerTargetHeight = Math.round((bannerMeta.height / bannerMeta.width) * bannerTargetWidth);

  const bannerBuffer = await sharp(bannerPath)
    .resize({ width: bannerTargetWidth })
    .png()
    .toBuffer();

  const cardSvg = `
  <svg width="920" height="${bannerTargetHeight + 24}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c1022"/>
        <stop offset="100%" stop-color="#101634"/>
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="920" height="${bannerTargetHeight + 24}" rx="14" fill="url(#cardBg)" filter="url(#shadow)"/>
  </svg>`;

  const canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#000000'
    }
  });

  await canvas
    .composite([
      { input: Buffer.from(backgroundSvg), top: 0, left: 0 },
      { input: Buffer.from(cardSvg), top: height - (bannerTargetHeight + 24) - 20, left: 40 },
      { input: bannerBuffer, top: height - bannerTargetHeight - 20 - 12, left: 48 }
    ])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Generated ${outputPath}`);
}

createCover().catch((err) => {
  console.error(err);
  process.exit(1);
});
