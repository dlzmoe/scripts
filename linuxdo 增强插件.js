// ==UserScript==
// @name         linuxdo 增强插件
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.19
// @description  linux.do 多功能脚本，显示创建时间或将浏览器替换为时间，显示楼层数，隐藏签名尾巴，新标签页打开话题，强制 block（拉黑屏蔽） 某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，功能设置面板导入导出，楼层抽奖等，功能持续更新，欢迎提出。
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
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  var menu_ALL = [
    ['menu_openpostblank', '新标签页打开话题', '新标签页打开话题', false],
    ['menu_autoexpandreply', '自动展开回复', '自动展开回复', false],
    ['menu_showcreatetime', '话题列表显示创建时间', '话题列表显示创建时间', true],
    ['menu_viewstotime', '将浏览量替换为创建时间', '将浏览量替换为创建时间', false],
    ['menu_showfloors', '显示楼层数', '显示楼层数', true],
    ['menu_hidereplytail', '隐藏跟帖小尾巴签名', '隐藏跟帖小尾巴签名', false],
    ['menu_showchattime', '显示聊天频道时间', '显示聊天频道时间', false],
    ['menu_createreply', '快捷创建回复', '快捷创建回复', true],
    ['menu_blockuserlist', '屏蔽指定用户', '屏蔽指定用户', true],
    ['menu_suspendedball', '功能悬浮球（显示与否不影响设置功能运行）', '功能悬浮球（显示与否不影响设置功能运行）', true],
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
      if (menu_ALL[i][0] === 'menu_customBlockKeywords') { // 只有 [屏蔽指定关键词] 启用时，才注册菜单 [自定义屏蔽关键词]
        customBlockKeywords()
      } else {
        menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function () {
          menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`)
        });
      }

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

  function setinitdate() {
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
      setinitdate();
    }, 1000);
  }

  // 隐藏跟帖小尾巴签名
  function menu_hidereplytail() {
    if (!menu_value('menu_hidereplytail')) return;
    $('head').append('<style>.topic-post .signature-img{display:none !important}</style>');
  }
  menu_hidereplytail();

  // 显示楼层数
  function menu_showfloors() {
    if (!menu_value('menu_showfloors')) return;
    setInterval(() => {
      $('.topic-post').each(function () {
        const num = $(this).find('article').attr('id').replace(/^post_/, '');
        if ($(this).find('.linuxfloor').length < 1) {
          $(this).find('.topic-avatar').append(`<span class="linuxfloor">#${num}</span>`)
        }
      })
    }, 1000);
  }

  // 显示聊天频道时间
  function menu_showchattime() {
    if (!menu_value('menu_showchattime')) return;
    $('head').append(`<style>
      .chat-message-container.-user-info-hidden .chat-time{display:block!important;}
      </style>`)
  }
  menu_showchattime();

  // 新标签页打开话题
  function menu_openpostblank() {
    if (!menu_value('menu_openpostblank')) return;
    $('.topic-list a.title').click(function (event) {
      event.preventDefault();
      var url = $(this).attr('href');
      window.open(url, '_blank');
    });
  }

  // 显示功能悬浮球
  function menu_suspendedball() {
    if (!menu_value('menu_suspendedball')) return;
    setTimeout(() => {
      $('body').append(`<div class="menu_suspendedball">
        <div class="opendialog"><svg class="fa d-icon d-icon-cog svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#cog"></use></svg></div>
        <div id="menu_suspendedball">
          <div class="title">设置</div><div class="close">+</div>
          <p class="hint">请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。</p>
          <div class="item">
            <div class="tit">1. 屏蔽用户列表（使用英文,分隔）</div>
            <textarea id="blockuserlist" placeholder="user1,user2,user3"></textarea>
          </div>
          <div class="item">
            <div class="tit">2. 自定义快捷回复（换行分隔）</div>
            <textarea id="customquickreply" placeholder="前排~">前排围观~
你好啊</textarea>
          </div>
          <div class="flex">
            <button class="btn save">保存</button>
            <button class="btn floorlottery">楼层抽奖</button>
            <button class="btn import">导入</button>
            <input type="file" id="fileInput" style="display:none;" accept=".json">
            <button class="btn export">导出</button>
          </div>
        </div>
      </div>
      
      <dialog open class="floorlotterywrap">
        <div>
          <label for="totalFloors">总楼层：</label>
          <input type="number" id="totalFloors" min="1">
        </div>
        <div>
          <label for="numToDraw">需要抽取的个数：</label>
          <input type="number" id="numToDraw" min="1">
        </div>
        <button id="floorlotterdrawButton" class="btn">确定</button>
        <button id="floorlotterclose" class="btn">关闭</button>
        <div id="floorlotterloading" style="display: none;">
          <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
        </div>
        <div id="result"></div>
      </dialog>
      `);

      $('.menu_suspendedball .opendialog').click(function () {
        $('#menu_suspendedball').show();
      })

      $('.menu_suspendedball .close').click(function () {
        $('#menu_suspendedball').hide();
      })

      // 导入
      $('.menu_suspendedball .import').click(function () {
        // 触发隐藏的文件输入元素的点击事件
        $('#fileInput').click();
      });

      // 处理文件选择
      $('#fileInput').change(function (event) {
        var file = event.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            try {
              // 解析JSON内容
              var jsonData = JSON.parse(e.target.result);

              // 屏蔽用户
              if (jsonData.blockuserlist !== undefined) {
                $('#blockuserlist').val(jsonData.blockuserlist);
              }
              // 快捷回复
              if (jsonData.customquickreply !== undefined) {
                $('#customquickreply').val(jsonData.customquickreply);
              }
            } catch (err) {
              alert("Error parsing JSON: " + err.message);
            }
          };
          reader.readAsText(file);
        }
      });

      // 楼层抽奖
      $('.floorlottery').click(function () {
        $('#menu_suspendedball').hide();
        $('.floorlotterywrap').show();
      })

      // 开始
      $('#floorlotterdrawButton').click(function () {
        var totalFloors = parseInt($('#totalFloors').val());
        var numToDraw = parseInt($('#numToDraw').val());

        if (isNaN(totalFloors) || isNaN(numToDraw) || totalFloors <= 0 || numToDraw <= 0 || numToDraw > totalFloors) {
          alert('请输入有效的数字');
          return;
        }

        $('#floorlotterloading').show();
        $('#result').empty();

        setTimeout(function () {
          var drawnFloors = [];
          while (drawnFloors.length < numToDraw) {
            var randomFloor = Math.floor(Math.random() * totalFloors) + 1;
            if (!drawnFloors.includes(randomFloor)) {
              drawnFloors.push(randomFloor);
            }
          }

          $('#floorlotterloading').hide();
          $('#result').text('抽取到的楼层是：' + drawnFloors.join(', '));
        }, 2000); // 模拟2秒的加载时间
      });
      // 关闭弹窗
      $('#floorlotterclose').click(function(){
        $('.floorlotterywrap').hide();
      })

      // 导出
      $('.menu_suspendedball .export').click(function () {
        var content1 = $('#blockuserlist').val();
        var content2 = $('#customquickreply').val();

        var data = {
          blockuserlist: content1,
          customquickreply: content2
        };

        var jsonString = JSON.stringify(data, null, 2);
        var blob = new Blob([jsonString], {
          type: "application/json"
        });

        // 获取当前日期并格式化为 YYYYMMDD
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        var formattedDate = year + month + day;

        var filename = "linuxdo-plugin-" + formattedDate + ".json";
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      // 初始化
      function init() {
        // 屏蔽用户
        var linuxdo_blockuserlist = localStorage.getItem('linuxdo_blockuserlist');
        if (linuxdo_blockuserlist) {
          $('#blockuserlist').val(linuxdo_blockuserlist)
        }
        // 自定义快捷回复
        var linuxdo_customquickreply = localStorage.getItem('linuxdo_customquickreply');
        if (linuxdo_customquickreply) {
          $('#customquickreply').val(linuxdo_customquickreply)
        } else {
          localStorage.setItem('linuxdo_customquickreply', `前排围观~
你好啊`);
        }
      }
      init();

      // 屏蔽用户
      function setBlockUser() {
        var blockuserlist = $('#blockuserlist').val();
        localStorage.setItem('linuxdo_blockuserlist', blockuserlist);
      }
      // 自定义快捷回复
      function setQuickReply() {
        var customquickreply = $('#customquickreply').val();
        localStorage.setItem('linuxdo_customquickreply', customquickreply);
      }

      $('#menu_suspendedball .save').click(function () {
        setBlockUser();
        setQuickReply();
        $('#menu_suspendedball').hide();
        alert('设置保存成功，请刷新网页！');
      })

    }, 1000);
  };
  menu_suspendedball();

  // 屏蔽指定用户
  function menu_blockuserlist() {
    if (!menu_value('menu_blockuserlist')) return;
    var linuxdo_blockuserlist = [];
    if (localStorage.getItem('linuxdo_blockuserlist')) {
      linuxdo_blockuserlist = localStorage.getItem('linuxdo_blockuserlist').split(',');
    }
    $('.topic-list .topic-list-data.posters>a:nth-child(1)').each(function () {
      var user = $(this).attr('data-user-card')
      if (linuxdo_blockuserlist.indexOf(user) !== -1) {
        $(this).parents('tr.topic-list-item').remove();
      }
    })
  }

  // 模拟键盘输入文字
  function simulateInput($textarea, text) {
    $textarea.focus(); // 聚焦到textarea

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      // 更新textarea的值
      $textarea.val($textarea.val() + char);

      // 创建并派发input事件
      let inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
      });
      $textarea[0].dispatchEvent(inputEvent);

      // 创建并派发keydown事件
      let keyEvent = new KeyboardEvent('keydown', {
        key: char,
        char: char,
        keyCode: char.charCodeAt(0),
        which: char.charCodeAt(0),
        bubbles: true
      });
      $textarea[0].dispatchEvent(keyEvent);
    }
  }

  // 快捷回复设置
  function menu_createreply() {
    if (!menu_value('menu_createreply')) return;
    var linuxdo_customquickreply = [];
    if (localStorage.getItem('linuxdo_customquickreply')) {
      linuxdo_customquickreply = localStorage.getItem('linuxdo_customquickreply').split(/\r?\n/);
    }
    setInterval(() => {
      if ($('.createreply').length < 1) {
        $('.timeline-container .topic-timeline').append(`<div class="createreply" style="margin-top:4rem;"></div>`)

        linuxdo_customquickreply.forEach(function (item) {
          var $li = $('<button class="btn btn-default create reply-to-post no-text btn-icon" type="button"></button>').text(item);
          $('.createreply').append($li);
        });

        $('.createreply button').click(function () {
          if ($('.timeline-footer-controls button.create').length != 0) {
            $('.timeline-footer-controls button.create')[0].click();
          }
          if ($('#topic-footer-buttons .topic-footer-main-buttons button.create').length != 0) {
            $('#topic-footer-buttons .topic-footer-main-buttons button.create')[0].click();
          }

          setTimeout(() => {
            let $textarea = $('.d-editor-textarea-wrapper textarea');
            let text = $(this).html();

            simulateInput($textarea, text);
          }, 1000);
        })
      }
    }, 1000);
  }
  menu_createreply();

  // 自动展开回复
  function menu_autoexpandreply() {
    if (!menu_value('menu_autoexpandreply')) return;
    $('nav.post-controls .show-replies').each(function () {
      if ($(this).html().includes('个回复') && $(this).attr('aria-expanded') === 'false') {
        $(this).click();
      }
    })
  }

  // 定义一个正则表达式来匹配域名结尾
  function isDomainEnding(str) {
    var domainPattern = /\.(com|org|net|edu|gov|co|cn|io|info|biz|me|us|uk|au|de|fr|jp|ru|ch|it|nl|se|no|es|mil|int|arpa|asia|museum|name|pro|coop|aero|cat|jobs|mobi|travel|xxx|idv|tv|cc|ws|bz|nu|tk|fm|ag|am|at|be|bg|cd|cf|cg|ch|cl|cm|cz|dk|dm|ec|ee|es|eu|fi|ga|gd|gf|gg|gl|gp|gr|hm|hr|ht|hu|im|io|is|je|ke|kg|ki|kr|kz|la|lc|li|lt|lu|lv|ma|mc|md|ms|mt|mu|mx|my|nf|ng|nl|no|nz|pa|pe|pf|pg|pl|pm|pn|pr|pt|pw|re|ro|rs|sa|sb|sc|sg|sh|si|sk|sm|sn|so|st|su|sx|tc|tf|tk|tl|tm|to|tr|tt|tw|ua|ug|uy|uz|vc|ve|vg|vn|vu|wf|yt|za|zm|zw)$/i;
    return domainPattern.test(str);
  }
  // 默认运行脚本
  function runscripts() {
    $('.signature-img').each(function () {
      if ($(this).siblings('.signature-p').length < 1) {
        var url = $(this).attr('src');

        // 先判断是否带 http
        if (url.indexOf('http') < 0) {
          $(this).after(`<p class="signature-p" style="color:#279a36;font-size:14px;">${url}（该用户签名非图片格式，已自动转文字）</p>`);
          $(this).hide();
        } else {
          // 在带 http 的链接中判断是否是域名，大几率是博客域名
          if (isDomainEnding(url)) {
            $(this).after(`<p class="signature-p" style="color:#279a36;font-size:14px;">${url}（该用户签名非图片格式，已自动转文字）</p>`);
            $(this).hide();
          }
        }
      }
    })
  }
  runscripts();

  $(function () {
    $('head').append(`<style>
.linuxlevel.four{background:linear-gradient(to right, red, blue);-webkit-background-clip:text;color:transparent;}

.topic-post{position:relative;}
.linuxfloor{display:flex;position:absolute;left:-28px;top:0px;color:#96aed0;width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:16px}

.topic-list .views{font-weight:400!important;white-space:nowrap!important;}
.createreply{display:flex;flex-direction:column;max-width:300px;}
.createreply button{margin-bottom:10px;justify-content:flex-start;text-align:left;}
.menu_suspendedball *{box-sizing:border-box;margin:0;padding:0}
.menu_suspendedball .close{position:absolute;right:10px;top:3px;cursor:pointer;font-size:34px;color:#999;transform:rotate(45deg)}
.menu_suspendedball .opendialog{z-index:99;position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#d1f0ff;color:#999;font-size:22px;cursor:pointer}
.menu_suspendedball .opendialog svg{margin:0}
.menu_suspendedball .hint{margin-top:5px;color:#d94f4f;font-size:14px}
#menu_suspendedball{display:none;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:600px;height:430px;overflow-y:auto;background:#fff;color:#333;box-shadow:1px 2px 5px rgba(0,0,0,.2);border-radius:10px;padding:15px;z-index:999;overflow-x:hidden;}
#menu_suspendedball .title{font-size:18px;text-align:center;font-weight:600}
#menu_suspendedball .btn{border:none;outline:0;min-width:80px;height:32px;display:inline-flex;align-items:center;justify-content:center;background:#1c1c1e;color:#fff;font-size:14px;border-radius:5px;cursor:pointer;transition:all .1s linear}
#menu_suspendedball .btn:hover{opacity:0.9;}
#menu_suspendedball .flex{display:flex;justify-content:space-between;}
#menu_suspendedball .import{margin-left:auto;margin-right:10px;}
#menu_suspendedball .import,#menu_suspendedball .export{background:#D1F0FF;color:#559095;}
#menu_suspendedball .floorlottery{margin-left:10px;background:#FFB003}
#menu_suspendedball .item{margin-top:10px}
#menu_suspendedball .item .tit{text-align:left;font-size:15px;margin-bottom:6px}
#menu_suspendedball .item textarea{font-family:inherit;width:100%;min-height:100px;border-radius:5px;border:1px solid #999;outline:0;padding:5px;font-size:14px;transition:all .1s linear;resize:none}
#menu_suspendedball .item textarea:focus{border-color:#333}

#floorlotterloading img{width:50px;height:50px}
.floorlotterywrap{display:none;width:400px;height:300px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:999}
.floorlotterywrap{width:400px;height:300px}
        </style>`)

    // 帖子列表
    let pollinglength1 = 0;
    setInterval(() => {
      if (pollinglength1 != $('.topic-list-body tr').length) {
        pollinglength1 = $('.topic-list-body tr').length
        // 需要轮询的方法
        menu_showcreatetime(); // 显示创建时间
        menu_showfloors(); // 显示楼层数
        menu_openpostblank(); // 新标签页打开话题
        menu_blockuserlist(); // 屏蔽指定用户
        menu_autoexpandreply(); // 自动展开回复
        runscripts(); // 默认运行脚本
      }
    }, 1000);

    // 帖子详情
    let pollinglength2 = 0;
    setInterval(() => {
      if (pollinglength2 != $('.post-stream .topic-post').length) {
        pollinglength2 = $('.post-stream .topic-post').length
        // 需要轮询的方法
        menu_showcreatetime(); // 显示创建时间
        menu_showfloors(); // 显示楼层数
        menu_openpostblank(); // 新标签页打开话题
        menu_blockuserlist(); // 屏蔽指定用户
        menu_autoexpandreply(); // 自动展开回复
        runscripts(); // 默认运行脚本
      }
    }, 1000);

  })

})();