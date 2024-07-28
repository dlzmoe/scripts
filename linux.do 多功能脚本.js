// ==UserScript==
// @name         linux.do 多功能脚本
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.5
// @description  linux.do 多功能脚本，显示创建时间或将浏览器替换为时间，显示楼层数，隐藏签名尾巴，功能持续更新，欢迎提出。
// @author       dlzmoe
// @match        *://*.linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  var menu_ALL = [
    ['menu_showcreatetime', '帖子列表显示创建时间', '帖子列表显示创建时间', true],
    ['menu_viewstotime', '将浏览量替换为创建时间', '将浏览量替换为创建时间', true],
    ['menu_showfloors', '显示楼层数', '显示楼层数', true],
    ['menu_hidereplytail', '隐藏跟帖小尾巴签名', '隐藏跟帖小尾巴签名', false],
    ['menu_showchattime', '显示聊天频道时间', '显示聊天频道时间', false],
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
    if (menu_ID.length > menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
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
    menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 修改设置后记得刷新网页！', function () {
      window.GM_openInTab(window.location.href, {
        active: false,
        // insert: true,
        // setParent: true
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


  function formattedDate(time) {
    const timestamp = Number(time); // 将字符串转换为数字类型
    const date = new Date(timestamp);

    // 获取当前日期
    const now = new Date();
    const isToday = now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且确保两位数
    const day = String(date.getDate()).padStart(2, '0'); // 确保两位数
    const hours = String(date.getHours()).padStart(2, '0'); // 确保两位数
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 确保两位数

    if (isToday) {
      return `${hours}:${minutes}`;
    } else {
      return `${month}/${day} ${hours}:${minutes}`;
    }
  }

  function convertToTimestamp(dateStr) {
    // 创建一个正则表达式来匹配日期和时间部分
    var datePattern = /(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日 (\d{2}):(\d{2})/;
    var dateMatch = dateStr.match(datePattern);

    if (dateMatch) {
      var year = parseInt(dateMatch[1], 10);
      var month = parseInt(dateMatch[2], 10) - 1; // 月份从0开始
      var day = parseInt(dateMatch[3], 10);
      var hours = parseInt(dateMatch[4], 10);
      var minutes = parseInt(dateMatch[5], 10);

      // 创建 Date 对象
      var date = new Date(year, month, day, hours, minutes);
      return date.getTime(); // 返回时间戳
    } else {
      return null; // 日期格式无效
    }
  }

  function init() {
    $('.topic-list .age').each(function () {
      const str = $(this).attr('title');
      var match = str.match(/创建日期：([\s\S]*?)最新：/);

      if (match && match[1]) {
        var creationDate = match[1].trim();
        var timestamp = convertToTimestamp(creationDate);
      }

      if ($(this).find(".linuxtime").length < 1) {
        $('.post-activity').attr('style', 'white-space:nowrap;display:inline-block;width:100%;text-align:left;');

        if (timestamp) {
          var now = new Date().getTime();
          var oneDay = 1000 * 60 * 60 * 24;
          var oneWeek = oneDay * 7;
          var oneMonth = oneDay * 30; // 近似值
          var threeMonths = oneMonth * 3;

          var color;
          var timeDiff = now - timestamp;


          if (menu_value('menu_viewstotime')) {
            $(this).siblings('.views').html('未知');
            $('head').append(`<style>
              .topic-list .views .number{opacity:0!important}
              .topic-list .views{font-weight:400!important;white-space:nowrap!important;}
              </style>`)
            $('.topic-list th.views span').html('创建时间');
            if (timeDiff < oneDay) {
              color = '#45B5AA';
              $(this).siblings('.views').html(`<span class="linuxtime" style="color:${color}">${formattedDate(timestamp)}</span>`);
            } else if (timeDiff < oneWeek) {
              color = '#66A586';
              $(this).siblings('.views').html(`<span class="linuxtime" style="color:${color}">${formattedDate(timestamp)}</span>`);
            } else if (timeDiff < oneMonth) {
              color = '#CFA94A';
              $(this).siblings('.views').html(`<span class="linuxtime" style="color:${color}">${formattedDate(timestamp)}</span>`);
            } else if (timeDiff < threeMonths) {
              color = '#3e8ed2';
              $(this).siblings('.views').html(`<span class="linuxtime" style="color:${color}">${formattedDate(timestamp)}</span>`);
            } else {
              color = '#cccccc';
              $(this).siblings('.views').html(`<span class="linuxtime" style="color:${color}"><img 
              style="width: 20px;
                    vertical-align: sub;" 
              src="https://cdn.linux.do/uploads/default/original/3X/0/a/0a7634b834bc6ecef03ab57306dafd8475387155.png"> ${formattedDate(timestamp)}</span>`);
            }
          } else {
            if (timeDiff < oneDay) {
              color = '#45B5AA';
              $(this).find('.post-activity').append(`<span class="linuxtime" style="color:${color}">（${formattedDate(timestamp)}）</span>`);
            } else if (timeDiff < oneWeek) {
              color = '#66A586';
              $(this).find('.post-activity').append(`<span class="linuxtime" style="color:${color}">（${formattedDate(timestamp)}）</span>`);
            } else if (timeDiff < oneMonth) {
              color = '#CFA94A';
              $(this).find('.post-activity').append(`<span class="linuxtime" style="color:${color}">（${formattedDate(timestamp)}）</span>`);
            } else if (timeDiff < threeMonths) {
              color = '#3e8ed2';
              $(this).find('.post-activity').append(`<span class="linuxtime" style="color:${color}">（${formattedDate(timestamp)}）</span>`);
            } else {
              color = '#cccccc';
              $(this).find('.post-activity').append(`<span class="linuxtime" style="color:${color}">（<img 
              style="width: 20px;
                    vertical-align: sub;" 
              src="https://cdn.linux.do/uploads/default/original/3X/0/a/0a7634b834bc6ecef03ab57306dafd8475387155.png"> ${formattedDate(timestamp)}）</span>`);
            }
          }
        }
      }
    });
  }

  // 显示创建时间
  function menu_showcreatetime() {
    if (!menu_value('menu_showcreatetime')) return;
    setInterval(() => {
      init();
    }, 1000);
  }
  menu_showcreatetime();


  // 隐藏跟帖小尾巴签名
  function menu_hidereplytail() {
    if (!menu_value('menu_hidereplytail')) return;
    $('head').append('<style>.topic-post .signature-img{display:none !important}</style>')
  }
  menu_hidereplytail();


  // 显示楼层数
  function menu_showfloors() {
    if (!menu_value('menu_showfloors')) return;
    $('head').append(`<style>
    .topic-post{position:relative;}
    .linuxfloor{display:flex;position:absolute;left:-32px;top:25px;color:#96aed0;width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:18px}

      </style>`)
    setInterval(() => {
      $('.topic-post').each(function () {
        const num = $(this).find('article').attr('id').replace(/^post_/, '');
        if ($(this).find('.linuxfloor').length < 1) {
          $(this).find('.topic-avatar').append(`<span class="linuxfloor">${num}</span>`)
        }
      })
    }, 1000);

  }
  menu_showfloors();

  
  // 显示聊天频道时间
  function menu_showchattime(){
    if (!menu_value('menu_showchattime')) return;
    $('head').append(`<style>
      .chat-message-container.-user-info-hidden .chat-time{display:block!important;}
  
      </style>`)
  }
  menu_showchattime();

})();