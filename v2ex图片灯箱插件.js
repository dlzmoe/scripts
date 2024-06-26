// ==UserScript==
// @name         v2ex 图片灯箱插件
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.0.5
// @description  v2ex 图片灯箱插件，可以使用滚轮放大缩小。
// @author       dlzmoe
// @match        *://v2ex.com/*
// @match        *://*.v2ex.com/*
// @match        *://www.v2ex.com/*
// @icon         https://www.google.com/chrome/static/images/chrome-logo-m100.svg
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";
  !(function (s) {
    s.fn.simplebox = function (e) {
      var d = s.extend({
          fadeSpeed: 400,
          darkMode: !1
        }, e),
        a = s("html"),
        o = s('<div id="overlay"></div>'),
        c = s('<div class="cross"></div>'),
        n = s("<img class='slb' style='transform: scale(1);' id='imagetran'>"),
        i = d.fadeSpeed,
        r = !1;
      d.darkMode ?
        (o.css("background-color", "black"),
          c.addClass("cross--dark"),
          s(".slb").addClass("slb--invert"),
          n.addClass("slb--invert")) :
        (o.css("background-color", "rgba(0, 0, 0, 0.8)"),
          c.addClass("cross--light"));
      var t = function () {
        o.fadeOut(i),
          n.removeClass("slb--opened"),
          (r = !1),
          a.css("overflow-y", "scroll");
      };
      return (
        o.click(t),
        c.click(t),
        s(document).keyup(function (s) {
          27 == s.keyCode && r && t();
        }),
        this.each(function () {
          o.append(c);
          var e = s(this);
          e.click(function () {
            (r = !0), a.css("overflow-y", "hidden");
            var e = s(this),
              d = e.attr("src");
            n.attr("src", d),
              n.css("max-height", "100%"),
              n.css("max-width", "100%"),
              n.addClass("pop-in"),
              n.removeClass("pop-out"),
              n.addClass("center"),
              n.addClass("slb--opened"),
              o.css("pointer-events", "initial"),
              o.append(n),
              a.append(o),
              o.fadeIn(i);
          });
        })
      );
    };
  })(jQuery);
  $(function () {
    $("body").append(
      "<style>#overlay,.cross{will-change:transform}#overlay,.center,.cross{top:0;right:0}.cross{position:fixed;margin:30px 55px 0 0;cursor:pointer;transition:.3s all ease-in-out;z-index:99;opacity:9}.cross::after,.cross::before{position:absolute;content:'';width:35px;height:2px}.cross::after{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.cross::before{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.cross--light::after,.cross--light::before{background-color:#000}.cross--dark::after,.cross--dark::before{background-color:#fff}.slb{box-shadow:2px 2px 12px 1px rgba(0,0,0,.2);cursor:-webkit-zoom-in;cursor:zoom-in}.slb--invert{box-shadow:2px 2px 12px 1px rgba(255,255,255,.3)}.slb--opened{cursor:auto}.pop-in{-webkit-animation:pop-in 250ms;-moz-animation:pop-in 250ms;-ms-animation:pop-in 250ms}.pop-out{-webkit-animation:pop-out 250ms;-moz-animation:pop-out 250ms;-ms-animation:pop-out 250ms}#overlay{display:none;width:100vw;height:100vh;position:fixed;left:0;bottom:0;pointer-events:none;cursor:pointer;z-index:999;cursor:zoom-out}.center{max-height:100%;position:absolute;bottom:0;left:0;margin:auto;cursor:zoom-out}@-webkit-keyframes pop-in{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes pop-in{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes pop-out{0%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}100%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}}@keyframes pop-out{0%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}100%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}}</style>"
    );
    $(".topic_content img:not([src^='/'])").addClass("slb");
    $(".reply_content img:not([src^='/'])").addClass("slb");
    $(".slb").simplebox({
      fadeSpeed: 100,
    });
    $(".topic_content img:not([src^='/'])")
      .parent()
      .attr("href", "javascript:void(0)")
      .attr("target", "");
    $(".reply_content img:not([src^='/'])")
      .parent()
      .attr("href", "javascript:void(0)")
      .attr("target", "");

    $(".topic_content img:not([src^='/'])").click(function () {
      let step = 0.1;
      let INNER = false;

      function $(select) {
        return document.querySelector(select);
      }
      // 鼠标相对页面的位置
      function getMousePos(event) {
        let e = event || window.event;
        let scrollX =
          document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY =
          document.documentElement.scrollTop || document.body.scrollTop;
        let x = e.pageX || e.clientX + scrollX;
        let y = e.pageY || e.clientY + scrollY;
        return {
          x: x,
          y: y
        };
      }

      function getElementPosition(select) {
        let dom = document.querySelector(select);
        let scrollX =
          document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY =
          document.documentElement.scrollTop || document.body.scrollTop;
        let rect = dom.getBoundingClientRect();
        let x = scrollX + dom.getBoundingClientRect().left;
        let y = scrollY + dom.getBoundingClientRect().top;
        let height = dom.getBoundingClientRect().height;
        let width = dom.getBoundingClientRect().width;
        return {
          x: x,
          y: y,
          height: height,
          width: width
        };
      }

      function mouseIndom(event) {
        let mouseMsg = getMousePos(event);
        let domMsg = getElementPosition("#imagetran");
        let flagX =
          mouseMsg.x > domMsg.x && mouseMsg.x < domMsg.x + domMsg.width;
        let flagY =
          mouseMsg.y > domMsg.y && mouseMsg.y < domMsg.y + domMsg.height;
        if (flagX && flagY) {
          return true;
        } else {
          return false;
        }
      }
      // 文档鼠标移动
      document.onmousemove = function (event) {
        INNER = mouseIndom(event);
      };
      if (window.addEventListener)
        //FF,火狐浏览器会识别该方法
        window.addEventListener("DOMMouseScroll", wheel, false);
      window.onmousewheel = document.onmousewheel = wheel; //W3C
      //统一处理滚轮滚动事件
      function wheel(event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
          delta = event.wheelDelta / 120;
          if (window.opera) delta = -delta;
        } else if (event.detail) {
          delta = -event.detail / 3;
        }
        if (delta) handle(delta, event);
      }
      //上下滚动时的具体处理函数
      function handle(delta, event) {
        if (INNER) {
          if (delta > 0) {
            //向上滚动
            let scale =
              Number.parseFloat(
                $("#imagetran").style.transform.replace("scale(", "")
              ) + step;
            $("#imagetran").style.webkitTransform = "scale(" + scale + ")";
          } else {
            //向下滚动
            let scale =
              Number.parseFloat(
                $("#imagetran").style.transform.replace("scale(", "")
              ) - step;
            if (scale > 0.1) {
              $("#imagetran").style.webkitTransform = "scale(" + scale + ")";
            }
          }
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
    });
  });
})();