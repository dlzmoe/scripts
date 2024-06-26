// ==UserScript==
// @name         抖音视频下载 - 需进入详情页
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.1
// @description  Tampermonkey description
// @author       dlzmoe
// @match        https://*.douyin.com/*
// @icon         https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';
  $(function () {
    setTimeout(function () {
      $('.danMuPlayerStyle .jkfSVWLT .wobrT4EE:nth-child(4)').remove();
      $('.xgplayer.xgplayer-pc .xg-right-grid').append(`
      <xg-icon class="xgplayer-playclarity-setting" data-state="normal" data-index="10">
        <div class="gear">
          <div class="btn" id="xgplayer-download">下载</div>
        </div>
      </xg-icon>`)

      $('#xgplayer-download').click(function () {
        var videoUrl = $('.xgplayer video').find('source:nth-child(1)').attr('src');
        $('body').append(`<a id="newdownload" href="${videoUrl}" download></a>`)
        $('#newdownload')[0].click();
      })
    }, 1000)

  })
})();