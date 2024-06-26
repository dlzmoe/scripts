## scripts

https://github.com/dlzmoe/scripts

自用的脚本等，主要是油猴脚本。

```js
// ==UserScript==
// @name         tampermonkey-scripts
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.1
// @description  Tampermonkey Scripts
// @author       dlzmoe <anghunk@gmail.com>
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/chrome/static/images/chrome-logo-m100.svg
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';
  // 替换
  if (location.href === "http://localhost:8080/") return
  let script = document.createElement('script')
  script.src = 'http://127.0.0.1:5500/index.js'
  document.body.appendChild(script)
  // 替换
})();
```
