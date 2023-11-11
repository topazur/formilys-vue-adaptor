import { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '文档',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Hooks', link: '/hooks/' },
      { text: 'Components', link: '/components/' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
      {
        text: 'Hooks',
        items: [
          { text: 'Hooks导览页', link: '/hooks/' },
          { text: 'useControllableValue', link: '/hooks/useControllableValue' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Components导览页', link: '/components/' },
          { text: 'Select2', link: '/components/select2' },
          { text: 'QueryFoldFilter', link: '/components/fold' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },

  vite: {
    resolve: {
      alias: [
        // {
        // find: '@odinlin/formily-antdv',
        // replacement: resolve(__dirname, '../../packages/antdv/src'),
        // },
        {

          find: /^@odinlin\/formily-antdv$/,
          replacement: fileURLToPath(
            new URL('../../packages/antdv/src', import.meta.url),
          ),
        },
      ],
    },
    plugins: [
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
    ],
  },

})
