// ==UserScript==
// @name         v2ex AI 总结帖子
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.4
// @description  自定义 api key 等信息，实现 AI 总结帖子，会保留缓存记录到本地避免大量消耗 token。
// @author       dlzmoe
// @match        *://v2ex.com/*
// @match        *://*.v2ex.com/*
// @match        *://www.v2ex.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAACoAIABAAAAAEAAAAgoAMABAAAAAEAAAAgAAAAAI9OQMkAAARKSURBVHicrVe7SzNLFP/t7CObbEg0WliJooUxcAsfYKFW2lh8NhdLwUIsbMTCBG3EIoid4J/xNd9t7ZSAIiJcNaSIYBcbNVlMsq/M3MK762YziVE8EGbYOTnnd55zRsD/xBiT7+/vf+u6vlir1VTLskApFfADRAhhiqIgEokYsVjsNJVK/S0Igg0AAgAUCoW/np+fr15fX5WfUPgZ9fT0WP39/dNjY2P/SowxOZfLXZXLZUVRFIyPjyORSCAUCkEQmh3AGIMgCGCMAYC3D/IFiVIKy7Lw8vKCfD6PcrmsALhijEWFu7u7P4+Pj78URcHMzAyi0WjXCoPnQeLxV6tVXFxcwLIsDA0N/UN0XV8EgGQyCU3TQClFo9FAo9EAY8xb/Xv33OWllIJSCsaYt/L4GWPQNA3JZBIAoOv6olSr1VQASCQS3h/9FgWtC54FPcDbB2UkEgkAQK1WUyXLsgAAiqK0MFNKIQgCKKVcl3ajMChPFEXIsgwAsCwLkltq/jh1K/C7RAhxAQmSX3DQwo2NDZydnbWcu4D9vKFQCNvb21hdXfUU8ZIwaIQHwD3w50Aul/PQflZyjuPg6OgIoVAIKysrbRUGc6wFgH8lhLRV2K4Es9ksotEolpaWuuobTSEAPhIPACSpCV/XtL+/D03TMD8/3ySP5xHiB+BnYIxBFEUQQkAI8faiKHJ/fh7GGPb29nB9fd0kryOAIBAXgCRJkCQJhBBv5QGSJKmJ33EcpNNp5PP5JpnBkHXMgcvLy65cXiqVsLm5iaenp6bvpmkinU7j+PgYw8PD3BJuCgEAr+kEAXXqCQMDAzg5OUFfX19LaN7e3pDJZGDbNtcLXA+4ICzL6nj5uHu3WtwwBIn3rQVAJws/6/WlUgmZTAa6rnvKXHDxeByHh4cghHgXFRcAT8Hy8nLXVy/P0nA4jGw2i8HBQTiO09kDfgD+PvDdWUCWZRwcHGB0dBTuhcczkhsCfyfslvwACSHY3d1FKpXy8oinvAlAEATw7tLPEjB4DgBbW1uYnJyEYRhfb8V+hJ0AtPPA+vo6ZmdnYZpmizy3urruhFNTU17n83dDf9dz6z0cDmNtbQ0LCwswDKNpNON1QK4Hgi7a2dnh/qkdMcZgmmbbCYo7DxBCGKVU4CWh/ybjCQwqNwyD2zWDSdhoNAC8P1gkWZZhmiYsy4KiKCCEeAz1ev1LpfdZqYqiCMaY1xNkWQZRVdUAgHK5/PHxY2bzVv/eb43fa/7RPMhPCPGGUVeXqqqGFI1GTyuVyq9isQhN0xCJRBAKhbqy8KvE2PvDpFgsAgA0TTsVGGPy+fn5m67riizLGBkZQTweh6Io31YUJEopbNtGpVLBw8MDbNtGLBaz5ubmopIgCPbt7e00gCtd15VCofAjSjtRLBazent7pwVBsD0TGWPyzc3N72q1uliv11XHcX70eS7LMlRVNSKRyOnExIT3PP8P91unlxYYZf4AAAAASUVORK5CYII=
// @license      Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  var menu_ALL = [
    ['menu_ManualSummary', '是否开启手动总结 / 自动', '是否开启手动总结 / 自动', true],
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
    menu_ID[menu_ID.length] = GM_registerMenuCommand('⚙️ 设置API key配置', function () {
      setApiConfig();
    });

    menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 建议与反馈！', function () {
      window.GM_openInTab("https://github.com/dlzmoe/scripts", {
        active: true,
        insert: true,
        setParent: true
      });
    });

  }

  function setApiConfig() {

    $('body').append(`
      <div class="v2exaisummary">
  <input type="text" id="v2exaisummary-apikey" placeholder="sk-xxxxxxx">
  <input type="text" id="v2exaisummary-baseurl" placeholder="https://api.openai.com" value="https://api.openai.com">
  <input type="text" id="v2exaisummary-model" placeholder="gpt-4o-mini" value="gpt-4o-mini">
  <button id="v2exaisummary-save">保存</button>
</div>
      `)

    $('.v2exaisummary').show();

    var v2exaisummaryAPI = JSON.parse(localStorage.getItem('v2exaisummaryAPI'));
    if (!v2exaisummaryAPI) {
      v2exaisummaryAPI = {
        apikey: "",
        baseurl: "",
        model: "",
      }
    } else {
      $('#v2exaisummary-apikey').val(v2exaisummaryAPI.apikey);
      $('#v2exaisummary-baseurl').val(v2exaisummaryAPI.baseurl);
      $('#v2exaisummary-model').val(v2exaisummaryAPI.model);
    }

    // 保存
    $('#v2exaisummary-save').click(function () {
      v2exaisummaryAPI = {
        apikey: $('#v2exaisummary-apikey').val(),
        baseurl: $('#v2exaisummary-baseurl').val(),
        model: $('#v2exaisummary-model').val(),
      }
      localStorage.setItem('v2exaisummaryAPI', JSON.stringify(v2exaisummaryAPI));
      $('.v2exaisummary').remove();
    })
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
  $(function () {

  })
  // 手动总结
  function menu_ManualSummary() {
    isCache();
    if (menu_value('menu_ManualSummary')) {
      // 手动总结
      $('.aisummary').click(function () {
        $('.aisummary').hide();
        getPostContent();
      })
    } else {
      // 自动总结
      $('.aisummary').hide();
      // getPostContent();
    }
  }

  if (window.location.pathname.indexOf('/t/') > -1) {
    menu_ManualSummary();
  }

  // 获取帖子内容
  function getPostContent() {
    var v2exaisummaryAPI = JSON.parse(localStorage.getItem('v2exaisummaryAPI'));
    $('.gpt-summary-wrap').show();
    return new Promise((resolve, reject) => {
      const topic_contentdata = $('h1').html() + $('.topic_content').map(function () {
        return $(this).html();
      }).get().join('');

      const v2exprompt = `根据以下帖子内容进行总结，请使用 text 文本返回回答，字数限制 200 字以内，越精炼越好，语言要求返回简体中文，并且进行中英文混排优化。
帖子内容如下：
${topic_contentdata}`;

      fetch(`${v2exaisummaryAPI.baseurl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${v2exaisummaryAPI.apikey}`,
          },
          body: JSON.stringify({
            model: v2exaisummaryAPI.model,
            messages: [{
              role: "user",
              content: v2exprompt,
            }],
            temperature: 0.7,
          }),
        })
        .then(response => {
          if (!response.ok) {
            reject(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(gptData => {
          $(".gpt-summary").html(`AI 总结：${gptData.choices[0].message.content}`);
          $('.airegenerate').show();

          let v2exaisummarydata =
            JSON.parse(localStorage.getItem("v2exaisummarydata")) || [];
          const match = window.location.pathname;
          let existingObject = v2exaisummarydata.find((item) => item.name == match);

          let newObject = {
            name: match,
            value: gptData.choices[0].message.content,
          };
          if (existingObject) {
            existingObject.value = newObject.value;
          } else {
            v2exaisummarydata.push(newObject);
          }
          // 将帖子总结的数据缓存
          localStorage.setItem("v2exaisummarydata", JSON.stringify(v2exaisummarydata));
          resolve();

        })
        .catch(error => {
          $(".gpt-summary").html(`抱歉生成失败，请检查配置或者反馈给开发者！`);
          $('.airegenerate').show();
        });
    });
  }

  // 先判断是否有缓存
  function isCache() {
    $("#Main .box>.header").after(`<button type="button" class="aisummary">AI总结</button>`);
    $("#Main .box>.header").after(
      `<div class="gpt-summary-wrap">
       <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
       <button type="button" class="airegenerate" style="display:none">重新生成</button>
        </div>`
    );

    let v2exaisummarydata = JSON.parse(localStorage.getItem("v2exaisummarydata")) || [];
    const match = window.location.pathname;
    let existingObject = v2exaisummarydata.find((item) => item.name === match);

    if (existingObject) {
      // 存在缓存，拿旧数据
      $('.gpt-summary-wrap').show();
      $(".gpt-summary").html(`AI 总结：${existingObject.value}`);
      $('.airegenerate').show();
      $('.aisummary').hide();

    } else {
      $('.gpt-summary-wrap').hide();
      getPostContent();
    }

    $('.airegenerate').click(() => {
      $('.gpt-summary').html(`AI 总结：正在使用 AI 总结内容中，请稍后...`)
      $('.airegenerate').hide();
      getPostContent();
    })
  }

  $('body').append(`<style>.gpt-summary-wrap{background:#fffbd9;border-radius:5px;padding:10px;font-size:14px;color:#303030;margin:0;line-height:1.6;text-align:left}.aisummary{display:flex;outline:0;border:1px solid #eee;background:#ffe27d;color:#626262;padding:4px 10px;cursor:pointer;border-radius:3px}.gpt-summary-wrap .airegenerate{margin-top:6px;outline:0;border:1px solid #eee;background:#ffe27d;color:#626262;padding:4px 10px;cursor:pointer;border-radius:3px}.v2exaisummary{position:fixed;bottom:20px;right:20px;z-index:99999;max-width:400px;padding:20px;border:1px solid #ddd;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1);background-color:#f9f9f9;display:none}.v2exaisummary input[type=text]{width:100%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:4px;font-size:16px;transition:border-color .3s}.v2exaisummary input[type=text]:focus{border-color:#007bff;outline:0}.v2exaisummary button{width:100%;padding:10px;background-color:#007bff;color:#fff;border:none;border-radius:4px;font-size:16px;cursor:pointer;transition:background-color .3s}.v2exaisummary button:hover{background-color:#0056b3}</style>`)
})();