// ==UserScript==
// @name        Netlify 汉化脚本
// @namespace   https://github.com/dlzmoe/scripts
// @version     0.0.1
// @author      dlzmoe
// @description 由于官方不支持中文，汉化 Netlify 大部分的翻译
// @include     *://*.netlify.com/*
// @license     MIT
// @icon        https://app.netlify.com/favicon-48x48.png
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/484197/Netlify%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484197/Netlify%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const zh_Hans = [
	['Team overview', '团队概况'],
	['Sites', '站点'],
	['Builds', '构建'],
	['Integrations', '集成'],
	['Domains', '域名'],
	['Members', '成员'],
	['Audit log', '审核日志'],
	['Security Scorecard', '安全评分'],
	['Billing', '计费'],
	['Team settings', '团队设置'],
	['Upgrade', '升级'],
	['Bandwidth', '带宽'],
	['Build minutes', '构建时间'],
	['Concurrent builds', '构建并发'],
	['Team members', '团队成员'],
	['Site overview', '概览'],
	['Site configuration', '配置'],
	['Deploys', '部署'],
	['Logs', '日志'],
	['Metrics', '指标'],
	['Domain management', '域名管理'],
	['Forms', '形式'],
	['Favorite site', '收藏站点'],
	['Unfavorite site', '取消收藏'],
	['General', '常规'],
	['Site details', '站点详情'],
	['Status badges', '状态徽章'],
	['Site members', '网站会员'],
	['Danger zone', '危险操作'],
	['Site information', '站点信息'],
	['Site name', '站点名称'],
	['Owner', '所有人'],
	['Site ID', '站点 ID'],
	['Created', '创建时间'],
	['Last update', '最后更新'],
	['Change site name', '更改名称'],
	['Add-ons', '附加组件'],
	['This site is not using any add-ons', '该网站未使用任何附加组件'],
	['Take your static site further with rich add-ons built right into your dashboard. Automatically upgrade tiers as your usage grows, paying only for what you use.', '通过仪表板中内置的丰富附加组件进一步提升您的静态网站。随着使用量的增长自动升级等级，只需按使用量付费。'],
	['Deploy status badge', '部署状态徽章'],
	['Team: ', '团队：'],
	['Build & deploy', '构建和部署'],
	['Post processing', '后期处理'],
	['Split Testing', '对比测试'],
	['Deploy notifications', '部署通知'],
	['Environment variables', '环境变量'],
	['Notifications', '通知'],
	['Identity', '身份'],
	['Access & security', '访问和安全'],
	['Continuous deployment', '持续部署'],
	['Manage repository', '管理存储库'],
	['Build settings', '构建设置'],
	['Runtime', '运行'],
	['Base directory', '基本目录'],
	['Package directory', '包目录'],
	['Build command', '构建命令'],
	['Publish directory', '发布目录'],
	['Functions directory', '函数目录'],
	['Build status', '构建状态'],
	['Configure', '修改'],
	['Functions region', '功能区'],
	['Configure how functions are deployed for your site.', '配置如何为您的站点部署功能。'],
	['Region', '地区'],
	['Dependency management', '依赖管理'],
	['Manage the software and tool versions installed in the build environment for your site.', '管理站点构建环境中安装的软件和工具版本。'],
	['Branches and deploy contexts', '分支和部署上下文'],
	['Deploy contexts are branch-based environments that enable you to configure builds depending on the context. This includes production and preview environments.', '部署上下文是基于分支的环境，使您能够根据上下文配置构建。这包括生产和预览环境。'],
	['Production branch', '生产分支'],
	['Branch deploys', '分支部署'],
	['Deploy Previews', '部署预览'],
	['Collaboration tools', '协同工具'],
	['Build hooks', '构建 hooks'],
	['Deploy key', '部署密钥'],
	['Build image selection ', '构建图像选择'],
	['Automatic deploy deletion', '自动部署删除'],
	['Add a variable', '新增变量'],
	['New environment variable', '新环境变量'],
	['Scopes', '范围'],
	['All scopes', '全部范围'],
	['Specific scopes', '具体范围'],
	['Limit this environment variable to specific scopes, such as builds, functions, or post processing', '将此环境变量限制为特定范围，例如构建、函数或后处理'],
	['Upgrade to unlock', '升级解锁'],
	['Create variable', '新增变量'],
	['Cancel', '取消'],
	['Docs', '文档'],
	['Pricing', '价格'],
	['Support', '支持'],
	['Blog', '博客'],
	['Changelog', '变更日志'],
	['Terms', '条款'],
	['Add a single variable', '新增一个变量'],
	['Import from a .env file', '导入 .env 文件'],
	['Environment variables allow you to change site behavior across different deploy contexts and scopes. For example, use variables to set different configuration options for builds or to store secret API keys for use in your functions.', '环境变量允许您跨不同的部署上下文和范围更改站点行为。例如，使用变量为构建设置不同的配置选项或存储秘密 API 密钥以供在函数中使用。'],
	['Deploy settings', '部署设置'],
	['Lock to stop auto publishing', '锁定并停止发布'],
	['Options', '选项'],
	['Retry with latest branch commit', '重新部署'],
	['Clear cache and retry with latest branch commit', '清除缓存并重新部署'],
	['Repository', '存储库'],
	['Your site is linked to a Git repository for continuous deployment.', '您的站点链接到 Git 存储库以进行持续部署。'],
	['Current repository', '当前存储库'],
	['Production domains', '生产环境'],
	['Your site is always accessible at a netlify.app subdomain based on the site name. Custom domains allow visitors to access your site at your own domains.', '您的网站始终可以根据网站名称通过 netlify.app 子域进行访问。自定义域允许访问者通过您自己的域访问您的网站。'],
	['Add domain alias', '新增自定义域名'],
  ['Visual editor dashboard', '可视化编辑器仪表板'],
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