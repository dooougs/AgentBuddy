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
  
  // Set initial viewport
  await page.setViewport({ width: 300, height: 800 });
  
  // Navigate to the preview file
  const previewPath = `file://${path.join(__dirname, 'agent-buddy-preview.html')}`;
  await page.goto(previewPath, { waitUntil: 'networkidle0' });
  
  // Wait for the page to be ready
  await delay(2000);
  
  // Hide the controls (simulate stage buttons) BEFORE calculating height
  await page.evaluate(() => {
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.style.display = 'none';
    }
  });
  
  // Wait for the DOM to reflow after hiding controls
  await delay(500);
  
  // Calculate actual visible content height with padding
  const contentHeight = await page.evaluate(() => {
    // Find the main content container (body)
    const body = document.querySelector('body');
    if (!body) return 600;
    
    // Get all visible child elements and find the last one
    const children = Array.from(body.children).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && el.offsetHeight > 0;
    });
    
    if (children.length === 0) return 600;
    
    // Get the bottom of the last visible element
    const lastChild = children[children.length - 1];
    const rect = lastChild.getBoundingClientRect();
    const height = rect.bottom + window.scrollY;
    
    return Math.max(height, 400); // Minimum 400px
  });
  
  const padding = 40; // padding in pixels
  const finalHeight = contentHeight + padding;
  
  console.log(`Calculated content height: ${contentHeight}px, final height with padding: ${finalHeight}px`);
  
  // Set viewport to calculated height
  await page.setViewport({ width: 300, height: finalHeight });
  
  // Wait a moment for the resize to settle
  await delay(500);
  
  const screenshots = [
    { name: 'screenshot-idle.png', clicks: 0, expectedState: 'idle' },
    { name: 'screenshot-thinking.png', clicks: 1, expectedState: 'thinking' },
    { name: 'screenshot-planning.png', clicks: 2, expectedState: 'planning' },
    { name: 'screenshot-searching.png', clicks: 3, expectedState: 'searching' },
    { name: 'screenshot-editing.png', clicks: 4, expectedState: 'editing' },
    { name: 'screenshot-terminal.png', clicks: 5, expectedState: 'terminal' },
    { name: 'screenshot-success.png', clicks: 6, expectedState: 'success' },
    { name: 'screenshot-error.png', clicks: 7, expectedState: 'error' },
    { name: 'screenshot-sleeping.png', clicks: 8, expectedState: 'sleeping' }
  ];
  
  // Take screenshots by cycling through states
  for (const screenshot of screenshots) {
    try {
      // Click to cycle through stages
      if (screenshot.clicks > 0) {
        for (let i = 0; i < screenshot.clicks; i++) {
          await page.click('.buddy-svg');
          // Longer delay to allow state transitions and animations to complete
          await delay(1200);
        }
      }
      
      // Extra delay before capturing to ensure all animations have settled
      await delay(800);
      
      // Wait for any animations to complete by checking if elements are stable
      await page.evaluate(() => {
        return new Promise(resolve => {
          // Wait for the next frame and a bit longer for animations
          requestAnimationFrame(() => {
            setTimeout(resolve, 400);
          });
        });
      });
      
      // Take the screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, screenshot.name),
        type: 'png'
      });
      
      console.log(`✓ Generated ${screenshot.name} (${screenshot.expectedState} state)`);
    } catch (error) {
      console.error(`✗ Failed to generate ${screenshot.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nScreenshots generated in media/ directory');
})();
