// ==UserScript==
// @name        Follow 网页版汉化插件
// @namespace   https://github.com/dlzmoe/scripts
// @version     0.0.2
// @description 由于官方不支持中文，汉化大部分的翻译（正在开发中，欢迎更正中文！）
// @match       *://app.follow.is/*
// @grant       none
// @license     MIT
// @icon        https://app.follow.is/favicon.ico
// @author      dlzmoe
// ==/UserScript==

const zh_Hans = [
	['Articles', '文章'],
	['Unread', '未读'],
	['unread', '未读'],
	['Items', '内容'],
	['Discover', '发现'],
	['Any URL or Keyword', '任意 URL 或关键字'],
	['Search', '搜索'],
	['Popular', '热门'],
	['Starred', '收藏'],
	['Zero Unread', '暂无未读'],
	['Top News -', '头条新闻 -'],
	['Last Night', '昨晚'],
	['Yesterday', '昨天'],
	['Mark', '标记'],
	['as read', '为已读'],
	['as read?', '为已读?'],
	['Confirm?', '确认?'],
	['Confirm', '确认'],
	['Profile', '个人资料'],
	['Power', 'Power'],
	['General', '常规'],
	['Appearance', '外观'],
	['timeline', '时间线'],
	['Show unread content on launch', '启动时显示未读内容'],
	['Display only unread content when the app is launched.', '应用启动时仅显示未读内容。'],
	['Group by date', '按日期分组'],
	['Group entries by date.', '按日期对条目进行分组'],
	['Preferences', '首选项'],
	['Download Desktop app', '下载桌面应用程序'],
	['Log out', '退出登录'],
	['all', '全部'],
	['Show all', '显示全部'],
	['Show unread Only ', '仅显示未读'],
	['Refetch', '重新获取'],
	['Star', '收藏'],
	['star', '收藏'],
	['Unstar', '取消收藏'],
	['unstar', '取消收藏'],
	['Copy link', '复制链接'],
	['Open in new tab', '在新标签页打开'],
	['Share', '分享'],
	['Mark as unread', '标记为未读'],
	['Mark as read', '标记为已读'],
	['Link copied to clipboard.', '链接已复制到剪贴板。'],
	['Starred.', '已加入收藏'],
	['Unstarred.', '已取消收藏'],
	['Actions', '行动'],
	['Integration', '集成'],
	['Shortcuts', '快捷方式'],
	['Invitations', '邀请码'],
	['About', '关于'],
	['Mark as read when scrolling', '滚动时标记为已读'],
	['Automatically mark entries as read when scrolled out of the view.', '滚动出视图时自动将条目标记为已读。'],
	['Mark as read when hovering', '悬停时标记为已读'],
	['Automatically mark entries as read when hovered.', '悬停时自动将条目标记为已读。'],
	['Mark as read when in the view', '在视图中标记为已读'],
	['Automatically mark single-level entries (e.g., social media posts, pictures, video views) as read when they enter the view.', '当单级条目（例如社交媒体帖子、图片、视频观看）进入视图时，自动标记为已读。'],
	['Privacy & Data', '隐私和数据'],
	['Persist data for offline usage', '保留数据以供离线使用'],
	['Persist data locally to enable offline access and local search.', '将数据保留在本地以实现离线访问和本地搜索。'],
	['Send anonymous data', '发送匿名数据'],
	['By opting to send anonymized telemetry data, you contribute to improving the overall user experience of Follow.', '通过选择发送匿名遥测数据，您可以为改善关注的整体用户体验做出贡献。'],
	['Rebuild Database', '重建数据库'],
	['If you are experiencing rendering issues, rebuilding the database may solve them.', '如果您遇到渲染问题，重建数据库可能会解决这些问题。'],
	['Rebuild', '重建'],
	['Love our product?', '喜欢我们的产品？'],
	['Give us a star on GitHub', '在 GitHub 上给我们一颗星'],
	['Theme', '主题'],
	['System', '跟随系统'],
	['Light', '明亮'],
	['Dark', '黑夜'],
	['Unread count', '未读数'],
	['Show in sidebar', '在侧边栏显示'],
	['Edit feed', '编辑订阅'],
	['Edit Feed', '编辑订阅'],
	['Unfollow feed', '取消订阅'],
	['Claim Feed', '声明所有权'],
	['Copy Entry ID', '复制文章id'],
	['Edit', '编辑'],
	['Unfollow', '取消订阅'],
	['Navigate to feed', '导航至 Feed'],
	['Claim', '声明'],
	['Mark all as read', '全部标记为已读'],
	['Open feed in browser', '在浏览器中打开Feed'],
	['Open site in browser', '在浏览器中打开网站'],
	['Load archived entries', '加载存档条目'],
	['Category', '分类'],
	['Private Follow', '私人订阅'],
	['Tile', '标题'],
];

