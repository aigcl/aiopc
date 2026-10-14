# OPC Growth OS 开发文档

> 面向政府公共服务、OPC 创业者、项目方与人才需求方的 AI OPC 公共平台。当前仓库包含可运行的 React 前端、本地 SQLite API 原型和 GitHub Pages 静态发布流程。

## 1. 技术概览

- **框架**：React 18+、TypeScript、Vite
- **交互与动画**：`motion/react`、原生 `requestAnimationFrame`/CSS 动画
- **图标**：`lucide-react`
- **样式**：`src/src/index.css` + `src/platform/platform.css`（Tailwind Vite 插件已配置）
- **数据**：公开演示数据写在 `src/src/App.tsx`；注册、会话、项目/人才/需求发布由 `server/server.mjs` 提供 SQLite API，API 不可用时不会在浏览器保存账户
- **构建产物**：项目根目录的 `index.html` 与 `assets/`

## 2. 目录结构

```text
网站/
├─ src/
│  ├─ src/App.tsx           # 页面组件、导航、演示数据与交互逻辑
│  ├─ src/index.css         # 全局设计令牌、布局、响应式样式
│  ├─ platform/HomePage.tsx # AI OPC 公共平台首页
│  ├─ platform/platform.css # 首页与 H5 响应式视觉层
│  └─ main.tsx              # Vite React 挂载入口
├─ assets/                  # 构建后的 JS/CSS、视频与社区图片
├─ index.html               # Vite 单页入口；GitHub Pages 构建时复制为各页面入口
├─ server/server.mjs        # 本地 SQLite API
├─ data/opc.sqlite          # 本地运行生成，禁止提交真实数据
├─ privacy.html             # 隐私政策
├─ terms.html               # 用户协议
├─ disclaimer.html          # 免责声明
├─ content-policy.html      # 内容审核与举报规则
├─ assets-license.html      # 图片、视频与字体来源说明
├─ public/media/             # 首页与社区页使用的本地素材
├─ docs/OPCCHINA-ANALYSIS.md # OPCChina.ai 页面拆解与接入方案
├─ tests/                   # Playwright 检查
├─ vite.config.ts           # Vite 配置，base 为相对路径
└─ package.json             # 脚本与依赖
```

## 3. 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本
- Windows PowerShell 示例均在项目目录 `D:\codex\网站` 执行

首次安装依赖：

```powershell
Set-Location 'D:\codex\网站'
npm install
```

## 4. 本地开发

启动开发服务器：

```powershell
Set-Location 'D:\codex\网站'
npm run api

# 另开一个 PowerShell 窗口
npm run dev -- --host 127.0.0.1 --port 4178
```

浏览器访问：<http://127.0.0.1:4178/index.html>

> 不要直接双击 `file:///D:/codex/网站/index.html`。ES module 在 `file://` 下会被浏览器拦截，页面可能显示为空白。

## 5. 构建与同步静态页面

```powershell
Set-Location 'D:\codex\网站'
npm run build
```

构建会先执行 TypeScript 检查，再由 Vite 生成 `dist/`。GitHub Pages 工作流会把构建入口、根目录素材和法律页面统一复制到 `_site/`，不再发布旧版静态 HTML。

```powershell
python -m http.server 4178 --bind 127.0.0.1 --directory 'D:\codex\网站'
```

修改后建议在浏览器执行 **Ctrl+F5**，避免旧 bundle 或图片缓存。

## 6. 页面与交互入口

| 页面 | 入口 | 当前能力 |
| --- | --- | --- |
| 首页 | `首页` | 今日指标、7 天路径选择、快捷入口 |
| 找资源 | `找资源` | 关键词搜索、资源类型筛选、空状态重置 |
| 学技能 | `学技能` | 技能分、课程进度、继续学习入口 |
| 找项目 | `找项目` | 推荐/最新/远程/结果分成标签，发布项目草稿提示 |
| 人才机会 | `人才机会` | 人才目录、项目需求、发布审核说明 |
| 创业社区 | `创业社区` | 动态流、项目展示、资源交流、城市活跃榜 |
| AI 助手 | `AI助手` | 城市/阶段上下文、快捷提示、本地规则生成行动计划、保存计划 |
| 我的 OPC | `我的OPC` | 登录后显示个人能力、收藏与行动计划 |

