const path = require('path');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, 'media');
const outputPath = path.join(mediaDir, 'devto-states-banner.png');

const screenshotFiles = [
  'screenshot-idle.png',
  'screenshot-thinking.png',
  'screenshot-planning.png',
  'screenshot-searching.png',
  'screenshot-editing.png',
  'screenshot-terminal.png',
  'screenshot-success.png',
  'screenshot-error.png',
  'screenshot-sleeping.png'
];

async function buildBanner() {
  const firstMeta = await sharp(path.join(mediaDir, screenshotFiles[0])).metadata();

  const scale = 0.3;
  const gap = 10;
  const padding = 16;

  const tileWidth = Math.round(firstMeta.width * scale);
  const tileHeight = Math.round(firstMeta.height * scale);

  const bannerWidth = padding * 2 + tileWidth * screenshotFiles.length + gap * (screenshotFiles.length - 1);
  const bannerHeight = padding * 2 + tileHeight;

  const composites = [];

  for (let index = 0; index < screenshotFiles.length; index++) {
    const inputPath = path.join(mediaDir, screenshotFiles[index]);
    const resized = await sharp(inputPath)
      .resize(tileWidth, tileHeight, { fit: 'cover' })
      .png()
      .toBuffer();

    composites.push({
      input: resized,
      top: padding,
      left: padding + index * (tileWidth + gap)
    });
  }

  await sharp({
    create: {
      width: bannerWidth,
      height: bannerHeight,
      channels: 4,
      background: '#07080f'
    }
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  console.log(`Generated: ${outputPath}`);
  console.log(`Banner size: ${bannerWidth}x${bannerHeight} | Tile size: ${tileWidth}x${tileHeight}`);
}

buildBanner().catch((error) => {
  console.error(error);
  process.exit(1);
});
