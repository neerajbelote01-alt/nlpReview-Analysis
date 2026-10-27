import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

function runFrontendVerification() {
  console.log('=' .repeat(50));
  console.log('ReviewIQ AI — Frontend Verification Suite');
  console.log('=' .repeat(50));

  // 1. Verify dist exists
  if (!fs.existsSync(distDir)) {
    throw new Error('Dist directory does not exist. Run "npm run build" first.');
  }
  console.log('[1/4] Build directory verified: dist/');

  // 2. Verify index.html
  const indexPath = path.join(distDir, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  if (!indexHtml.includes('ReviewIQ AI')) {
    throw new Error('index.html does not contain ReviewIQ AI title');
  }
  if (!indexHtml.includes('reviewiq_theme')) {
    throw new Error('index.html is missing theme flash-prevention script');
  }
  console.log('[2/4] index.html verified with anti-theme-flash script & ReviewIQ AI branding.');

  // 3. Verify CSS bundle
  const assetsDir = path.join(distDir, 'assets');
  const assetFiles = fs.readdirSync(assetsDir);
  const cssFile = assetFiles.find((f) => f.endsWith('.css'));
  if (!cssFile) {
    throw new Error('No CSS bundle found in dist/assets/');
  }
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
  if (!cssContent.includes('backdrop-filter')) {
    throw new Error('CSS bundle missing glassmorphism backdrop-filter definitions');
  }
  console.log(`[3/4] CSS bundle verified: ${cssFile} (${(cssContent.length / 1024).toFixed(1)} KB) with glassmorphism classes.`);

  // 4. Verify JS bundle
  const jsFile = assetFiles.find((f) => f.endsWith('.js'));
  if (!jsFile) {
    throw new Error('No JS bundle found in dist/assets/');
  }
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
  // Check for presence of key page components / strings
  const requiredSymbols = [
    'ReviewIQ AI',
    'Dashboard',
    'Review Analyzer',
    'Product Catalog',
    'Aspect Analytics',
    'Model Evaluation'
  ];
  for (const sym of requiredSymbols) {
    if (!jsContent.includes(sym)) {
      throw new Error(`JS bundle missing expected UI component: "${sym}"`);
    }
  }
  console.log(`[4/4] JS bundle verified: ${jsFile} (${(jsContent.length / 1024).toFixed(1)} KB) containing all routes and pages.`);

  console.log('=' .repeat(50));
  console.log('[SUCCESS] All frontend verification checks PASSED!');
  console.log('=' .repeat(50));
}

runFrontendVerification();