class ReplaceText {
	constructor(i18n, mode = 'equal') {
		this.W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
		this.done = new Set();
		this.alert = this.W.alert.bind(this.W);
		this.confirm = this.W.confirm.bind(this.W);
		this.prompt = this.W.prompt.bind(this.W);
		const i18nMap = new Map(i18n);
		const i18nArr = i18n.map(value => value[0]);
		if (mode === 'regexp') {
			this.textReplace = (text) => {
				if (i18nMap.has(text))
					text = i18nMap.get(text);
				else {
					const key = i18nArr.find(key => (key instanceof RegExp && text.match(key) !== null));
					if (key !== undefined)
						text = text.replace(key, i18nMap.get(key));
				}
				return text;
			};
		} else if (mode === 'match') {
			this.textReplace = (text) => {
				const key = i18nArr.find(key => (text.match(key) !== null));
				if (key !== undefined)
					text = text.replace(key, i18nMap.get(key));
				return text;
			};
		} else {
			this.textReplace = (text) => {
				if (i18nMap.has(text))
					text = i18nMap.get(text);
				return text;
			};
		}
		this.replaceAlert();
		this.replaceObserver();
	}
	replaceAlert() {
		this.W.alert = (message) => this.alert(this.textReplace(message));
		this.W.confirm = (message) => this.confirm(this.textReplace(message));
		this.W.prompt = (message, _default) => this.prompt(this.textReplace(message), _default);
	}
	replaceNode(node, self = false) {
		const list = this.getReplaceList(node, self);
		for (let index in list) {
			list[index].forEach(node => {
				if (this.done.has(node[index]))
					return;
				const newText = this.textReplace(node[index]);
				if (node[index] !== newText) {
					this.done.add(newText);
					node[index] = newText;
				}
			});
		}
	}
	replaceObserver() {
		const bodyObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.type === 'attributes' || mutation.type === 'characterData')
					this.replaceNode(mutation.target, true);
				else if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(addedNode => this.replaceNode(addedNode));
				}
			});
		});
		document.addEventListener('readystatechange', () => {
			bodyObserver.observe(document.body, {
				attributes: true,
				characterData: true,
				childList: true,
				subtree: true
			});
			this.replaceNode(document.body);
		}, {
			capture: true,
			once: true
		});
	}
	getReplaceList(node, self = false) {
		const list = {
			data: new Set(),
			placeholder: new Set(),
			title: new Set(),
			value: new Set(),
		};
		const nodeList = self ? [node] : this.nodeForEach(node);
		nodeList.forEach(node => {
			if (node.parentElement instanceof HTMLScriptElement || node.parentElement instanceof HTMLStyleElement)
				return;
			if (node instanceof HTMLElement && node.title !== '')
				list.title.add(node);
			if (node instanceof HTMLInputElement && ['button', 'reset', 'submit'].includes(node.type) && node.value !== '')
				list.value.add(node);
			else if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement && node.placeholder !== '')
				list.placeholder.add(node);
			else if (node instanceof Text)
				list.data.add(node);
		});
		return list;
	}
	nodeForEach(node) {
		const list = [];
		list.push(node);
		if (node.hasChildNodes())
			node.childNodes.forEach(child => list.push(...this.nodeForEach(child)));
		return list;
	}
}

new ReplaceText(zh_Hans, 'regexp');