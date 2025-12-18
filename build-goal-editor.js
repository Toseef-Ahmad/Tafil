#!/usr/bin/env node
// build-goal-editor.js - Bundle ProseMirror-based live Markdown editor for offline use
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  console.log('📝 Building Goal Markdown editor bundle...');

  try {
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'goal-markdown-editor-src.js')],
      bundle: true,
      outfile: path.join(__dirname, 'dist', 'goal-markdown-editor-bundle.js'),
      format: 'iife',
      platform: 'browser',
      target: ['chrome100'],
      minify: true,
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });

    console.log('✅ Goal editor bundle created successfully!');
    const stats = fs.statSync(path.join(__dirname, 'dist', 'goal-markdown-editor-bundle.js'));
    console.log(`   Bundle size: ${(stats.size / 1024).toFixed(1)} KB`);
  } catch (error) {
    console.error('❌ Goal editor build failed:', error);
    process.exit(1);
  }
}

build();


