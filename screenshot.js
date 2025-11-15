const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filesToCapture = [
    'frontend/src/routes/+page.svelte',
    'frontend/src/routes/generator/+page.svelte',
    'frontend/src/routes/settings/+page.svelte',
    'frontend/src/lib/EditModal.svelte'
  ];

  if (!fs.existsSync('verification')){
    fs.mkdirSync('verification');
  }

  for (const filePath of filesToCapture) {
    const content = fs.readFileSync(filePath, 'utf-8');
    await page.setContent(`<pre><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    const screenshotPath = `verification/${filePath.split('/').pop().replace('.svelte', '.png')}`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
  }

  await browser.close();
})();
