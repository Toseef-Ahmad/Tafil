#!/usr/bin/env node
// build-canvas.js - Bundle Excalidraw canvas for offline use
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  console.log('📦 Building Excalidraw canvas bundle...');
  
  // Read Excalidraw CSS
  const excalidrawCssPath = path.join(__dirname, 'node_modules/@excalidraw/excalidraw/dist/prod/index.css');
  let excalidrawCss = '';
  try {
    excalidrawCss = fs.readFileSync(excalidrawCssPath, 'utf8');
    console.log('   Found Excalidraw CSS');
  } catch (err) {
    console.warn('   ⚠️ Could not read Excalidraw CSS');
  }
  
  try {
    // Bundle the React app
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'canvas-src.jsx')],
      bundle: true,
      outfile: path.join(__dirname, 'dist', 'canvas-bundle.js'),
      format: 'iife',
      platform: 'browser',
      target: ['chrome100'],
      minify: true,
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.IS_PREACT': 'false',
      },
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.ttf': 'dataurl',
        '.eot': 'dataurl',
        '.svg': 'dataurl',
        '.png': 'dataurl',
      },
      jsx: 'automatic',
      jsxImportSource: 'react',
      // Banner to inject CSS
      banner: {
        js: `
(function() {
  if (typeof document !== 'undefined') {
    var style = document.createElement('style');
    style.id = 'excalidraw-styles';
    style.textContent = ${JSON.stringify(excalidrawCss)};
    document.head.appendChild(style);
  }
})();
`,
      },
    });
    
    console.log('✅ Canvas bundle created successfully!');
    
    // Get bundle size
    const stats = fs.statSync(path.join(__dirname, 'dist', 'canvas-bundle.js'));
    console.log(`   Bundle size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
