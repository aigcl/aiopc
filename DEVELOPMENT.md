# OPC Growth OS 开发文档

> 面向 AI OPC 一人公司的资源、技能、项目与行动管理原型。当前版本为本地前端演示，不包含生产数据库或服务端 API。

## 1. 技术概览

- **框架**：React 18+、TypeScript、Vite
- **交互与动画**：`motion/react`、原生 `requestAnimationFrame`/CSS 动画
- **图标**：`lucide-react`
- **样式**：`src/src/index.css`（Tailwind Vite 插件已配置）
- **数据**：演示数据写在 `src/src/App.tsx`；登录账户和会话使用浏览器 `localStorage`
- **构建产物**：项目根目录的 `index.html` 与 `assets/`

## 2. 目录结构

```text
网站/
├─ src/
│  ├─ App.tsx              # 页面组件、导航、演示数据与交互逻辑
│  ├─ index.css             # 全局设计令牌、布局、响应式样式
│  ├─ main.tsx              # React 挂载入口
│  └─ build.html            # Vite 构建入口模板
├─ assets/                  # 构建后的 JS/CSS、视频与社区图片
├─ index.html               # 可直接由静态服务器访问的同步产物
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
npm run dev -- --host 127.0.0.1 --port 4178
```

浏览器访问：<http://127.0.0.1:4178/index.html>

> 不要直接双击 `file:///D:/codex/网站/index.html`。ES module 在 `file://` 下会被浏览器拦截，页面可能显示为空白。

## 5. 构建与同步静态页面

```powershell
Set-Location 'D:\codex\网站'
npm run build
```

构建会先执行 TypeScript 检查，再由 Vite 生成 `assets/` 和入口产物。完成后重新启动静态服务器即可预览：

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
| 创业社区 | `创业社区` | 动态流、项目展示、资源交流、城市活跃榜 |
| AI 助手 | `AI助手` | 城市/阶段上下文、快捷提示、本地规则生成行动计划、保存计划 |
| 我的 OPC | `我的OPC` | 登录后显示个人能力、收藏与行动计划 |

首页首屏还包含：

- AI 人形视频层（桌面端根据鼠标横向位置调整视频时间，移动端自动播放）
- 右下角 OPC 场所横向图片滚动条
- 视频声音开关与背景层脚本（由根目录 `index.html` 的同步增强层挂载）

## 7. 本地演示数据

核心数据位于 `src/src/App.tsx` 顶部：

- `resourceData`：资源列表
- `projectData`：项目列表
- `nav`：顶部导航及页面 ID

需要替换为真实后端时，保留组件字段名，增加 API 请求层并处理加载、失败和空数据状态；不要在组件中直接散落请求地址。

## 8. 登录演示说明

当前认证仅用于原型演示：

- 账户：`localStorage.opc_accounts`
- 当前会话：`localStorage.opc_session`
- AI 助手保存的计划：`localStorage.opc_copilot_plan`

生产环境必须改为服务端认证、密码哈希、过期会话和权限校验；不要把真实密码写入本地存储。

## 9. 资源与媒体

社区滚动图位于 `assets/`，命名格式为 `community-*.webp`。新增图片时：

1. 使用 WebP/AVIF，桌面图片宽度建议不低于 900px；
2. 在 `index.html` 或组件中使用相对路径 `./assets/...`；
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

确认 PowerShell 当前目录是 `D:\codex\网站`，并通过 `http://127.0.0.1:4178/index.html` 访问，而不是 `file://`。若端口已占用，换用 4179，并同步修改访问地址。

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

这是前端原型。接入真实用户、项目、政策或支付数据前，需要补齐服务端 API、数据库、鉴权、日志、隐私政策、内容审核和备份恢复机制。
