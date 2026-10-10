import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /启动我的 OPC/ }).click();
});

test("navigates all seven product pages", async ({ page }) => {
  const pages = [
    ["首页", "今天，从一个明确动作开始。"],
    ["找资源", "全国 OPC 社区地图"],
    ["学技能", "学习的终点，是完成一次交付。"],
    ["找项目", "让能力进入真实项目。"],
    ["创业社区", "一个人创业，不等于独自前进。"],
    ["AI助手", "把模糊问题，拆成下一步。"],
    ["我的OPC", "登录后进入你的 OPC 工作台"],
  ];
  for (const [nav, title] of pages) {
    await page.getByRole("button", { name: nav, exact: true }).click();
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
});

test("filters resources and recovers from empty state", async ({ page }) => {
  await page.getByRole("button", { name: "找资源", exact: true }).click();
  await expect(page.getByText("674")).toBeVisible();
  await expect(page.getByText("87")).toBeVisible();
  await expect(page.getByText("AI原点社区", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "城市首字母 H" }).click();
  await expect(page.getByText("培风社OPC社区", { exact: true })).toBeVisible();
  await expect(page.getByText("AI原点社区", { exact: true })).toBeHidden();
  await page.getByRole("button", { name: "全国", exact: true }).click();
  await page.getByLabel("搜索资源").fill("不存在的资源");
  await expect(page.getByText("没有找到相关社区")).toBeVisible();
  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.getByText("武汉滨江亲橙人工智能OPC社区")).toBeVisible();
  await expect(page.getByText("OPC 社区常见问题")).toBeVisible();
});

test("shows the AI OPC ONE brand and domain", async ({ page }) => {
  await expect(
    page.getByText("AI OPC ONE", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("aiopcone.com", { exact: true }).first(),
  ).toBeVisible();
});

test("opens and returns from second and third level pages", async ({
  page,
}) => {
  await page.getByRole("button", { name: "找资源", exact: true }).click();
  await page
    .getByRole("button", { name: /查看社区资料/ })
    .first()
    .click();
  await expect(page.getByText("社区介绍")).toBeVisible();
  await expect(
    page.getByText("北京市海淀区东升镇成府路45号（原点大厦）"),
  ).toBeVisible();
  await page.getByRole("button", { name: "支持详情", exact: true }).click();
  await expect(
    page.getByText("大模型算力券补贴50%，单年最高200万元"),
  ).toBeVisible();
  await page.getByRole("button", { name: "← 返回上一级" }).click();
  await page.getByRole("button", { name: "学技能", exact: true }).click();
  await page.getByRole("button", { name: "继续学习" }).first().click();
  await expect(page.getByText("课程目录")).toBeVisible();
  await page.getByRole("button", { name: "← 返回上一级" }).click();
  await page.getByRole("button", { name: "找项目", exact: true }).click();
  await page.getByRole("button", { name: "查看详情" }).first().click();
  await expect(page.getByText("交付范围")).toBeVisible();
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
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(
    page.getByRole("button", { name: "找资源", exact: true }).last(),
  ).toBeVisible();
});
