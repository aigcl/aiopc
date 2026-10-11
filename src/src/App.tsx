import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  Compass,
  Cpu,
  Eye,
  EyeOff,
  GraduationCap,
  Handshake,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type PageId =
  | "home"
  | "resources"
  | "learn"
  | "tools"
  | "projects"
  | "community"
  | "assistant"
  | "profile";
type User = { name: string; email: string };
type Account = User & { password: string };
const nav: { id: PageId; label: string; icon: any }[] = [
  { id: "home", label: "首页", icon: LayoutDashboard },
  { id: "resources", label: "找资源", icon: Map },
  { id: "learn", label: "学技能", icon: GraduationCap },
  { id: "tools", label: "AI工具", icon: Sparkles },
  { id: "projects", label: "找项目", icon: BriefcaseBusiness },
  { id: "community", label: "创业社区", icon: Users },
  { id: "assistant", label: "AI助手", icon: Bot },
  { id: "profile", label: "我的OPC", icon: CircleUserRound },
];
const communityData = [
  {
    title: "AI原点社区",
    city: "北京",
    district: "海淀区 · 五道口",
    address: "北京市海淀区东升镇成府路45号（原点大厦）",
    image: "./assets/images/ai-yuandian.jpg",
    friendly: 2,
    description:
      "位于北京海淀区五道口核心地带，以全球AI人才创新创业第一站为定位，是海淀人工智能创新街区的核心载体。",
    supports: [
      "原点学堂50个开放式工位面向AI开发者免费开放",
      "大模型算力券补贴50%，单年最高200万元",
      "科技人才创业资金10万元，创赛获奖最高50万元",
      "人才保障住房5折，安居补贴每月最高3000元",
      "连接清华等高校AI人才与投融资资源",
    ],
    recommended: true,
    letter: "B",
  },
  {
    title: "完美创界OPC社区",
    city: "成都",
    district: "成华区",
    address: "成都市成华区东郊记忆·成都国际时尚产业园",
    image: "./assets/images/wanmei-chuangjie.jpg",
    friendly: 3,
    description:
      "位于成都成华区东郊记忆，依托文创产业生态和千万级客流场景，聚焦内容分发、文创IP与演出展览合作。",
    supports: [
      "免费入驻，免6–12个月工位费",
      "提供火山引擎算力及平台账号",
      "园区线下内容分发渠道",
      "文创IP授权合作机会",
      "演出场景与展览场地支持",
    ],
    recommended: true,
    letter: "C",
  },
  {
    title: "紫光VID网络视听产业园OPC创业社区",
    city: "北京",
    district: "通州区",
    address: "北京市通州区运河商务区紫光VID网络视听产业园",
    image: "./assets/images/ziguang-vid.jpg",
    friendly: 5,
    description:
      "位于北京城市副中心运河商务区，是北京市广电局和通州区重点打造的网络视听产业集聚区。",
    supports: [
      "免费注册地址与低成本共享工位",
      "4000平方米专属OPC空间",
      "算力补贴及DeepSeek AI工具支持",
      "青年拔尖人才奖励最高25万元",
      "对接200余家视听产业链企业",
    ],
    recommended: true,
    letter: "B",
  },
  {
    title: "益人城OPC生态社区",
    city: "北京",
    district: "海淀区",
    address: "北京市海淀区永丰路用友产业园东区19A",
    image: "./assets/images/yirencheng.jpg",
    friendly: 3,
    description:
      "由益企行科技产业服务集团运营，面向AI应用、智能硬件和企业服务等创业方向。",
    supports: [
      "200个AI开发者工位免费",
      "模型券补贴50%，单年最高200万元",
      "创业奖励最高50万元",
      "人才公寓5折最长3年",
      "订单池对接政府、高校和龙头企业需求",
    ],
    recommended: true,
    letter: "B",
  },
  {
    title: "培风社OPC社区",
    city: "杭州",
    district: "上城区",
    address: "杭州市上城区水墩北路1号5号楼",
    image: "./assets/images/peifengshe.png",
    friendly: 4,
    description:
      "上城区首章新所官方OPC社区，服务一人公司、独立开发者、数字游民及小微创业个体。",
    supports: [
      "首年工位全免，水电网物业全包",
      "免费AI工具会员账号",
      "算力平台补贴最高30万元/年",
      "超级个体奖励最高20万元",
      "OPC人才驿站最长3年梯度优惠",
    ],
    recommended: true,
    letter: "H",
  },
  {
    title: "武汉滨江亲橙人工智能OPC社区",
    city: "武汉",
    district: "武昌区",
    address: "武汉市武昌滨江数创走廊（武汉阿里中心T1-37楼）",
    image: "./assets/images/wuhan-qincheng.png",
    friendly: 2,
    description: "亲橙OPC品牌在武汉的落地社区，聚焦AI应用开发和智慧城市赛道。",
    supports: [
      "400个精装工位与4400平方米空间",
      "接入武昌智算中心专属通道",
      "算力补贴最高20万元/年",
      "AI模型研发补贴最高500万元",
      "OPC人才安居支持最高100万元",
    ],
    recommended: true,
    letter: "W",
  },
  {
    title: "模数OPC社区",
    city: "北京",
    district: "北京",
    recommended: false,
    letter: "B",
  },
  {
    title: "O-Hub社区（北京市数字人基地创新社区）",
    city: "北京",
    district: "朝阳区",
    recommended: false,
    letter: "B",
  },
  {
    title: "中关村AI北纬社区",
    city: "北京",
    district: "北京",
    recommended: false,
    letter: "B",
  },
  {
    title: "天府长岛·元创岛OPC社区",
    city: "成都",
    district: "高新区",
    recommended: false,
    letter: "C",
  },
  {
    title: "芯创社（成都芯谷人工智能OPC社区）",
    city: "成都",
    district: "双流区",
    recommended: false,
    letter: "C",
  },
];
const alphabet = "BCDFGHJKLMNQRSTWXYZ".split("");
const imageForCommunity = (x: (typeof communityData)[number]) =>
  x.image ||
  (x.city === "成都"
    ? "./assets/images/community-chengdu.webp"
    : x.city === "杭州"
      ? "./assets/images/community-hangzhou.webp"
      : "./assets/images/community-beijing.webp");
