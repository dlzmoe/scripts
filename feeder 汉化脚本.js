// ==UserScript==
// @name        feeder 汉化脚本
// @namespace   https://github.com/dlzmoe/scripts
// @version     0.0.2
// @author      dlzmoe
// @description feeder.com 汉化脚本
// @include     *://feeder.co/*
// @license     MIT
// @icon        https://feeder.co/favicon.ico
// @grant       none
// ==/UserScript==

const zh_Hans = [
	['All feeds', '全部订阅'],
	['Unread', '未读'],
	['Starred', '星标'],
	['Home', '首页'],
	['Dashboard', '图表'],
	['Rules', '规则'],
	['Team', '团队'],
	['Library', '列表'],
	['Account', '账户'],
	['Help', '帮助'],
	['Collapse', '收起'],
	['Reload feeds', '重新加载源数据'],
	['Open all unread...', '打开所有未读'],
	['Mark all as read', '全部标为已读'],
	['Mark feed as read', '将 feed 标为已读'],
	['Export posts', '导出帖子'],
	['Go to page', '跳转到网站'],
	['Edit feed', '编辑 feed'],
	['Delete feed', '删除 feed'],
	['Filters', '过滤'],
	['Display', '展示'],
	['Order', '排序'],
	['Newest first', '最新'],
	['Oldest first', '最旧'],
	['Realtime', '实时'],
	['Auto-update', '自动更新'],
	['Content style', '风格'],
	['Timestamp', '时间戳'],
	['Previous post', '上一篇'],
	['Next post', '下一篇'],
	['Share post', '分享'],
	['Mark as unread', '标记为已读'],
	['Star post', '收藏'],
	['Toggle collections', '切换集合'],
	['Simple', '简单'],
	['Full', '源站'],
	['Free', '免费'],
	['My account', '我的账户'],
	['Settings', '设置'],
	['Share', '分享'],
	['Add to collections', '添加到收藏夹'],
	['Appearance', '外观'],
	['Log out', '退出'],
	['Change display mode', '更改显示模式'],
	['Minimal', '极小'],
	['Reader', '读者'],
	['3-pane', '3 窗格'],
	['Reader', '读者'],
	['Two panes with collapsing folders', '两个包含折叠文件夹的窗格'],
	['Read posts inline for fast consuming', '内联阅读帖子，快速查看'],
	['The entire hierarchy for the best overview', '最佳预览的层次结构'],
	['Change theme', '更改主题'],
	['Light', '明亮'],
	['Dark', '暗黑'],
	['Holiday', '假期'],
	['Orange', '橙色'],
	['Holiday', '假期'],
	['Sand', '沙滩'],
	['Grey', '灰色'],
	['Follow OS setting', '跟随操作系统设置'],
	['Reload', '重新加载'],
	['Expanded', '放大'],
	['Collapsed', '缩小'],
	['Column width', '全宽'],
	['Notifications', '通知'],
	['Sound', '声音'],
	['iOS/Android', 'iOS/Android'],
	['Get Feeder Plus', '获取 Feeder Plus'],
	['Toggle all feeds', '选择全部'],
	['Email summaries', '邮件摘要'],
	['Connections', '连接'],
	['Advanced', '高级'],
	['Global', '全球'],
	['Ask before marking many as read', '在标记已读前询问'],
	['Track unread posts -', '跟踪未读帖子'],
	['When OFF stops marking incoming posts as unread', '当 OFF 时，停止将收到的帖子标记为未读'],
	['Notify me when my feeds stop working', '当我的 Feed 停止工作时通知我'],
	['Connected', '连接'],
	['Receive e-mail summaries', '接受邮件订阅'],
	['Get a periodical with the latest posts from your feeds. Daily, weekly or monthly. You decide.', '每天、每周或每月获取包含源中最新帖子的期刊。'],
	['Enable e-mail summaries', '开始邮箱订阅'],
	['Plan', '计划'],
	['Email and password', '邮箱和密码'],
	['Invoices', '发票'],
	['Billing address', '账单'],
	['Your plan', '你的计划'],
	['Change plan', '更改计划'],
	['Payment details', '付款明细'],
	['No payment method', '没有付款计划'],
	['Upgrade for more', '升级获取更多'],
	['Change email', '修改邮箱'],
	['Current email address is', '当前邮箱地址为'],
	['New email', '新邮箱'],
	['Repeat new email', '重复新邮箱'],
	['Update email', '更新邮箱'],
	['Change password', '修改密码'],
	['Current password', '当前密码'],
	['New password', '新密码'],
	['Update password', '更新密码'],
	['Delete your account', '删除你的账户'],
	['All your data will be deleted, and there will be no way to retrieve them.', '您的所有数据都将被删除，并且无法检索它们。'],
	['Current email address', '当前邮箱'],
	['Remove your account', '确认删除账户'],
	['Invoice date', '发票日期'],
	['VAT', '增值税'],
	['Total', '总计'],
	['You have no invoices', '您没有发票'],
	['Once your first payment is generated it will be shown here', '如果你付款成功，它将会显示在这里。'],
	['Your billing address', '你的账单邮寄地址'],
	['This information will be on your invoices.', '此信息将出现在您的发票上'],
	['Your name', '你的姓名'],
	['Company name', '公司名称'],
	['Address', '地址'],
	['Address (line 2)', '地址（第二行）'],
	['Zip code', '邮政编码'],
	['VAT Number', '增值税号'],
	['Country', '国家'],
	['Additional information', '其他信息'],
	['Update billing address', '更新账单邮寄地址'],
	['Help center', '帮助中心'],
	["What's new?", "最新新闻"],
	['Keyboard navigation', '键盘导航'],
	['Contact support', '联系支持人员'],
	['Downloads', '下载安装'],
	['Automate your workflow with Rules', '使用规则自动执行工作流程'],
	['Define your keywords and choose what happens next. Filter posts, add them to collections, post content to Slack and Microsoft teams, and more.', '定义关键字并选择接下来要执行的操作。筛选帖子、将其添加到收藏夹、将内容发布到 Slack 和 Microsoft 团队等。'],
	['Upgrade to Feeder Plus', '升级到 Feeder Plus'],
	['Collaborate with your team', '与你的团队协作'],
	['Share feeds, manage users in one place and work together.', '共享，在一个地方管理用户并协同工作。'],
	['Get started', '开始使用'],
	['Want to try it first?', '想先试试嘛？'],
	['Feeds', '订阅'],
	['Collections', '收集'],
	['Sources', '来源'],
	['Import & Export', '导入导出'],
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