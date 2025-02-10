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
        icon: 'https://chat.oaipro.com/favicon-32x32.ico',
        name: "Lobechat Webdav 同步功能",
        namespace: 'https://github.com/dlzmoe/UserScript',
        description: "给 lobechat 程序添加 webdav 同步的功能。",
        version: pkg.version,
        match: [
          '*://chat.oaipro.com/*',
          '*://chat-preview.lobehub.com/*',
          '*://lobechat.zishu.me/*',
        ],
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
