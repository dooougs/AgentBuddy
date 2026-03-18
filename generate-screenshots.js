const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const screenshotsDir = path.join(__dirname, 'media');

// Ensure media directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to match VS Code panel
  await page.setViewport({ width: 300, height: 400 });
  
  // Navigate to the preview file
  const previewPath = `file://${path.join(__dirname, 'agent-buddy-preview.html')}`;
  await page.goto(previewPath, { waitUntil: 'networkidle0' });
  
  // Wait for the page to be ready
  await delay(2000);
  
  // Hide the controls (simulate stage buttons)
  await page.evaluate(() => {
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.style.display = 'none';
    }
  });
  
  const screenshots = [
    { name: 'screenshot-idle.png', clicks: 0 },
    { name: 'screenshot-success.png', clicks: 6 },
    { name: 'screenshot-error.png', clicks: 7 },
    { name: 'screenshot-terminal.png', clicks: 5 }
  ];
  
  // Take screenshots by cycling through states
  for (const screenshot of screenshots) {
    try {
      // Get the SVG element to click (cycles through stages)
      const svgElement = await page.$('.buddy-svg');
      
      if (svgElement && screenshot.clicks > 0) {
        for (let i = 0; i < screenshot.clicks; i++) {
          await page.click('.buddy-svg');
          await delay(500);
        }
      }
      
      await delay(500);
      
      // Take the screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, screenshot.name),
        type: 'png'
      });
      
      console.log(`✓ Generated ${screenshot.name}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${screenshot.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nScreenshots generated in media/ directory');
})();
