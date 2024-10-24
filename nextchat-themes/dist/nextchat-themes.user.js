// ==UserScript==
// @name         nextchat-themes
// @namespace    https://github.com/dlzmoe/UserScript
// @version      0.0.3
// @author       dlzmoe
// @description  NextChat 插件，修改 UI 主题！
// @license      Apache-2.0
// @icon         https://framerusercontent.com/images/tCHbBovHGLAJDNKRG1lKfavenFs.png
// @match        *://app.nextchat.dev/*
// @match        *://nextchat.oaipro.com/*
// @require      https://unpkg.com/vue@3.4.38/dist/vue.global.prod.js
// @grant        GM_addStyle
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const i=document.createElement("style");i.textContent=t,document.head.append(i)})(" :root{--primary: #333 !important}.home_sidebar-logo__Cd7hL svg path{fill:#999!important}.button_icon-button-text__my76e{font-size:14px!important}.home_container__4PEJZ{width:98vw!important;height:98vh!important;max-width:100%!important}.home_sidebar__fPZfq{background:#f9f9f9!important;box-shadow:none!important}.chat_chat-input__PQ_oF{min-height:130px!important}.settings_settings__427bK{max-width:1000px!important}.chat_chat-input-actions__mwYC_ .chat_chat-input-action__DMW7Y{width:auto!important}.chat_chat-input-actions__mwYC_ .chat_chat-input-action__DMW7Y .chat_text__TkPfN{opacity:1!important;transform:none!important}.chat_chat-message-avatar__3QeMq .chat_chat-message-edit__h58of button{display:none!important}.chat_chat-message-avatar__3QeMq .no-dark svg g rect{fill:#fff!important}.chat_chat-message-user__ZtTEj>.chat_chat-message-container__O_X8_>.chat_chat-message-item__dKqMl{background-color:#fff!important}.chat_chat-message-action-date__RsXTn{display:none!important}.ui-lib_list-item__YH0DO .ui-lib_list-header__RwThu .ui-lib_list-item-title__Fsa9c{font-size:16px}.ui-lib_list-item__YH0DO .ui-lib_list-header__RwThu .ui-lib_list-item-sub-title__jSgHb{font-size:14px;padding-top:6px}.input-range_input-range__SuxRd,.ui-lib_select-with-icon__L6FLF .ui-lib_select-with-icon-select__JhHwp{font-size:14px}.home_sidebar-tail__T2_u7{flex-direction:column-reverse;width:100%}.home_sidebar-actions__LcDT9>.home_sidebar-action__IVfyJ:nth-child(3){display:none!important}.home_sidebar-actions__LcDT9:nth-child(2){width:100%!important;margin-bottom:10px}.home_sidebar-actions__LcDT9:nth-child(2) .button_shadow__G4m_0{width:100%!important;height:40px!important;background:#333!important;color:#fff!important}.home_sidebar-actions__LcDT9:nth-child(2) .button_shadow__G4m_0 *{font-size:16px!important}.home_sidebar-actions__LcDT9:nth-child(2) .button_shadow__G4m_0 .button_icon-button-icon__AMZta{transform:scale(1.2)}.home_sidebar-actions__LcDT9:nth-child(2) .button_shadow__G4m_0 svg{fill:#fff!important}.home_chat-item-info__9r6z_{display:none!important}.home_chat-item__Oblai{margin-bottom:5px!important;position:relative!important}.home_chat-item-delete__3qV5m{top:50%!important;transform:translateY(-50%)!important;right:10px!important}.home_chat-item-title__sRstw{font-weight:500!important}#webdavBtn{position:fixed;bottom:25px;left:85px;display:flex;align-items:center;display:none}#webdavBtn button{margin-right:10px!important}#webdavBtn .button_icon-button-icon__AMZta{width:auto!important} ");

(function (vue) {
  'use strict';

  const name = "nextchat-themes";
  const version = "0.0.3";
  const author = "dlzmoe";
  const description = "NextChat plug-in, modify the UI theme!";
  const type = "module";
  const license = "Apache-2.0";
  const scripts = {
    dev: "vite --mode development",
    build: "vite build",
    preview: "vite preview"
  };
  const dependencies = {
    vue: "^3.4.27",
    webdav: "^5.7.1"
  };
  const devDependencies = {
    "@vitejs/plugin-vue": "^5.0.4",
    less: "^4.1.0",
    "less-loader": "^8.0.0",
    "style-loader": "^2.0.0",
    vite: "^5.2.12",
    "vite-plugin-monkey": "^4.0.0"
  };
  const packageJson = {
    name,
    version,
    author,
    description,
    type,
    license,
    scripts,
    dependencies,
    devDependencies
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main = {
    methods: {
      addWebdavBtn() {
      }
    },
    created() {
      console.log(
        `%c ${packageJson.name} %c 已开启 `,
        "padding: 2px 1px; color: #fff; background: #606060;",
        "padding: 2px 1px; color: #fff; background: #42c02e;"
      );
      this.addWebdavBtn();
    }
  };
  const _hoisted_1 = { id: "webdavBtn" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("button", {
    class: "button_icon-button__VwAMf undefined button_shadow__G4m_0 clickable undefined",
    role: "button",
    "aria-label": "ChatGPT"
  }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "button_icon-button-icon__AMZta false" }, "上传到云端")
  ], -1);
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("button", {
    class: "button_icon-button__VwAMf undefined button_shadow__G4m_0 clickable undefined",
    role: "button",
    "aria-label": "ChatGPT"
  }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "button_icon-button-icon__AMZta false" }, "同步到本地")
  ], -1);
  const _hoisted_4 = [
    _hoisted_2,
    _hoisted_3
  ];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, _hoisted_4);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const app = vue.createApp(App);
  app.mount(
    (() => {
      const appDiv = document.createElement("div");
      document.body.append(appDiv);
      return appDiv;
    })()
  );

})(Vue);