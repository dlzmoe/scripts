import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://raw.githubusercontent.com/dlzmoe/UserScript/refs/heads/main/assets/g.png',
        name: "example-scripts",
        namespace: 'https://github.com/dlzmoe/UserScript',
        description: "a sample script.",
        version: pkg.version,
        match: ['*://app.nextchat.dev/*'],
      },
      build: {
        externalGlobals: {
          // require 引入
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
        },
        minify: false, // 不混淆
      },
    }),
  ],
});
