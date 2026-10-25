# 陵水展示网站

静态展示网站，支持简体中文、英语、法语、俄语和西班牙语。原页面为概念展示，非政府官方网站。

## GitHub Pages

在仓库 Settings → Pages 中选择从 `main` 分支的 `/(root)` 目录部署。
启用后，默认网站地址为 `https://wiiinter27.github.io/lingshui-global-site/`。
网站无需安装依赖、执行构建或运行后端服务器。

## 继续修改

- `index.html`：页面内容与链接。
- `styles.css`：原网站样式。
- `languages.css`：语言选择和外语排版、投资对接按钮。
- `script.js`：图集及互动测试。
- `locales.js`：四种外语翻译字典。
- `i18n.js`：语言切换与选择记忆。
- `assets/`：全部图片。

修改中文文字时，同步更新 `locales.js` 中对应的四种外语条目。
仓库更新后，GitHub Pages 会重新部署。多人维护请通过分支及 Pull Request 合并改动，避免覆盖。

图片及展示信息沿用用户提供的原始网站素材；原有权利声明不变，未额外授予开源许可证。
