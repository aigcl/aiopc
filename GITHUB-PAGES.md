# GitHub Pages 发布说明

## 已准备好的内容

- `CNAME`：预留给 `aiopcone.com`，待 DNS 生效后再在 Pages 设置中启用
- `.github/workflows/deploy-pages.yml`：推送到 `main` 后自动发布
- `.nojekyll`：确保 `assets` 下的视频、字体和媒体文件按原路径访问
- 当前根目录 `index.html` 与 `assets/`：作为可直接发布的静态站点

## 首次发布

1. 在 GitHub 新建一个空仓库，例如 `aiopcone-site`，不要勾选 README、License 或 `.gitignore`。
2. 在项目目录执行：

```powershell
git init
git branch -M main
git add index.html assets CNAME .nojekyll .github .gitignore design-qa.md GITHUB-PAGES.md
git commit -m "prepare AI OPC ONE for GitHub Pages"
git remote add origin https://github.com/<你的用户名>/aiopcone-site.git
git push -u origin main
```

3. 打开仓库的 `Settings > Pages`，确认 Source 使用 `GitHub Actions`。
4. 等待 `Deploy AI OPC ONE to GitHub Pages` 工作流完成。

## 域名解析

在域名服务商 DNS 中添加：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<你的用户名>.github.io` |

DNS 生效后，在 `Settings > Pages > Custom domain` 填写 `aiopcone.com`，开启 `Enforce HTTPS`。当前自动部署暂不把 `CNAME` 写入发布目录，避免 DNS 未生效时影响 `aigcl.github.io/aiopc/` 临时地址。

## 注意事项

- 当前 `assets` 约 37 MB，其中包含首屏视频；GitHub 单文件 100 MB 限制内，可以正常发布。
- 每次修改根目录发布文件后推送到 `main`，Pages 会自动重新部署。
- 若域名不是 `aiopcone.com`，先修改 `CNAME` 和本说明中的域名，再推送。
