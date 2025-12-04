import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Tafil Documentation',
  description: 'Modern Project Manager for Node.js Developers',
  base: '/Tafil/docs/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Download', link: '/downloads/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'GitHub', link: 'https://github.com/Toseef-Ahmad/Tafil' }
    ],

    sidebar: [
      {
        text: 'Downloads',
        items: [
          { text: 'Installation', link: '/downloads/' },
          { text: 'macOS', link: '/downloads/macos' },
          { text: 'Windows', link: '/downloads/windows' },
          { text: 'Linux', link: '/downloads/linux' },
          { text: 'Build from Source', link: '/downloads/build-from-source' }
        ]
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/getting-started' },
          { text: 'First Steps', link: '/guide/first-steps' },
          { text: 'Scanning Projects', link: '/guide/scanning' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Collections', link: '/features/collections' },
          { text: 'Command Palette', link: '/features/command-palette' },
          { text: 'Running Projects', link: '/features/running-projects' },
          { text: 'Project Insights', link: '/features/insights' },
          { text: 'IDE Integration', link: '/features/ide-integration' },
          { text: 'Themes', link: '/features/themes' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Keyboard Shortcuts', link: '/reference/shortcuts' },
          { text: 'Supported Frameworks', link: '/reference/frameworks' },
          { text: 'Settings', link: '/reference/settings' }
        ]
      },
      {
        text: 'Contributing',
        items: [
          { text: 'How to Contribute', link: '/contributing/' },
          { text: 'Development Setup', link: '/contributing/setup' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Toseef-Ahmad/Tafil' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Touseef Ahmad'
    },

    search: {
      provider: 'local'
    }
  }
})

