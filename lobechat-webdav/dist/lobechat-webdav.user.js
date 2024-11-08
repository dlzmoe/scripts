// ==UserScript==
// @name         lobechat-webdav
// @namespace    https://github.com/dlzmoe/UserScript
// @version      0.0.2
// @author       dlzmoe
// @description  给 lobechat 程序添加 webdav 同步的功能。
// @license      Apache-2.0
// @icon         https://chat-preview.lobehub.com/favicon-32x32.ico
// @match        *://chat.oaipro.com/*
// @match        *://chat-preview.lobehub.com/*
// @require      https://unpkg.com/vue@3.4.38/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(" .lobewebdav{position:fixed;left:10px;top:230px;z-index:100}.lobewebdav .lobewebdav-dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:600px;height:400px;overflow-y:scroll;padding:30px;border-radius:20px;background:#fff;box-shadow:1px 5px 10px #0003}.lobewebdav .lobewebdav-dialog .close{position:absolute;right:20px;top:30px;cursor:pointer;transition:all .2s linear}.lobewebdav .lobewebdav-dialog .close:hover{color:#666}.lobewebdav .lobewebdav-dialog h2{margin-bottom:20px}.lobewebdav .lobewebdav-dialog .item{display:flex;align-items:center;margin-top:1em}.lobewebdav .lobewebdav-dialog .item label{width:120px;text-align:right;white-space:nowrap}.lobewebdav .lobewebdav-dialog .item input{flex:1;border-radius:4px;height:28px;border:1px solid #999;transition:all .1s linear;padding:0 10px}.lobewebdav .lobewebdav-dialog .item input:focus{border-color:#666}.lobewebdav .lobewebdav-dialog button{outline:none;border:none;border-radius:5px;background:#333;color:#fff;height:30px;padding:0 15px;transition:all .1s linear;cursor:pointer}.lobewebdav .lobewebdav-dialog button+button{margin-left:10px}.lobewebdav .lobewebdav-dialog button:hover{background:#666} ");

