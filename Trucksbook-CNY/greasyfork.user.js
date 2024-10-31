// ==UserScript==
// @name        Trucksbook 欧元换算人民币单位
// @version     1.0
// @namespace   https://github.com/dlzmoe/Userscript
// @author      dlzmoe
// @description trucksbook.eu 欧元换算人民币单位插件，安装即可使用生效。
// @match       https://trucksbook.eu/*
// @grant       none
// @icon        https://trucksbook.eu/data/system/favicon.ico
// @license     Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  $(document).ready(function () {
    var exchangeRate = 7.73; // 汇率

    $('*').contents().each(function () {
      if (this.nodeType === Node.TEXT_NODE) {
        var text = this.nodeValue;

        var regex = /(\d[\d\s]*)\s*€/g;
        var matches;

        while ((matches = regex.exec(text)) !== null) {
          var euroValue = parseFloat(matches[1].replace(/\s+/g, ''));
          var rmbValue = (euroValue * exchangeRate).toFixed(2);
          var newText = text.replace(matches[0], rmbValue + ' 元');
          $(this).replaceWith(newText);
        }
      }
    });
  });

})();