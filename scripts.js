// ==UserScript==
// @name         tampermonkey-scripts
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.1
// @description  Tampermonkey Scripts
// @author       dlzmoe
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @icon         https://www.google.com/chrome/static/images/chrome-logo-m100.svg
// @grant        none
// @license      Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  var menu_ALL = [
    ['menu_demo1', '功能名称', '功能名称', true],
  ];
  var menu_ID = [];
  for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
    if (GM_getValue(menu_ALL[i][0]) == null) {
      GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
    };
  }
  registerMenuCommand();

  // 注册脚本菜单
  function registerMenuCommand() {
    if (menu_ID.length > menu_ALL.length) { // 如果菜单 ID 数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
      for (let i = 0; i < menu_ID.length; i++) {
        GM_unregisterMenuCommand(menu_ID[i]);
      }
    }
    for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
      menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
      menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function () {
        menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`)
      });
    }
    menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 建议与反馈！', function () {
      window.GM_openInTab("https://github.com/dlzmoe/scripts", {
        active: true,
        insert: true,
        setParent: true
      });
    });

  }

  // 菜单开关
  function menu_switch(menu_status, Name, Tips) {
    if (menu_status == 'true') {
      GM_setValue(`${Name}`, false);
      GM_notification({
        text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`,
        timeout: 3500,
        onclick: function () {
          location.reload();
        }
      });
    } else {
      GM_setValue(`${Name}`, true);
      GM_notification({
        text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`,
        timeout: 3500,
        onclick: function () {
          location.reload();
        }
      });
    }
    registerMenuCommand(); // 重新注册脚本菜单
  };

  // 返回菜单值
  function menu_value(menuName) {
    for (let menu of menu_ALL) {
      if (menu[0] == menuName) {
        return menu[3]
      }
    }
  }

  function demo1() {
    if (!menu_value('menu_demo1')) return;
    // 替换
    if (location.href === "http://localhost:8080/") return
    let script = document.createElement('script')
    script.src = 'http://127.0.0.1:5500/index.js'
    document.body.appendChild(script)
    // 替换
  }
  demo1();

})();