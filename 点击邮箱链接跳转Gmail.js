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
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  var mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

  mailtoLinks.forEach(function (link) {
    console.log(link.href);
    link.href = `https://mail.google.com/mail/u/0/?ui=2&fs=1&tf=cm&${link.href}`
  });

})();