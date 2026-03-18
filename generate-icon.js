const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Create a simple icon HTML with synthwave styling
  const iconHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; width: 128px; height: 128px; }
        div { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
              background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 100%);
              font-size: 80px; }
      </style>
    </head>
    <body>
      <div>🤖</div>
    </body>
    </html>
  `;
  
  const tempFile = path.join(__dirname, 'temp-icon.html');
  fs.writeFileSync(tempFile, iconHtml);
  
  await page.setViewport({ width: 128, height: 128 });
  await page.goto(`file://${tempFile}`, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(__dirname, 'media', 'icon.png'),
    type: 'png'
  });
  
  fs.unlinkSync(tempFile);
  await browser.close();
  
  console.log('✓ Generated media/icon.png (128x128)');
})();