(function (vue) {
  'use strict';

  const name = "lobechat-webdav";
  const version = "0.0.2";
  const author = "dlzmoe";
  const description = "Add webdav synchronization function to lobechat program.";
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
    data() {
      return {
        open: false,
        exportData: {},
        importData: {},
        webdav: {
          baseurl: "",
          username: "",
          password: ""
        },
        msg: ""
      };
    },
    methods: {
      // 打开弹窗
      opendialog() {
        this.open = !this.open;
      },
      // 保存密码
      savewebdav() {
        localStorage.setItem("lobechat-webdav", JSON.stringify(this.webdav));
      },
      // 获取 lobechat 数据生成 json
      getIndexedDB() {
        const dbName = "LOBE_CHAT_DB";
        const storeNames = ["messages", "sessionGroups", "sessions", "topics"];
        let request = indexedDB.open(dbName);
        request.onsuccess = (event) => {
          const db = event.target.result;
          let state = {
            messages: [],
            sessionGroups: [],
            sessions: [],
            topics: []
          };
          let pendingStores = 0;
          storeNames.forEach((storeName) => {
            if (db.objectStoreNames.contains(storeName)) {
              pendingStores++;
              const transaction = db.transaction([storeName], "readonly");
              const objectStore = transaction.objectStore(storeName);
              const allRecords = objectStore.getAll();
              allRecords.onsuccess = (event2) => {
                const result = event2.target.result;
                state[storeName] = result;
                pendingStores--;
                if (pendingStores === 0) {
                  this.exportData = JSON.stringify({
                    exportType: "all",
                    state,
                    version: 7
                  });
                }
              };
              allRecords.onerror = (event2) => {
                console.error(`Error fetching data from ${storeName}:`, event2);
              };
            } else {
              console.warn(`Object store ${storeName} not found in database ${dbName}`);
            }
          });
          if (pendingStores === 0) {
            console.log("No valid object stores found in the database.");
          }
        };
        request.onerror = (event) => {
          console.error("Error opening database:", event);
        };
      },
      // 检查文件夹是否存在
      checkFolderExists(folderUrl) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "PROPFIND",
            url: folderUrl,
            headers: {
              Authorization: "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`),
              Depth: "1"
              // 只检查一层
            },
            onload: function(response) {
              if (response.status === 207) {
                resolve(true);
              } else if (response.status === 404) {
                resolve(false);
              } else {
                reject(new Error(`Error checking folder: ${response.statusText}`));
              }
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      },
      // 创建文件夹
      createFolder(folderUrl) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "MKCOL",
            url: folderUrl,
            headers: {
              Authorization: "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`)
            },
            onload: function(response) {
              if (response.status === 201) {
                resolve(true);
              } else {
                reject(new Error(`Error creating folder: ${response.statusText}`));
              }
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      },
      // 检查并创建文件夹
      async checkAndCreateFolder() {
        this.getIndexedDB();
        const folderUrl = `${this.webdav.baseurl}lobechat-webdav-backup/`;
        try {
          const exists = await this.checkFolderExists(folderUrl);
          if (!exists) {
            await this.createFolder(folderUrl);
            console.log("Folder 'lobechat-webdav-backup' created successfully.");
          } else {
            console.log("Folder 'lobechat-webdav-backup' already exists.");
          }
          const data = this.exportData;
          if (!data) {
            console.error("Export data is not initialized properly.");
            return;
          }
          const uploadUrl = `${this.webdav.baseurl}lobechat-webdav-backup/data.json`;
          try {
            const uploadResponse = await this.uploadFile(uploadUrl, data);
            this.msg = "同步到云端成功！";
          } catch (error) {
            console.error("Upload failed:", error);
            this.msg = "同步失败！";
          }
        } catch (error) {
          console.error(error);
        }
      },
      uploadFile(url, fileData) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "PUT",
            url,
            data: fileData,
            headers: {
              "Content-Type": "text/plain",
              Authorization: "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`)
            },
            onload: function(response) {
              if (response.status >= 200 && response.status < 300) {
                resolve(response);
              } else {
                reject(new Error(`Upload failed: ${response.statusText}`));
              }
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      },
      downloadFile(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url,
            headers: {
              Authorization: "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`)
            },
            onload: function(response) {
              if (response.status >= 200 && response.status < 300) {
                resolve(response.responseText);
              } else {
                reject(new Error(`Download failed: ${response.statusText}`));
              }
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      },
      // 上传
      async uploadSampleFile() {
        this.checkAndCreateFolder();
      },
      // 下载
      async downloadSampleFile() {
        const downloadUrl = `${this.webdav.baseurl}lobechat-webdav-backup/data.json`;
        try {
          const downloadResponse = await this.downloadFile(downloadUrl);
          const importData = JSON.parse(downloadResponse);
          console.log(importData);
          this.msg = "下载成功，即将同步数据，请勿操作页面！";
          const dbName = "LOBE_CHAT_DB";
          const storeNames = ["messages", "sessionGroups", "sessions", "topics"];
          let request = indexedDB.open(dbName);
          request.onsuccess = function(event) {
            const db = event.target.result;
            const state = importData.state;
            console.log(importData);
            storeNames.forEach((storeName) => {
              if (db.objectStoreNames.contains(storeName)) {
                const transaction = db.transaction([storeName], "readwrite");
                const objectStore = transaction.objectStore(storeName);
                const clearRequest = objectStore.clear();
                clearRequest.onsuccess = function() {
                  console.log(`${storeName} store cleared.`);
                  const data = state[storeName];
                  if (Array.isArray(data)) {
                    data.forEach((item) => {
                      const addRequest = objectStore.add(item);
                      addRequest.onsuccess = function() {
                        console.log(`Item added to ${storeName} store.`);
                      };
                      addRequest.onerror = function(event2) {
                        console.error(`Error adding item to ${storeName}:`, event2);
                      };
                    });
                    setTimeout(() => {
                      this.msg = "同步完成，请手动刷新页面！";
                    }, 1e3);
                  }
                };
                clearRequest.onerror = function(event2) {
                  console.error(`Error clearing ${storeName} store:`, event2);
                };
              } else {
                console.warn(`Object store ${storeName} not found in database ${dbName}`);
              }
            });
          };
          request.onerror = function(event) {
            console.error("Error opening database:", event);
          };
        } catch (error) {
          console.error(error);
          this.msg = "下载失败，请检查是否存在备份！";
        }
      }
    },
    created() {
      const lobechat_webdav = JSON.parse(localStorage.getItem("lobechat-webdav"));
      if (lobechat_webdav) {
        this.webdav = lobechat_webdav;
      }
      console.log(
        `%c ${packageJson.name} %c 已开启 `,
        "padding: 2px 1px; color: #fff; background: #606060;",
        "padding: 2px 1px; color: #fff; background: #42c02e;"
      );
    }
  };
  const _hoisted_1 = { class: "lobewebdav" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("div", {
    style: { "border-radius": "8px", "height": "44px", "width": "44px" },
    class: "layoutkit-flexbox css-5wokcq acss-1rzhzi1"
  }, [
    /* @__PURE__ */ vue.createElementVNode("span", {
      class: "anticon acss-17q14cp",
      role: "img"
    }, [
      /* @__PURE__ */ vue.createElementVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        class: "icon icon-tabler icons-tabler-outline icon-tabler-brand-webflow"
      }, [
        /* @__PURE__ */ vue.createElementVNode("path", {
          stroke: "none",
          d: "M0 0h24v24H0z",
          fill: "none"
        }),
        /* @__PURE__ */ vue.createElementVNode("path", { d: "M17 10s-1.376 3.606 -1.5 4c-.046 -.4 -1.5 -8 -1.5 -8c-2.627 0 -3.766 1.562 -4.5 3.5c0 0 -1.843 4.593 -2 5c-.013 -.368 -.5 -4.5 -.5 -4.5c-.15 -2.371 -2.211 -3.98 -4 -3.98l2 12.98c2.745 -.013 4.72 -1.562 5.5 -3.5c0 0 1.44 -4.3 1.5 -4.5c.013 .18 1 8 1 8c2.758 0 4.694 -1.626 5.5 -3.5l3.5 -9.5c-2.732 0 -4.253 2.055 -5 4z" })
      ])
    ])
  ], -1);
  const _hoisted_3 = [
    _hoisted_2
  ];
  const _hoisted_4 = { class: "lobewebdav-dialog" };
  const _hoisted_5 = /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "icon icon-tabler icons-tabler-outline icon-tabler-x"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      stroke: "none",
      d: "M0 0h24v24H0z",
      fill: "none"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M18 6l-12 12" }),
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M6 6l12 12" })
  ], -1);
  const _hoisted_6 = [
    _hoisted_5
  ];
  const _hoisted_7 = /* @__PURE__ */ vue.createElementVNode("h2", null, "同步 Lobechat 数据到 WebDav", -1);
  const _hoisted_8 = { class: "item" };
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("label", null, "WebDav 地址：", -1);
  const _hoisted_10 = { class: "item" };
  const _hoisted_11 = /* @__PURE__ */ vue.createElementVNode("label", null, "WebDav 用户名：", -1);
  const _hoisted_12 = { class: "item" };
  const _hoisted_13 = /* @__PURE__ */ vue.createElementVNode("label", null, "WebDav 密码：", -1);
  const _hoisted_14 = { class: "item" };
  const _hoisted_15 = { class: "item" };
  const _hoisted_16 = { class: "item" };
  const _hoisted_17 = { class: "msg" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      vue.createElementVNode("a", {
        "aria-label": "webdav",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.opendialog && $options.opendialog(...args)),
        href: "javascript:void(0)"
      }, _hoisted_3),
      vue.withDirectives(vue.createElementVNode("div", _hoisted_4, [
        vue.createElementVNode("div", {
          class: "close",
          onClick: _cache[1] || (_cache[1] = ($event) => this.open = false)
        }, _hoisted_6),
        _hoisted_7,
        vue.createElementVNode("div", _hoisted_8, [
          _hoisted_9,
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.webdav.baseurl = $event),
            placeholder: "https://xxx.com/dav/"
          }, null, 512), [
            [vue.vModelText, $data.webdav.baseurl]
          ])
        ]),
        vue.createElementVNode("div", _hoisted_10, [
          _hoisted_11,
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.webdav.username = $event)
          }, null, 512), [
            [vue.vModelText, $data.webdav.username]
          ])
        ]),
        vue.createElementVNode("div", _hoisted_12, [
          _hoisted_13,
          vue.withDirectives(vue.createElementVNode("input", {
            type: "password",
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.webdav.password = $event)
          }, null, 512), [
            [vue.vModelText, $data.webdav.password]
          ])
        ]),
        vue.createElementVNode("div", _hoisted_14, [
          vue.createElementVNode("button", {
            onClick: _cache[5] || (_cache[5] = (...args) => $options.savewebdav && $options.savewebdav(...args))
          }, "保存密码")
        ]),
        vue.createElementVNode("div", _hoisted_15, [
          vue.createElementVNode("button", {
            onClick: _cache[6] || (_cache[6] = (...args) => $options.uploadSampleFile && $options.uploadSampleFile(...args))
          }, "同步到云端"),
          vue.createElementVNode("button", {
            onClick: _cache[7] || (_cache[7] = (...args) => $options.downloadSampleFile && $options.downloadSampleFile(...args))
          }, "下载到本地")
        ]),
        vue.createElementVNode("div", _hoisted_16, [
          vue.createElementVNode("div", _hoisted_17, vue.toDisplayString($data.msg), 1)
        ])
      ], 512), [
        [vue.vShow, $data.open]
      ])
    ]);
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