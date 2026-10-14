import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

type Navigate = (page: 'home'|'opcnews'|'resources'|'learn'|'tools'|'projects'|'talent'|'community'|'assistant'|'profile') => void;

const banners = [
  { src: new URL('../../assets/img/opcchinabanner1.png', import.meta.url).href, alt: 'OPC中国：赋能一人公司生态' },
  { src: new URL('../../assets/img/opcchinabanner2.png', import.meta.url).href, alt: 'OPC中国：一人公司生态' },
  { src: new URL('../../assets/img/opcchinabanner3.png', import.meta.url).href, alt: 'OPC中国：一人公司创业' },
];

const topics = [
  { title: 'OPC 政策合集', src: new URL('../../assets/img/OPCzhengfuzhengce.png', import.meta.url).href, alt: 'OPC 政府政策咨询合集' },
  { title: 'OPC 专访合集', src: new URL('../../assets/img/OPCzhuanfangheji.png', import.meta.url).href, alt: 'OPC 创业者专访合集' },
];

const skills = [
  { name: '即梦 AI', src: new URL('../../assets/img/jimengaibg2.png', import.meta.url).href },
  { name: 'Claude', src: new URL('../../assets/img/claudebg.png', import.meta.url).href },
  { name: 'Gemini', src: new URL('../../assets/img/geminibg.png', import.meta.url).href },
  { name: 'ChatGPT', src: new URL('../../assets/img/chatgptbackgrpud.png', import.meta.url).href },
];

const articles = [
  { title: 'Watch Skill 使用教程：让 Codex 看懂视频和录屏', desc: '把视频、录屏或浏览器画面处理成带时间点的证据，保留关键画面、时间线、OCR 与可搜索内容。', date: '2026年8月19日', views: '585', image: '2026081903254550-480x300.png' },
  { title: 'Skill Deck 使用教程：把散落的 AI 技能集中管理', desc: '将 Codex、Claude、Cursor 等工具目录中的技能整理成可搜索、筛选和检查的目录。', date: '2026年8月19日', views: '269', image: '2026081903144032-480x300.png' },
  { title: 'Repomix 使用教程：把代码仓库打包成 AI 能读懂的一个文件', desc: '将代码仓库整理为适合 AI 阅读的上下文，支持文件筛选、压缩、配置和安全检查。', date: '2026年8月18日', views: '272', image: '2026081807132089-480x300.png' },
  { title: 'OpenMagic 使用教程：直接选中网页，让 AI 修改源码', desc: '直接选中网页中的标题、按钮和卡片等元素，用文字说明修改目标，缩短界面沟通路径。', date: '2026年8月18日', views: '256', image: '2026081802174077-480x300.png' },
  { title: 'Plannotator 使用教程：在 Codex 执行前，先把计划审清楚', desc: '在本地浏览器审阅计划，逐段批注、退回修改，确认范围和验收要求后再执行。', date: '2026年8月17日', views: '367', image: '2026081706130074-480x300.png' },
  { title: 'BrowserSkill 使用教程：让 Codex 操作已登录的真实浏览器', desc: '让 Codex 在独立浏览器窗口中完成浏览、点击、输入和测试，不影响当前工作。', date: '2026年8月17日', views: '668', image: '2026081703384198-480x300.png' },
].map((article, index) => ({
  ...article,
  src: [
    new URL('../../assets/img/2026081903254550-480x300.png', import.meta.url).href,
    new URL('../../assets/img/2026081903144032-480x300.png', import.meta.url).href,
    new URL('../../assets/img/2026081807132089-480x300.png', import.meta.url).href,
    new URL('../../assets/img/2026081802174077-480x300.png', import.meta.url).href,
    new URL('../../assets/img/2026081706130074-480x300.png', import.meta.url).href,
    new URL('../../assets/img/2026081703384198-480x300.png', import.meta.url).href,
  ][index],
}));

