(function () {
  "use strict";

  const STORAGE_KEYS = {
    geo: "zhiliutai.geo.v1",
    brief: "zhiliutai.brief.v1",
    tasks: "zhiliutai.tasks.v1",
    favorites: "zhiliutai.ecosystem.favorites.v1",
    leads: "zhiliutai.ecosystem.leads.v1"
  };

  const allowedViews = new Set(["dashboard", "geo", "learning", "brief", "tasks", "assets", "ecosystem"]);
  let toastTimer = null;
  let activeCourseCategory = "all";
  let activeEcosystemTab = "policies";
  let activeDetail = null;
  let detailOpener = null;
  let leadOpener = null;

  function initializeHeroParticles() {
    const canvas = document.querySelector("#hero-particles");
    const hero = document.querySelector(".hero-command-center");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canvas || !hero || reducedMotion.matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId = 0;
    let points = [];
    let width = 0;
    let height = 0;
    const density = window.matchMedia("(max-width: 640px)").matches ? 18 : 34;

    function resize() {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      points = Array.from({ length: density }, function (_, index) {
        return {
          x: (index * 89) % width,
          y: (index * 47) % height,
          speed: 0.11 + (index % 5) * 0.025,
          size: 0.8 + (index % 3) * 0.45
        };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      points.forEach(function (point, index) {
        point.x += point.speed;
        point.y -= point.speed * 0.36;
        if (point.x > width + 4) point.x = -4;
        if (point.y < -4) point.y = height + 4;
        context.beginPath();
        context.fillStyle = index % 4 === 0 ? "rgba(255, 222, 174, 0.75)" : "rgba(255, 143, 68, 0.55)";
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });
      frameId = window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    reducedMotion.addEventListener("change", function (event) {
      if (event.matches) window.cancelAnimationFrame(frameId);
    });
  }

  function mountOpcCircle() {
    const panel = document.querySelector("#opc-circle-panel");
    const tabs = document.querySelector("#view-ecosystem .ecosystem-tabs");
    if (!panel || !tabs) return;
    tabs.parentNode.insertBefore(panel, tabs);
    panel.hidden = false;
    panel.querySelectorAll("[data-ecosystem-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        const target = button.dataset.ecosystemTab;
        const tab = document.querySelector('.ecosystem-tab[data-ecosystem-tab="' + target + '"]');
        if (tab) tab.click();
      });
    });
  }

  function readStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function readTaskIds() {
    const value = readStorage(STORAGE_KEYS.tasks, []);
    return Array.isArray(value) ? value.filter(function (item) { return typeof item === "string"; }) : [];
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function navigate(viewName, options) {
    const settings = Object.assign({ focus: true, updateHash: true }, options);
    const nextView = allowedViews.has(viewName) ? viewName : "dashboard";

    document.querySelectorAll(".view[data-view]").forEach(function (view) {
      const isCurrent = view.dataset.view === nextView;
      view.hidden = !isCurrent;
      view.classList.toggle("is-active", isCurrent);
    });

    document.querySelectorAll("[data-target]").forEach(function (control) {
      const isCurrent = control.dataset.target === nextView;
      control.classList.toggle("is-active", isCurrent && (control.classList.contains("top-nav-item") || control.classList.contains("side-nav-item")));
      if (control.classList.contains("top-nav-item") || control.classList.contains("side-nav-item")) {
        if (isCurrent) {
          control.setAttribute("aria-current", "page");
        } else {
          control.removeAttribute("aria-current");
        }
      }
    });

    const activeTopNav = document.querySelector(".top-nav-item.is-active");
    if (activeTopNav && typeof activeTopNav.scrollIntoView === "function") {
      activeTopNav.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }

    if (settings.updateHash) {
      window.history.replaceState(null, "", "#" + nextView);
    }

    document.title = getViewTitle(nextView) + "｜智流台";
    window.scrollTo({ top: 0, behavior: "auto" });
    if (settings.focus) {
      const main = document.querySelector("#main-content");
      if (main) main.focus({ preventScroll: true });
    }
  }

  function getViewTitle(viewName) {
    const titles = {
      dashboard: "工作台",
      geo: "GEO 增长",
      learning: "AI 学习圈",
      brief: "需求拆解",
      tasks: "任务大厅",
      assets: "方案资产",
      ecosystem: "创业生态"
    };
    return titles[viewName] || "工作台";
  }

  function bindNavigation() {
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-target]");
      if (!trigger || !allowedViews.has(trigger.dataset.target)) return;
      event.preventDefault();
      navigate(trigger.dataset.target);
    });

    window.addEventListener("hashchange", function () {
      const viewName = window.location.hash.slice(1);
      navigate(viewName, { focus: false, updateHash: false });
    });
  }

  function bindGlobalSearch() {
    const input = document.querySelector("#global-search");
    if (!input) return;

    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const query = input.value.trim();
      if (!query) {
        showToast("请输入课程或任务关键词");
        return;
      }

      const ecosystemMatch = findEcosystemTab(query);
      if (ecosystemMatch) {
        activeEcosystemTab = ecosystemMatch;
        const ecosystemSearch = document.querySelector("#ecosystem-search");
        if (ecosystemSearch) ecosystemSearch.value = query;
        renderEcosystem();
        navigate("ecosystem");
        showToast("已在创业生态中搜索“" + query + "”");
        return;
      }

      const courseSearch = document.querySelector("#course-search");
      if (courseSearch) {
        courseSearch.value = query;
        activeCourseCategory = "all";
        updateCourseFilters();
      }
      navigate("learning");
      showToast("已在课程目录中搜索“" + query + "”");
    });
  }

  function updateCourseFilters() {
    const search = document.querySelector("#course-search");
    const cards = Array.from(document.querySelectorAll(".course-card"));
    const query = search ? search.value.trim().toLocaleLowerCase("zh-CN") : "";
    let visibleCount = 0;

    cards.forEach(function (card) {
      const categories = (card.dataset.category || "").split(/\s+/);
      const title = (card.dataset.title || card.textContent || "").toLocaleLowerCase("zh-CN");
      const categoryMatches = activeCourseCategory === "all" || categories.includes(activeCourseCategory);
      const textMatches = !query || title.includes(query);
      const shouldShow = categoryMatches && textMatches;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    document.querySelectorAll(".filter-button").forEach(function (button) {
      const isActive = button.dataset.category === activeCourseCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    const count = document.querySelector("#course-count");
    const empty = document.querySelector("#course-empty");
    if (count) count.textContent = "显示 " + visibleCount + " 门课程";
    if (empty) empty.hidden = visibleCount !== 0;
  }

  function bindCourseFilters() {
    const search = document.querySelector("#course-search");
    if (search) search.addEventListener("input", updateCourseFilters);

    document.querySelectorAll(".filter-button").forEach(function (button) {
      button.addEventListener("click", function () {
        activeCourseCategory = button.dataset.category || "all";
        updateCourseFilters();
      });
    });

    document.querySelectorAll(".course-detail").forEach(function (button) {
      button.addEventListener("click", function () {
        const course = getCourseResource(button.dataset.course || "");
        if (course) openResourceDetail(course, button);
      });
    });
  }

  function textHash(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 997;
    }
    return hash;
  }

  function calculateGeoResult(value, mode) {
    const lengthScore = Math.min(16, Math.floor(value.length / 45));
    const structureScore = /[#：:。\n]/.test(value) ? 7 : 2;
    const evidenceScore = /(数据|来源|案例|作者|日期|客户|结果)/.test(value) ? 8 : 2;
    const questionScore = /(如何|为什么|什么|FAQ|问答|？|\?)/i.test(value) ? 6 : 1;
    const urlScore = mode === "url" && /^https?:\/\//i.test(value) ? 7 : 0;
    const variation = textHash(value) % 8;
    const score = Math.max(38, Math.min(94, 42 + lengthScore + structureScore + evidenceScore + questionScore + urlScore + variation));

    let grade = "基础待补齐";
    if (score >= 82) grade = "引用准备度较高";
    else if (score >= 68) grade = "已有基础，优先补证据";
    else if (score >= 54) grade = "结构可用，仍需改造";

    const summary = mode === "url"
      ? "当前网址具备基础可抓取条件，建议优先补齐页面摘要、问答结构与可验证来源。"
      : "当前内容能够表达主题，但需要把关键结论独立成句，并增加来源和实体信息。";

    return {
      score: score,
      grade: grade,
      summary: summary,
      recommendations: [
        { title: "识别 AI 引用模式", detail: "抽样检查同类问题在主流 AI 答案中的来源结构，记录常被引用的定义、步骤和数据类型。" },
        { title: "内容结构化改造", detail: "增加一句话摘要、二级标题、步骤清单和 3–5 个真实 FAQ，让每个答案可独立阅读。" },
        { title: "权威性增强", detail: "补齐作者身份、更新时间、数据来源、案例范围与验证方式，避免无来源的绝对化结论。" },
        { title: "语义清晰度优化", detail: "统一核心实体名称，减少“它、这个、相关”等模糊指代，并补充用户真实问题的同义表达。" }
      ]
    };
  }

  function appendRecommendationList(container, recommendations) {
    const fragment = document.createDocumentFragment();
    recommendations.forEach(function (item) {
      const li = document.createElement("li");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      const detail = document.createElement("span");
      title.textContent = item.title;
      detail.textContent = item.detail;
      body.append(title, detail);
      li.append(body);
      fragment.append(li);
    });
    container.replaceChildren(fragment);
  }

  function renderGeoResult(saved) {
    const result = document.querySelector("#geo-result");
    const score = document.querySelector("#geo-score");
    const grade = document.querySelector("#geo-grade");
    const summary = document.querySelector("#geo-summary");
    const list = document.querySelector("#geo-recommendations");
    if (!result || !score || !grade || !summary || !list) return;

    const numericScore = Math.max(0, Math.min(100, Number(saved.result.score) || 0));
    const recommendations = Array.isArray(saved.result.recommendations) ? saved.result.recommendations : [];
    score.textContent = String(numericScore);
    score.style.setProperty("--score", numericScore + "%");
    score.setAttribute("aria-label", "诊断评分 " + numericScore + " 分");
    grade.textContent = saved.result.grade;
    summary.textContent = saved.result.summary;
    appendRecommendationList(list, recommendations);
    result.hidden = false;
  }

  function bindGeoForm() {
    const form = document.querySelector("#geo-form");
    const input = document.querySelector("#geo-input");
    const error = document.querySelector("#geo-error");
    const count = document.querySelector("#geo-count");
    if (!form || !input || !error || !count) return;

    function updateCount() {
      if (input.value.length > 1200) input.value = input.value.slice(0, 1200);
      count.textContent = input.value.length + " / 1200";
    }

    input.addEventListener("input", function () {
      updateCount();
      if (input.value.trim()) {
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    });

    form.querySelectorAll("input[name='geo-mode']").forEach(function (radio) {
      radio.addEventListener("change", function () {
        input.placeholder = radio.value === "url"
          ? "例如：https://example.com/services"
          : "粘贴需要检查的文章、产品介绍或 FAQ 内容";
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();
      const modeInput = form.querySelector("input[name='geo-mode']:checked");
      const mode = modeInput ? modeInput.value : "url";

      if (!value) {
        error.textContent = "请先输入网址或需要诊断的内容。";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      input.removeAttribute("aria-invalid");
      error.textContent = "";
      const saved = { value: value, mode: mode, result: calculateGeoResult(value, mode), updatedAt: new Date().toISOString() };
      const persisted = writeStorage(STORAGE_KEYS.geo, saved);
      renderGeoResult(saved);
      showToast(persisted ? "GEO 诊断已生成并保存在当前浏览器" : "GEO 诊断已生成，但当前浏览器禁止本地保存");
    });

    const saved = readStorage(STORAGE_KEYS.geo, null);
    if (saved && saved.value && saved.result && Number.isFinite(Number(saved.result.score)) && Array.isArray(saved.result.recommendations)) {
      input.value = String(saved.value).slice(0, 1200);
      const modeRadio = form.querySelector("input[name='geo-mode'][value='" + (saved.mode === "content" ? "content" : "url") + "']");
      if (modeRadio) modeRadio.checked = true;
      updateCount();
      renderGeoResult(saved);
    } else {
      updateCount();
    }
  }

  function createListItems(container, values, ordered) {
    const fragment = document.createDocumentFragment();
    values.forEach(function (value) {
      const item = document.createElement("li");
      item.textContent = value;
      fragment.append(item);
    });
    container.replaceChildren(fragment);
    if (ordered) container.setAttribute("data-count", String(values.length));
  }

  function createSkillTags(container, values) {
    const fragment = document.createDocumentFragment();
    values.forEach(function (value) {
      const tag = document.createElement("span");
      tag.textContent = value;
      fragment.append(tag);
    });
    container.replaceChildren(fragment);
  }

  function generateBrief(value) {
    const isGeo = /(GEO|官网|搜索|引用|FAQ|AI)/i.test(value);
    const isContent = /(抖音|小红书|视频号|内容|脚本|选题|文章|矩阵)/i.test(value);
    const isAnalysis = /(报表|预算|财务|账龄|经营|数据|Excel)/i.test(value);

    if (isGeo) {
      return {
        summary: "目标是提升核心页面被 AI 理解与引用的准备度，先完成基线诊断，再按结构、证据、语义三个层级改造。",
        deliverables: ["重点页面 GEO 基线诊断表", "产品页、服务页与 FAQ 改造清单", "可直接发布的结构化内容样稿", "改造前后验收与 AI 来源抽样记录"],
        skills: ["GEO 策略", "内容结构", "事实核验", "FAQ 设计"],
        milestones: ["第 1–2 天：确认页面范围与目标问题", "第 3–5 天：完成基线诊断和内容改造", "第 6–8 天：上线检查与引用抽样", "第 9–10 天：验收并沉淀复用模板"],
        estimate: "10 个工作日 · ¥4,000–8,000"
      };
    }

    if (isContent) {
      return {
        summary: "目标是把现有素材转为分平台内容矩阵，统一主题但保留抖音、小红书、视频号各自的表达和转化动作。",
        deliverables: ["一周跨平台选题排期", "抖音口播脚本与首屏钩子", "小红书图文结构与标题组", "视频号脚本与私域承接动作", "发布后复盘指标表"],
        skills: ["选题策划", "短视频脚本", "平台适配", "数据复盘"],
        milestones: ["第 1 天：盘点素材与目标人群", "第 2–3 天：生成选题和三平台脚本", "第 4 天：校对合规与人设一致性", "第 5–7 天：发布、记录数据并复盘"],
        estimate: "7 个工作日 · ¥2,500–5,000"
      };
    }

    if (isAnalysis) {
      return {
        summary: "目标是把重复报表动作标准化，并将异常识别、负责人和跟进节点纳入同一套可复用流程。",
        deliverables: ["数据字段与口径说明", "自动分析模板或操作流程", "异常预警规则与负责人清单", "月度复盘页与验收样例"],
        skills: ["数据清洗", "经营分析", "流程自动化", "结果校验"],
        milestones: ["第 1–2 天：核对数据源与业务口径", "第 3–4 天：建立模板和预警规则", "第 5 天：用历史数据验证", "第 6 天：交付说明与验收"],
        estimate: "6 个工作日 · ¥3,000–6,000"
      };
    }

    return {
      summary: "需求已整理为可执行范围。建议先确认目标人群、交付渠道和验收标准，再进入任务匹配。",
      deliverables: ["需求范围与边界清单", "核心交付物初稿", "执行排期与负责人建议", "验收标准与复盘模板"],
      skills: ["需求分析", "项目管理", "内容交付", "质量验收"],
      milestones: ["阶段 1：确认目标与现有资料", "阶段 2：完成初稿并核对范围", "阶段 3：执行、校验与修改", "阶段 4：验收并沉淀方案"],
      estimate: "5–10 个工作日 · ¥2,000–6,000"
    };
  }

  function renderBriefResult(saved) {
    const result = document.querySelector("#brief-result");
    const summary = document.querySelector("#brief-summary");
    const deliverables = document.querySelector("#deliverables");
    const skills = document.querySelector("#skills");
    const milestones = document.querySelector("#milestones");
    const estimate = document.querySelector("#estimate");
    if (!result || !summary || !deliverables || !skills || !milestones || !estimate) return;

    summary.textContent = saved.result.summary;
    createListItems(deliverables, saved.result.deliverables, false);
    createSkillTags(skills, saved.result.skills);
    createListItems(milestones, saved.result.milestones, true);
    estimate.textContent = saved.result.estimate;
    result.hidden = false;
  }

  function bindBriefForm() {
    const form = document.querySelector("#brief-form");
    const input = document.querySelector("#brief-input");
    const error = document.querySelector("#brief-error");
    const count = document.querySelector("#brief-count");
    if (!form || !input || !error || !count) return;

    function updateCount() {
      if (input.value.length > 1000) input.value = input.value.slice(0, 1000);
      count.textContent = input.value.length + " / 1000";
    }

    input.addEventListener("input", function () {
      updateCount();
      if (input.value.trim()) {
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    });

    document.querySelectorAll("[data-example]").forEach(function (button) {
      button.addEventListener("click", function () {
        input.value = button.dataset.example || "";
        updateCount();
        input.focus();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) {
        error.textContent = "请先描述需要解决的问题和期望交付。";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      input.removeAttribute("aria-invalid");
      error.textContent = "";
      const saved = { value: value, result: generateBrief(value), updatedAt: new Date().toISOString() };
      const persisted = writeStorage(STORAGE_KEYS.brief, saved);
      renderBriefResult(saved);
      showToast(persisted ? "需求已拆解为本地任务卡" : "需求已拆解，但当前浏览器禁止本地保存");
    });

    const publishButton = document.querySelector("#publish-to-tasks");
    if (publishButton) {
      publishButton.addEventListener("click", function () {
        navigate("tasks");
        showToast("已进入任务大厅；演示版不会创建真实订单");
      });
    }

    const saved = readStorage(STORAGE_KEYS.brief, null);
    if (saved && saved.value && saved.result && Array.isArray(saved.result.deliverables) && Array.isArray(saved.result.skills) && Array.isArray(saved.result.milestones)) {
      input.value = String(saved.value).slice(0, 1000);
      updateCount();
      renderBriefResult(saved);
    } else {
      updateCount();
    }
  }

  function applyTaskState() {
    const takenTasks = new Set(readTaskIds());
    document.querySelectorAll(".take-task").forEach(function (button) {
      const isTaken = takenTasks.has(button.dataset.taskId);
      button.classList.toggle("is-taken", isTaken);
      button.textContent = isTaken ? "已接单 · 已加入工作台" : "接单并加入工作台";
      button.setAttribute("aria-pressed", String(isTaken));
    });
  }

  function bindTasks() {
    document.querySelectorAll(".take-task").forEach(function (button) {
      button.addEventListener("click", function () {
        const takenTasks = new Set(readTaskIds());
        const taskId = button.dataset.taskId;
        if (!taskId) return;

        if (takenTasks.has(taskId)) {
          showToast("该任务已在本地工作台中");
          return;
        }

        takenTasks.add(taskId);
        const persisted = writeStorage(STORAGE_KEYS.tasks, Array.from(takenTasks));
        if (!persisted) {
          showToast("当前浏览器禁止本地保存，接单状态未写入");
          return;
        }
        applyTaskState();
        showToast("接单状态已保存；演示版未创建真实订单");
      });
    });
    applyTaskState();
  }

  function bindAssets() {
    document.querySelectorAll(".reuse-asset").forEach(function (button) {
      button.addEventListener("click", function () {
        const assetName = button.dataset.asset || "方案";
        showToast("已把“" + assetName + "”加入本地复用清单");
      });
    });
  }

  function getDataLayer() {
    const source = window.ZHILIUTAI_DATA;
    return source && source.ecosystemData && source.ecosystemConfig ? source : null;
  }

  function makeElement(tagName, className, content) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof content === "string") element.textContent = content;
    return element;
  }

  function getFavorites() {
    const value = readStorage(STORAGE_KEYS.favorites, []);
    return Array.isArray(value) ? value.filter(function (item) { return typeof item === "string"; }) : [];
  }

  function isFavorite(id) {
    return getFavorites().includes(id);
  }

  function toggleFavorite(id) {
    if (!id) return false;
    const saved = new Set(getFavorites());
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    return writeStorage(STORAGE_KEYS.favorites, Array.from(saved));
  }

  function getCourseResource(title) {
    const data = getDataLayer();
    if (!data) return null;
    const course = data.courseDetails[title];
    if (!course) return null;

    return {
      id: "course:" + title,
      title: title,
      category: course.category,
      summary: course.summary,
      tags: [course.category, course.tool, course.difficulty],
      facts: [["工具", course.tool], ["难度", course.difficulty], ["发布日期", course.date], ["学习人数", course.students]],
      body: Array.isArray(course.body) ? course.body.map(function (item, index) { return "课程环节 " + (index + 1) + "：" + item; }) : [],
      action: "加入学习清单",
      kind: "course"
    };
  }

  function findEcosystemTab(query) {
    const data = getDataLayer();
    if (!data || !query) return null;
    const normalized = query.toLocaleLowerCase("zh-CN");
    return Object.keys(data.ecosystemData).find(function (tabName) {
      return data.ecosystemData[tabName].some(function (item) {
        return resourceText(item).includes(normalized);
      });
    }) || null;
  }

  function resourceText(item) {
    const facts = Array.isArray(item.facts) ? item.facts.map(function (fact) { return fact.join(" "); }).join(" ") : "";
    const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
    const body = Array.isArray(item.body) ? item.body.join(" ") : "";
    return [item.title, item.category, item.summary, tags, facts, body].join(" ").toLocaleLowerCase("zh-CN");
  }

  function createFactList(facts, className) {
    const list = makeElement("dl", className);
    (facts || []).forEach(function (fact) {
      const row = makeElement("div", "resource-fact");
      row.appendChild(makeElement("dt", "", fact[0]));
      row.appendChild(makeElement("dd", "", fact[1]));
      list.appendChild(row);
    });
    return list;
  }

  function createTagList(tags, className) {
    const list = makeElement("div", className || "skill-tags");
    (tags || []).forEach(function (tag) {
      list.appendChild(makeElement("span", "", tag));
    });
    return list;
  }

  function createResourceCard(item) {
    const card = makeElement("article", "ecosystem-card");
    card.dataset.resourceId = item.id;

    const head = makeElement("div", "ecosystem-card-head");
    const type = makeElement("span", "status-chip status-chip-blue", item.category);
    const favorite = makeElement("button", "icon-button resource-save", isFavorite(item.id) ? "★" : "☆");
    favorite.type = "button";
    favorite.dataset.resourceId = item.id;
    favorite.setAttribute("aria-label", (isFavorite(item.id) ? "取消收藏" : "收藏") + item.title);
    favorite.setAttribute("aria-pressed", String(isFavorite(item.id)));
    favorite.title = isFavorite(item.id) ? "取消收藏" : "收藏";
    if (isFavorite(item.id)) favorite.classList.add("is-saved");
    head.appendChild(type);
    head.appendChild(favorite);
    card.appendChild(head);

    card.appendChild(makeElement("h3", "", item.title));
    card.appendChild(makeElement("p", "", item.summary));
    card.appendChild(createFactList((item.facts || []).slice(0, 2), "resource-facts"));
    card.appendChild(createTagList((item.tags || []).slice(0, 4), "skill-tags"));

    const actions = makeElement("div", "ecosystem-card-actions");
    const detail = makeElement("button", "button button-secondary resource-detail", "查看详情");
    detail.type = "button";
    detail.dataset.resourceId = item.id;
    const action = makeElement("button", "button button-primary resource-action", item.action || "提交咨询");
    action.type = "button";
    action.dataset.resourceId = item.id;
    actions.appendChild(detail);
    actions.appendChild(action);
    card.appendChild(actions);
    return card;
  }

  function updateEcosystemChrome(data, config, visibleCount) {
    const title = document.querySelector("#ecosystem-section-title");
    const kicker = document.querySelector("#ecosystem-kicker");
    const description = document.querySelector("#ecosystem-section-description");
    const search = document.querySelector("#ecosystem-search");
    const count = document.querySelector("#ecosystem-count");
    if (title) title.textContent = config.title;
    if (kicker) kicker.textContent = config.kicker;
    if (description) description.textContent = config.description;
    if (search) search.placeholder = config.placeholder;
    if (count) count.textContent = "显示 " + visibleCount + " " + config.unit;

    document.querySelectorAll(".ecosystem-tab").forEach(function (button) {
      const isActive = button.dataset.ecosystemTab === activeEcosystemTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderEcosystem() {
    const data = getDataLayer();
    const grid = document.querySelector("#ecosystem-grid");
    const empty = document.querySelector("#ecosystem-empty");
    const communityFaq = document.querySelector("#community-faq");
    const search = document.querySelector("#ecosystem-search");
    if (!data || !grid) return;

    const config = data.ecosystemConfig[activeEcosystemTab] || data.ecosystemConfig.policies;
    const entries = data.ecosystemData[activeEcosystemTab] || [];
    const query = search ? search.value.trim().toLocaleLowerCase("zh-CN") : "";
    const visibleEntries = entries.filter(function (item) {
      return !query || resourceText(item).includes(query);
    });

    grid.replaceChildren();
    visibleEntries.forEach(function (item) {
      grid.appendChild(createResourceCard(item));
    });
    if (empty) empty.hidden = visibleEntries.length !== 0;
    if (communityFaq) communityFaq.hidden = activeEcosystemTab !== "communities";
    updateEcosystemChrome(data, config, visibleEntries.length);
  }

  function findResourceById(id) {
    const data = getDataLayer();
    if (!data || !id) return null;
    const tabName = Object.keys(data.ecosystemData).find(function (name) {
      return data.ecosystemData[name].some(function (item) { return item.id === id; });
    });
    if (!tabName) return null;
    return data.ecosystemData[tabName].find(function (item) { return item.id === id; }) || null;
  }

  function syncOverlayState() {
    const detailOpen = document.querySelector("#detail-backdrop");
    const leadOpen = document.querySelector("#lead-dialog");
    const hasOverlay = (detailOpen && !detailOpen.hidden) || (leadOpen && !leadOpen.hidden);
    document.body.classList.toggle("has-overlay", Boolean(hasOverlay));
  }

  function trapOverlayFocus(event) {
    if (event.key !== "Tab") return;
    const dialog = document.querySelector("#lead-dialog");
    const drawer = document.querySelector("#detail-backdrop");
    const container = dialog && !dialog.hidden
      ? dialog.querySelector(".lead-dialog")
      : drawer && !drawer.hidden
        ? drawer.querySelector(".detail-drawer")
        : null;
    if (!container) return;

    const focusable = Array.from(container.querySelectorAll("button:not([disabled]), input:not([type=hidden]):not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter(function (element) { return element.getClientRects().length > 0; });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function renderDetail(item) {
    const title = document.querySelector("#detail-title");
    const kicker = document.querySelector("#detail-kicker");
    const body = document.querySelector("#detail-body");
    const primary = document.querySelector("#detail-primary");
    const save = document.querySelector("#detail-save");
    if (!title || !kicker || !body || !primary || !save) return;

    title.textContent = item.title;
    kicker.textContent = item.kind === "course" ? "课程概览" : item.category;
    primary.textContent = item.action || "提交咨询";
    save.querySelector("span:last-child").textContent = isFavorite(item.id) ? "已收藏" : "收藏";
    save.classList.toggle("is-saved", isFavorite(item.id));
    save.setAttribute("aria-pressed", String(isFavorite(item.id)));

    body.replaceChildren();
    body.appendChild(makeElement("p", "detail-summary", item.summary));
    body.appendChild(createFactList(item.facts || [], "detail-facts"));
    if (item.tags && item.tags.length) {
      const tagSection = makeElement("section", "detail-section");
      tagSection.appendChild(makeElement("h3", "", "能力与标签"));
      tagSection.appendChild(createTagList(item.tags, "skill-tags"));
      body.appendChild(tagSection);
    }

    const detailSection = makeElement("section", "detail-section");
    detailSection.appendChild(makeElement("h3", "", item.kind === "course" ? "课程内容" : "资源说明"));
    if (item.body && item.body.length) {
      const list = makeElement("ol", "detail-list");
      item.body.forEach(function (paragraph) {
        list.appendChild(makeElement("li", "", paragraph));
      });
      detailSection.appendChild(list);
    } else {
      detailSection.appendChild(makeElement("p", "detail-note", "原站当前仅提供目录摘要，详细内容待后台补充；政策、价格和活动信息请以相关主体的最新正式通知为准。"));
    }
    body.appendChild(detailSection);
  }

  function openResourceDetail(item, opener) {
    const backdrop = document.querySelector("#detail-backdrop");
    const drawer = document.querySelector("#detail-drawer");
    if (!backdrop || !drawer || !item) return;
    activeDetail = item;
    detailOpener = opener || null;
    renderDetail(item);
    backdrop.hidden = false;
    syncOverlayState();
    window.setTimeout(function () {
      const closeButton = document.querySelector("#detail-close");
      (closeButton || drawer).focus();
    }, 0);
  }

  function closeResourceDetail() {
    const backdrop = document.querySelector("#detail-backdrop");
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    activeDetail = null;
    syncOverlayState();
    if (detailOpener && typeof detailOpener.focus === "function") detailOpener.focus();
  }

  function setLeadError(message) {
    const error = document.querySelector("#lead-error");
    if (error) error.textContent = message || "";
  }

  function openLeadDialog(title, source, opener) {
    const dialog = document.querySelector("#lead-dialog");
    const dialogPanel = dialog ? dialog.querySelector(".lead-dialog") : null;
    const titleNode = document.querySelector("#lead-title");
    const sourceInput = document.querySelector("#lead-source");
    const subtitle = document.querySelector("#lead-subtitle");
    if (!dialog || !dialogPanel || !titleNode || !sourceInput) return;
    leadOpener = opener || null;
    titleNode.textContent = title || "提交咨询";
    sourceInput.value = source || "创业生态";
    if (subtitle) subtitle.textContent = "填写信息后仅在本页显示成功反馈。";
    setLeadError("");
    dialog.hidden = false;
    syncOverlayState();
    window.setTimeout(function () {
      const closeButton = document.querySelector("#lead-close");
      (closeButton || dialogPanel).focus();
    }, 0);
  }

  function closeLeadDialog() {
    const dialog = document.querySelector("#lead-dialog");
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    syncOverlayState();
    if (leadOpener && typeof leadOpener.focus === "function") leadOpener.focus();
  }

  function runResourceAction(item, opener) {
    if (!item) return;
    if (item.kind === "course") {
      showToast("已把“" + item.title + "”加入本地学习清单");
      return;
    }
    const isReadOnly = (item.action || "").indexOf("查看") === 0 || (item.facts || []).some(function (fact) { return fact[0] === "状态" && (fact[1] === "已结束" || fact[1] === "已完成"); });
    if (isReadOnly) {
      showToast("该资源当前仅提供资料查看，不开放本地报名或申请");
      return;
    }
    openLeadDialog((item.action || "提交咨询") + "：" + item.title, item.title, opener);
  }

  function bindEcosystem() {
    const data = getDataLayer();
    if (!data) return;
    const grid = document.querySelector("#ecosystem-grid");
    const search = document.querySelector("#ecosystem-search");

    document.querySelectorAll(".ecosystem-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        activeEcosystemTab = button.dataset.ecosystemTab || "policies";
        if (search) search.value = "";
        renderEcosystem();
      });
    });
    if (search) search.addEventListener("input", renderEcosystem);

    if (grid) {
      grid.addEventListener("click", function (event) {
        const target = event.target.closest("[data-resource-id]");
        if (!target) return;
        const item = findResourceById(target.dataset.resourceId || "");
        if (!item) return;
        if (target.classList.contains("resource-save")) {
          const persisted = toggleFavorite(item.id);
          if (!persisted) {
            showToast("当前浏览器禁止本地保存，收藏状态未写入");
            return;
          }
          renderEcosystem();
          showToast(isFavorite(item.id) ? "已收藏“" + item.title + "”" : "已取消收藏“" + item.title + "”");
        } else if (target.classList.contains("resource-detail")) {
          openResourceDetail(item, target);
        } else if (target.classList.contains("resource-action")) {
          runResourceAction(item, target);
        }
      });
    }

    document.querySelectorAll(".open-lead").forEach(function (button) {
      button.addEventListener("click", function () {
        openLeadDialog(button.dataset.leadTitle || "平台综合咨询", button.dataset.leadSource || "创业生态", button);
      });
    });

    const detailClose = document.querySelector("#detail-close");
    const detailBackdrop = document.querySelector("#detail-backdrop");
    const detailSave = document.querySelector("#detail-save");
    const detailPrimary = document.querySelector("#detail-primary");
    if (detailClose) detailClose.addEventListener("click", closeResourceDetail);
    if (detailBackdrop) detailBackdrop.addEventListener("click", function (event) { if (event.target === detailBackdrop) closeResourceDetail(); });
    if (detailSave) detailSave.addEventListener("click", function () {
      if (!activeDetail) return;
      const persisted = toggleFavorite(activeDetail.id);
      if (!persisted) {
        showToast("当前浏览器禁止本地保存，收藏状态未写入");
        return;
      }
      renderDetail(activeDetail);
      renderEcosystem();
      showToast(isFavorite(activeDetail.id) ? "已收藏“" + activeDetail.title + "”" : "已取消收藏“" + activeDetail.title + "”");
    });
    if (detailPrimary) detailPrimary.addEventListener("click", function () { runResourceAction(activeDetail, detailPrimary); });

    const leadClose = document.querySelector("#lead-close");
    const leadDialog = document.querySelector("#lead-dialog");
    const leadForm = document.querySelector("#lead-form");
    if (leadClose) leadClose.addEventListener("click", closeLeadDialog);
    if (leadDialog) leadDialog.addEventListener("click", function (event) { if (event.target === leadDialog) closeLeadDialog(); });
    if (leadForm) leadForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.querySelector("#lead-name");
      const contact = document.querySelector("#lead-contact");
      const need = document.querySelector("#lead-need");
      const source = document.querySelector("#lead-source");
      const missing = [name, contact, need].some(function (field) { return !field || !field.value.trim(); });
      if (missing) {
        setLeadError("请填写称呼、联系方式和需求说明。");
        [name, contact, need].forEach(function (field) { if (field) field.setAttribute("aria-invalid", String(!field.value.trim())); });
        if (name && !name.value.trim()) name.focus();
        else if (contact && !contact.value.trim()) contact.focus();
        else if (need) need.focus();
        return;
      }
      [name, contact, need].forEach(function (field) { field.removeAttribute("aria-invalid"); });
      const records = readStorage(STORAGE_KEYS.leads, []);
      const nextRecords = Array.isArray(records) ? records.slice(0, 19) : [];
      nextRecords.unshift({ name: name.value.trim(), contact: contact.value.trim(), need: need.value.trim(), source: source ? source.value : "创业生态", createdAt: new Date().toISOString() });
      const persisted = writeStorage(STORAGE_KEYS.leads, nextRecords);
      closeLeadDialog();
      showToast(persisted ? "咨询已在本地演示中记录，不会发送给真实平台" : "已完成演示提交，当前浏览器未保存记录");
      leadForm.reset();
    });

    document.addEventListener("keydown", function (event) {
      trapOverlayFocus(event);
      if (event.key !== "Escape") return;
      const leadDialog = document.querySelector("#lead-dialog");
      if (leadDialog && !leadDialog.hidden) {
        closeLeadDialog();
        return;
      }
      closeResourceDetail();
    });
    renderEcosystem();
  }

  function initializeIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      try {
        window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
      } catch (error) {
        // Text fallbacks remain visible when the icon CDN is unavailable.
      }
    }
  }

  function init() {
    initializeHeroParticles();
    mountOpcCircle();
    bindNavigation();
    bindGlobalSearch();
    bindCourseFilters();
    bindGeoForm();
    bindBriefForm();
    bindTasks();
    bindAssets();
    bindEcosystem();
    initializeIcons();

    const initialView = window.location.hash.slice(1);
    navigate(initialView, { focus: false, updateHash: !allowedViews.has(initialView) });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