首页首屏包含角色入口、社区地图、AI 工具、项目/人才入口、注册 CTA 和本地授权素材。移动端使用折叠导航、单列卡片和安全区域适配，不依赖横向滚动。

## 7. 本地演示数据

核心数据位于 `src/src/App.tsx` 顶部：

- `resourceData`：资源列表
- `projectData`：项目列表
- `nav`：顶部导航及页面 ID

需要替换为真实后端时，保留组件字段名，增加 API 请求层并处理加载、失败和空数据状态；不要在组件中直接散落请求地址。

## 8. 登录演示说明

本地 API 模式使用 SQLite 与服务端会话：

- `npm run api` 启动 `127.0.0.1:8787`
- `users` 保存邮箱、密码哈希、角色和状态
- `listings` 保存项目、人才和需求，默认 `pending_review`
- `reports` 预留举报处理记录
- API 不可用时，前端会提示服务未连接并停止注册/登录；不要填写常用密码

AI 助手保存的计划：`localStorage.opc_copilot_plan`

生产环境必须把 SQLite 换成托管 PostgreSQL/MySQL，使用 Argon2id/bcrypt、HTTPS、CSRF 防护、刷新令牌轮换、RBAC、限流、审计日志、备份恢复和内容审核后台；不要把真实密码写入本地存储。

旧版浏览器演示字段：

- 账户：`localStorage.opc_accounts`
- 当前会话：`localStorage.opc_session`
- 旧字段仅用于迁移检查，不再作为账户存储或认证来源

## 9. 资源与媒体

首页素材位于 `public/media/`，构建后输出到 `dist/media/`；历史社区素材仍位于 `assets/`。新增图片时：

1. 使用 WebP/AVIF，桌面图片宽度建议不低于 900px；
2. 在组件中使用相对路径 `./media/...` 或 `./assets/...`；
3. 补充有意义的 `alt` 文本；
4. 用浏览器 Network 面板确认返回状态为 200。

视频资源优先使用项目内可访问文件，避免依赖失效的跨域地址；更新后检查 `video.readyState`、实际宽度和播放错误。

## 10. 验证清单

提交前至少完成：

```powershell
npm run build
npm test
```

浏览器检查：

- `http://127.0.0.1:4178/index.html` 返回 200；
- 首页首屏、人形视频、滚动图片均可见；
- 顶部导航可切换 7 个页面；
- AI 助手可生成并保存计划；
- 登录/注册校验和退出登录正常；
- 390px、768px、1440px 宽度下无横向溢出；
- 控制台无未处理的资源加载错误。

## 11. 常见问题

### 页面打不开或空白

确认 PowerShell 当前目录是 `D:\codex\网站`，先启动 `npm run api`，再启动 Vite，并通过 `http://127.0.0.1:4178/index.html` 访问，而不是 `file://`。若端口已占用，换用空闲端口，并同步修改访问地址。

### 修改没有生效

先执行 `npm run build`，再 Ctrl+F5。不要只修改 `src/` 后继续查看旧的根目录 bundle。

### 图片或视频不显示

检查文件是否真的位于 `assets/`，路径是否以 `./assets/` 开头，并在 Network 面板确认没有 404、CORS 或 MIME 类型错误。

### 需要清空演示账户

在浏览器开发者工具 Console 执行：

```js
localStorage.removeItem('opc_accounts');
localStorage.removeItem('opc_session');
localStorage.removeItem('opc_copilot_plan');
location.reload();
```

## 12. 发布前边界

正式运营前，需要补齐 ICP/公安备案等适用事项、运营主体与联系方式、正式隐私政策和用户协议审核、内容审核与举报工单、版权/授权留档、数据保存期限、删除请求流程、第三方 AI 数据处理协议及备份恢复演练。平台不得冒充政府官方，政策和 AI 输出必须标注来源与“仅供参考”。