const news = [
  ['2026年6月14日', '首届“创梦杯”OPC创新创业大赛颁奖，特等奖10万元。'],
  ['2026年6月13日', '网审结果公示，60个项目晋级线下路演。'],
  ['2026年6月10日', '浙江财经大学授牌实践教学基地。'],
  ['2026年6月10日', '湖北师范大学莅临考察，共建OPC产业学院。'],
];

const popular = [
  ['2026年5月6日', '图解《宁波市人民政府办公厅关于支持人工智能OPC创新创业发展的若干意见》'],
  ['2026年6月13日', '首届“创梦杯”OPC创新创业大赛网审结果公示'],
  ['2026年4月20日', '宁波发布“人工智能OPC”征集令'],
  ['2026年5月20日', '《海南省支持人工智能OPC创新发展的若干措施》发布'],
  ['2026年3月11日', '上城召开打造“OPC创业第一城”新闻发布会'],
];

const schools = ['辽宁石油化工大学', '海南师范大学', '重庆工程学院', '重庆电子科技职业大学', '成都银杏酒店管理学院', '成都理工大学', '成都锦城学院'];
const aiBrands = ['DeepSeek', '讯飞星火', '文心', '腾讯元宝', '通义千问', '即梦 AI', '火山引擎'];

export default function HomePage({ navigate }: { navigate: Navigate; register: () => void }) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);

  useEffect(() => {
    if (paused || interactionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActiveBanner((index) => (index + 1) % banners.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, interactionPaused]);

  const moveBanner = (offset: number) => setActiveBanner((index) => (index + offset + banners.length) % banners.length);

  return <div className="opc-original-home">
    <h1 className="opc-home-sr-only">AI OPC ONE｜一人公司 · AI 成长社区</h1>

    <section className="opc-home-visuals" aria-label="OPC中国首页专题">
      <div
        className="opc-home-carousel"
        onPointerEnter={() => setInteractionPaused(true)}
        onPointerLeave={() => setInteractionPaused(false)}
        onFocusCapture={() => setInteractionPaused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false); }}
        aria-roledescription="轮播图"
        aria-label="OPC中国专题图片"
      >
        <button className="opc-home-carousel__image" type="button" onClick={() => navigate('opcnews')} aria-label={`查看：${banners[activeBanner].alt}`}>
          <img src={banners[activeBanner].src} alt={banners[activeBanner].alt} fetchPriority="high" decoding="async" />
        </button>
        <button className="opc-home-carousel__arrow opc-home-carousel__arrow--prev" type="button" aria-label="上一张专题图片" onClick={() => moveBanner(-1)}><ChevronLeft size={20} /></button>
        <button className="opc-home-carousel__arrow opc-home-carousel__arrow--next" type="button" aria-label="下一张专题图片" onClick={() => moveBanner(1)}><ChevronRight size={20} /></button>
        <div className="opc-home-carousel__controls" aria-label="轮播控制">
          <div className="opc-home-carousel__dots">
            {banners.map((banner, index) => <button key={banner.src} type="button" aria-label={`显示第 ${index + 1} 张专题图片`} aria-current={activeBanner === index ? 'true' : undefined} onClick={() => setActiveBanner(index)} />)}
          </div>
          <button className="opc-home-carousel__pause" type="button" aria-label={paused ? '继续自动轮播' : '暂停自动轮播'} onClick={() => { setPaused((value) => !value); setInteractionPaused(false); }}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
        </div>
      </div>
      <div className="opc-home-topic-tiles">
        {topics.map((topic) => <button className="opc-home-topic-tile" type="button" key={topic.title} onClick={() => navigate('opcnews')} aria-label={`查看${topic.title}`}>
          <img src={topic.src} alt={topic.alt} loading="lazy" decoding="async" />
          <span>{topic.title}<ArrowRight size={15} /></span>
        </button>)}
      </div>
    </section>

    <section className="opc-home-section opc-home-skills" aria-labelledby="opc-home-skills-title">
      <div className="opc-home-section__heading">
        <div><span>AI SKILLS</span><h2 id="opc-home-skills-title">Skills 专题</h2><p>聚焦 AIGC 与 AI 智能体实战，打造“智能体 + 技能”核心生产力。</p></div>
        <button type="button" onClick={() => navigate('learn')}>更多专题 <ArrowRight size={15} /></button>
      </div>
      <div className="opc-home-skill-grid">
        {skills.map((skill) => <button className="opc-home-skill-card" type="button" key={skill.name} onClick={() => navigate('learn')}>
          <img src={skill.src} alt={`${skill.name} 技能专题`} loading="lazy" decoding="async" />
          <span>{skill.name}<ArrowRight size={14} /></span>
        </button>)}
      </div>
    </section>

    <section className="opc-home-section opc-home-editorial" aria-label="原网页文章与快讯">
      <div className="opc-home-articles">
        <div className="opc-home-section__heading">
          <div><span>ORIGINAL ARTICLES</span><h2>最新文章</h2><p>原网页精选教程与 AI 实践</p></div>
          <button type="button" onClick={() => navigate('opcnews')}>更多文章 <ArrowRight size={15} /></button>
        </div>
        <div className="opc-home-article-list">
          {articles.map((article) => <button className="opc-home-article" type="button" key={article.title} onClick={() => navigate('opcnews')}>
            <img src={article.src} alt={article.title} loading="lazy" decoding="async" />
            <span className="opc-home-article__copy"><small>SKILLS 专题 <i>·</i> {article.date}</small><b>{article.title}</b><span>{article.desc}</span><small className="opc-home-article__views">浏览 {article.views}</small></span>
          </button>)}
        </div>
      </div>

      <aside className="opc-home-sidebar">
        <section className="opc-home-feed" aria-labelledby="opc-home-news-title">
          <div className="opc-home-section__heading"><div><span>OPC NEWS</span><h2 id="opc-home-news-title">快讯</h2></div><button type="button" onClick={() => navigate('opcnews')}>更多 <ArrowRight size={14} /></button></div>
          <div className="opc-home-news-list">
            {news.map(([date, title]) => <button type="button" key={title} onClick={() => navigate('opcnews')}><time>{date}</time><b>{title}</b><ArrowRight size={14} /></button>)}
          </div>
        </section>
        <section className="opc-home-feed opc-home-popular" aria-labelledby="opc-home-popular-title">
          <div className="opc-home-section__heading"><div><span>POLICY & TOPICS</span><h2 id="opc-home-popular-title">热门内容</h2></div><button type="button" onClick={() => navigate('opcnews')}>全部 <ArrowRight size={14} /></button></div>
          <div className="opc-home-popular-list">
            {popular.map(([date, title], index) => <button type="button" key={title} onClick={() => navigate('opcnews')}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><small>{date}</small></button>)}
          </div>
        </section>
      </aside>
    </section>

    <section className="opc-home-section opc-home-partners" aria-labelledby="opc-home-partners-title">
      <div className="opc-home-section__heading"><div><span>PUBLICLY LISTED ON THE ORIGINAL PAGE</span><h2 id="opc-home-partners-title">原网页列出的高校与 AI 工具</h2><p>下列名称来自原首页公开展示，仅作信息收录，不代表当前合作关系或官方背书。</p></div></div>
      <div className="opc-home-name-groups"><div><span>高校</span><div>{schools.map((name) => <span key={name}>{name}</span>)}</div></div><div><span>AI 工具与平台</span><div>{aiBrands.map((name) => <span key={name}>{name}</span>)}</div></div></div>
      <p className="opc-home-source-note">政策、赛事与项目时间信息按原网页内容整理，可能发生变化；资格条件和最新进展请以主管部门公告及活动主办方原文为准。</p>
    </section>
  </div>;
}
