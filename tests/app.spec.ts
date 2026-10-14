import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders the complete public-platform navigation", async ({ page }) => {
  for (const [nav, title] of [
    ["首页", "AI OPC ONE｜一人公司 · AI 成长社区"],
    ["OPC资讯", "社区动态"],
    ["社区地图", "全国 OPC 社区地图"],
    ["学技能", "学习的终点，是完成一次交付。"],
    ["AI工具", "把能提高交付效率的工具，放在一个入口。"],
    ["找项目", "让能力进入真实项目。"],
    ["人才机会", "让项目找到合适的人，也让能力被看见。"],
    ["创业社区", "一个人创业，不等于独自前进。"],
    ["AI助手", "把模糊问题，拆成下一步。"],
    ["我的OPC", "登录后进入你的 OPC 工作台"],
  ]) {
    await page.getByRole("button", { name: nav, exact: true }).click();
    if (nav === "首页") {
      await expect(page.getByRole("heading", { name: "AI OPC ONE｜一人公司 · AI 成长社区" })).toBeAttached();
      await expect(page.getByRole("heading", { name: "Skills 专题" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "最新文章" })).toBeVisible();
    } else {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }
    if (nav === "OPC资讯") {
      await page.getByRole("button", { name: "返回 AI OPC ONE" }).click();
    }
  }
});

test("AI tools and talent directory are usable", async ({ page }) => {
  await page.getByRole("button", { name: "AI工具", exact: true }).click();
  await page.getByLabel("搜索 AI 工具").fill("Dify");
  await expect(page.getByText("Dify", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Skills 实战索引" })).toBeVisible();
  await expect(page.locator(".opcchina-skill-card")).toHaveCount(9);
  await page.getByRole("button", { name: "查看工具说明" }).click();
  await expect(page.getByText("这个工具解决什么问题")).toBeVisible();
  await page.getByRole("button", { name: "← 返回上一级" }).click();
  await page.getByRole("button", { name: "人才机会", exact: true }).click();
  await expect(page.getByText("林一 · AI 自动化顾问", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "找需求", exact: true }).click();
  await expect(page.getByText("园区 AI 政策问答原型", { exact: true })).toBeVisible();
});

test("registers with consent, persists session, and logs out", async ({ page }) => {
  await page.getByRole("button", { name: "注册" }).click();
  await page.getByLabel("称呼").fill("林一");
  await page.getByLabel("邮箱").fill(`lin-${Date.now()}@example.com`);
  await page.getByLabel("密码", { exact: true }).fill("growth8888");
  await page.getByLabel("确认密码").fill("growth8888");
  await page.locator(".consent-check input").check();
  await page.getByRole("button", { name: "创建账户" }).click();
  await expect(page.getByRole("button", { name: /林一/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /林一/ })).toBeVisible();
  await page.getByRole("button", { name: /林一/ }).click();
  await page.getByRole("button", { name: "退出登录" }).click();
  await expect(page.getByRole("button", { name: "登录", exact: true })).toBeVisible();
});

test("assistant and mobile navigation have no overflow", async ({ page }) => {
  await page.getByRole("button", { name: "AI助手", exact: true }).click();
  await page.getByRole("button", { name: "帮我拆解一个创业想法" }).click();
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("建议路径")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(page.getByRole("button", { name: "人才机会", exact: true }).last()).toBeVisible();
});

test("original homepage content and carousel adapt across narrow viewports", async ({ page }) => {
  await page.getByRole("button", { name: "首页", exact: true }).click();
  await expect(page.getByRole("img", { name: "OPC中国：赋能一人公司生态" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "快讯" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "热门内容" })).toBeVisible();
  await page.getByRole("button", { name: "暂停自动轮播" }).click();
  await expect(page.getByRole("button", { name: "继续自动轮播" })).toBeVisible();
  await page.getByRole("button", { name: "继续自动轮播" }).click();
  await page.getByRole("button", { name: "下一张专题图片" }).click();
  await expect(page.getByRole("img", { name: "OPC中国：一人公司生态" })).toBeVisible();

  for (const width of [320, 360, 390, 430, 768, 1031]) {
    await page.setViewportSize({ width, height: 840 });
    await expect(page.getByRole("heading", { name: "Skills 专题" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `homepage overflows at ${width}px`).toBe(true);
    expect(await page.locator(".opc-home-carousel").evaluate((element) => {
      const image = element.querySelector("img");
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && image?.complete === true && image.naturalWidth > 0;
    })).toBe(true);
  }
});

test("skills cards keep readable two-column rhythm on phones", async ({ page }) => {
  await page.getByRole("button", { name: "首页", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const columns = await page.locator(".opc-home-skill-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" "));
  expect(columns).toHaveLength(2);
});

test("account API outage is explained clearly in the auth modal", async ({ page }) => {
  const requests: string[] = [];
  await page.route("**/api/**", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ message: "API unavailable" }) });
  });
  await page.goto("/");
  requests.length = 0;
  await page.getByRole("button", { name: "注册" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("当前未连接账户服务；注册与登录暂不可用。", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "创建账户" })).toBeDisabled();
  expect(requests.some((url) => url.endsWith("/api/health"))).toBe(true);
});

test("legal pages and page assets are reachable", async ({ page, request }) => {
  for (const path of ["/privacy.html", "/terms.html", "/disclaimer.html", "/content-policy.html"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
  }
  expect((await request.get("/assets/hero-source.mp4")).status()).toBe(200);
});
