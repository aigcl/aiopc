export type OpcChinaSkillTutorial = {
  name: string;
  category: string;
  tone: string;
  problem: string;
  outcome: string;
  sourceId: string;
  sourceUrl: string;
};

// This is a transformed catalog of publicly visible OPC China topics. It keeps
// short, original summaries instead of copying article bodies or hotlinking
// third-party cover images.
export const opcChinaSkillTutorials: OpcChinaSkillTutorial[] = [
  {
    name: "Watch Skill",
    category: "视频理解",
    tone: "watch",
    problem: "把视频、录屏和浏览器画面变成可回看的时间点证据。",
    outcome: "适合：验收演示、视频检索、OCR 与带时间线的复盘",
    sourceId: "4329",
    sourceUrl: "#opcchina-news?p=4329",
  },
  {
    name: "Skill Deck",
    category: "技能资产",
    tone: "deck",
    problem: "扫描并整理散落在 Codex、Claude、Cursor 等工具目录里的技能。",
    outcome: "适合：技能搜索、来源检查、快照归档与团队复用",
    sourceId: "4317",
    sourceUrl: "#opcchina-news?p=4317",
  },
  {
    name: "Repomix",
    category: "代码理解",
    tone: "repomix",
    problem: "把代码仓库压缩成更适合 AI 阅读、分享和审查的单个上下文。",
    outcome: "适合：代码交接、架构分析、远程仓库整理与安全检查",
    sourceId: "4304",
    sourceUrl: "#opcchina-news?p=4304",
  },
  {
    name: "OpenMagic",
    category: "网页开发",
    tone: "openmagic",
    problem: "直接选中网页元素，再把修改目标和验收要求交给编程助手。",
    outcome: "适合：界面定位、增量改版、前端协作与视觉验收",
    sourceId: "4289",
    sourceUrl: "#opcchina-news?p=4289",
  },
  {
    name: "Plannotator",
    category: "计划审查",
    tone: "plannotator",
    problem: "在代码执行前审阅计划范围、测试覆盖和风险点。",
    outcome: "适合：复杂需求评审、批注退回、变更边界与交付检查",
    sourceId: "4275",
    sourceUrl: "#opcchina-news?p=4275",
  },
  {
    name: "BrowserSkill",
    category: "浏览器自动化",
    tone: "browser",
    problem: "在隔离会话中操作已登录浏览器，完成页面浏览、输入和测试。",
    outcome: "适合：真实页面验收、流程回放、人工接管与账号隔离",
    sourceId: "4256",
    sourceUrl: "#opcchina-news?p=4256",
  },
  {
    name: "网页滚动视频",
    category: "内容制作",
    tone: "scroll-video",
    problem: "将网页滚动、停顿、点击和高亮动作编排成可复用演示视频。",
    outcome: "适合：产品演示、教程录制、发布前验收与 MP4 导出",
    sourceId: "4247",
    sourceUrl: "#opcchina-news?p=4247",
  },
  {
    name: "Image to Editable PPT",
    category: "文档生产",
    tone: "ppt",
    problem: "从一张 PPT 截图提取文字、图形和版式，重新组织成可编辑页面。",
    outcome: "适合：演示文稿复刻、素材拆解、版式迭代与交付归档",
    sourceId: "4234",
    sourceUrl: "#opcchina-news?p=4234",
  },
  {
    name: "Auto-Editor",
    category: "视频剪辑",
    tone: "editor",
    problem: "自动识别口播静音并完成第一遍粗剪，减少重复查找和删除。",
    outcome: "适合：口播粗剪、停顿清理、教程视频与批量初剪",
    sourceId: "4221",
    sourceUrl: "#opcchina-news?p=4221",
  },
];

export const opcChinaInformationArchitecture = [
  { label: "首页", kind: "portal", target: "opcnews" },
  { label: "文章分类", kind: "taxonomy", target: "opcnews" },
  { label: "Gemini", kind: "category", target: "opcnews" },
  { label: "Claude", kind: "category", target: "opcnews" },
  { label: "ChatGPT", kind: "category", target: "opcnews" },
  { label: "即梦AI", kind: "category", target: "tools" },
  { label: "Skills专题", kind: "collection", target: "learn" },
  { label: "问答社区", kind: "community", target: "community" },
  { label: "快讯", kind: "news", target: "opcnews" },
  { label: "专栏作家", kind: "people", target: "community" },
  { label: "网址导航", kind: "directory", target: "tools" },
  { label: "标签归档", kind: "archive", target: "opcnews" },
  { label: "投稿", kind: "submission", target: "talent" },
] as const;