function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={small ? "brand-mark small" : "brand-mark"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40">
        <path d="M8 29 18.5 8 29 29M12.5 22h12" />
        <circle cx="28" cy="15" r="7" />
        <path d="M31 22v10" />
      </svg>
    </span>
  );
}
function WarpText({ text }: { text: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointer = { x: -9999, y: -9999 };
    const draw = (time = 0) => {
      const bounds = element.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(bounds.width * ratio));
      const height = Math.max(1, Math.floor(bounds.height * ratio));
      if (element.width !== width || element.height !== height) {
        element.width = width;
        element.height = height;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      const size = Math.min(bounds.width * 0.087, 78);
      const lines = text.split("\n");
      const lineHeight = size * 1.08;
      const startY = (bounds.height - lines.length * lineHeight) / 2 + size * 0.83;
      context.font = `800 ${size}px Inter, "Microsoft YaHei", sans-serif`;
      context.textBaseline = "alphabetic";
      const phase = reduceMotion.matches ? 0 : time * 0.00055;
      lines.forEach((line, lineIndex) => {
        const y = startY + lineIndex * lineHeight;
        const textWidth = context.measureText(line).width;
        const segments = Array.from(line);
        let x = 0;
        segments.forEach((character, index) => {
          const characterWidth = context.measureText(character).width;
          const centerX = x + characterWidth / 2;
          const dx = centerX - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const pointerWarp = distance < 230 ? Math.sin((1 - distance / 230) * Math.PI) * (dx / 230) * 10 : 0;
          const wave = Math.sin(index * 0.68 + phase + lineIndex * 0.7) * 2.4;
          const offsetY = wave + pointerWarp;
          context.fillStyle = "rgba(209, 255, 237, .34)";
          context.fillText(character, x + 1.5, y + offsetY + 1.5);
          context.fillStyle = "#123b31";
          context.fillText(character, x, y + offsetY);
          x += characterWidth;
        });
        const glow = context.createLinearGradient(0, y - size, textWidth, y);
        glow.addColorStop(0, "rgba(111, 239, 189, 0)");
        glow.addColorStop(0.5, "rgba(111, 239, 189, .28)");
        glow.addColorStop(1, "rgba(111, 239, 189, 0)");
        context.fillStyle = glow;
        context.fillRect(0, y - size * 0.1, textWidth, 2);
      });
      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const leave = () => { pointer = { x: -9999, y: -9999 }; };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [text]);
  return <canvas ref={canvas} className="warp-title" aria-label={text} role="img" />;
}
const projectData = [
  {
    title: "AI 内容工厂 MVP",
    tag: "产品共创",
    budget: "¥8k-15k",
    fit: 96,
    desc: "为知识型 IP 搭建选题、脚本和分发自动化工作流。",
  },
  {
    title: "园区政策智能问答",
    tag: "技术交付",
    budget: "¥20k+",
    fit: 89,
    desc: "基于园区政策库建立检索问答与线索收集页面。",
  },
  {
    title: "30 天小红书增长实验",
    tag: "增长合作",
    budget: "结果分成",
    fit: 82,
    desc: "共创选题模型、内容模板和每周数据复盘机制。",
  },
];
function AuthModal({
  mode,
  setMode,
  close,
  success,
}: {
  mode: "login" | "register";
  setMode: (m: "login" | "register") => void;
  close: () => void;
  success: (u: User) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const accounts: Account[] = JSON.parse(
      localStorage.getItem("opc_accounts") || "[]",
    );
    if (mode === "register") {
      if (name.trim().length < 2) return setError("姓名至少需要 2 个字符");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError("请输入有效邮箱");
      if (pwd.length < 8) return setError("密码至少需要 8 位");
      if (pwd !== confirm) return setError("两次密码输入不一致");
      if (accounts.some((a) => a.email === email))
        return setError("该邮箱已经注册");
      const a = { name: name.trim(), email, password: pwd };
      localStorage.setItem("opc_accounts", JSON.stringify([...accounts, a]));
      success({ name: a.name, email: a.email });
    } else {
      const a = accounts.find((a) => a.email === email && a.password === pwd);
      if (!a) return setError("邮箱或密码不正确");
      success({ name: a.name, email: a.email });
    }
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        className="auth-panel"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="close-btn" aria-label="关闭" onClick={close}>
          <X size={18} />
        </button>
        <div className="auth-logo">
          <BrandMark small />
          <span>
            AI OPC ONE<small>aiopcone.com</small>
          </span>
        </div>
        <span className="eyebrow">SECURE WORKSPACE ACCESS</span>
        <h2>{mode === "login" ? "登录工作台" : "创建 OPC 账户"}</h2>
        <p>
          {mode === "login"
            ? "继续管理你的路径、资源与任务。"
            : "保存创业档案，建立可持续行动记录。"}
        </p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              姓名
              <input
                aria-label="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的称呼"
              />
            </label>
          )}
          <label>
            邮箱
            <input
              aria-label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label>
            密码
            <div className="password">
              <input
                aria-label="密码"
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="至少 8 位"
              />
              <button
                type="button"
                aria-label={show ? "隐藏密码" : "显示密码"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {mode === "register" && (
            <label>
              确认密码
              <input
                aria-label="确认密码"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次输入密码"
              />
            </label>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button className="primary-btn full" type="submit">
            {mode === "login" ? (
              <>
                <LogIn size={16} />
                进入系统
              </>
            ) : (
              <>
                <UserPlus size={16} />
                创建账户
              </>
            )}
          </button>
        </form>
        <button
          className="switch-auth"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "还没有账户？立即注册" : "已有账户？返回登录"}
        </button>
        <div className="security-note">
          <ShieldCheck size={14} />
          本地演示认证，请勿使用真实常用密码。
        </div>
      </motion.div>
    </div>
  );
}
function MarketingHero({ openApp }: { openApp: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let prev: number | null = null,
      target = 0;
    const move = (e: MouseEvent) => {
      if (innerWidth < 1024 || !el.duration) return;
      if (prev === null) {
        prev = e.clientX;
        return;
      }
      target = Math.max(
        0,
        Math.min(
          el.duration,
          target + ((e.clientX - prev) / innerWidth) * 0.8 * el.duration,
        ),
      );
      prev = e.clientX;
      el.currentTime = target;
    };
    const ready = () => {
      if (innerWidth < 1024) {
        el.autoplay = true;
        el.play().catch(() => {});
      }
    };
    addEventListener("mousemove", move);
    el.addEventListener("loadedmetadata", ready);
    return () => {
      removeEventListener("mousemove", move);
      el.removeEventListener("loadedmetadata", ready);
    };
  }, []);
  return (
    <section className="marketing-hero">
      <video
        ref={video}
        muted
        playsInline
        preload="auto"
        src="assets/hero-source.mp4"
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-brand">
          <BrandMark />
          <div>
            <b>AI OPC ONE</b>
            <span>aiopcone.com</span>
          </div>
        </div>
        <span className="eyebrow">AI-POWERED OPC OPERATING SYSTEM</span>
        <WarpText text={"一个人，也能启动\n一套完整的创业系统。"} />
        <p>连接一人公司、超级个体与 AI 创作者，从一个想法，到一个产品，再到一家公司。</p>
        <div>
          <button className="primary-btn" onClick={openApp}>
            启动我的 OPC <ArrowRight size={17} />
          </button>
          <button
            className="ghost-btn"
            onClick={() =>
              document
                .getElementById("proof")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            了解系统
          </button>
        </div>
      </div>
    </section>
  );
}
function PageHeader({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
function DetailShell({
  back,
  eyebrow,
  title,
  image,
  meta,
  children,
}: {
  back: () => void;
  eyebrow: string;
  title: string;
  image: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="detail-page">
      <button className="back-link" onClick={back}>
        ← 返回上一级
      </button>
      <div className="detail-hero">
        <img src={image} alt="" />
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{meta}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
function CommunityDetail({
  community,
  back,
}: {
  community: (typeof communityData)[number];
  back: () => void;
}) {
  const [tab, setTab] = useState("总览");
  const [applied, setApplied] = useState(false);
  const groups = {
    办公空间: community.supports?.slice(0, 1) || ["办公空间信息待社区确认"],
    算力与工具: community.supports?.slice(1, 2) || ["算力支持信息待社区确认"],
    资金与政策: community.supports?.slice(2, 4) || [
      "相关政策以主管部门最新公告为准",
    ],
    安居与商机: community.supports?.slice(4) || [
      "商机与安居支持需按项目资格确认",
    ],
  };
  return (
    <div className="community-detail">
      <button className="back-link" onClick={back}>
        ← 返回社区地图
      </button>
      <section className="community-profile-hero">
        <img
          src={imageForCommunity(community)}
          alt={`${community.title}封面`}
        />
        <div className="profile-overlay">
          <span className="eyebrow">COMMUNITY DOSSIER</span>
          <h1>{community.title}</h1>
          <p>
            <MapPin size={15} />
            {community.city} · {community.district || "城区待确认"}
          </p>
          <div className="profile-pills">
            <span>入驻友好度 {community.friendly || "待核实"}/5</span>
            <span>公开资料核验</span>
          </div>
        </div>
      </section>
      <section className="community-summary">
        <div>
          <span>详细地址</span>
          <b>{community.address || "请向社区确认地址"}</b>
        </div>
        <div>
          <span>适合方向</span>
          <b>AI 应用 · 独立创业 · 一人公司</b>
        </div>
        <div>
          <span>办公情况</span>
          <b>{community.supports?.[0] || "以当前入驻公告为准"}</b>
        </div>
        <button className="primary-btn" onClick={() => setApplied(true)}>
          {applied ? "意向已保存" : "提交入驻意向"}
        </button>
      </section>
      {applied && (
        <div className="notice-success">
          <Check size={16} />
          已保存你的入驻意向。正式申请前请与运营方核实资格、名额和费用。
        </div>
      )}
      <div className="tabs detail-tabs">
        {["总览", "支持详情", "入驻指南", "政策与提醒"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "总览" && (
        <section className="dossier-layout">
          <article>
            <h2>社区介绍</h2>
            <p>
              {community.description ||
                "该社区的公开介绍仍在补充中，建议申请前完成线下或电话核验。"}
            </p>
            <h2>适合谁</h2>
            <div className="detail-features">
              {[
                "正在验证业务方向的一人公司",
                "需要本地办公与注册服务的团队",
                "需要连接政策、算力或行业资源的创业者",
                "能提供明确项目和长期投入计划的申请人",
              ].map((x) => (
                <div key={x}>
                  <Check size={15} />
                  {x}
                </div>
              ))}
            </div>
          </article>
          <aside>
            <h3>入驻前核验清单</h3>
            <ol>
              {[
                "是否需要完成工商注册或迁入",
                "工位类型、面积、费用及免费期限",
                "可用算力、补贴的适用条件",
                "政策申报时间和材料要求",
                "运营方联系人与实际可用名额",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </aside>
        </section>
      )}
      {tab === "支持详情" && (
        <section className="support-details">
          {Object.entries(groups).map(([title, items]) => (
            <article key={title}>
              <h2>{title}</h2>
              {items.map((x) => (
                <p key={x}>
                  <Check size={15} />
                  {x}
                </p>
              ))}
            </article>
          ))}
        </section>
      )}
      {tab === "入驻指南" && (
        <section className="guide-steps">
          {[
            "准备创业者与业务介绍",
            "确认社区定位与准入条件",
            "提交申请并补充证明材料",
            "沟通工位、服务和政策事项",
            "签署协议后开始使用服务",
          ].map((x, i) => (
            <article key={x}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <div>
                <h3>{x}</h3>
                <p>每一步都应保留书面确认，避免将宣传口径视为最终承诺。</p>
              </div>
            </article>
          ))}
        </section>
      )}
      {tab === "政策与提醒" && (
        <section className="policy-note">
          <h2>政策使用提醒</h2>
          <p>
            本页将公开资料整理为便于比较的社区档案，不构成对办公、补贴、算力、融资或安居支持的保证。政策资格、金额、有效期和申请材料会变化，请以当地主管部门、园区运营方或正式协议为准。
          </p>
          <h3>建议准备的材料</h3>
          <div className="detail-features">
            {[
              "身份证明与主体信息",
              "业务计划或项目说明",
              "团队与技能证明",
              "预算与资源需求清单",
            ].map((x) => (
              <div key={x}>
                <Check size={15} />
                {x}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
function PixelBlast() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * ratio));
      const h = Math.max(1, Math.floor(rect.height * ratio));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const step = 32;
      const drift = reducedMotion ? 0 : (time * 0.014) % step;
      for (let y = -step; y < rect.height + step; y += step) {
        for (let x = -step; x < rect.width + step; x += step) {
          const px = x + ((y / step) % 2) * 8;
          const py = y + drift;
          const pulse = 1.35 + Math.sin(time * 0.0012 + x * 0.03 + y * 0.02) * 0.55;
          ctx.fillStyle = `rgba(41, 139, 120, ${0.35 + pulse * 0.09})`;
          ctx.beginPath(); ctx.arc(px, py, pulse, 0, Math.PI * 2); ctx.fill();
        }
      }
      const waveX = reducedMotion ? rect.width * .72 : (time * 0.045) % (rect.width + 320) - 160;
      const gradient = ctx.createLinearGradient(waveX - 180, 0, waveX + 180, 0);
      gradient.addColorStop(0, "rgba(102, 198, 174, 0)");
      gradient.addColorStop(.5, "rgba(102, 198, 174, .34)");
      gradient.addColorStop(1, "rgba(102, 198, 174, 0)");
      ctx.fillStyle = gradient; ctx.fillRect(waveX - 180, 0, 360, rect.height);
      const radius = 110 + Math.sin(time * .001) * 24;
      ctx.strokeStyle = "rgba(66, 155, 167, .2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rect.width * .78, rect.height * .56, radius, 0, Math.PI * 2);
      ctx.stroke();
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} className="pixel-blast" aria-hidden="true" />;
}
function Dashboard({ setPage }: { setPage: (p: PageId) => void }) {
  const [goal, setGoal] = useState("AI创业");
  const [generated, setGenerated] = useState(false);
  const [tasks, setTasks] = useState([true, false, false]);
  const completedTasks = tasks.filter(Boolean).length;
  return (
    <div className="dashboard-stage">
      <PixelBlast />
      <PageHeader
        eyebrow="TODAY / GROWTH CONSOLE"
        title="今天，从一个明确动作开始。"
        desc="系统已汇总与你当前阶段最相关的资源与机会。"
      />
      <div className="metric-row">
        <div>
          <span>本周行动</span>
          <b>4 / 7</b>
          <small>较上周 +2</small>
        </div>
        <div>
          <span>匹配机会</span>
          <b>06</b>
          <small>2 个高匹配</small>
        </div>
        <div>
          <span>技能完成度</span>
          <b>72%</b>
          <small>继续学习 AI 工具</small>
        </div>
        <div>
          <span>城市资源</span>
          <b>42</b>
          <small>覆盖全国节点</small>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="work-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">AI PATH BUILDER</span>
              <h2>生成你的启动路径</h2>
            </div>
            <Sparkles size={20} />
          </div>
          <p>选择当前目标，系统会给出一条 7 天行动路线。</p>
          <div className="segmented">
            {["AI创业", "内容变现", "技能接单"].map((x) => (
              <button
                className={goal === x ? "active" : ""}
                onClick={() => setGoal(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <button className="primary-btn" onClick={() => setGenerated(true)}>
            AI 帮我规划 <ArrowRight size={16} />
          </button>
          {generated && (
            <div className="success-state">
              <Check size={17} />
              <div>
                <b>{goal}路径已生成</b>
                <span>下一步：完成能力画像并匹配首个项目。</span>
                <button className="success-link" onClick={() => setPage("projects")}>
                  查看匹配项目 <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="work-panel compact">
          <div className="panel-title">
            <h2>今日任务</h2>
            <span className="count">{completedTasks} / {tasks.length}</span>
          </div>
          {[
            "完善服务能力标签",
            "浏览 3 个高匹配项目",
            "完成 AI 工具路线第 2 节",
          ].map((x, i) => (
            <label className="task" key={x}>
              <input
                type="checkbox"
                checked={tasks[i]}
                onChange={() =>
                  setTasks((current) =>
                    current.map((value, index) => (index === i ? !value : value)),
                  )
                }
              />
              <span>{x}</span>
              <small>+{i + 1} XP</small>
            </label>
          ))}
        </section>
      </div>
      <section className="stage-entry-section" aria-label="按创业阶段开始">
        <div className="section-title">
          <div>
            <span className="eyebrow">CHOOSE YOUR STAGE</span>
            <h2>你现在处在哪一站？</h2>
          </div>
          <span className="stage-entry-note">先选阶段，再进入对应的资源与动作</span>
        </div>
        <div className="stage-entry-grid">
          {[
            ["我在观望", "还没有明确方向", "assistant", "01"],
            ["我要起步", "有想法，准备做验证", "projects", "02"],
            ["我在爬坡", "已经在交付和增长", "tools", "03"],
          ].map(([title, desc, target, index]) => (
            <button key={title} onClick={() => setPage(target as PageId)}>
              <span>{index}</span>
              <div><b>{title}</b><small>{desc}</small></div>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </section>
      <section id="proof" className="quick-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">QUICK ACCESS</span>
            <h2>继续你的核心工作</h2>
          </div>
        </div>
        <div className="quick-grid">
          {[
            {
              p: "resources" as PageId,
              t: "查找创业资源",
              d: "城市、园区、政策与算力",
              i: Compass,
            },
            {
              p: "learn" as PageId,
              t: "补齐关键技能",
              d: "从能力缺口到项目交付",
              i: BookOpen,
            },
            {
              p: "projects" as PageId,
              t: "匹配真实项目",
              d: "按技能、预算与方式筛选",
              i: BriefcaseBusiness,
            },
            {
              p: "assistant" as PageId,
              t: "咨询 AI 助手",
              d: "拆需求、找资源、定路径",
              i: Bot,
            },
          ].map((x) => (
            <button onClick={() => setPage(x.p)} key={x.t}>
              <x.i />
              <b>{x.t}</b>
              <span>{x.d}</span>
              <ArrowRight className="arrow" />
            </button>
          ))}
        </div>
      </section>
      <section className="opc-network-section" aria-label="OPC 同行网络">
        <div className="section-title">
          <div>
            <span className="eyebrow">OPC NETWORK / CHINA</span>
            <h2>独立创造，并肩同行</h2>
          </div>
          <button className="text-link" onClick={() => setPage("community")}>进入同行社 <ArrowRight size={14} /></button>
        </div>
        <div className="network-grid">
          <article className="network-card network-card--wide">
            <span className="network-index">01 / CITY</span>
            <h3>在你的城市，找到一群同行者。</h3>
            <p>查看北京、杭州、深圳、上海、成都等地的 OPC 社区，连接空间、活动与真实项目。</p>
            <button className="secondary-btn" onClick={() => setPage("resources")}>探索城市节点 <ArrowRight size={14} /></button>
          </article>
          <article className="network-card">
            <span className="network-index">02 / SIGNAL</span>
            <h3>每天 5 分钟，跟上 AI 与创业变化。</h3>
            <p>从工具更新、案例拆解到可执行机会，筛选与你当前阶段相关的信号。</p>
            <button className="text-link" onClick={() => setPage("learn")}>查看学习资料 <ArrowRight size={14} /></button>
          </article>
          <article className="network-card">
            <span className="network-index">03 / MEET</span>
            <h3>不只在线交流，更要真实相遇。</h3>
            <p>参与城市活动、主题共学和项目协作，把一次交流变成下一步行动。</p>
            <button className="text-link" onClick={() => setPage("community")}>查看社区活动 <ArrowRight size={14} /></button>
          </article>
          <article className="network-card network-card--accent">
            <span className="network-index">04 / POLICY</span>
            <h3>OPC 扶持政策，一站式看懂。</h3>
            <p>按城市了解空间、算力、人才与创业支持，具体资格以官方公告为准。</p>
            <button className="secondary-btn" onClick={() => setPage("resources")}>查看政策资源 <ArrowRight size={14} /></button>
          </article>
          <article className="network-card">
            <span className="network-index">05 / LAUNCHPAD</span>
            <h3>看看同行者，正在创造什么。</h3>
            <p>浏览独立创作者的产品与项目，从案例中找到合作、验证和发布的下一步。</p>
            <a className="text-link" href="https://www.opc.community/zh/launchpad" target="_blank" rel="noreferrer">浏览项目展台 <ArrowRight size={14} /></a>
          </article>
          <article className="network-card">
            <span className="network-index">06 / JOIN</span>
            <h3>加入 OPC 同行社，让创造不再孤单。</h3>
            <p>无论你有想法、正在做 MVP、想参加活动，或愿意分享资源，都能找到合适入口。</p>
            <button className="text-link" onClick={() => setPage("community")}>找到你的入口 <ArrowRight size={14} /></button>
          </article>
        </div>
      </section>
      <section className="opc-signals-section" aria-label="创业信号与加入路径">
        <div className="signals-feed">
          <div className="section-title">
            <div>
              <span className="eyebrow">WEEKLY SIGNALS</span>
              <h2>把变化，变成下一步。</h2>
            </div>
            <a className="text-link" href="https://www.opc.community/china/news" target="_blank" rel="noreferrer">查看 OPC 资讯 <ArrowRight size={14} /></a>
          </div>
          <article className="signal-lead">
            <span>POLICY RADAR · 2025</span>
            <h3>人工智能+行动，正在给微型团队更多应用与创业场景。</h3>
            <p>关注智能原生企业、AI 应用落地与个体创业的公开政策信号；申报资格、资金和有效期须以主管部门公告为准。</p>
            <a className="text-link" href="https://www.gov.cn/gongbao/2025/issue_12266/202509/content_7039598.html" target="_blank" rel="noreferrer">阅读官方原文 <ArrowRight size={14} /></a>
          </article>
          <div className="signal-list" aria-label="近期 OPC 信号">
            <article><span>DAILY BRIEF · AI</span><h3>Prefix Sliding：无需训练的推理提速思路</h3><p>把值得跟进的模型、工具和产品机会压缩成一条可执行线索。</p><a className="text-link" href="https://www.bestblogs.dev/article/300397f823" target="_blank" rel="noreferrer">查看来源 <ArrowRight size={14} /></a></article>
            <article><span>CITY EVENTS · COFFEE CHAT</span><h3>北京、上海、广州、杭州、深圳等城市持续开放交流</h3><p>优先参加离你最近的一场 Coffee Chat，再决定是否加入长期共学。</p><a className="text-link" href="https://www.opc.community/china/events" target="_blank" rel="noreferrer">查看活动 <ArrowRight size={14} /></a></article>
          </div>
          <div className="news-strip" aria-label="最新动态">
            <span className="eyebrow">LATEST / OPC BRIEF</span>
            <div><b>从一个想法到一套可交付系统</b><small>用工具、社区和真实项目，把今天的动作变成下一次复盘。</small></div>
            <button className="text-link" onClick={() => setPage("tools")}>查看 AI 工具 <ArrowRight size={14} /></button>
          </div>
        </div>
        <aside className="join-path">
          <span className="eyebrow">START HERE</span>
          <h2>选择你现在的起点</h2>
          <div>
            {[
              ["我有一个想法", "寻找方向和反馈", "assistant"],
              ["我正在做 MVP", "需要测试和建议", "projects"],
              ["我要参加活动", "认识城市同行", "community"],
              ["我想成为主理人", "建设本地社区", "community"],
              ["我有资源可分享", "连接更多创造者", "resources"],
            ].map(([title, desc, target], index) => (
              <button key={title} onClick={() => setPage(target as PageId)}>
                <span>0{index + 1}</span><div><b>{title}</b><small>{desc}</small></div><ArrowRight size={15} />
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
function ResourcesPage() {
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState("全部");
  const [recommended, setRecommended] = useState(false);
  const [city, setCity] = useState("全国");
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState("");
  const [selected, setSelected] = useState<
    (typeof communityData)[number] | null
  >(null);
  const list = communityData.filter(
    (x) =>
      (letter === "全部" || x.letter === letter) &&
      (!recommended || x.recommended) &&
      `${x.title}${x.city}${x.district}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const reset = () => {
    setQ("");
    setLetter("全部");
    setRecommended(false);
  };
  const locate = () => {
    setLocating(true);
    setLocationNote("");
    if (!navigator.geolocation) {
      setLocating(false);
      setLocationNote("当前浏览器不支持定位，请手动选择城市。");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("北京");
        setLocationNote("已读取当前位置附近的城市资源。你可随时手动切换城市。");
        setLocating(false);
      },
      () => {
        setLocationNote(
          "未获得位置权限，已保留全国视图。请在浏览器设置中允许位置访问，或手动选择城市。",
        );
        setLocating(false);
      },
      { timeout: 8000 },
    );
  };
  if (selected)
    return (
      <CommunityDetail community={selected} back={() => setSelected(null)} />
    );
  return (
    <>
      <section className="atlas-head">
        <div>
          <span className="eyebrow">NATIONAL OPC COMMUNITY ATLAS</span>
          <h1>全国 OPC 社区地图</h1>
          <p>
            找到适合一人公司落地的城市节点，参考办公、算力、商机、资金与安居支持。
          </p>
          <small>
            公开数据快照 · 来源：OPC圈社区地图 · 详情以各社区最新公告为准
          </small>
        </div>
        <div className="atlas-stats">
          <div>
            <b>674</b>
            <span>个社区</span>
          </div>
          <div>
            <b>87</b>
            <span>座城市</span>
          </div>
          <em>真实入驻友好度参考</em>
        </div>
      </section>
      <section className="support-strip" aria-label="社区支持能力">
        {[
          [Home, "办公空间"],
          [Cpu, "算力资源"],
          [Handshake, "商机对接"],
          [WalletCards, "资金支持"],
          [Building2, "安居保障"],
        ].map(([Icon, label]: any) => (
          <div key={label}>
            <Icon size={17} />
            <span>{label}</span>
          </div>
        ))}
      </section>
      <div className="filterbar">
        <label>
          <Search size={16} />
          <input
            aria-label="搜索资源"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索社区、城市或城区"
          />
        </label>
        <div className="filter-pills">
          <button
            className={!recommended ? "active" : ""}
            onClick={() => setRecommended(false)}
          >
            全部社区
          </button>
          <button
            className={recommended ? "active" : ""}
            onClick={() => setRecommended(true)}
          >
            推荐社区
          </button>
        </div>
      </div>
      <div className="location-bar">
        <div>
          <MapPin size={16} />
          <b>资源定位</b>
          <span>
            {city} · {locationNote || "选择城市后优先查看本地社区、政策和活动"}
          </span>
        </div>
        <select
          aria-label="选择城市"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          {["全国", "北京", "成都", "杭州", "武汉", "深圳", "上海", "长沙"].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
        <button className="secondary-btn" onClick={locate} disabled={locating}>
          {locating ? "定位中..." : "使用当前位置"}
        </button>
      </div>
      <div className="alphabet-filter">
        <button
          className={letter === "全部" ? "active" : ""}
          onClick={() => setLetter("全部")}
        >
          全国
        </button>
        {alphabet.map((x) => (
          <button
            aria-label={`城市首字母 ${x}`}
            className={letter === x ? "active" : ""}
            onClick={() => setLetter(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="result-title">
        <div>
          <span className="eyebrow">VERIFIED PUBLIC SAMPLE</span>
          <h2>{recommended ? "推荐社区" : "社区名录"}</h2>
        </div>
        <span>显示 {list.length} 条已核实公开样本</span>
      </div>
      {list.length ? (
        <div className="community-grid">
          {list.map((x) => (
            <article key={x.title}>
              <div className="community-visual">
                <img
                  src={imageForCommunity(x)}
                  alt={`${x.title}原站图片`}
                  loading="lazy"
                />
                <span>{x.city.slice(0, 1)}</span>
                <i>{x.recommended ? "推荐" : "社区"}</i>
              </div>
              <div className="community-body">
                <small>
                  <Map size={13} />
                  {x.city} · {x.district}
                </small>
                <h3>{x.title}</h3>
                <div className="community-tags">
                  <span>办公空间</span>
                  <span>政策支持</span>
                  <span>创业连接</span>
                </div>
                <button onClick={() => setSelected(x)}>
                  查看社区资料 <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search />
          <h3>没有找到相关社区</h3>
          <p>尝试清除关键词，或切换城市首字母。</p>
          <button className="secondary-btn" onClick={reset}>
            重置筛选
          </button>
        </div>
      )}
      <section className="faq-section">
        <div className="result-title">
          <div>
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2>OPC 社区常见问题</h2>
          </div>
        </div>
        <div className="faq-grid">
          <article>
            <h3>什么是 OPC 社区？</h3>
            <p>
              专为一人公司、个体创业者设计的创业空间，通常由地方政府或国有平台运营，提供低成本办公、注册地址和创业政策支持。
            </p>
          </article>
          <article>
            <h3>和普通共享办公有什么不同？</h3>
            <p>
              通常具备政府或平台背景，可承接注册、政策补贴与产业资源，成本更友好，也更聚焦独立创业者。
            </p>
          </article>
          <article>
            <h3>常见入驻条件是什么？</h3>
            <p>
              已注册或计划注册一人公司、个体经营主体，且业务方向符合社区定位。具体条件须以社区公告为准。
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
function AiToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const tools = [
    { name: "ChatGPT", category: "研究与写作", tone: "chat", desc: "拆解需求、生成方案、整理资料并协助完成日常交付。", use: "适合：研究、文案、方案、客户沟通", link: "https://chatgpt.com/", label: "开始使用" },
    { name: "OpenAI API", category: "开发与集成", tone: "api", desc: "把模型能力接入你的网站、工作流或内部工具，形成可交付产品。", use: "适合：AI 应用、自动化、产品原型", link: "https://platform.openai.com/", label: "查看平台" },
    { name: "Codex", category: "开发与集成", tone: "codex", desc: "用自然语言完成代码搭建、调试、测试和迭代，适合一人开发。", use: "适合：网站、脚本、MVP、自动化", link: "https://platform.openai.com/docs/codex", label: "查看文档" },
    { name: "Dify", category: "应用与知识库", tone: "dify", desc: "搭建知识库、工作流和可发布的 AI 应用，减少重复开发。", use: "适合：客服、知识助手、企业服务", link: "https://dify.ai/", label: "打开 Dify" },
    { name: "n8n", category: "自动化", tone: "n8n", desc: "连接表单、表格、邮件和 AI 节点，把重复动作变成可复用流程。", use: "适合：获客、内容分发、通知、同步", link: "https://n8n.io/", label: "打开 n8n" },
    { name: "ComfyUI", category: "视觉与视频", tone: "visual", desc: "用节点工作流控制图像生成、风格一致性和批量素材生产。", use: "适合：商品图、封面、短视频素材", link: "https://www.comfy.org/", label: "查看项目" },
    { name: "PromptHub", category: "提示词资产", tone: "prompt", desc: "发现、反推、改写和验证提示词，把经验沉淀为可复用资产。", use: "适合：提示词库、团队规范、内容生产", link: "https://prompthub.xin/", label: "打开平台" },
    { name: "GitHub", category: "开发与部署", tone: "github", desc: "托管代码、协作开发并通过 GitHub Pages 发布静态网站。", use: "适合：版本管理、部署、开源协作", link: "https://github.com/", label: "打开 GitHub" },
  ];
  const categories = ["全部", "研究与写作", "开发与集成", "应用与知识库", "自动化", "视觉与视频", "提示词资产", "开发与部署"];
  const visible = tools.filter((tool) => {
    const text = `${tool.name}${tool.category}${tool.desc}${tool.use}`.toLowerCase();
    return (category === "全部" || tool.category === category) && text.includes(query.toLowerCase());
  });
  return (
    <>
      <PageHeader
        eyebrow="AI TOOLKIT"
        title="把能提高交付效率的工具，放在一个入口。"
        desc="从一个具体任务开始选择工具，先完成一次可展示成果，再决定是否深入投入。"
      />
      <section className="ai-tools-intro" aria-label="AI 工具使用建议">
        <div>
          <span className="eyebrow">ONE-PERSON OPERATING SYSTEM</span>
          <h2>今天要完成什么？</h2>
          <p>研究、开发、视觉、自动化和提示词，都可以先从最小闭环开始。</p>
        </div>
        <div className="ai-tools-intro__steps">
          <span><b>01</b>选择任务</span>
          <span><b>02</b>打开工具</span>
          <span><b>03</b>留下成果</span>
        </div>
      </section>
      <div className="ai-tools-toolbar">
        <label>
          <Search size={16} />
          <input aria-label="搜索 AI 工具" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索工具、场景或能力" />
        </label>
        <div className="ai-tools-categories" aria-label="AI 工具分类">
          {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>
      <div className="ai-tools-grid">
        {visible.map((tool) => (
          <article className={`ai-tool-card ai-tool-card--${tool.tone}`} key={tool.name}>
            <div className="ai-tool-card__top">
              <span className="ai-tool-mark"><Sparkles size={17} /></span>
              <span>{tool.category}</span>
            </div>
            <h2>{tool.name}</h2>
            <p>{tool.desc}</p>
            <small>{tool.use}</small>
            <a href={tool.link} target="_blank" rel="noreferrer">{tool.label} <ArrowRight size={14} /></a>
          </article>
        ))}
      </div>
      {!visible.length && <div className="empty-state ai-tools-empty"><Search /><h3>没有找到匹配工具</h3><p>换一个关键词，或切换工具分类。</p><button className="secondary-btn" onClick={() => { setQuery(""); setCategory("全部"); }}>重置筛选</button></div>}
      <section className="ai-tools-note">
        <div><span className="eyebrow">DELIVERY RULE</span><h2>工具不是终点，成果才是。</h2><p>每次使用至少留下一个可复用结果：工作流、模板、样品、链接或客户反馈。</p></div>
        <button className="primary-btn" onClick={() => setCategory("自动化")}>先看自动化工具 <ArrowRight size={14} /></button>
      </section>
    </>
  );
}
function LearnPage() {
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState("学习路线");
  const [certified, setCertified] = useState(false);
  const [tutorialFilter, setTutorialFilter] = useState("全部");
  const courses = [
    { t: "AI 工具实战", d: "建立提示词、自动化与交付工作流", n: "7 节", p: 64 },
    { t: "个人品牌增长", d: "内容定位、矩阵分发与线索承接", n: "9 节", p: 32 },
    { t: "OPC 商业模型", d: "定价、验证、现金流与复购设计", n: "6 节", p: 18 },
  ];
  const tutorials = [
    { tool: "Codex", level: "入门", title: "用 Codex 搭建可交付的个人工作流", desc: "从需求拆分、项目目录到代码审查，完成一个能演示的微型工具。", source: "OpenAI 官方文档", link: "https://platform.openai.com/docs/codex", tone: "codex" },
    { tool: "Codex", level: "实战", title: "Codex 自动化实战：从想法到可用网页", desc: "学习如何用任务描述驱动页面搭建、验证和迭代，把服务流程沉淀为模板。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=Codex%20%E6%95%99%E7%A8%8B", tone: "codex" },
    { tool: "ComfyUI", level: "入门", title: "ComfyUI 节点工作流：稳定出图与批量生产", desc: "理解模型、节点、提示词和队列，搭建一套可复用的内容生产工作流。", source: "ComfyUI 官方文档", link: "https://docs.comfy.org/", tone: "comfy" },
    { tool: "ComfyUI", level: "实战", title: "ComfyUI 商业视觉工作流案例", desc: "围绕商品图、封面图和短视频素材，练习控制一致性与交付质量。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=ComfyUI%20%E5%95%86%E4%B8%9A%E5%B7%A5%E4%BD%9C%E6%B5%81", tone: "comfy" },
    { tool: "Dify", level: "入门", title: "Dify 知识库与应用编排入门", desc: "完成一个带知识库、变量和提示词的问答应用，适合内部助手或客户交付演示。", source: "Dify 官方文档", link: "https://docs.dify.ai/", tone: "dify" },
    { tool: "Dify", level: "实战", title: "Dify 搭建可售卖的 AI 助手", desc: "从客户问题收集、知识库整理到测试与交付说明，形成最小服务包。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=Dify%20%E6%95%99%E7%A8%8B", tone: "dify" },
    { tool: "n8n", level: "入门", title: "n8n 自动化工作流基础", desc: "用触发器、条件与数据节点连接表单、内容和通知，先解决一个重复动作。", source: "n8n 官方课程", link: "https://docs.n8n.io/courses/", tone: "n8n" },
    { tool: "n8n", level: "实战", title: "n8n 自动化获客与内容分发", desc: "练习线索收集、内容草稿、人工审核和发送提醒，保留人工确认节点。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=n8n%20%E6%95%99%E7%A8%8B", tone: "n8n" },
    { tool: "FDE", level: "入门", title: "FDE 工作流与交付框架", desc: "将一个模糊需求拆成输入、处理、验收与复盘，建立可重复的服务交付路径。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=FDE%20%E6%95%99%E7%A8%8B", tone: "fde" },
    { tool: "AI 创业", level: "实践", title: "AI 一人公司：7 天验证一个服务方向", desc: "用客户访谈、样品、报价与复盘验证需求，避免在未验证前过度开发。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=AI%20%E5%88%9B%E4%B8%9A&order=pubdate", tone: "opc" },
    { tool: "AI 创业", level: "实践", title: "AI 内容服务：从样品到首位付费客户", desc: "把单一交付写清楚，完成样品、报价单与访谈记录，再决定是否扩展服务。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=AI%20%E4%B8%80%E4%BA%BA%E5%85%AC%E5%8F%B8&order=pubdate", tone: "opc" },
    { tool: "提示词", level: "基础", title: "提示词工程：把任务写成可复用指令", desc: "用角色、上下文、约束、输出格式和验收标准降低每次生成的随机性。", source: "OpenAI 官方指南", link: "https://platform.openai.com/docs/guides/prompt-engineering", tone: "codex" },
    { tool: "提示词", level: "实战", title: "提示词工作流：内容、研究和表格任务", desc: "通过示例与检查清单，将日常任务整理为团队可复制的工作模板。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%B7%A5%E7%A8%8B%20%E6%95%99%E7%A8%8B", tone: "dify" },
    { tool: "提示词", level: "实战", title: "PromptHub 提示词创作与验证", desc: "从提示词发现、结构化改写到试用验证，建立可复用的提示词资产库。", source: "PromptHub 官方", link: "https://prompthub.xin/", tone: "opc" },
    { tool: "提示词", level: "实战", title: "PromptHub 多模态提示词：图像与视频", desc: "参考图片或视频反推提示词，再用参数、风格与输出约束迭代素材质量。", source: "PromptHub 官方", link: "https://prompthub.xin/", tone: "opc" },
    { tool: "自动化", level: "实战", title: "从表单到通知：自动化服务最小闭环", desc: "串联输入、分类、人工审核与通知，练习交付前必须保留的验收环节。", source: "哔哩哔哩教程", link: "https://search.bilibili.com/all?keyword=AI%20%E8%87%AA%E5%8A%A8%E5%8C%96%20%E5%B7%A5%E4%BD%9C%E6%B5%81", tone: "n8n" },
    { tool: "开源部署", level: "入门", title: "Docker 部署 AI 工具的基础方法", desc: "了解环境变量、数据卷、端口和更新回滚，降低本地部署工具的维护风险。", source: "Docker 官方入门", link: "https://docs.docker.com/get-started/", tone: "fde" },
  ];
  const learningResources = [
    { title: "OpenAI 开发者文档", desc: "Codex、API、提示词和构建指南。适合做 AI 工具或接入模型能力时查阅。", label: "官方免费", link: "https://platform.openai.com/docs/" },
    { title: "ComfyUI 文档与示例", desc: "节点、工作流、模型管理和常见问题。先从基础工作流开始，再做商业视觉案例。", label: "官方免费", link: "https://docs.comfy.org/" },
    { title: "Dify 学习中心", desc: "应用编排、知识库、工作流与发布。适合搭建企业知识助手和可演示原型。", label: "官方免费", link: "https://docs.dify.ai/" },
    { title: "n8n 课程中心", desc: "自动化基础、核心节点与项目式练习。适合从一个重复动作开始做流程验证。", label: "官方免费", link: "https://docs.n8n.io/courses/" },
    { title: "freeCodeCamp 中文学习入口", desc: "覆盖 Web 开发、Git、JavaScript、Python 等基础能力，可按项目练习补齐短板。", label: "免费课程", link: "https://www.freecodecamp.org/chinese/" },
    { title: "哔哩哔哩 AI 工具教程", desc: "按最新发布日期检索 AI 创业、自动化、ComfyUI、Dify 与 n8n 的视频教程。", label: "免费视频", link: "https://search.bilibili.com/all?keyword=AI%20%E5%88%9B%E4%B8%9A&order=pubdate" },
    { title: "PromptHub 提示词平台", desc: "发现、创作、反推、增强与验证 AI 提示词，覆盖编程、写作、营销、图像和视频等场景。", label: "官方免费", link: "https://prompthub.xin/" },
  ];
  const tutorialFilters = ["全部", "Codex", "ComfyUI", "Dify", "n8n", "FDE", "提示词", "自动化", "开源部署", "AI 创业"];
  const tutorialCovers: Record<string, { src: string; alt: string }> = {
    codex: { src: "/assets/images/tutorial-codex.png", alt: "OpenAI Codex 官方项目封面" },
    comfy: { src: "/assets/images/tutorial-comfyui.png", alt: "ComfyUI 官方项目封面" },
    dify: { src: "/assets/images/tutorial-dify.png", alt: "Dify 官方项目封面" },
    n8n: { src: "/assets/images/tutorial-n8n.png", alt: "n8n 官方项目封面" },
    fde: { src: "/assets/images/tutorial-opc.png", alt: "OpenAI 官方开发资源封面" },
    opc: { src: "/assets/images/tutorial-opc.png", alt: "OpenAI 官方开发资源封面" },
  };
  const visibleTutorials = tutorialFilter === "全部" ? tutorials : tutorials.filter((item) => item.tool === tutorialFilter);
  if (selected)
    return (
      <DetailShell
        back={() => setSelected(null)}
        eyebrow="LEARNING PATH"
        title={selected.t}
        image="./assets/images/learning.webp"
        meta={`${selected.n} · 当前进度 ${selected.p}%`}
      >
        <div className="detail-grid">
          <section>
            <h2>课程目标</h2>
            <p>
              {selected.d}。通过任务驱动的方式完成一次可展示、可复用的真实成果。
            </p>
            <h2>课程目录</h2>
            <div className="lesson-list">
              {[
                "明确目标与交付标准",
                "建立核心方法与模板",
                "完成第一次实践任务",
                "复盘并沉淀可复用资产",
              ].map((x, i) => (
                <button key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b>{x}</b>
                  <em>{i === 0 ? "已完成" : "18 分钟"}</em>
                </button>
              ))}
            </div>
          </section>
          <aside>
            <h3>学习成果</h3>
            <p>完成后将更新能力画像，并解锁对应项目匹配标签。</p>
            <button className="primary-btn">继续下一节</button>
          </aside>
        </div>
      </DetailShell>
    );
  return (
    <>
      <PageHeader
        eyebrow="SKILL GRAPH"
        title="学习的终点，是完成一次交付。"
        desc="路线围绕真实项目任务设计，进度会同步到你的能力画像。"
      />
      <div className="tabs">
        {["学习路线", "学习资料", "技能认证"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "学习资料" && (
        <>
          <section className="learning-resource-head">
            <span className="eyebrow">FREE LEARNING SOURCES</span>
            <h2>把工具资料和真实练习放在一起</h2>
            <p>从官方文档开始建立基础，再用视频案例完成作品。所有外部来源均在新窗口打开。</p>
          </section>
          <section className="library-grid learning-resource-grid">
            {learningResources.map((item, i) => (
              <article key={item.title}>
                <span>来源 {String(i + 1).padStart(2, "0")} · {item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <a className="secondary-btn" href={item.link} target="_blank" rel="noreferrer">打开学习入口</a>
              </article>
            ))}
          </section>
          <section className="practice-kit">
            <div>
              <span className="eyebrow">PRACTICE KIT</span>
              <h2>每学一个工具，都要留下一个可展示成果</h2>
              <p>建议使用同一套交付清单：需求说明、输入资料、工作流截图、结果样品、测试记录和报价/复盘。</p>
            </div>
            <div className="practice-kit__items">
              {["一页服务说明", "一个可演示原型", "三位用户反馈", "一次交付复盘"].map((item, i) => <span key={item}><b>{String(i + 1).padStart(2, "0")}</b>{item}</span>)}
            </div>
          </section>
        </>
      )}
      {tab === "技能认证" && (
        <section className="cert-panel">
          <div>
            <span className="eyebrow">SKILL VERIFICATION</span>
            <h2>把成果变成可被信任的能力标签</h2>
            <p>
              提交一次真实交付作品和复盘，即可进入人工审核队列。认证不代表平台背书或收入承诺。
            </p>
          </div>
          <button className="primary-btn" onClick={() => setCertified(true)}>
            {certified ? "认证申请已保存" : "提交认证申请"}
          </button>
        </section>
      )}
      {tab === "学习路线" && (
        <>
          <div className="learning-layout">
            <aside className="skill-summary">
              <span className="eyebrow">YOUR PROFILE</span>
              <b>72</b>
              <p>当前技能分</p>
              <div>
                <i style={{ width: "72%" }} />
              </div>
              <small>完成下一节可提升 4 分</small>
            </aside>
            <div className="course-list">
              {courses.map((x) => (
                <article key={x.t}>
                  <div className="course-icon">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3>{x.t}</h3>
                    <p>{x.d}</p>
                    <div className="progress">
                      <i style={{ width: `${x.p}%` }} />
                    </div>
                  </div>
                  <span>{x.n}</span>
                  <button className="secondary-btn" onClick={() => setSelected(x)}>继续学习</button>
                </article>
              ))}
            </div>
          </div>
          <section className="tutorial-hub" aria-label="推荐学习教程">
            <div className="tutorial-hub__head">
              <div>
                <span className="eyebrow">CURATED TUTORIALS</span>
                <h2>从工具学习，到一次真实交付</h2>
                <p>优先选一门工具课程完成可演示作品，再进入项目验证。外部链接将在新窗口打开。</p>
              </div>
              <a className="secondary-btn" href="https://github.com/awesome-selfhosted/awesome-selfhosted" target="_blank" rel="noreferrer">免费工具目录</a>
            </div>
            <div className="tutorial-filters" aria-label="教程工具分类">
              {tutorialFilters.map((item) => (
                <button key={item} className={tutorialFilter === item ? "active" : ""} onClick={() => setTutorialFilter(item)}>{item}</button>
              ))}
            </div>
            <div className="tutorial-grid">
              {visibleTutorials.map((item) => {
                const cover = tutorialCovers[item.tone] || tutorialCovers.opc;
                return <article className={`tutorial-card tutorial-card--${item.tone}`} key={`${item.tool}-${item.title}`}>
                  <div className="tutorial-cover"><img src={cover.src} alt={cover.alt} /><span>{item.tool}</span><i>{item.level}</i></div>
                  <div className="tutorial-card__body">
                    <span>{item.source}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <a href={item.link} target="_blank" rel="noreferrer">开始学习 <span aria-hidden="true">↗</span></a>
                  </div>
                </article>;
              })}
            </div>
            <p className="tutorial-note">课程链接来自官方文档、官方课程页或哔哩哔哩对应关键词检索页；视频时效与内容质量请以发布者页面为准。</p>
          </section>
        </>
      )}
    </>
  );
}
function ProjectsPage() {
  const [mode, setMode] = useState("推荐");
  const [published, setPublished] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  if (selected)
    return (
      <DetailShell
        back={() => setSelected(null)}
        eyebrow="PROJECT BRIEF"
        title={selected.title}
        image="./assets/images/project.webp"
        meta={`${selected.tag} · ${selected.budget} · ${selected.fit}% 匹配`}
      >
        <div className="detail-grid">
          <section>
            <h2>项目目标</h2>
            <p>{selected.desc}</p>
            <h2>交付范围</h2>
            <div className="detail-features">
              {[
                "需求与成功指标确认",
                "核心方案和执行计划",
                "可运行的首版成果",
                "交付文档与一次复盘",
              ].map((x) => (
                <div key={x}>
                  <Check size={15} />
                  {x}
                </div>
              ))}
            </div>
          </section>
          <aside>
            <h3>合作信息</h3>
            <p>
              预计周期：2–4 周<br />
              协作方式：远程优先
              <br />
              验收方式：里程碑交付
            </p>
            <button className="primary-btn">申请合作</button>
            <small>提交前请完善个人能力画像。</small>
          </aside>
        </div>
      </DetailShell>
    );
  return (
    <>
      <PageHeader
        eyebrow="OPPORTUNITY EXCHANGE"
        title="让能力进入真实项目。"
        desc="按匹配度、预算与协作方式找到下一次交付。"
        action={
          <button className="primary-btn" onClick={() => setDraft(true)}>
            发布项目
          </button>
        }
      />
      {draft && (
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            setDraft(false);
            setPublished(true);
          }}
        >
          <h2>发布项目需求</h2>
          <label>
            项目名称
            <input required placeholder="例如：AI 内容生产流程搭建" />
          </label>
          <label>
            预算范围
            <select defaultValue="">
              <option value="" disabled>
                请选择预算
              </option>
              <option>¥3k 以下</option>
              <option>¥3k–10k</option>
              <option>¥10k–30k</option>
              <option>结果分成</option>
            </select>
          </label>
          <label className="wide">
            目标与验收
            <textarea
              required
              placeholder="描述需要解决的问题、交付物和验收方式"
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setDraft(false)}
            >
              取消
            </button>
            <button className="primary-btn">保存项目草稿</button>
          </div>
        </form>
      )}
      {published && (
        <div className="notice-success">
          <Check size={16} />
          项目草稿已创建，请完善需求、预算和验收标准。
        </div>
      )}
      <div className="tabs">
        {["推荐", "最新", "远程协作", "结果分成"].map((x) => (
          <button
            className={mode === x ? "active" : ""}
            onClick={() => setMode(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="project-list">
        {projectData.map((x) => (
          <article key={x.title}>
            <div className="match">
              <b>{x.fit}</b>
              <span>匹配度</span>
            </div>
            <div>
              <span className="project-tag">{x.tag}</span>
              <h3>{x.title}</h3>
              <p>{x.desc}</p>
            </div>
            <strong>{x.budget}</strong>
            <button className="secondary-btn" onClick={() => setSelected(x)}>
              查看详情
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function CommunityPage() {
  const [tab, setTab] = useState("创业广场");
  const [selected, setSelected] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [posted, setPosted] = useState(false);
  if (selected)
    return (
      <DetailShell
        back={() => setSelected(null)}
        eyebrow="FOUNDER STORY"
        title={selected}
        image="./assets/images/workspace.webp"
        meta="创业者实践记录 · 公开交流"
      >
        <div className="article-detail">
          <p className="lead">
            从一个小而明确的交付开始，比先搭建庞大的商业计划更容易获得真实反馈。
          </p>
          <h2>这次实践做了什么</h2>
          <p>
            先把目标缩小到七天内可以验证的结果，再找三位潜在用户访谈。根据问题频率整理一个最小服务包，并用一页介绍说明交付内容、周期和价格。
          </p>
          <h2>过程中踩过的坑</h2>
          <p>
            最初的方案包含太多功能，用户无法快速理解价值。删掉非核心内容后，沟通时间缩短，也更容易获得明确反馈。
          </p>
          <h2>下一步计划</h2>
          <p>
            继续完成三次真实交付，把重复动作整理为模板，再决定是否扩展产品能力。
          </p>
          <div className="article-actions">
            <button className="secondary-btn">收藏</button>
            <button className="primary-btn">参与讨论</button>
          </div>
        </div>
      </DetailShell>
    );
  return (
    <>
      <PageHeader
        eyebrow="FOUNDER NETWORK"
        title="一个人创业，不等于独自前进。"
        desc="围绕真实行动交流经验、展示项目并连接城市同行者。"
        action={
          <button className="primary-btn" onClick={() => setComposer(true)}>
            发布动态
          </button>
        }
      />
      {composer && (
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            setComposer(false);
            setPosted(true);
          }}
        >
          <h2>发布创业动态</h2>
          <label>
            标题
            <input required placeholder="写下你正在验证的方向" />
          </label>
          <label className="wide">
            内容
            <textarea required placeholder="分享过程、问题和需要的协作支持" />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setComposer(false)}
            >
              取消
            </button>
            <button className="primary-btn">发布到创业广场</button>
          </div>
        </form>
      )}
      {posted && (
        <div className="notice-success">
          <Check size={16} />
          动态已发布到你的本地演示工作台。
        </div>
      )}
      <div className="tabs">
        {["创业广场", "项目展示", "资源交流", "城市圈"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="feed-layout">
        <div className="feed">
          {[
            "如何用 7 天验证一个 AI 服务方向？",
            "分享我的第一个 OPC 报价模板",
            "深圳 AI 创业者本周四线下共创",
          ].map((x, i) => (
            <article key={x}>
              <div className="feed-avatar">{["林", "周", "顾"][i]}</div>
              <div>
                <small>
                  {["林一 · 杭州", "周禾 · 上海", "顾南 · 深圳"][i]} · {i + 1}{" "}
                  小时前
                </small>
                <h3>
                  <button className="feed-title" onClick={() => setSelected(x)}>
                    {x}
                  </button>
                </h3>
                <p>记录实际执行过程、踩坑与下一步计划，欢迎同行者一起补充。</p>
                <div>
                  <span>
                    <MessageSquare size={14} /> {12 + i * 8}
                  </span>
                  <button>收藏</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="city-panel">
          <span className="eyebrow">ACTIVE CITIES</span>
          <h3>城市活跃榜</h3>
          {[
            ["深圳", 132],
            ["杭州", 118],
            ["上海", 96],
            ["成都", 74],
          ].map(([c, n]) => (
            <div key={c}>
              <span>{c}</span>
              <b>{n}</b>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
function AssistantPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, text]);
    setText("");
  };
  return (
    <div className="assistant-page">
      <PageHeader
        eyebrow="OPC COPILOT"
        title="把模糊问题，拆成下一步。"
        desc="AI 会结合资源、技能与项目数据给出建议，但最终决策由你完成。"
      />
      <div className="chat-shell">
        <aside>
          <span className="eyebrow">QUICK PROMPTS</span>
          {[
            "帮我拆解一个创业想法",
            "推荐适合我的技能路线",
            "找到深圳的创业资源",
            "评估一个项目需求",
          ].map((x) => (
            <button key={x} onClick={() => setText(x)}>
              {x}
              <ArrowRight size={14} />
            </button>
          ))}
        </aside>
        <main>
          <div className="messages">
            <div className="ai-message">
              <Bot size={17} />
              <div>
                <b>OPC Copilot</b>
                <p>
                  告诉我你的目标、所在城市或当前卡点，我会先帮你明确下一步。
                </p>
              </div>
            </div>
            {messages.map((m, i) => (
              <div key={i}>
                <div className="user-message">{m}</div>
                <div className="ai-message">
                  <Sparkles size={17} />
                  <div>
                    <b>建议路径</b>
                    <p>
                      先定义可验证结果，再补齐关键技能，并从一个小项目开始。已为你关联
                      3 条资源。
                    </p>
                    <div className="ai-actions">
                      <button onClick={() => setSaved(true)}>
                        保存为行动计划
                      </button>
                      <button
                        onClick={() => setText("推荐与这个问题有关的本地资源")}
                      >
                        继续追问
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              aria-label="询问 AI 助手"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入你的问题..."
            />
            <button className="primary-btn" aria-label="发送" onClick={send}>
              <Send size={16} />
            </button>
          </div>
        </main>
      </div>
      {saved && (
        <div className="notice-success">
          <Check size={16} />
          行动计划已保存到“我的 OPC”。
        </div>
      )}
    </div>
  );
}
function ProfilePage({
  user,
  login,
}: {
  user: User | null;
  login: () => void;
}) {
  const [tab, setTab] = useState("概览");
  const [editing, setEditing] = useState(false);
  if (!user)
    return (
      <div className="locked-state">
        <div>
          <CircleUserRound size={32} />
        </div>
        <h1>登录后进入你的 OPC 工作台</h1>
        <p>保存路径、学习进度、项目收藏和行动记录。</p>
        <button className="primary-btn" onClick={login}>
          登录工作台
        </button>
      </div>
    );
  return (
    <>
      <PageHeader
        eyebrow="MY OPC"
        title={`${user.name}的创业控制台`}
        desc={`${user.email} · 当前阶段：验证期`}
      />
      <div className="tabs">
        {["概览", "能力画像", "收藏", "账户设置"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "收藏" && (
        <section className="library-grid">
          {["AI原点社区", "AI 内容工厂 MVP", "AI 工具实战"].map((x, i) => (
            <article key={x}>
              <span>已收藏 {String(i + 1).padStart(2, "0")}</span>
              <h3>{x}</h3>
              <p>可从对应模块继续查看详情和下一步操作。</p>
              <button className="secondary-btn">查看详情</button>
            </article>
          ))}
        </section>
      )}
      {tab === "账户设置" && (
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);
          }}
        >
          <h2>账户与隐私设置</h2>
          <label>
            显示名称
            <input defaultValue={user?.name} />
          </label>
          <label>
            默认城市
            <select defaultValue="北京">
              <option>北京</option>
              <option>杭州</option>
              <option>成都</option>
              <option>武汉</option>
              <option>深圳</option>
            </select>
          </label>
          <label className="wide">
            通知偏好
            <select defaultValue="站内通知">
              <option>站内通知</option>
              <option>邮件与站内通知</option>
              <option>关闭非必要通知</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-btn">保存设置</button>
          </div>
        </form>
      )}
      {tab === "能力画像" && (
        <section className="cert-panel">
          <div>
            <span className="eyebrow">CAPABILITY PROFILE</span>
            <h2>让匹配结果更贴近你的真实能力</h2>
            <p>
              补充擅长领域、可投入时间和期望合作方式后，系统会据此调整项目与资源推荐。
            </p>
          </div>
          <button className="primary-btn" onClick={() => setEditing(true)}>
            编辑能力画像
          </button>
          {editing && (
            <div className="notice-success">
              <Check size={16} />
              编辑模式已开启，请在下一版填写完整能力标签。
            </div>
          )}
        </section>
      )}
      {tab === "概览" && (
        <div className="profile-layout">
          <section className="profile-card">
            <div className="big-avatar">{user.name[0]}</div>
            <h2>{user.name}</h2>
            <p>AI 内容与自动化服务</p>
            <div className="tags">
              <span>内容策略</span>
              <span>AI 工具</span>
              <span>增长实验</span>
            </div>
            <button className="secondary-btn">编辑能力画像</button>
          </section>
          <section className="profile-main">
            <div className="metric-row">
              <div>
                <span>技能分</span>
                <b>72</b>
              </div>
              <div>
                <span>项目收藏</span>
                <b>06</b>
              </div>
              <div>
                <span>连续行动</span>
                <b>3 天</b>
              </div>
            </div>
            <div className="work-panel">
              <div className="panel-title">
                <h2>本周行动计划</h2>
                <span className="count">4 / 7</span>
              </div>
              {[
                "完成服务介绍页",
                "联系两个项目发起人",
                "学习 AI 工具实战",
                "发布一次项目复盘",
              ].map((x, i) => (
                <label className="task" key={x}>
                  <input type="checkbox" defaultChecked={i < 2} />
                  <span>{x}</span>
                  <small>周{i + 2}</small>
                </label>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const [mobile, setMobile] = useState(false);
  const [auth, setAuth] = useState<"login" | "register" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState(false);
  const [showMarketing, setShowMarketing] = useState(true);
  useEffect(() => {
    const s = localStorage.getItem("opc_session");
    if (s) setUser(JSON.parse(s));
  }, []);
  const complete = (u: User) => {
    setUser(u);
    localStorage.setItem("opc_session", JSON.stringify(u));
    setAuth(null);
  };
  const logout = () => {
    setUser(null);
    setAccount(false);
    localStorage.removeItem("opc_session");
  };
  const change = (id: PageId) => {
    setPage(id);
    setMobile(false);
    setShowMarketing(false);
    scrollTo({ top: 0 });
  };
  return (
    <div className="product-app">
      {showMarketing && (
        <MarketingHero
          openApp={() => {
            setShowMarketing(false);
            setPage("home");
          }}
        />
      )}
      <header className="product-nav">
        <button className="product-logo" onClick={() => change("home")}>
          <BrandMark small />
          <span className="brand-word">
            <b>AI OPC ONE</b>
            <small>aiopcone.com</small>
          </span>
        </button>
        <nav>
          {nav.map((n) => (
            <button
              className={page === n.id ? "active" : ""}
              onClick={() => change(n.id)}
              key={n.id}
            >
              <n.icon size={15} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="mobile-trigger"
            aria-label="打开导航"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
          {user ? (
            <div className="account-wrap">
              <button className="user-btn" onClick={() => setAccount(!account)}>
                <span>{user.name[0]}</span>
                {user.name}
                <ChevronDown size={13} />
              </button>
              {account && (
                <div className="account-menu">
                  <small>{user.email}</small>
                  <button onClick={() => change("profile")}>进入工作台</button>
                  <button onClick={logout}>
                    <LogOut size={14} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="login-nav" onClick={() => setAuth("login")}>
                登录
              </button>
              <button
                className="register-nav"
                onClick={() => setAuth("register")}
              >
                注册
              </button>
            </>
          )}
        </div>
      </header>
      {mobile && (
        <div className="mobile-menu">
          {nav.map((n) => (
            <button onClick={() => change(n.id)} key={n.id}>
              <n.icon size={17} />
              {n.label}
            </button>
          ))}
        </div>
      )}
      {auth && (
        <AuthModal
          mode={auth}
          setMode={setAuth}
          close={() => setAuth(null)}
          success={complete}
        />
      )}
      <div className="page-shell">
        <AnimatePresence mode="wait">
          <motion.main
            className="page-content"
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {page === "home" && <Dashboard setPage={change} />}{" "}
            {page === "resources" && <ResourcesPage />}
            {page === "learn" && <LearnPage />}
            {page === "tools" && <AiToolsPage />}
            {page === "projects" && <ProjectsPage />}
            {page === "community" && <CommunityPage />}
            {page === "assistant" && <AssistantPage />}
            {page === "profile" && (
              <ProfilePage user={user} login={() => setAuth("login")} />
            )}
          </motion.main>
        </AnimatePresence>
      </div>
      <footer className="product-footer">
        <b>AI OPC ONE · aiopcone.com</b>
        <span>资源 · 技能 · 项目 · 创业者网络</span>
        <small>本地产品原型</small>
      </footer>
    </div>
  );
}
