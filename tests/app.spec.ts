import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /启动我的 OPC/ }).click();
});

test("navigates all seven product pages", async ({ page }) => {
  const pages = [
    ["首页", "今天，从一个明确动作开始。"],
    ["OPC资讯", "社区动态"],
    ["社区地图", "全国 OPC 社区地图"],
    ["学技能", "学习的终点，是完成一次交付。"],
    ["找项目", "让能力进入真实项目。"],
    ["创业社区", "一个人创业，不等于独自前进。"],
    ["AI助手", "把模糊问题，拆成下一步。"],
    ["我的OPC", "登录后进入你的 OPC 工作台"],
  ];
  for (const [nav, title] of pages) {
    await page.getByRole("button", { name: nav, exact: true }).click();
    await expect(page.getByText(title, { exact: true })).toBeVisible();
    if (nav === "OPC资讯") {
      await page.getByRole("button", { name: "返回 AI OPC ONE" }).click();
    }
  }
});

test("filters resources and recovers from empty state", async ({ page }) => {
  await page.getByRole("button", { name: "社区地图", exact: true }).click();
  await page.getByLabel("搜索资源").fill("不存在的资源");
  await expect(page.getByText("没有找到相关社区")).toBeVisible();
  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.getByText("AI原点社区", { exact: true })).toBeVisible();
});

test("registers, persists session, and logs out", async ({ page }) => {
  await page.getByRole("button", { name: "注册" }).click();
  await page.getByLabel("姓名").fill("林一");
  await page.getByLabel("邮箱").fill("lin@example.com");
  await page.getByLabel("密码", { exact: true }).fill("growth88");
  await page.getByLabel("确认密码").fill("growth88");
  await page.getByRole("button", { name: "创建账户" }).click();
  await expect(page.getByRole("button", { name: /林一/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /林一/ })).toBeVisible();
  await page.getByRole("button", { name: /林一/ }).click();
  await page.getByRole("button", { name: "退出登录" }).click();
  await expect(page.getByRole("button", { name: "登录" })).toBeVisible();
});

test("AI assistant responds and mobile has no overflow", async ({ page }) => {
  await page.getByRole("button", { name: "AI助手", exact: true }).click();
  await page.getByRole("button", { name: "帮我拆解一个创业想法" }).click();
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("建议路径")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(page.getByRole("button", { name: "社区地图", exact: true }).last()).toBeVisible();
});
