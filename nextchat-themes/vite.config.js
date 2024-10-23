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
        icon: 'https://framerusercontent.com/images/tCHbBovHGLAJDNKRG1lKfavenFs.png',
        name: "nextchat-themes",
        namespace: 'https://github.com/dlzmoe/UserScript',
        description: "NextChat 插件，修改 UI 主题！",
        version: pkg.version,
        match: [
          '*://app.nextchat.dev/*',
          '*://nextchat.oaipro.com/*',
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
