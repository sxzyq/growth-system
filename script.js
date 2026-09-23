const app = (() => {
  const STORAGE_KEY = 'personal-growth-system-v3';

  const moodColors = [
    // 黄色系 — 积极阳光
    { name: '感恩 / 满足', value: '#FEF3C7', group: '黄色系' },
    { name: '开心 / 雀跃', value: '#FDE047', group: '黄色系' },
    { name: '温暖 / 阳光', value: '#FACC15', group: '黄色系' },

    // 橙色系 — 热情活力
    { name: '兴奋 / 期待', value: '#FB923C', group: '橙色系' },
    { name: '自信 / 充满力量', value: '#F97316', group: '橙色系' },
    { name: '热情 / 活力满满', value: '#EA580C', group: '橙色系' },

    // 粉色系 — 温柔情感
    { name: '温柔 / 幸福', value: '#F9A8D4', group: '粉色系' },
    { name: '心动 / 甜蜜', value: '#F472B6', group: '粉色系' },
    { name: '委屈 / 心酸', value: '#EC4899', group: '粉色系' },

    // 红色系 — 强烈情绪
    { name: '烦躁 / 不耐烦', value: '#DC2626', group: '红色系' },
    { name: '生气 / 愤怒', value: '#B91C1C', group: '红色系' },

    // 绿色系 — 生机与平静
    { name: '放松 / 慵懒', value: '#A7F3D0', group: '绿色系' },
    { name: '活力 / 蓬勃生机', value: '#86EFAC', group: '绿色系' },
    { name: '生机 / 希望', value: '#4ADE80', group: '绿色系' },
    { name: '清新 / 舒畅', value: '#5ECCB8', group: '绿色系' },
    { name: '冷静 / 专注', value: '#0F766E', group: '绿色系' },

    // 青蓝色系 — 清醒与忧郁
    { name: '清晰 / 清醒', value: '#38BDF8', group: '青蓝色系' },
    { name: '平静 / 安心', value: '#22D3EE', group: '青蓝色系' },
    { name: '忧郁 / 苦闷', value: '#60A5FA', group: '青蓝色系' },
    { name: '悲伤 / 低落', value: '#3B82F6', group: '青蓝色系' },
    { name: '失望 / 沮丧', value: '#64748B', group: '青蓝色系' },

    // 紫色系 — 迷茫、梦幻与空白
    { name: '空白 / 懵懵的', value: '#DDD6FE', group: '紫色系' },
    { name: '梦幻 / 憧憬', value: '#C084FC', group: '紫色系' },
    { name: '迷茫 / 困惑', value: '#8B5CF6', group: '紫色系' },
    { name: '痛苦 / 难过', value: '#5B4B8A', group: '紫色系' },

    // 灰色系 — 平淡与麻木
    { name: '疲惫 / 平淡', value: '#CBD5E1', group: '灰色系' },
    { name: '无聊 / 倦怠', value: '#94A3B8', group: '灰色系' },
    { name: '放空 / 麻木', value: '#6B7280', group: '灰色系' },

    // 棕褐色系 — 焦虑与沉重
    { name: '焦虑 / 不安', value: '#D97706', group: '棕褐色系' },
    { name: '压抑 / 沉重', value: '#78716C', group: '棕褐色系' }
  ];

  const partnerStages = {
    seedling: [
      // 0 种子
      `<ellipse cx="40" cy="48" rx="10" ry="14" fill="#D4A373"/><ellipse cx="38" cy="46" rx="3" ry="5" fill="#E8C547" opacity="0.6"/>`,
      // 1 发芽
      `<path d="M40 60 L40 40" stroke="#86EFAC" stroke-width="4" stroke-linecap="round"/>
       <ellipse cx="32" cy="38" rx="8" ry="5" fill="#4ADE80" transform="rotate(-30 32 38)"/>
       <ellipse cx="48" cy="36" rx="8" ry="5" fill="#5ECCB8" transform="rotate(30 48 36)"/>
       <path d="M32 62 L48 62 L44 70 L36 70 Z" fill="#D4A373"/>`,
      // 2 长叶
      `<path d="M40 64 L40 34" stroke="#86EFAC" stroke-width="4" stroke-linecap="round"/>
       <ellipse cx="30" cy="40" rx="10" ry="6" fill="#4ADE80" transform="rotate(-25 30 40)"/>
       <ellipse cx="50" cy="36" rx="10" ry="6" fill="#5ECCB8" transform="rotate(25 50 36)"/>
       <ellipse cx="28" cy="52" rx="9" ry="5" fill="#4ADE80" transform="rotate(-15 28 52)"/>
       <ellipse cx="52" cy="48" rx="9" ry="5" fill="#5ECCB8" transform="rotate(15 52 48)"/>
       <path d="M30 64 L50 64 L46 72 L34 72 Z" fill="#D4A373"/>`,
      // 3 茁壮
      `<path d="M40 68 L40 44" stroke="#A67B5B" stroke-width="5" stroke-linecap="round"/>
       <circle cx="40" cy="34" r="18" fill="#4ADE80"/>
       <circle cx="28" cy="40" r="12" fill="#86EFAC"/>
       <circle cx="52" cy="38" r="13" fill="#5ECCB8"/>
       <circle cx="40" cy="24" r="10" fill="#86EFAC"/>
       <path d="M32 68 L48 68 L45 74 L35 74 Z" fill="#D4A373"/>`
    ],
    flower: [
      // 0 种子
      `<ellipse cx="40" cy="48" rx="10" ry="14" fill="#D4A373"/>`,
      // 1 花苞
      `<path d="M40 62 L40 38" stroke="#86EFAC" stroke-width="3" stroke-linecap="round"/>
       <ellipse cx="40" cy="34" rx="8" ry="10" fill="#F472B6"/>
       <path d="M32 66 L48 66 L45 72 L35 72 Z" fill="#D4A373"/>`,
      // 2 绽放
      `<path d="M40 64 L40 40" stroke="#86EFAC" stroke-width="3" stroke-linecap="round"/>
       <circle cx="40" cy="34" r="7" fill="#FEF08A"/>
       <ellipse cx="40" cy="24" rx="7" ry="10" fill="#F9A8D4"/>
       <ellipse cx="40" cy="44" rx="7" ry="10" fill="#F9A8D4"/>
       <ellipse cx="28" cy="34" rx="10" ry="7" fill="#F472B6"/>
       <ellipse cx="52" cy="34" rx="10" ry="7" fill="#F472B6"/>
       <path d="M32 66 L48 66 L45 72 L35 72 Z" fill="#D4A373"/>`,
      // 3 盛放
      `<path d="M40 66 L40 42" stroke="#86EFAC" stroke-width="3" stroke-linecap="round"/>
       <circle cx="40" cy="34" r="9" fill="#FACC15"/>
       <g fill="#F472B6">${Array.from({length:10},(_,i)=>{const a=i*36;const x=40+16*Math.cos(a*Math.PI/180);const y=34+16*Math.sin(a*Math.PI/180);return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="10" transform="rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;}).join('')}</g>
       <path d="M30 66 L50 66 L47 72 L33 72 Z" fill="#D4A373"/>`
    ],
    cactus: [
      // 0 种子
      `<ellipse cx="40" cy="48" rx="10" ry="14" fill="#D4A373"/>`,
      // 1 小仙人掌
      `<ellipse cx="40" cy="52" rx="10" ry="16" fill="#5ECCB8"/>
       <path d="M35 46 L37 46 M43 44 L45 44 M36 56 L38 56 M44 58 L46 58" stroke="#14532D" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M30 66 L50 66 L47 72 L33 72 Z" fill="#D4A373"/>`,
      // 2 长大
      `<ellipse cx="40" cy="50" rx="12" ry="20" fill="#5ECCB8"/>
       <ellipse cx="26" cy="44" rx="7" ry="10" fill="#86EFAC"/>
       <ellipse cx="54" cy="40" rx="7" ry="12" fill="#86EFAC"/>
       <path d="M33 42 L35 42 M45 38 L47 38 M31 52 L33 52 M47 50 L49 50 M29 32 L31 32 M51 28 L53 28" stroke="#14532D" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M28 66 L52 66 L49 72 L31 72 Z" fill="#D4A373"/>`,
      // 3 开花
      `<ellipse cx="40" cy="50" rx="13" ry="21" fill="#5ECCB8"/>
       <ellipse cx="25" cy="44" rx="8" ry="11" fill="#86EFAC"/>
       <ellipse cx="55" cy="40" rx="8" ry="13" fill="#86EFAC"/>
       <circle cx="40" cy="22" r="7" fill="#F472B6"/>
       <circle cx="40" cy="22" r="3" fill="#FEF08A"/>
       <path d="M32 40 L34 40 M46 36 L48 36 M30 52 L32 52 M48 50 L50 50 M28 30 L30 30 M52 26 L54 26" stroke="#14532D" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M26 66 L54 66 L51 72 L29 72 Z" fill="#D4A373"/>`
    ]
  };

  const partnerMessagesByType = {
    seedling: ['今天也要加油哦 🌱', '记得记录今天的小确幸～', '你已经超棒的！', '慢慢来，我在陪着你', '每一小步都算数'],
    flower: ['你心里的花，今天又悄悄开了一点 🌸', '晒晒太阳，你会开得更漂亮', '不管阴天晴天，你都很可爱', '绽放不用着急，慢慢来也很美', '你的努力，我都看见了'],
    cactus: ['小小的你，其实很有力量 🌵', '干旱也没关系，你能扛过去', '不需要一直开花，做自己就好', '你的坚韧，是最酷的', '慢慢来，沙漠也会开花']
  };

  const sceneTagList = [
    { emoji: '🌿', label: '自然' },
    { emoji: '☕', label: '美食' },
    { emoji: '📚', label: '学习' },
    { emoji: '🏃', label: '运动' },
    { emoji: '🎵', label: '音乐' },
    { emoji: '💤', label: '休息' },
    { emoji: '👫', label: '社交' },
    { emoji: '✨', label: '灵感' },
    { emoji: '🐱', label: '动物' },
    { emoji: '🌧️', label: '雨天' },
    { emoji: '🎮', label: '娱乐' },
    { emoji: '💼', label: '工作' }
  ];

  const emojiFaceList = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];

  const ratingTexts = {
    1: '今天有点难呀…抱抱你，都过去了 🍂',
    2: '小波折而已，明天会更好哒 🍀',
    3: '平平淡淡，安稳也珍贵 🍃',
    4: '好充实！为你开心，继续保持 🌻',
    5: '超级棒！今天值得放烟花 🎆'
  };

  const encouragements = [
    '每一天的记录，都是未来送给自己的礼物 🌱',
    '从今天开始，留下属于你的成长足迹吧',
    '哪怕只写一句话，也是在认真生活',
    '慢慢来，成长是一场温柔的坚持',
    '新的一天，新的可能，开始记录吧 ✨'
  ];

  const dailyQuotes = [
    '你不需要很厉害了才开始，但你需要开始才会很厉害 ✨',
    '今天的你，已经是所有过往经历的总和，而未来正由现在书写',
    '记录不是为了完美，而是为了真实',
    '每一次复盘，都是给未来的自己留一盏灯',
    '成长不是直线，是螺旋上升，允许自己偶尔退步',
    '你比自己想象中更有韧性',
    '认真对待每一天的人，时间也会认真对待她',
    '不必急着成为谁，你正在成为更好的自己',
    '那些写下来的情绪，就不会再在心里乱撞',
    '今天的记录，是明天最温柔的回礼 🌱'
  ];

  const todoEncourages = [
    '太棒了！今天的待办全部完成 🎉',
    '全部搞定！给自己点个赞',
    '任务清零，可以安心休息啦',
    '效率满满，继续保持！'
  ];

  const partnerMessages = [
    '今天也要加油哦 🌱',
    '记得记录今天的小确幸～',
    '你已经超棒的！',
    '慢慢来，我在陪着你',
    '每一小步都算数'
  ];

  let state = loadData();
  let currentRating = 0;
  let selectedMoods = [];
  let saveTimer = null;
  let miniMonthOffset = 0;
  let displayMonthOffset = 0;
  let chartRange = 7;
  let currentMarkDate = null;
  let selectedTags = [];
  let todoViewDate = getToday();      // 每日待办当前查看的日期
  let weeklyViewKey = getWeekStartKey(getToday()); // 每周任务当前查看的周（周一起点日期）
  let dailyViewDate = getToday();      // 每日记录当前编辑的日期（可切到往日）

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 兼容旧记录没有 tags 字段
        if (parsed && parsed.records) {
          Object.values(parsed.records).forEach(r => {
            if (!Array.isArray(r.tags)) r.tags = [];
          });
        }
        return ensureDataShape(parsed);
      }

      // 兼容 v2 数据
      const v2Raw = localStorage.getItem('personal-growth-system-v2');
      if (v2Raw) {
        const v2 = ensureDataShape(JSON.parse(v2Raw));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v2));
        return v2;
      }

      // 兼容第一轮 v1 数据
      const oldRaw = localStorage.getItem('personal-growth-system-v1');
      if (oldRaw) {
        const oldData = JSON.parse(oldRaw);
        if (oldData && oldData.records) {
          const migrated = ensureDataShape({
            records: oldData.records,
            todos: [],
            weeklyTasks: [],
            goals: [],
            notes: [],
            weeklyInsight: '',
            markedDates: {},
            settings: { darkMode: false, partnerType: 'seedling' },
            version: 3
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
    } catch (e) {
      console.warn('读取本地数据失败', e);
    }
    return createDefaultData();
  }

  function createDefaultData() {
    return {
      records: {},
      todos: [],
      weeklyTasks: [],
      goals: [],
      notes: [],
      weeklyInsight: {},
      dubai: [],
      markedDates: {},
      settings: { darkMode: false, partnerType: 'seedling' },
      version: 3
    };
  }

  function ensureDataShape(data) {
    if (!data || typeof data !== 'object') return createDefaultData();
    const records = {};
    Object.entries(data.records || {}).forEach(([date, r]) => {
      records[date] = { ...createEmptyRecord(), ...r };
      if (!Array.isArray(records[date].tags)) records[date].tags = [];
    });
    const today = getToday();
    const thisWeek = getWeekStartKey(today);
    const todos = (data.todos || []).map(t => (t.date ? t : { date: today, ...t }));
    const weeklyTasks = (data.weeklyTasks || []).map(t => (t.weekKey ? t : { weekKey: thisWeek, ...t }));
    // 旧版 weeklyInsight 是单一字符串，迁移为按周（周一起点）存储；旧文字归到上一周，避免带入本周
    let weeklyInsight = data.weeklyInsight;
    if (!weeklyInsight || typeof weeklyInsight !== 'object') {
      const legacy = weeklyInsight || '';
      weeklyInsight = {};
      if (legacy) {
        const prev = new Date(thisWeek + 'T00:00:00');
        prev.setDate(prev.getDate() - 7);
        weeklyInsight[formatDate(prev)] = legacy;
      }
    }
    return {
      records,
      todos,
      weeklyTasks,
      goals: data.goals || [],
      notes: data.notes || [],
      weeklyInsight,
      dubai: Array.isArray(data.dubai) ? data.dubai : [],
      markedDates: data.markedDates || {},
      settings: normalizeSettings(data.settings),
      version: 3
    };
  }

  function normalizeSettings(s) {
    const base = s && typeof s === 'object' ? s : {};
    let mode = base.themeMode || (base.darkMode ? 'night' : 'normal');
    if (!['normal', 'green', 'night'].includes(mode)) mode = 'normal';
    return { ...base, themeMode: mode, darkMode: mode === 'night' };
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('保存本地数据失败', e);
      return false;
    }
  }

  function getToday() {
    return formatDate(new Date());
  }

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 返回包含该日期的「周一」的日期字符串，用作周标识
  function getWeekStartKey(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay(); // 0=周日 1=周一 ...
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return formatDate(d);
  }

  // 时间中文显示：'09-08' 形式，用于日历/日期
  function getTodosForDate(dateStr) {
    return state.todos.filter(t => t.date === dateStr);
  }

  function getWeeklyForKey(weekKey) {
    return state.weeklyTasks.filter(t => t.weekKey === weekKey);
  }

  // 本周（本周一起点）内的待办和每周任务，供复盘与洞察统计使用
  function getThisWeekTodos() {
    const start = getWeekStartKey(getToday());
    const end = new Date(start + 'T00:00:00');
    end.setDate(end.getDate() + 6);
    const endStr = formatDate(end);
    return state.todos.filter(t => t.date && t.date >= start && t.date <= endStr);
  }

  function getThisWeekTasks() {
    return state.weeklyTasks.filter(t => t.weekKey === getWeekStartKey(getToday()));
  }

  function getTodayRecord() {
    return state.records[getToday()] || createEmptyRecord();
  }

  function getDailyViewRecord() {
    return state.records[dailyViewDate] || createEmptyRecord();
  }

  function createEmptyRecord() {
    return {
      completion: '',
      moment: '',
      tags: [],
      moodColor: '',
      rating: 0,
      reflection: '',
      tomorrow: '',
      photos: [],
      updatedAt: null
    };
  }

  function formatDateCN(dateStr) {
    const d = new Date(dateStr);
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    return `${dateStr.replace(/-/g, '.')} ${week}`;
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了，早点休息 🌙';
    if (hour < 11) return '早上好，开启新的一天 ☀️';
    if (hour < 14) return '中午好，记得好好吃饭 🍚';
    if (hour < 18) return '下午好，保持专注 🌿';
    return '晚上好，今天过得怎么样 🌙';
  }

  function getRecordDates() {
    return Object.keys(state.records).sort();
  }

  // 是否真正有内容的记录（排除自动创建的空占位，如每日记录页生成的当天空记录）
  function isRealRecord(r) {
    return !!r && (r.completion || r.moment || r.reflection || r.tomorrow || r.moodColor || r.rating || (r.photos && r.photos.length) || (r.tags && r.tags.length));
  }

  // 只返回真正有内容的记录日期
  function getRealRecordDates() {
    return getRecordDates().filter(d => isRealRecord(state.records[d]));
  }

  function calcStreak() {
    const dates = new Set(getRealRecordDates());
    const d = new Date();
    // 若今天还没填内容（比如清早刚打开），不算断签，先看昨天起的连续，避免连续天数直接归零
    if (!dates.has(formatDate(d))) d.setDate(d.getDate() - 1);
    let streak = 0;
    while (dates.has(formatDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  function calcMaxStreak() {
    const dates = getRealRecordDates();
    if (!dates.length) return 0;
    let max = 1, current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 1;
      }
    }
    return max;
  }

  function getMissedDays() {
    const dates = new Set(getRecordDates());
    const today = new Date();
    let missed = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    while (!dates.has(formatDate(d))) {
      missed++;
      d.setDate(d.getDate() - 1);
      if (missed > 30) break;
    }
    return missed;
  }

  // 页面模式：normal(正常) / green(绿色) / night(夜晚)
  function applyTheme(mode) {
    state.settings.themeMode = mode;
    document.body.classList.remove('dark-mode', 'mode-normal', 'mode-green');
    if (mode === 'night') document.body.classList.add('dark-mode');
    else if (mode === 'normal') document.body.classList.add('mode-normal');
    else document.body.classList.add('mode-green');
    document.querySelectorAll('.seg-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === mode)
    );
    // 夜间：首页小公主轻轻闭眼（切到眨眼/闭眼图）+ 动作放缓；白天睁开
    const night = mode === 'night';
    const wrap = document.getElementById('partnerWrap');
    const img = document.getElementById('partner');
    if (wrap) wrap.classList.toggle('night-calm', night);
    if (img) img.src = night ? (POSES.blink) : (state.partnerPoseBase || POSES.base);
  }

  function initTheme() {
    let mode = state.settings.themeMode;
    if (!mode) mode = state.settings.darkMode ? 'night' : 'normal';
    applyTheme(mode);
  }

  function setTheme(mode) {
    if (!['normal', 'green', 'night'].includes(mode)) mode = 'normal';
    applyTheme(mode);
    state.settings.darkMode = mode === 'night';
    saveData();
  }

  // 导航
  function navTo(target) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-target="${target}"]`)?.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(target);
    if (section) {
      section.classList.add('active');
      section.querySelectorAll('[data-animate]').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (target === 'plan') renderPlan();
    if (target === 'review') renderReview();
    if (target === 'display') renderDisplay();
    if (target === 'insight') renderInsights();
    if (target === 'dubai') renderDubai();
    if (target === 'home') showHomeGreeting();
  }

  // 首页
  function renderHome() {
    const today = getToday();
    document.getElementById('greeting').textContent = getGreeting();
    document.getElementById('dateLine').innerHTML = `<span class="calendar-icon">📅</span>${formatDateCN(today)}`;

    const dates = getRealRecordDates();
    const reviewEl = document.getElementById('randomReview');
    if (dates.length < 3) {
      const text = encouragements[Math.floor(Math.random() * encouragements.length)];
      reviewEl.innerHTML = `
        <div class="empty-state">
          <div class="illo-seedling"><div class="seed-stem"></div><div class="seed-leaf leaf-l"></div><div class="seed-leaf leaf-r"></div><div class="seed-pot"></div></div>
          <p>${text}</p>
          <button class="btn-text" onclick="app.navTo('daily')">去写今日记录 →</button>
        </div>
      `;
    } else {
      const date = dates[Math.floor(Math.random() * dates.length)];
      const r = state.records[date];
      const snippet = escapeHtml(r.moment || r.completion || '（没有详细内容）');
      reviewEl.innerHTML = `
        <div>${snippet}</div>
        <div class="review-date">${formatDateCN(date)} · 评分 ${r.rating || '-'} · <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${r.moodColor || '#ccc'};vertical-align:middle;"></span></div>
        <button class="btn-text review-edit-btn" onclick="app.editRecordOfDate('${date}')">✏️ 修改这一天</button>
      `;
    }

    document.getElementById('totalDays').textContent = dates.length;

    const todayRecord = getTodayRecord();
    const hasToday = todayRecord.completion || todayRecord.moment || todayRecord.rating;
    document.getElementById('todayState').textContent = hasToday ? '已记录' : '未记录';

    const illo = document.getElementById('moodIllustration');
    illo.className = 'mood-illustration';
    if (!hasToday) {
      illo.classList.add('seedling');
    } else if (todayRecord.rating >= 4) {
      // 默认太阳
    } else if (todayRecord.rating <= 2) {
      illo.classList.add('cloudy');
    } else {
      illo.classList.add('seedling');
    }

    renderPartner();
    renderMiniCalendar();
    renderNotes();
  }

  // 成长伙伴（专属吉祥物）
  function renderPartner() {
    const streak = calcStreak();
    const missed = getMissedDays();
    const wrap = document.getElementById('partnerWrap');
    const img = document.getElementById('partner');
    if (!wrap || !img) return;

    img.className = 'partner-svg' + (missed >= 2 ? ' wither' : '');

    // 按连续记录天数给吉祥物"成长光环"（无需不同图片）
    let lv = 0;
    if (streak >= 7) lv = 3;
    else if (streak >= 4) lv = 2;
    else if (streak >= 2) lv = 1;
    wrap.classList.remove('partner-lv1', 'partner-lv2', 'partner-lv3');
    if (lv >= 1) wrap.classList.add('partner-lv1');
    if (lv >= 2) wrap.classList.add('partner-lv2');
    if (lv >= 3) wrap.classList.add('partner-lv3');
  }

  // 首页点名语录（每次点开首页，小公主弹出一句）
  const homeGreetings = [
    '未来和你有关的人和事，都在等你闯过这一关。',
    '在我安定下来前，我得先找到我自己。',
    '迷茫是自由的眩晕感。',
    '迷茫是掌控人生的开始。',
    '世界正在我眼前自行展开，我觉得我能做任何事。',
    '相信缓慢、平和、细水长流的力量。',
    '能与我一同站到这里，你就不必怀疑自己的能力。',
    '我不后悔，我迈出的每一步都铿锵有力。',
    '祝我有不被磨灭的勇气和力量。',
    '先出发，路上缺啥补啥。',
    '我就是能成为任何我想成为的人，坚强和胆量为我开路。',
    '不要在任何场合自卑，任何你能进入的场合，你本就拥有资格。',
    '凡是我所要面对的，都是我能克服的。',
    '做你害怕的事，然后你会发现不过如此。',
    '出发永远比向往更有意义。',
    '我不会放弃走到明天，因为昨天那个我，已经走到了今天。',
    '我不知道前方是什么样，但是我不要后悔选择，我要行胜于言，我要接住一切。',
    '即使痛苦，也让我觉得这一路走得值得，痛苦和成长让我变得更有质感。',
    '对了就庆祝，错了就进步。',
    '人生的容错率很高，三次 left 就是 right。',
    '也许是天气，也许是运气，也许只是我不放弃。',
    '对未来真正的慷慨，是把一切献给现在。',
    '不要因为一时的困境而放弃构想自己的未来。命运是座环流岛，人类才是蒲公英。',
    '向外求，求而不得；向内求，生生不息。',
    '在不可预知的明天，平静也是一种幸福。',
    '一切都很好，我听到自己向上的声音。',
    '世界如此辽阔，怎么走都不算错。',
    '你明亮勇敢，我想你自由又自在。',
    '唯有勇气，是毕生倚仗。',
    '亲爱的女孩，人生若有新体验，你别拒绝。',
    '照顾自己，应当像花一般细心呵护。',
    '亲爱的，你才 18 岁，干什么都刚刚好。',
    '眼泪和坚持一样伟大。',
    '你当像鸟，飞往你的山。',
    '我相信缓慢、平和、细水长流的力量。',
    '一个粗糙的开始，就是最好的开始。',
    '祝来年春山昂首，我为自己筹谋，不再自否。',
    '永远不要失去发芽的心情。',
    '能否像一棵树一样，坚毅又盎然。',
    '向上的路从来不轻松，但每抓稳一个节点，都会离想去的地方更近一点。',
    '人生若有新体验，请别拒绝。当你不再恐惧时，害怕就成了兴奋剂。'
  ];

  let homeGreetingTimer = null;
  function showHomeGreeting() {
    const wrap = document.getElementById('partnerWrap');
    const bubble = document.getElementById('partnerBubble');
    if (!wrap || !bubble) return;
    if (homeGreetingTimer) clearTimeout(homeGreetingTimer);

    const msg = homeGreetings[Math.floor(Math.random() * homeGreetings.length)];
    bubble.textContent = msg;
    bubble.classList.add('show');
    wrap.classList.add('beam');
    // 挥手：不是每次点名都挥，约六成概率，且动作更轻快
    if (Math.random() < 0.6) setPose('wave', 950);

    homeGreetingTimer = setTimeout(() => {
      bubble.classList.remove('show');
      wrap.classList.remove('beam');
    }, 5000);
  }

  // 多姿态切换：眨眼 / 挥手 / 开心跳
  const POSES = { base: 'mascot.png', blink: 'mascot_blink.png', wave: 'mascot_wave.png', hop: 'mascot_hop.png' };
  let poseState = 'base';
  let poseTimer = null;
  let blinkTimer = null;

  function preloadPoses() {
    Object.values(POSES).forEach(src => { const im = new Image(); im.src = src; });
  }

  function setPose(name, ms) {
    const img = document.getElementById('partner');
    if (!img) return;
    img.src = POSES[name] || POSES.base;
    poseState = name;
    if (poseTimer) clearTimeout(poseTimer);
    if (ms !== undefined) {
      poseTimer = setTimeout(() => {
        if (poseState === name) {
          const calm = document.body.classList.contains('dark-mode');
          img.src = calm ? POSES.blink : POSES.base;
          poseState = calm ? 'blink' : 'base';
        }
      }, ms);
    }
  }

  function autoBlink() {
    if (poseState === 'base') setPose('blink', 150);
  }
  function startAutoBlink() {
    stopAutoBlink();
    // 不规则眨眼：2.5~5.5 秒随机，更像真人
    const delay = 2500 + Math.random() * 3000;
    blinkTimer = setTimeout(() => { autoBlink(); startAutoBlink(); }, delay);
  }
  function stopAutoBlink() {
    if (blinkTimer) { clearTimeout(blinkTimer); blinkTimer = null; }
  }

  // 点一下吉祥物：摇晃 + 开心跳 + 气泡说一句温暖的话；连续快速点→原地转圈比拳头
  let lastPokeTime = 0;
  let pokeConsecutive = 0;
  function pokePartner() {
    const wrap = document.getElementById('partnerWrap');
    const bubble = document.getElementById('partnerBubble');
    if (!wrap || !bubble) return;
    const now = Date.now();
    pokeConsecutive = (now - lastPokeTime < 1200) ? pokeConsecutive + 1 : 1;
    lastPokeTime = now;
    if (pokeConsecutive >= 2) { pokeConsecutive = 0; celebratePartner(); return; }

    wrap.classList.add('shake');
    setTimeout(() => wrap.classList.remove('shake'), 500);

    setPose('hop', 1050);

    const streak = calcStreak();
    const type = state.settings.partnerType || 'seedling';
    const messages = [...(partnerMessagesByType[type] || partnerMessages)];
    if (streak > 0) messages.push(`你已经坚持 ${streak} 天啦，我在为你鼓掌！`);
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bubble.textContent = msg;
    bubble.classList.add('show');
    setTimeout(() => bubble.classList.remove('show'), 2500);
  }

  // 连续点击：原地小转圈，结束后元气地比一个加油拳头
  function celebratePartner() {
    const wrap = document.getElementById('partnerWrap');
    const bubble = document.getElementById('partnerBubble');
    if (!wrap || !bubble) return;
    wrap.classList.remove('spin', 'cheer');
    void wrap.offsetWidth;
    wrap.classList.add('spin');
    setPose('hop', 900);
    setTimeout(() => {
      wrap.classList.remove('spin');
      wrap.classList.add('cheer');
      bubble.textContent = '加油！你是最棒的 💪';
      bubble.classList.add('show');
    }, 900);
    setTimeout(() => {
      wrap.classList.remove('cheer');
      bubble.classList.remove('show');
    }, 1900);
  }

  // 悬停→歪头 + 气泡；移开恢复
  let hoverTimer = null;
  function bindHover() {
    const wrap = document.getElementById('partnerWrap');
    const bubble = document.getElementById('partnerBubble');
    if (!wrap || !bubble) return;
    wrap.addEventListener('mouseenter', () => {
      wrap.classList.add('tilt');
      bubble.textContent = '今天想记录什么小故事？';
      bubble.classList.add('show');
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => bubble.classList.remove('show'), 4000);
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.classList.remove('tilt');
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      bubble.classList.remove('show');
    });
  }

  // 全站吉祥物即时反馈（Duolingo 式：右下角蹦出来 + 气泡 + 情绪反馈）
  let mascotTimer = null;
  function mascotReact(text) {
    const box = document.getElementById('mascotFeedback');
    const bubble = document.getElementById('mascotFbBubble');
    if (!box || !bubble || !text) return;
    bubble.textContent = text;
    box.classList.remove('pop');
    void box.offsetWidth;
    box.classList.add('pop');
    if (mascotTimer) clearTimeout(mascotTimer);
    mascotTimer = setTimeout(() => box.classList.remove('pop'), 3200);
  }

  // 励志语录弹窗
  function showQuoteToast() {
    const toast = document.getElementById('quoteToast');
    const text = document.getElementById('quoteToastText');
    const today = getToday();
    const lastQuoteDate = state.settings?.lastQuoteDate;

    // 同一天只显示一次
    if (lastQuoteDate === today) return;

    const quote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    text.textContent = quote;
    toast.classList.add('show');

    if (!state.settings) state.settings = {};
    state.settings.lastQuoteDate = today;
    saveData();

    // 6 秒后自动关闭
    setTimeout(() => closeQuoteToast(), 6000);
  }

  function closeQuoteToast() {
    document.getElementById('quoteToast')?.classList.remove('show');
  }

  // 首页滑入语录条（滑入 → 停留 → 收回）
  function showSlideQuote() {
    const el = document.getElementById('slideQuote');
    if (!el) return;
    const text = document.getElementById('slideQuoteText');
    text.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
    el.classList.remove('hide', 'show');
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(window.__slideQuoteTimer);
    window.__slideQuoteTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 3600);
  }

  function hideSlideQuote() {
    document.getElementById('slideQuote')?.classList.remove('show');
  }

  // 迷你月历
  function getMonthDates(offset) {
    const now = new Date();
    now.setMonth(now.getMonth() + offset);
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, firstDay, daysInMonth };
  }

  function renderMiniCalendar() {
    const { year, month, firstDay, daysInMonth } = getMonthDates(miniMonthOffset);
    document.getElementById('miniCalendarTitle').textContent = `${year}年${month + 1}月`;
    const container = document.getElementById('miniCalendar');
    container.innerHTML = '';

    const headers = ['日', '一', '二', '三', '四', '五', '六'];
    headers.forEach(h => {
      const div = document.createElement('div');
      div.className = 'mini-calendar-header';
      div.textContent = h;
      container.appendChild(div);
    });

    const today = getToday();
    const todayObj = new Date();
    let recordedCount = 0;

    for (let i = 0; i < firstDay; i++) {
      container.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = state.records[dateStr];
      const real = isRealRecord(record);
      const div = document.createElement('div');
      div.className = 'mini-calendar-day';
      div.textContent = d;

      if (real) {
        div.classList.add('recorded');
        div.style.setProperty('--dot-color', record.moodColor || '#4ADE80');
        recordedCount++;
      }

      if (dateStr === today) div.classList.add('today');

      const dateObj = new Date(dateStr);
      const isPast = dateObj < new Date(today) && dateStr !== today;
      if (isPast && !real) div.classList.add('past-missed');

      div.onclick = () => showDateDetail(dateStr);
      container.appendChild(div);
    }

    document.getElementById('miniCalendarSummary').textContent = `本月已记录 ${recordedCount} 天`;
  }

  function changeMiniMonth(delta) {
    miniMonthOffset += delta;
    renderMiniCalendar();
  }

  // 便利贴
  function renderNotes() {
    const listEl = document.getElementById('noteList');
    const emptyEl = document.getElementById('noteEmpty');
    const clearBtn = document.getElementById('clearNotesBtn');

    if (!state.notes.length) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      clearBtn.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    const doneCount = state.notes.filter(n => n.done).length;
    clearBtn.style.display = doneCount > 0 ? 'block' : 'none';

    listEl.innerHTML = '';
    state.notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'note-item' + (note.done ? ' done' : '');
      div.dataset.id = note.id;
      div.innerHTML = `
        <div class="note-dot" onclick="app.toggleNote(${note.id})" title="点击标记完成/取消"></div>
        <span class="note-text" onclick="app.editNote(${note.id})" title="点击修改内容">${escapeHtml(note.text)}</span>
        <button class="note-edit" onclick="app.editNote(${note.id})" title="修改">✎</button>
        <button class="note-delete" onclick="app.deleteNote(${note.id})" title="删除">×</button>
      `;
      listEl.appendChild(div);
    });
  }

  function addNote() {
    const input = document.getElementById('newNote');
    const text = input.value.trim();
    if (!text) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      return;
    }
    state.notes.unshift({ id: Date.now(), text, done: false });
    input.value = '';
    saveData();
    renderNotes();
  }

  function toggleNote(id) {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      note.done = !note.done;
      saveData();
      renderNotes();
    }
  }

  function deleteNote(id) {
    state.notes = state.notes.filter(n => n.id !== id);
    saveData();
    renderNotes();
  }

  // 通用行内编辑：点击文字/编辑按钮后，原地换成输入框，回车或失焦保存，Esc 取消
  function beginInlineEdit(textEl, getValue, commit) {
    if (!textEl || textEl.dataset.editing === '1') return;
    const input = document.createElement('input');
    input.className = 'inline-edit-input';
    input.value = getValue();
    input.setAttribute('data-isedit-input', '1');
    textEl.dataset.editing = '1';
    textEl.style.display = 'none';
    textEl.insertAdjacentElement('afterend', input);
    input.focus();
    input.select();
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      input.remove();
      textEl.style.display = '';
      delete textEl.dataset.editing;
      if (save) commit(input.value);
    };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') finish(true);
      else if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => finish(true));
  }

  function editNote(id) {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    const span = document.querySelector(`.note-item[data-id="${id}"] .note-text`);
    beginInlineEdit(span, () => note.text, (v) => {
      note.text = (v.trim() || note.text);
      span.textContent = escapeHtml(note.text);
      saveData();
    });
  }

  function clearDoneNotes() {
    state.notes = state.notes.filter(n => !n.done);
    saveData();
    renderNotes();
  }

  // Emoji / 场景标签
  function getTagLabel(emoji) {
    return sceneTagList.find(t => t.emoji === emoji)?.label || '';
  }

  function toggleTagPanel() {
    const panel = document.getElementById('tagPanel');
    const toggle = document.getElementById('tagToggle');
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      toggle.textContent = '收起';
    } else {
      panel.style.display = 'none';
      toggle.textContent = '展开';
    }
  }

  function renderTagPanel() {
    const sceneContainer = document.getElementById('sceneTags');
    const emojiContainer = document.getElementById('emojiTags');
    sceneContainer.innerHTML = '';
    emojiContainer.innerHTML = '';

    sceneTagList.forEach(t => {
      const div = document.createElement('div');
      div.className = 'scene-tag' + (selectedTags.includes(t.emoji) ? ' selected' : '');
      div.innerHTML = `<span>${t.emoji}</span><span>${t.label}</span>`;
      div.onclick = () => toggleTag(t.emoji);
      sceneContainer.appendChild(div);
    });

    emojiFaceList.forEach(e => {
      const div = document.createElement('div');
      div.className = 'emoji-tag' + (selectedTags.includes(e) ? ' selected' : '');
      div.textContent = e;
      div.onclick = () => toggleTag(e);
      emojiContainer.appendChild(div);
    });

    updateTagCount();
    renderSelectedTags();
  }

  function toggleTag(emoji) {
    const idx = selectedTags.indexOf(emoji);
    if (idx > -1) {
      selectedTags.splice(idx, 1);
    } else {
      selectedTags.push(emoji);
    }
    renderTagPanel();
    autoSave();
  }

  function removeTag(emoji) {
    const idx = selectedTags.indexOf(emoji);
    if (idx > -1) {
      selectedTags.splice(idx, 1);
      renderTagPanel();
      autoSave();
    }
  }

  function updateTagCount() {
    const el = document.getElementById('tagCount');
    if (el) el.textContent = `（已选 ${selectedTags.length}）`;
  }

  function renderSelectedTags() {
    const container = document.getElementById('selectedTags');
    if (!selectedTags.length) {
      container.innerHTML = '<span class="no-tag-hint">还没选标签，展开选一个吧～</span>';
      return;
    }
    container.innerHTML = selectedTags.map(e => {
      const label = getTagLabel(e);
      return `<span class="selected-tag"><span>${e}</span>${label ? `<span class="tag-label">${label}</span>` : ''}<button class="tag-remove" onclick="app.removeTag('${e}')">×</button></span>`;
    }).join('');
  }

  function showTagHint(text) {
    const el = document.getElementById('tagHint');
    if (!el) return;
    el.textContent = text;
    setTimeout(() => { el.textContent = ''; }, 2000);
  }

  // 每日记录
  function renderMoodPalette() {
    const container = document.getElementById('moodPalette');
    container.innerHTML = '';
    moodColors.forEach(m => {
      const div = document.createElement('div');
      div.className = 'mood-color' + (selectedMoods.includes(m.value) ? ' selected' : '');
      div.style.backgroundColor = m.value;
      div.dataset.value = m.value;
      div.dataset.name = m.name;
      div.title = m.name;
      div.addEventListener('click', () => {
        const idx = selectedMoods.indexOf(m.value);
        if (idx > -1) {
          selectedMoods.splice(idx, 1);
        } else {
          selectedMoods.push(m.value);
        }
        updateMoodNameText();
        renderMoodPalette();
        autoSave();
      });
      container.appendChild(div);
    });
    updateMoodNameText();
  }

  function updateMoodNameText() {
    const el = document.getElementById('moodName');
    const names = selectedMoods.map(v => {
      const m = moodColors.find(x => x.value === v);
      return m ? m.name : '';
    }).filter(Boolean);
    el.textContent = names.length ? (names.length > 1 ? `当前心情（多选）：${names.join('、')}` : `当前心情：${names[0]}`) : '';
  }

  function renderStars(hoverValue = 0) {
    const stars = document.querySelectorAll('#starRating .star');
    const value = hoverValue || currentRating;
    stars.forEach(star => {
      const v = parseInt(star.dataset.value);
      star.classList.toggle('hover', v <= value && hoverValue > 0);
      star.classList.toggle('selected', v <= currentRating);
    });
    const textEl = document.getElementById('ratingText');
    const clearEl = document.getElementById('ratingClear');
    let label = '点击星星评分';
    if (hoverValue && ratingTexts[hoverValue]) {
      label = ratingTexts[hoverValue];
    } else if (currentRating && ratingTexts[currentRating]) {
      label = ratingTexts[currentRating];
    }
    if (textEl) {
      const mainText = textEl.querySelector('.rating-main-text') || textEl.childNodes[0];
      if (mainText) mainText.textContent = label;
    }
    if (clearEl) clearEl.style.display = currentRating > 0 && !hoverValue ? 'inline-block' : 'none';
  }

  function clearRating() {
    currentRating = 0;
    renderStars();
    autoSave();
    showSaveHint('评分已清除');
  }

  let starAudio = null;
  function playStarSound(value) {
    try {
      if (!starAudio) starAudio = new (window.AudioContext || window.webkitAudioContext)();
      if (starAudio.state === 'suspended') starAudio.resume();
      const now = starAudio.currentTime;
      const osc = starAudio.createOscillator();
      const gain = starAudio.createGain();
      osc.type = 'triangle';
      const base = 392 + (value - 1) * 48; // 评分越高音调越上扬
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.08, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      osc.connect(gain).connect(starAudio.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) { /* 忽略音频错误 */ }
  }

  function initStarRating() {
    const container = document.getElementById('starRating');
    container.addEventListener('pointerover', e => {
      const star = e.target.closest('.star');
      if (star) renderStars(parseInt(star.dataset.value));
    });
    container.addEventListener('pointerout', e => {
      if (!container.contains(e.relatedTarget)) renderStars(0);
    });
    container.addEventListener('click', e => {
      const star = e.target.closest('.star');
      if (!star) return;
      currentRating = parseInt(star.dataset.value);
      renderStars();
      playStarSound(currentRating);
      autoSave();
      const ratingReact = {
        1: '抱抱，都过去了，我一直在 🍂',
        2: '小波折而已，明天会好哒 🍀',
        3: '平平淡淡也很珍贵 🍃',
        4: '好充实！为你开心 🌻',
        5: '太棒了！今天值得放烟花 🎆'
      };
      mascotReact(ratingReact[currentRating]);
      const textEl = document.getElementById('ratingText');
      if (textEl) {
        textEl.classList.remove('rating-pop');
        void textEl.offsetWidth;
        textEl.classList.add('rating-pop');
      }
    });
    container.addEventListener('touchstart', e => {
      const star = e.target.closest('.star');
      if (star) renderStars(parseInt(star.dataset.value));
    }, { passive: true });
  }

  function loadDailyForm() {
    const r = getDailyViewRecord();
    document.getElementById('completion').value = r.completion || '';
    document.getElementById('moment').value = r.moment || '';
    document.getElementById('reflection').value = r.reflection || '';
    document.getElementById('tomorrow').value = r.tomorrow || '';
    currentRating = r.rating || 0;
    selectedMoods = Array.isArray(r.moodColors) ? r.moodColors.slice() : (r.moodColor ? [r.moodColor] : []);
    selectedTags = Array.isArray(r.tags) ? r.tags.slice() : [];
    renderStars();
    renderMoodPalette();
    renderTagPanel();
    renderMomentPhotos();
    updateDailyDateLine();
    renderDailySummary();
  }

  function updateDailyDateLine() {
    const el = document.getElementById('dailyDateLine');
    if (el) el.textContent = dailyViewDate === getToday()
      ? `📅 ${formatDateCN(dailyViewDate)}（今天）`
      : `📅 ${formatDateCN(dailyViewDate)}`;
    const picker = document.getElementById('dailyDatePicker');
    if (picker) picker.value = dailyViewDate;
  }

  function changeDailyDate(delta) {
    const d = new Date(dailyViewDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    dailyViewDate = formatDate(d);
    loadDailyForm();
  }

  function goDailyToday() {
    dailyViewDate = getToday();
    loadDailyForm();
  }

  function setDailyViewDate(v) {
    if (!v) return;
    dailyViewDate = v;
    loadDailyForm();
  }

  // 从首页随机回顾跳去编辑某一天的记录
  function editRecordOfDate(date) {
    if (date) dailyViewDate = date;
    navTo('daily');
    loadDailyForm();
  }

  // ---------- 百态照片（每天最多 5 张，自动压缩存 localStorage） ----------
  function getViewPhotos() {
    if (!state.records[dailyViewDate]) state.records[dailyViewDate] = createEmptyRecord();
    if (!state.records[dailyViewDate].photos) state.records[dailyViewDate].photos = [];
    return state.records[dailyViewDate].photos;
  }

  function renderMomentPhotos() {
    const grid = document.getElementById('momentPhotos');
    const btn = document.getElementById('photoAddBtn');
    if (!grid) return;
    const photos = getViewPhotos();
    grid.innerHTML = '';
    photos.forEach(p => {
      const wrap = document.createElement('div');
      wrap.className = 'photo-thumb-wrap';
      wrap.innerHTML = `<img src="${p.dataUrl}" alt="照片" onclick="app.openRecordPhoto('${dailyViewDate}','${p.id}')"><button type="button" class="photo-thumb-del" onclick="app.deletePhoto('${p.id}')" title="删除">×</button>`;
      grid.appendChild(wrap);
    });
    if (btn) btn.textContent = `📷 添加照片（${photos.length}/5）`;
  }

  function compressImageFile(file, cb) {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let { width: w, height: h } = img;
        if (Math.max(w, h) > MAX) {
          const k = MAX / Math.max(w, h);
          w = Math.round(w * k); h = Math.round(h * k);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        cb(canvas.toDataURL('image/jpeg', 0.62));
      };
      img.onerror = () => cb(null);
      img.src = ev.target.result;
    };
    reader.onerror = () => cb(null);
    reader.readAsDataURL(file);
  }

  function addPhotos(input) {
    const files = Array.from((input && input.files) || []);
    if (input) input.value = ''; // 允许再次选择同一文件
    const photos = getViewPhotos();
    const canAdd = 5 - photos.length;
    if (canAdd <= 0) { alert('每天最多存 5 张照片哦，先删掉几张旧的再试吧~'); return; }
    const chosen = files.slice(0, canAdd);
    if (!chosen.length) return;
    const record = state.records[dailyViewDate];
    let done = 0;
    chosen.forEach(file => {
      compressImageFile(file, dataUrl => {
        done++;
        if (dataUrl && getViewPhotos().length < 5) {
          record.photos.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), dataUrl, ts: Date.now() });
          if (!saveData()) {
            record.photos.pop();
            alert('照片太多，本地存储空间不够啦。建议删掉一些旧照片后再试~');
          }
        }
        if (done === chosen.length) renderMomentPhotos();
      });
    });
  }

  function deletePhoto(id) {
    const record = state.records[dailyViewDate];
    if (!record) return;
    record.photos = (record.photos || []).filter(p => p.id !== id);
    saveData();
    renderMomentPhotos();
    renderDailySummary();
  }

  function openRecordPhoto(date, id) {
    const rec = state.records[date];
    const p = rec && (rec.photos || []).find(q => q.id === id);
    if (!p) return;
    const lb = document.getElementById('photoLightbox');
    const img = document.getElementById('photoLightboxImg');
    if (!lb || !img) return;
    img.src = p.dataUrl;
    lb.classList.add('show');
  }

  function closePhotoLightbox() {
    const lb = document.getElementById('photoLightbox');
    if (lb) lb.classList.remove('show');
  }

  // ---------- 每日记录的小日历（点日期/日历图标就地弹出，快速跳转） ----------
  const miniCalState = { y: 0, m: 0 };
  const miniCalPad2 = n => (n < 10 ? '0' + n : '' + n);
  function miniCalBlank() { const b = document.createElement('button'); b.type = 'button'; b.className = 'mini-cal-day other'; b.tabIndex = -1; return b; }
  function renderMiniCal() {
    const grid = document.getElementById('miniCalGrid');
    const title = document.getElementById('miniCalTitle');
    if (!grid) return;
    const { y, m } = miniCalState;
    title.textContent = `${y}年${m + 1}月`;
    const startDow = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const today = getToday();
    grid.innerHTML = '';
    for (let i = 0; i < startDow; i++) grid.appendChild(miniCalBlank());
    for (let d = 1; d <= dim; d++) {
      const ds = `${y}-${miniCalPad2(m + 1)}-${miniCalPad2(d)}`;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mini-cal-day';
      b.textContent = d;
      if (ds === today) b.classList.add('today');
      if (ds === dailyViewDate) b.classList.add('current');
      b.onclick = () => { setDailyViewDate(ds); closeMiniCal(); };
      grid.appendChild(b);
    }
  }
  function toggleMiniCal(ev) {
    if (ev) ev.stopPropagation();
    const cal = document.getElementById('dailyMiniCal');
    if (!cal) return;
    if (!cal.hidden) { cal.hidden = true; return; }
    const d = new Date(dailyViewDate + 'T00:00:00');
    miniCalState.y = d.getFullYear();
    miniCalState.m = d.getMonth();
    renderMiniCal();
    cal.hidden = false;
  }
  function closeMiniCal() {
    const cal = document.getElementById('dailyMiniCal');
    if (cal) cal.hidden = true;
  }
  function miniCalNav(delta) {
    miniCalState.m += delta;
    if (miniCalState.m < 0) { miniCalState.m = 11; miniCalState.y--; }
    if (miniCalState.m > 11) { miniCalState.m = 0; miniCalState.y++; }
    renderMiniCal();
  }
  function miniCalToday() {
    const t = getToday();
    miniCalState.y = parseInt(t.slice(0, 4), 10);
    miniCalState.m = parseInt(t.slice(5, 7), 10) - 1;
    renderMiniCal();
  }
  document.addEventListener('click', function (e) {
    const cal = document.getElementById('dailyMiniCal');
    const nav = document.querySelector('.daily-date-nav');
    if (cal && !cal.hidden && nav && !nav.contains(e.target)) closeMiniCal();
  });

  function renderDailySummary() {
    const r = getDailyViewRecord();
    const hasContent = r.completion || r.moment || r.reflection || r.tomorrow || r.rating || r.moodColor || (r.tags && r.tags.length);
    const card = document.getElementById('summaryCard');
    const body = document.getElementById('dailySummary');
    if (!hasContent) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const tagChips = (r.tags && r.tags.length)
      ? `<p><strong>今日标签：</strong>${r.tags.map(e => {
          const label = getTagLabel(e);
          return `<span class="selected-tag" style="margin:2px 4px 2px 0;"><span>${e}</span>${label ? `<span class="tag-label">${label}</span>` : ''}</span>`;
        }).join('')}</p>`
      : '';
    body.innerHTML = `
      ${r.completion ? `<p><strong>完成情况：</strong>${escapeHtml(r.completion)}</p>` : ''}
      ${r.moment ? `<p><strong>百态：</strong>${escapeHtml(r.moment)}</p>` : ''}
      ${tagChips}
      ${r.rating ? `<p><strong>今日评分：</strong>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</p>` : ''}
      ${r.moodColor ? `<p><strong>情绪颜色：</strong><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${r.moodColor};vertical-align:middle;margin-right:4px;"></span>${escapeHtml(moodColors.find(m => m.value === r.moodColor)?.name || '')}</p>` : ''}
      ${r.reflection ? `<p><strong>反思：</strong>${escapeHtml(r.reflection)}</p>` : ''}
      ${r.tomorrow ? `<p><strong>明日计划：</strong>${escapeHtml(r.tomorrow)}</p>` : ''}
    `;
  }

  function autoSave() {
    const hint = document.getElementById('saveHint');
    hint.textContent = '保存中...';
    hint.classList.remove('hidden');
    hint.classList.add('visible');

    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (!state.records[dailyViewDate]) state.records[dailyViewDate] = createEmptyRecord();
      const r = state.records[dailyViewDate];
      r.completion = document.getElementById('completion').value.trim();
      r.moment = document.getElementById('moment').value.trim();
      r.reflection = document.getElementById('reflection').value.trim();
      r.tomorrow = document.getElementById('tomorrow').value.trim();
      r.rating = currentRating;
      r.moodColors = selectedMoods.slice();
      r.moodColor = selectedMoods[0] || '';
      r.tags = selectedTags.slice();
      r.updatedAt = new Date().toISOString();
      saveData();
      updateDailyDateLine();
      renderDailySummary();
      renderHome();

      hint.textContent = '已自动保存';
      setTimeout(() => {
        hint.classList.remove('visible');
        hint.classList.add('hidden');
      }, 2000);
    }, 500);
  }

  function initAutoSave() {
    ['completion', 'moment', 'reflection', 'tomorrow'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', autoSave);
    });
  }

  // 计划管理
  function renderPlan() {
    renderTodos();
    renderWeeklyTasks();
    renderGoals();
  }

  function renderTodos() {
    const listEl = document.getElementById('todoList');
    const emptyEl = document.getElementById('todoEmpty');
    const progressEl = document.getElementById('todoProgress');
    const encourageEl = document.getElementById('todoEncourage');
    const clearBtn = document.getElementById('clearDoneBtn');
    const dateNavEl = document.getElementById('todoDateNav');
    if (dateNavEl) dateNavEl.textContent = formatDateCN(todoViewDate);

    const todos = getTodosForDate(todoViewDate);
    const isToday = todoViewDate === getToday();
    // 只有查看今天时才显示「添加输入框和清空」
    document.getElementById('newTodoRow')?.style.setProperty('display', isToday ? '' : 'none');

    if (!todos.length) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      progressEl.textContent = '已完成 0/0';
      encourageEl.textContent = '';
      clearBtn.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    progressEl.textContent = `已完成 ${done}/${total}`;
    encourageEl.textContent = done === total && total > 0 ? todoEncourages[Math.floor(Math.random() * todoEncourages.length)] : '';
    clearBtn.style.display = done > 0 && isToday ? 'block' : 'none';

    listEl.innerHTML = '';
    todos.forEach(todo => {
      const div = document.createElement('div');
      div.className = 'todo-item' + (todo.done ? ' done' : '');
      div.dataset.id = todo.id;
      div.innerHTML = `
        <div class="todo-checkbox" onclick="app.toggleTodo(${todo.id})">${todo.done ? '✓' : ''}</div>
        <span class="todo-text" onclick="app.editTodo(${todo.id})" title="点击修改待办">${escapeHtml(todo.text)}</span>
        <button class="todo-edit" onclick="app.editTodo(${todo.id})" title="修改">✎</button>
        <button class="todo-delete" onclick="app.deleteTodo(${todo.id})" title="删除">×</button>
      `;
      listEl.appendChild(div);
    });
  }

  function addTodo() {
    const input = document.getElementById('newTodo');
    const text = input.value.trim();
    if (!text) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      return;
    }
    state.todos.unshift({ id: Date.now(), text, done: false, date: todoViewDate });
    input.value = '';
    saveData();
    renderTodos();
  }

  function editTodo(id) {
    const t = state.todos.find(x => x.id === id && x.date === todoViewDate);
    if (!t) return;
    const span = document.querySelector(`.todo-item[data-id="${id}"] .todo-text`);
    beginInlineEdit(span, () => t.text, (v) => {
      t.text = (v.trim() || t.text);
      span.textContent = escapeHtml(t.text);
      saveData();
    });
  }

  function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id && t.date === todoViewDate);
    if (todo) {
      const becomingDone = !todo.done;
      todo.done = !todo.done;
      saveData();
      renderTodos();
      if (becomingDone) {
        const remain = state.todos.filter(t => t.date === todoViewDate && !t.done).length;
        mascotReact(remain === 0
          ? '今天的待办全部完成啦！你是超级行动派 ✨'
          : '又划掉一件，稳稳前进中 🌱');
      }
    }
  }

  function deleteTodo(id) {
    const el = document.querySelector(`.todo-item[data-id="${id}"]`);
    const remove = () => {
      state.todos = state.todos.filter(t => !(t.id === id && t.date === todoViewDate));
      saveData();
      renderTodos();
    };
    if (el) {
      el.classList.add('removing');
      setTimeout(remove, 300);
    } else {
      remove();
    }
  }

  function clearDoneTodos() {
    state.todos = state.todos.filter(t => !(t.date === todoViewDate && t.done));
    saveData();
    renderTodos();
  }

  function changeTodoDate(delta) {
    const d = new Date(todoViewDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    todoViewDate = formatDate(d);
    renderTodos();
  }

  function goToday() {
    todoViewDate = getToday();
    renderTodos();
  }

  function renderWeeklyTasks() {
    const listEl = document.getElementById('weeklyList');
    const emptyEl = document.getElementById('weeklyEmpty');
    const bar = document.getElementById('weeklyProgressBar');
    const text = document.getElementById('weeklyProgressText');
    const navEl = document.getElementById('weeklyDateNav');
    if (navEl) {
      const monday = new Date(weeklyViewKey + 'T00:00:00');
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      navEl.textContent = `${formatCNShort(monday)} ~ ${formatCNShort(sunday)}`;
    }

    const tasks = getWeeklyForKey(weeklyViewKey);
    const isThisWeek = weeklyViewKey === getWeekStartKey(getToday());
    document.getElementById('newWeeklyRow')?.style.setProperty('display', isThisWeek ? '' : 'none');

    if (!tasks.length) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      bar.style.width = '0%';
      text.textContent = '本周进度 0%';
      return;
    }

    emptyEl.style.display = 'none';
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = Math.round((done / total) * 100);
    bar.style.width = percent + '%';
    text.textContent = `本周进度 ${percent}%`;

    listEl.innerHTML = '';
    tasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'todo-item' + (task.done ? ' done' : '');
      div.dataset.id = task.id;
      div.innerHTML = `
        <div class="todo-checkbox" onclick="app.toggleWeeklyTask(${task.id})">${task.done ? '✓' : ''}</div>
        <span class="todo-text" onclick="app.editWeeklyTask(${task.id})" title="点击修改任务">${escapeHtml(task.text)}</span>
        <button class="todo-edit" onclick="app.editWeeklyTask(${task.id})" title="修改">✎</button>
        <button class="todo-delete" onclick="app.deleteWeeklyTask(${task.id})" title="删除">×</button>
      `;
      listEl.appendChild(div);
    });
  }

  function addWeeklyTask() {
    const input = document.getElementById('newWeekly');
    const text = input.value.trim();
    if (!text) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      return;
    }
    state.weeklyTasks.unshift({ id: Date.now(), text, done: false, weekKey: weeklyViewKey });
    input.value = '';
    saveData();
    renderWeeklyTasks();
  }

  function editWeeklyTask(id) {
    const t = state.weeklyTasks.find(x => x.id === id && x.weekKey === weeklyViewKey);
    if (!t) return;
    const span = document.querySelector(`#weeklyList .todo-item[data-id="${id}"] .todo-text`);
    beginInlineEdit(span, () => t.text, (v) => {
      t.text = (v.trim() || t.text);
      span.textContent = escapeHtml(t.text);
      saveData();
    });
  }

  function toggleWeeklyTask(id) {
    const task = state.weeklyTasks.find(t => t.id === id && t.weekKey === weeklyViewKey);
    if (task) {
      task.done = !task.done;
      saveData();
      renderWeeklyTasks();
    }
  }

  function deleteWeeklyTask(id) {
    const el = document.querySelector(`#weeklyList .todo-item[data-id="${id}"]`);
    const remove = () => {
      state.weeklyTasks = state.weeklyTasks.filter(t => !(t.id === id && t.weekKey === weeklyViewKey));
      saveData();
      renderWeeklyTasks();
    };
    if (el) {
      el.classList.add('removing');
      setTimeout(remove, 300);
    } else {
      remove();
    }
  }

  function changeWeekly(delta) {
    const d = new Date(weeklyViewKey + 'T00:00:00');
    d.setDate(d.getDate() + delta * 7);
    weeklyViewKey = formatDate(d);
    renderWeeklyTasks();
  }

  function goThisWeek() {
    weeklyViewKey = getWeekStartKey(getToday());
    renderWeeklyTasks();
  }

  function formatCNShort(d) {
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function renderGoals() {
    const container = document.getElementById('goalGroups');
    const emptyEl = document.getElementById('goalEmpty');

    if (!state.goals.length) {
      container.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }

    emptyEl.style.display = 'none';
    const groups = { '月目标': [], '学期目标': [], '年目标': [] };
    state.goals.forEach(g => {
      if (!groups[g.period]) groups[g.period] = [];
      groups[g.period].push(g);
    });

    container.innerHTML = '';
    Object.entries(groups).forEach(([period, goals]) => {
      if (!goals.length) return;
      const groupDiv = document.createElement('div');
      groupDiv.className = 'goal-group';
      groupDiv.innerHTML = `<div class="goal-group-title">${periodIcon(period)} ${period}</div>`;
      goals.forEach(goal => {
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.dataset.id = goal.id;
        card.innerHTML = `
          <span class="goal-tag">${period}</span>
          <div class="goal-header">
            <span class="goal-title" onclick="app.editGoal(${goal.id})" title="点击修改目标名称">${escapeHtml(goal.title)}</span>
            <button class="goal-edit" onclick="app.editGoal(${goal.id})" title="修改目标名称">✎</button>
            <button class="goal-delete" onclick="app.deleteGoal(${goal.id})" title="删除">×</button>
          </div>
          <div class="goal-progress-wrap">
            <input type="range" class="goal-slider" min="0" max="100" value="${goal.progress}" oninput="app.updateGoalProgress(${goal.id}, this.value)">
            <span class="goal-percent">${goal.progress}%</span>
          </div>
        `;
        groupDiv.appendChild(card);
      });
      container.appendChild(groupDiv);
    });
  }

  function editGoal(id) {
    const g = state.goals.find(x => x.id === id);
    if (!g) return;
    const span = document.querySelector(`.goal-card[data-id="${id}"] .goal-title`);
    beginInlineEdit(span, () => g.title, (v) => {
      g.title = (v.trim() || g.title);
      span.textContent = escapeHtml(g.title);
      saveData();
    });
  }

  function periodIcon(period) {
    if (period === '月目标') return '🌙';
    if (period === '学期目标') return '📚';
    return '🌍';
  }

  function addGoal() {
    const titleInput = document.getElementById('newGoalTitle');
    const periodSelect = document.getElementById('newGoalPeriod');
    const title = titleInput.value.trim();
    const period = periodSelect.value;
    if (!title) {
      titleInput.classList.add('shake');
      setTimeout(() => titleInput.classList.remove('shake'), 400);
      return;
    }
    state.goals.unshift({ id: Date.now(), title, period, progress: 0 });
    titleInput.value = '';
    saveData();
    renderGoals();
  }

  function updateGoalProgress(id, value) {
    const goal = state.goals.find(g => g.id === id);
    if (goal) {
      goal.progress = parseInt(value);
      const card = document.querySelector(`.goal-card[data-id="${id}"]`);
      if (card) card.querySelector('.goal-percent').textContent = goal.progress + '%';
      saveData();
    }
  }

  function deleteGoal(id) {
    state.goals = state.goals.filter(g => g.id !== id);
    saveData();
    renderGoals();
  }

  // 复盘统计
  function renderReview() {
    const streak = calcStreak();
    const streakEl = document.getElementById('streakNumber');
    streakEl.textContent = streak;
    streakEl.classList.remove('pop');
    void streakEl.offsetWidth;
    streakEl.classList.add('pop');

    const streakText = document.getElementById('streakText');
    if (streak === 0) streakText.textContent = '开始记录吧！';
    else if (streak < 3) streakText.textContent = '已连续记录 ' + streak + ' 天，继续加油！';
    else if (streak < 7) streakText.textContent = '已连续记录 ' + streak + ' 天，状态不错！';
    else streakText.textContent = '已连续记录 ' + streak + ' 天，太厉害了！';

    renderReviewStats();
    renderTimeline();
  }

  function getWeekDates() {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    const diffToMonday = day === 0 ? -6 : 1 - day; // 0=周日回到本周一(减6), 其余推到本周一
    start.setDate(today.getDate() + diffToMonday);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(formatDate(d));
    }
    return dates;
  }

  // 本周（周一至今天）的连续打卡天数，只统计有真实内容的记录
  function getWeekStreak() {
    const weekSet = new Set(getWeekDates());
    const isReal = r => r && (r.completion || r.moment || r.reflection || r.tomorrow || r.moodColor || r.rating || (r.photos && r.photos.length) || (r.tags && r.tags.length));
    const d = new Date(getToday() + 'T00:00:00');
    let found = null;
    while (weekSet.has(formatDate(d))) {
      if (isReal(state.records[formatDate(d)])) { found = new Date(d); break; }
      d.setDate(d.getDate() - 1);
    }
    if (!found) return 0;
    let count = 0;
    const cursor = new Date(found);
    while (weekSet.has(formatDate(cursor)) && isReal(state.records[formatDate(cursor)])) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function renderReviewStats() {
    const weekDates = getWeekDates();
    // 只统计真正有内容的记录，排除自动创建的空占位（如每日记录页生成的当天空记录）
    const isReal = r => r && (r.completion || r.moment || r.reflection || r.tomorrow || r.moodColor || r.rating || (r.photos && r.photos.length) || (r.tags && r.tags.length));
    const records = weekDates.map(d => state.records[d]).filter(isReal);
    const recordDays = records.length;
    const rated = records.filter(r => r.rating && r.rating > 0);
    const avg = rated.length ? (rated.reduce((a, b) => a + (b.rating || 0), 0) / rated.length).toFixed(1) : '0.0';

    const moodCount = {};
    records.forEach(r => {
      if (r.moodColor) moodCount[r.moodColor] = (moodCount[r.moodColor] || 0) + 1;
    });

    const doneTodos = getThisWeekTodos().filter(t => t.done).length;
    const streak = getWeekStreak();

    const statsEl = document.getElementById('reviewStats');
    statsEl.innerHTML = `
      <div class="review-stat">
        <div class="review-stat-value">${recordDays}/7</div>
        <div class="review-stat-label">记录天数</div>
      </div>
      <div class="review-stat">
        <div class="review-stat-value">${avg}</div>
        <div class="review-stat-label">平均评分</div>
      </div>
      <div class="review-stat">
        <div class="review-stat-value">${doneTodos}</div>
        <div class="review-stat-label">完成待办</div>
      </div>
      <div class="review-stat">
        <div class="review-stat-value">${streak}</div>
        <div class="review-stat-label">连续打卡</div>
      </div>
      <div class="review-stat" style="grid-column: span 2;">
        <div class="review-stat-value" style="font-size:18px;">情绪占比</div>
        <div class="mood-summary">
          ${Object.entries(moodCount).map(([color, count]) => `
            <div class="mood-summary-item">
              <span class="mood-summary-dot" style="background:${color}"></span>
              <span>${count}天</span>
            </div>
          `).join('') || '<span style="color:#9CA3AF">暂无数据</span>'}
        </div>
      </div>
    `;

    const mainColor = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mainColorName = mainColor ? (moodColors.find(m => m.value === mainColor)?.name?.split('/')[0].trim() || '') : '';
    document.getElementById('reviewSummaryText').textContent =
      `本周你记录了 ${recordDays} 天，平均评分 ${avg} 分${mainColorName ? '，心情以「' + mainColorName + '」为主' : ''}，完成了 ${doneTodos} 项待办。`;

    document.getElementById('weeklyInsight').value =
      state.weeklyInsight && typeof state.weeklyInsight === 'object' ? (state.weeklyInsight[getWeekStartKey(getToday())] || '') : '';
  }

  function saveWeeklyInsight() {
    if (!state.weeklyInsight || typeof state.weeklyInsight !== 'object') state.weeklyInsight = {};
    state.weeklyInsight[getWeekStartKey(getToday())] = document.getElementById('weeklyInsight').value;
    saveData();
  }

  function renderTimeline() {
    const container = document.getElementById('timeline');
    container.innerHTML = '';
    const weekDates = getWeekDates();

    weekDates.forEach(dateStr => {
      const record = state.records[dateStr];
      const div = document.createElement('div');
      div.className = 'timeline-item';
      div.onclick = () => div.classList.toggle('expanded');

      if (record) {
        const snippet = escapeHtml((record.completion || '').slice(0, 40) + ((record.completion || '').length > 40 ? '...' : ''));
        const photos = record.photos || [];
        const photoHtml = photos.length
          ? `<div class="timeline-photos"><span class="photo-thumb-wrap"><img src="${photos[0].dataUrl}" alt="照片" onclick="app.openRecordPhoto('${dateStr}','${photos[0].id}')"></span>${photos.length > 1 ? `<span class="timeline-photo-count">📷 共 ${photos.length} 张</span>` : '📷 有照片'}</div>`
          : '';
        div.innerHTML = `
          <div class="timeline-date">${formatDateCN(dateStr)} ${'★'.repeat(record.rating || 0)}${'☆'.repeat(5 - (record.rating || 0))} <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${record.moodColor || '#ccc'};vertical-align:middle;"></span></div>
          <div class="timeline-preview">${snippet || '（暂无内容摘要）'}</div>
          ${photoHtml}
          <div class="timeline-detail">
            ${record.moment ? `<p><strong>百态：</strong>${escapeHtml(record.moment)}</p>` : ''}
            ${record.reflection ? `<p><strong>反思：</strong>${escapeHtml(record.reflection)}</p>` : ''}
            ${record.tomorrow ? `<p><strong>明日计划：</strong>${escapeHtml(record.tomorrow)}</p>` : ''}
          </div>
        `;
      } else {
        div.innerHTML = `
          <div class="timeline-date">${formatDateCN(dateStr)}</div>
          <div class="timeline-empty">今日未记录</div>
        `;
      }
      container.appendChild(div);
    });
  }

  // 展示板块
  function renderDisplay() {
    renderDisplayCalendar();
    renderTrendChart();
  }

  function getLuminance(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function renderDisplayCalendar() {
    const { year, month, firstDay, daysInMonth } = getMonthDates(displayMonthOffset);
    document.getElementById('displayCalendarTitle').textContent = `${year}年${month + 1}月`;
    const container = document.getElementById('displayCalendar');
    container.innerHTML = '';

    const today = getToday();
    for (let i = 0; i < firstDay; i++) container.appendChild(document.createElement('div'));

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = state.records[dateStr];
      const mark = state.markedDates[dateStr];
      const div = document.createElement('div');
      div.className = 'calendar-day';

      const moodArr = record?.moodColors?.length
        ? record.moodColors.filter(Boolean)
        : (record?.moodColor ? [record.moodColor] : []);
      const tagEmoji = record?.tags?.length ? record.tags[0] : '';

      let inner = `<span>${d}</span>`;
      if (tagEmoji) inner += `<span class="day-emoji">${tagEmoji}</span>`;
      div.innerHTML = inner;

      if (moodArr.length === 1) {
        div.classList.add('recorded');
        div.style.setProperty('--record-color', moodArr[0]);
      } else if (moodArr.length > 1) {
        const step = 100 / moodArr.length;
        const stops = moodArr.map((c, i) => `${c} ${(i * step).toFixed(2)}%, ${c} ${((i + 1) * step).toFixed(2)}%`).join(', ');
        div.style.background = `linear-gradient(135deg, ${stops})`;
        div.classList.add('recorded-multi');
      }
      if (dateStr === today) div.classList.add('today');
      if (mark) {
        if (mark.type === 'star') div.classList.add('marked-star');
        if (mark.type === 'color') {
          div.classList.add('marked-color');
          div.style.setProperty('--mark-color', mark.color);
        }
      }
      div.onclick = e => handleCalendarDayClick(e, dateStr, div);
      container.appendChild(div);
    }
  }

  function changeDisplayMonth(delta) {
    displayMonthOffset += delta;
    renderDisplayCalendar();
  }

  function handleCalendarDayClick(e, dateStr, el) {
    currentMarkDate = dateStr;
    const menu = document.getElementById('markMenu');
    const rect = el.getBoundingClientRect();
    menu.style.display = 'block';
    menu.style.left = Math.min(rect.left, window.innerWidth - 200) + 'px';
    menu.style.top = (rect.bottom + 8) + 'px';

    const closeMenu = ev => {
      if (!menu.contains(ev.target) && ev.target !== el) {
        menu.style.display = 'none';
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
  }

  function markDate(type, color) {
    if (!currentMarkDate) return;
    if (type === 'star') state.markedDates[currentMarkDate] = { type: 'star' };
    if (type === 'color') state.markedDates[currentMarkDate] = { type: 'color', color };
    saveData();
    renderDisplayCalendar();
    renderMiniCalendar();
    document.getElementById('markMenu').style.display = 'none';
  }

  function unmarkDate() {
    if (!currentMarkDate) return;
    delete state.markedDates[currentMarkDate];
    saveData();
    renderDisplayCalendar();
    renderMiniCalendar();
    document.getElementById('markMenu').style.display = 'none';
  }

  function renderTrendChart() {
    const svg = document.getElementById('trendChart');
    const wrap = document.getElementById('trendChartWrap');
    const empty = document.getElementById('chartEmpty');
    const dates = [];
    const today = new Date();
    for (let i = chartRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(formatDate(d));
    }

    const data = dates.map(d => ({ date: d, rating: state.records[d]?.rating || 0 }));
    const hasData = data.some(d => d.rating > 0);

    if (!hasData) {
      wrap.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    wrap.style.display = 'block';
    empty.style.display = 'none';

    const width = wrap.clientWidth || 600;
    const height = 240;
    const padding = 36;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const maxY = 5;
    const stepX = chartW / (data.length - 1 || 1);

    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = padding + chartH - (d.rating / maxY) * chartH;
      return { x, y, ...d };
    });

    const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    let circles = '';
    let labels = '';
    points.forEach((p, i) => {
      circles += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#22c55e" />`;
      if (i % Math.ceil(chartRange / 7) === 0 || chartRange <= 7) {
        labels += `<text x="${p.x}" y="${height - 10}" text-anchor="middle" font-size="11" fill="var(--text-sub)">${p.date.slice(5)}</text>`;
      }
      if (p.rating > 0) {
        labels += `<text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="11" fill="var(--primary-hover)">${p.rating}</text>`;
      }
    });

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.innerHTML = `
      <line x1="${padding}" y1="${padding + chartH}" x2="${width - padding}" y2="${padding + chartH}" stroke="var(--border-green)" stroke-width="1"/>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartH}" stroke="var(--border-green)" stroke-width="1"/>
      <polyline points="${linePoints}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
      ${labels}
    `;
  }

  function setChartRange(range, btn) {
    chartRange = range;
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderTrendChart();
  }

  // 第三视角 · 个人洞察
  const moodFamilies = {
    yellow: { name: '黄色系', theme: '积极阳光', desc: '这个月你比较多地感受到快乐、温暖和满足，像被阳光照着。这说明你心里有很多明亮的角落，也值得被好好珍惜。' },
    orange: { name: '橙色系', theme: '热情活力', desc: '这个月你充满行动力，像小太阳一样在燃烧。有热情是好事，也记得在冲刺后给自己留一点缓冲。' },
    pink: { name: '粉色系', theme: '温柔情感', desc: '这个月你的情感世界很丰富，可能被关系、被细节打动。这种敏感让你更懂得爱与被爱。' },
    red: { name: '红色系', theme: '强烈情绪', desc: '这个月你经历了一些比较强烈的情绪，可能是愤怒、烦躁或兴奋。强烈说明你在乎，给自己一些时间消化，它们会过去的。' },
    green: { name: '绿色系', theme: '生机与平静', desc: '这个月整体稳定而有生命力，像植物在安静地生长。你在一点点扎根，这种节奏其实很健康。' },
    cyan: { name: '青蓝色系', theme: '清醒与忧郁', desc: '这个月你常常清醒、思考，也可能伴随一些低落。思考让你成熟，但也别忘了让大脑休息。' },
    purple: { name: '紫色系', theme: '迷茫梦幻', desc: '这个月你可能在憧憬和困惑之间游走。不确定并不可怕，它往往意味着你正在靠近新的方向。' },
    gray: { name: '灰色系', theme: '平淡与麻木', desc: '这个月你似乎有些疲惫或麻木，像是电量不足。这不是懒，是身体在提醒你需要真正的休息。' },
    brown: { name: '棕褐色系', theme: '焦虑沉重', desc: '这个月你可能承受了不小的压力，有些沉重。请允许自己寻求帮助或暂时放下，你不需要一个人扛所有事。' }
  };

  function getMoodFamily(color) {
    const map = {
      '#FDE047': 'yellow', '#FACC15': 'yellow', '#FEF3C7': 'yellow',
      '#FB923C': 'orange', '#F97316': 'orange', '#EA580C': 'orange',
      '#F472B6': 'pink', '#F9A8D4': 'pink', '#EC4899': 'pink',
      '#B91C1C': 'red', '#DC2626': 'red',
      '#4ADE80': 'green', '#86EFAC': 'green', '#5ECCB8': 'green', '#0F766E': 'green', '#A7F3D0': 'green',
      '#38BDF8': 'cyan', '#22D3EE': 'cyan', '#3B82F6': 'cyan', '#60A5FA': 'cyan', '#64748B': 'cyan',
      '#5B4B8A': 'purple', '#8B5CF6': 'purple', '#C084FC': 'purple', '#DDD6FE': 'purple',
      '#CBD5E1': 'gray', '#94A3B8': 'gray', '#6B7280': 'gray',
      '#D97706': 'brown', '#78716C': 'brown'
    };
    return map[color] || 'green';
  }

  function getRecordsArray() {
    return Object.entries(state.records)
      .map(([date, r]) => ({ date, ...r }))
      .filter(r => r.rating || r.moodColor || r.completion || r.moment || r.reflection || (r.tags && r.tags.length))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function avgRating(records) {
    if (!records.length) return 0;
    return records.reduce((s, r) => s + (r.rating || 0), 0) / records.length;
  }

  function getWeekRecords() {
    const weekDates = new Set(getWeekDates());
    return getRecordsArray().filter(r => weekDates.has(r.date));
  }

  function getMonthRecords() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return getRecordsArray().filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  function formatNumber(n) {
    return Number.isFinite(n) ? n.toFixed(1) : '0.0';
  }

  function getRecentRecords(n) {
    return getRecordsArray().slice(-n);
  }

  // —— 方案3 · 综合洞察核心 ——
  // 真低谷判定：只有 1-2 星才算低谷。3 星一律视为"平静/中平"，与情绪色无关。
  function isLowSignal(r) {
    if (!r) return false;
    return r.rating >= 1 && r.rating <= 2;
  }

  function emotionLevel(records) {
    const rated = records.filter(r => r.rating);
    if (!rated.length) return 'mid';
    const avg = avgRating(rated);
    if (avg >= 4) return 'high';
    if (avg >= 3) return 'mid';
    return 'low';
  }

  const THEMES = [
    { key: '学习', icon: '📚', words: ['学习','考试','上课','作业','复习','课程','论文','读书','老师','单词','测验'] },
    { key: '人际', icon: '👫', words: ['朋友','家人','妈妈','爸爸','同学','室友','聊天','一起','见面','陪伴','社团','学姐','约'] },
    { key: '自然', icon: '🌿', words: ['花','草','树','云','天空','雨','阳光','风','叶','海','山','星星','月亮','猫','狗','小鸟'] },
    { key: '身体', icon: '🛌', words: ['累','困','睡','熬夜','头痛','生病','疲惫','失眠','起床','跑','运动','感冒'] },
    { key: '事务', icon: '🗂️', words: ['工作','任务','项目','部门','例会','汇报','会议','安排','清单','完成','打卡'] },
    { key: '情绪', icon: '💭', words: ['焦虑','紧张','担心','烦','难过','哭','生气','压力','迷茫','不开心','孤独','emo'] },
    { key: '成长', icon: '🌱', words: ['目标','计划','坚持','进步','成长','自律','变好','突破','收获','学到'] }
  ];

  function extractThemes(records) {
    const text = records.map(r => (r.reflection || '') + ' ' + (r.moment || '') + ' ' + (r.completion || '')).join(' ');
    return THEMES.map(t => {
      let c = 0;
      t.words.forEach(w => { const m = text.match(new RegExp(w, 'g')); if (m) c += m.length; });
      return { key: t.key, icon: t.icon, count: c };
    }).filter(t => t.count > 0).sort((a, b) => b.count - a.count).slice(0, 3);
  }

  // 分层情绪反馈 + 模板化综合报告
  function renderReport() {
    const container = document.getElementById('reportBlock');
    if (!container) return;
    const all = getRecordsArray();
    if (all.length < 3) {
      container.innerHTML = '<div class="insight-item"><div class="insight-text">记录满 3 天之后，我会为你生成一份「只属于你的综合洞察」🪄 再坚持几天就好。</div></div>';
      return;
    }

    const month = getMonthRecords();
    const pool = month.length >= 3 ? month : getRecentRecords(14);
    const level = emotionLevel(pool);
    const weather = {
      high: { emoji: '☀️', title: '你的状态天气是「晴朗」', line: '这段时间的你能量很高，像被阳光晒得很暖。这样发着光的日子，值得被好好记住和庆祝。' },
      mid: { emoji: '🌤️', title: '你的状态天气是「多云转晴」', line: '平稳里有一点波动，是很健康的节奏。你已经在自己的步调里，不必总要求自己做到最好。' },
      low: { emoji: '🌧️', title: '你的状态天气是「细雨」', line: '你最近有些被消耗，请一定先照顾好自己。愿意把这些记录下来，不是软弱，是你正在努力撑住。' }
    }[level];

    // 转变（前半段 vs 后半段）
    let shiftHtml = '';
    const dates = pool.map(r => r.date).sort();
    if (dates.length >= 4) {
      const midD = dates[Math.floor(dates.length / 2)];
      const a = pool.filter(r => r.date <= midD && r.rating);
      const b = pool.filter(r => r.date > midD && r.rating);
      if (a.length && b.length) {
        const av = avgRating(a), bv = avgRating(b);
        const txt = bv > av + 0.3
          ? `前面平均 ${formatNumber(av)} 分 → 现在平均 ${formatNumber(bv)} 分，整体在慢慢升温。你正在把自己一点点找回来。`
          : av > bv + 0.3
          ? `前面平均 ${formatNumber(av)} 分 → 现在平均 ${formatNumber(bv)} 分，气流略有回落。不是你不够好，可能只是在蓄力，先松一松。`
          : `前面平均 ${formatNumber(av)} 分 → 现在平均 ${formatNumber(bv)} 分，整体保持在一个平稳波段。稳定，也是一种了不起的能力。`;
        shiftHtml = `<div class="insight-item"><div class="insight-title">📈 你的状态曲线</div><div class="insight-text">${txt}</div></div>`;
      }
    }

    // 反复在想的事（高频词）
    let themeHtml = '';
    const themes = extractThemes(pool);
    if (themes.length) {
      themeHtml = `<div class="insight-item" style="border-left-color:#60A5FA;"><div class="insight-title">🗝️ 你最近反复在想</div><div class="insight-text">${themes.map(t => `${t.icon} ${t.key}`).join('、')}。你在这几件事上花了很多心思，它们大概率就是你近期真正在意的重心。</div></div>`;
    }

    // 高光 + 低谷
    const sorted = pool.filter(r => r.rating && typeof r.rating === 'number').sort((p, q) => q.rating - p.rating);
    let peaksHtml = '';
    if (sorted.length) {
      const top = sorted[0], bot = sorted[sorted.length - 1];
      const clip = s => s ? escapeHtml(s.slice(0, 30)) + (s.length > 30 ? '…' : '') : '';
      const topTxt = top.moment ? '：' + clip(top.moment) : '';
      const botTxt = isLowSignal(bot)
        ? `有一道<strong>${formatDateCN(bot.date)}</strong>（${bot.rating}★）的低谷，请记得抱抱那天的自己。`
        : `最平缓的一天是 <strong>${formatDateCN(bot.date)}</strong>（${bot.rating}★），那也是真实生活的一部分。`;
      peaksHtml = `<div class="insight-item" style="border-left-color:#F59E0B;"><div class="insight-title">✨ 高光与低谷</div><div class="insight-text">最闪亮的是 <strong>${formatDateCN(top.date)}</strong>（${top.rating}★）${topTxt}。<br>${botTxt}</div></div>`;
    }

    // 按状态等级给出不同强度的行动建议（分级）
    const action = {
      high: '趁状态好，选一件搁置已久的「重要小事」推进 10 分钟，把好状态用在刀刃上。',
      mid: '明天写下「今天最想完成的一件小事」，只写一件然后去做到，你会发现一天更有方向。',
      low: '今晚给自己 15 分钟放松：听首喜欢的歌、泡杯茶、看看窗外的天。恢复，也是行动。'
    }[level];

    container.innerHTML = `
      <div class="insight-item" style="border-left-color:#F59E0B;text-align:center;">
        <div class="insight-title" style="font-size:16px;">${weather.emoji} ${weather.title}</div>
        <div class="insight-text" style="max-width:420px;margin:0 auto;">${weather.line}</div>
      </div>
      ${shiftHtml}
      ${themeHtml}
      ${peaksHtml}
      <div class="insight-item" style="border-left-color:#22C55E;">
        <div class="insight-title">🪄 给「现在」的你一个小行动</div>
        <div class="insight-text"><strong>${action}</strong></div>
        <div class="insight-encourage">慢慢来，我会一直陪你看清自己。</div>
      </div>
    `;
  }

  function renderInsights() {
    renderInsightStatus();
    renderReport();
    renderWeeklyInsights();
    renderMonthlyInsights();
    renderSuggestions();
    document.getElementById('compareResult').classList.remove('show');
  }

  function renderInsightStatus() {
    const all = getRecordsArray();
    const week = getWeekRecords();
    const el = document.getElementById('insightStatus');
    if (all.length < 3) {
      el.innerHTML = '再记录几天，我就能帮你发现专属自己的小规律啦，不着急 🌱<br><small>当前已记录 <strong>' + all.length + '</strong> 天</small>';
    } else if (all.length < 8) {
      el.innerHTML = '已经记录 <strong>' + all.length + '</strong> 天啦，样本还不多，但这些小信号已经在出现 ✨<br><small>本周有 ' + week.length + ' 天记录</small>';
    } else {
      el.innerHTML = '已经记录 <strong>' + all.length + '</strong> 天，本周 <strong>' + week.length + '</strong> 天有记录。<br><small>数据越多，洞察越温柔准确</small>';
    }
  }

  function createInsightItem(title, data, text, encourage) {
    return `
      <div class="insight-item">
        <div class="insight-title">${title}</div>
        <div class="insight-data">${data}</div>
        <div class="insight-text">${text}</div>
        <div class="insight-encourage">${encourage}</div>
      </div>
    `;
  }

  function renderWeeklyInsights() {
    const container = document.getElementById('weeklyInsights');
    const records = getWeekRecords();
    if (records.length < 2) {
      container.innerHTML = '<div class="insight-item"><div class="insight-text">本周记录还比较少，等再多记录几天，我会帮你发现这周的隐藏模式 🌱</div></div>';
      return;
    }

    const items = [];

    // 1. 情绪颜色与评分
    const moodGroups = {};
    records.forEach(r => {
      if (!r.moodColor) return;
      if (!moodGroups[r.moodColor]) moodGroups[r.moodColor] = [];
      moodGroups[r.moodColor].push(r);
    });
    const moodStats = Object.entries(moodGroups)
      .map(([color, list]) => ({ color, count: list.length, avg: avgRating(list), name: moodColors.find(m => m.value === color)?.name || '' }))
      .filter(s => s.count >= 1)
      .sort((a, b) => b.avg - a.avg);
    if (moodStats.length >= 2) {
      const best = moodStats[0];
      items.push(createInsightItem(
        '你的「高效燃料」情绪',
        `这周你选择「${best.name}」的 ${best.count} 天，平均评分 <strong>${formatNumber(best.avg)}</strong> 分，是本周状态最好的情绪色。`,
        `这说明当你处于「${best.name.split('/')[0].trim()}」的状态时，更容易对自己满意，也更可能进入顺流。这不是偶然，而是你的一个内在节奏。`,
        '下次有重要任务时，可以先花几分钟让自己进入这种颜色代表的状态，效率会悄悄提升。'
      ));
    }

    // 2. 周几与情绪
    const weekdayGroups = [[], [], [], [], [], [], []];
    records.forEach(r => weekdayGroups[new Date(r.date).getDay()].push(r));
    const weekdayAvgs = weekdayGroups.map((list, i) => ({ day: i, count: list.length, avg: avgRating(list) })).filter(x => x.count > 0);
    const lowestDay = weekdayAvgs.slice().sort((a, b) => a.avg - b.avg)[0];
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    if (lowestDay && lowestDay.avg <= 2.5) {
      items.push(createInsightItem(
        `${dayNames[lowestDay.day]}似乎是你的低压日`,
        `这周${dayNames[lowestDay.day]}的平均评分为 <strong>${formatNumber(lowestDay.avg)}</strong> 分，是七天里相对比较有压力的一个节点。`,
        '这不代表你不够好，更可能来自环境或节律。能看见它的存在，就已经是改变的开始。',
        `试试在${dayNames[lowestDay.day]}预留 15 分钟只做让自己放松的小事，这不是偷懒，是在给自己的状态蓄电。`
      ));
    } else if (lowestDay && lowestDay.avg <= 3.2) {
      items.push(createInsightItem(
        `${dayNames[lowestDay.day]}可能是你的「喘息日」`,
        `这周${dayNames[lowestDay.day]}的平均评分约 <strong>${formatNumber(lowestDay.avg)}</strong> 分，是七天里的一个缓冲带。`,
        '评分不太高不等于低谷，有时这只是身体在说「我需要慢一点」。这种节奏是正常的。',
        `那天不必排满，留一点空白给自己，你会慢慢发现它其实保护了你这周剩下的日子。`
      ));
    }

    // 3. 反思字数与评分
    const lowRating = records.filter(r => r.rating && r.rating <= 2);
    const highRating = records.filter(r => r.rating && r.rating >= 4);
    if (lowRating.length && highRating.length) {
      const lowLen = lowRating.reduce((s, r) => s + (r.reflection || '').length, 0) / lowRating.length;
      const highLen = highRating.reduce((s, r) => s + (r.reflection || '').length, 0) / highRating.length;
      if (lowLen > highLen * 1.2) {
        items.push(createInsightItem(
          '低落时，你更擅长向内看',
          `评分较低的日子里，你的反思平均 <strong>${formatNumber(lowLen)}</strong> 字；而高评分日子里平均 <strong>${formatNumber(highLen)}</strong> 字。`,
          '这说明你在情绪低落时，倾向于更深刻地思考自己。这种「在困境中寻找意义」的能力很珍贵，它让你不会被情绪吞没。',
          '难过的时候写下来，就是已经在照顾自己。你比自己想象中更有力量。'
        ));
      }
    }

    // 4. 记录早晚
    const morning = records.filter(r => r.updatedAt && new Date(r.updatedAt).getHours() < 12);
    const evening = records.filter(r => r.updatedAt && new Date(r.updatedAt).getHours() >= 18);
    if (morning.length && evening.length) {
      const mAvg = avgRating(morning);
      const eAvg = avgRating(evening);
      if (mAvg > eAvg + 0.5) {
        items.push(createInsightItem(
          '早晨记录的你，状态更明亮',
          `早晨记录的日子平均评分 <strong>${formatNumber(mAvg)}</strong> 分，晚上记录的平均 <strong>${formatNumber(eAvg)}</strong> 分。`,
          '这可能是因为早晨的你还没被一天的琐事消耗，心境更开阔。也说明你很适合用记录开启一天。',
          '如果愿意，可以试试每天起床后先写一句今天最想完成的小事，给自己一个温柔的起点。'
        ));
      }
    }

    // 5. 连续打卡
    const streak = calcStreak();
    if (streak >= 3) {
      const streakRecords = getRecordsArray().slice(-streak);
      const avg = avgRating(streakRecords);
      items.push(createInsightItem(
        '坚持记录本身就在滋养你',
        `你已经连续记录 <strong>${streak}</strong> 天，这期间平均评分 <strong>${formatNumber(avg)}</strong> 分。`,
        '持续记录让你更清楚地看见自己，这种自我觉察本身就是一种治愈。你不需要完美，只需要继续。',
        '无论明天发生什么，记得留下一句话给自己。你会感谢现在坚持的自己。'
      ));
    }

    // 6. 高光内容
    const highMoments = records.filter(r => r.rating >= 4 && r.moment);
    if (highMoments.length) {
      const natureWords = /花|草|树|云|天空|雨|阳光|风|叶|海|山|星星|月亮/;
      const peopleWords = /朋友|家人|妈妈|爸爸|老师|同学|聊天|一起|见面|陪伴|爱|谢谢|温暖/;
      const natureCount = highMoments.filter(r => natureWords.test(r.moment)).length;
      const peopleCount = highMoments.filter(r => peopleWords.test(r.moment)).length;
      if (peopleCount >= 2) {
        items.push(createInsightItem(
          '人际连接是你的快乐来源',
          `这周 ${highMoments.length} 个高评分记录里，有 <strong>${peopleCount}</strong> 个提到了与人有关的温暖瞬间。`,
          '你很容易被关系里的善意打动，这说明你是一个重感情、也懂得爱的人。关系对你来说，不只是陪伴，更是能量。',
          '感到低落时，不妨主动联系一个让你舒服的人，哪怕只是发一句「今天还好吗」。'
        ));
      } else if (natureCount >= 2) {
        items.push(createInsightItem(
          '自然小事最容易治愈你',
          `这周 ${highMoments.length} 个高评分记录里，有 <strong>${natureCount}</strong> 个提到了自然或天气相关的小美好。`,
          '你对世界的细微之美很敏感，一片云、一阵风都能让你开心。这种感知力是很温柔的礼物。',
          '状态不好的时候，去窗边看看天空，或者出门走几分钟，大自然会 quietly 接住你。'
        ));
      }
    }

    // 保证 3-5 条
    const finalItems = items.slice(0, 5);
    if (finalItems.length < 3) {
      finalItems.push(createInsightItem(
        '本周的你，已经在认真生活',
        `这周你记录了 <strong>${records.length}</strong> 天，平均评分 <strong>${formatNumber(avgRating(records))}</strong> 分。`,
        '即使没有特别突出的规律，愿意每天停下来看看自己，本身就是一种很棒的能力。',
        '继续记录下去，更多属于你的小规律会慢慢浮现。'
      ));
    }
    container.innerHTML = finalItems.join('');
  }

  function renderMonthlyInsights() {
    const container = document.getElementById('monthlyInsights');
    const records = getMonthRecords();
    if (records.length < 2) {
      container.innerHTML = '<div class="insight-item"><div class="insight-text">本月记录还不够多，等记录再多一些，我会为你生成更完整的月度画像 🌙</div></div>';
      return;
    }

    // 情绪主旋律
    const familyCount = {};
    records.forEach(r => {
      if (!r.moodColor) return;
      const f = getMoodFamily(r.moodColor);
      familyCount[f] = (familyCount[f] || 0) + 1;
    });
    const dominant = Object.entries(familyCount).sort((a, b) => b[1] - a[1])[0];
    const themeInfo = dominant ? moodFamilies[dominant[0]] : moodFamilies.green;
    const totalColored = records.filter(r => r.moodColor).length;
    const percent = totalColored ? Math.round((dominant[1] / totalColored) * 100) : 0;

    let themeHtml = '';
    if (dominant) {
      themeHtml = `
        <div class="monthly-theme">
          <div class="monthly-theme-name">${themeInfo.name} · ${themeInfo.theme} (${percent}%)</div>
          <div class="monthly-theme-desc">${themeInfo.desc}</div>
        </div>
      `;
    }

    // 高光与低谷
    const sortedByRating = records.filter(r => r.rating).sort((a, b) => b.rating - a.rating);
    const highest = sortedByRating[0];
    const lowest = sortedByRating[sortedByRating.length - 1];

    const highTags = highest && highest.tags && highest.tags.length ? highest.tags.map(e => getTagLabel(e) || e).join('、') : '';
    const lowTags = lowest && lowest.tags && lowest.tags.length ? lowest.tags.map(e => getTagLabel(e) || e).join('、') : '';

    const highlightHtml = highest ? `
      <div class="monthly-block">
        <div class="monthly-block-title">✨ 高光时刻</div>
        <div class="monthly-block-body">
          <strong>${formatDateCN(highest.date)}</strong>，你给了自己 <strong>${highest.rating}</strong> 分。<br>
          ${highest.moment ? '那天让你印象深刻的是：' + escapeHtml(highest.moment.slice(0, 40)) + (highest.moment.length > 40 ? '…' : '') + '<br>' : ''}
          ${highTags ? '标签：' + highTags + '<br>' : ''}
          你值得记住这种被点亮的感觉。
        </div>
      </div>
    ` : '';

    let lowHtml = '';
    if (lowest && isLowSignal(lowest)) {
      lowHtml = `
      <div class="monthly-block">
        <div class="monthly-block-title">🌧️ 低谷信号</div>
        <div class="monthly-block-body">
          <strong>${formatDateCN(lowest.date)}</strong>，评分 <strong>${lowest.rating}</strong> 分。<br>
          ${lowest.moodColor ? '情绪色是「' + escapeHtml(moodColors.find(m => m.value === lowest.moodColor)?.name || '') + '」。<br>' : ''}
          ${lowTags ? '标签：' + lowTags + '<br>' : ''}
          低谷不是失败，它在提醒你需要被照顾。
        </div>
      </div>
    `;
    } else if (lowest && lowest.rating === 3) {
      lowHtml = `
      <div class="monthly-block">
        <div class="monthly-block-title">🌤️ 相对平静的一天</div>
        <div class="monthly-block-body">
          <strong>${formatDateCN(lowest.date)}</strong>，你给了自己 <strong>${lowest.rating}</strong> 分。<br>
          ${lowest.moodColor ? '情绪色是「' + escapeHtml(moodColors.find(m => m.value === lowest.moodColor)?.name || '') + '」。<br>' : ''}
          3 分是「平静」，不是低谷。这样稳稳的日子，也是在好好生活。
        </div>
      </div>
    `;
    }

    // 成长节奏
    const dates = records.map(r => r.date).sort();
    let rhythmHtml = '';
    if (dates.length >= 4) {
      const mid = dates[Math.floor(dates.length / 2)];
      const firstHalf = records.filter(r => r.date <= mid && r.rating);
      const secondHalf = records.filter(r => r.date > mid && r.rating);
      if (firstHalf.length && secondHalf.length) {
        const firstAvg = avgRating(firstHalf);
        const secondAvg = avgRating(secondHalf);
        let rhythmText = '';
        if (secondAvg > firstAvg + 0.3) {
          rhythmText = `月初平均 <strong>${formatNumber(firstAvg)}</strong> 分，月末平均 <strong>${formatNumber(secondAvg)}</strong> 分，整体呈 <strong>上升</strong> 趋势。你在慢慢找回状态，这很棒。`;
        } else if (secondAvg < firstAvg - 0.3) {
          rhythmText = `月初平均 <strong>${formatNumber(firstAvg)}</strong> 分，月末平均 <strong>${formatNumber(secondAvg)}</strong> 分，这个月似乎有些 <strong>下滑</strong>。这不是你的错，可能是消耗太大，先好好休息。`;
        } else {
          rhythmText = `月初和月末的评分基本持平，整体在 <strong>稳定波动</strong>。稳定本身就是一种力量，说明你已经在自己的节奏里。`;
        }
        rhythmHtml = `
          <div class="monthly-block">
            <div class="monthly-block-title">📈 成长节奏</div>
            <div class="monthly-block-body">${rhythmText}</div>
          </div>
        `;
      }
    }

    // 能力标签
    const labels = [];
    if (calcMaxStreak() >= 14) labels.push({ name: '坚持型', text: '你不需要外力 push，自己就能把一件事做下去，这是很难得的能力。' });
    const uniqueColors = new Set(records.filter(r => r.moodColor).map(r => r.moodColor)).size;
    if (uniqueColors >= 8) labels.push({ name: '情绪细腻型', text: '你能感受到很多细微的情绪，这说明你对自己很诚实，也很有感知力。' });
    const weekTodos = getThisWeekTodos();
    const doneTodos = weekTodos.filter(t => t.done).length;
    const todoRate = weekTodos.length ? doneTodos / weekTodos.length : 0;
    if (weekTodos.length >= 5 && todoRate >= 0.8) labels.push({ name: '执行力强', text: '想到就做，不拖延，这是你很大的优势。' }
           );
    const avgReflection = records.reduce((s, r) => s + (r.reflection || '').length, 0) / records.length;
    if (avgReflection >= 30) labels.push({ name: '内省型', text: '你愿意花时间理解自己，这种向内看的能力会让你成长得更快。' });
    const peopleWords = /朋友|家人|妈妈|爸爸|老师|同学|聊天|一起|见面|陪伴|爱|谢谢|温暖/;
    const relationCount = records.filter(r => peopleWords.test(r.moment || '')).length;
    if (relationCount >= 3) labels.push({ name: '重视关系型', text: '温暖的人际连接是你重要的能量来源。' });
    const goalProgress = state.goals.length ? state.goals.reduce((s, g) => s + (g.progress || 0), 0) / state.goals.length : 0;
    if (state.goals.length && goalProgress >= 20) labels.push({ name: '目标导向型', text: '你清楚自己要什么，也在一步步靠近。' });

    const labelsHtml = labels.length ? `
      <div class="insight-item" style="border-left-color:#C084FC;">
        <div class="insight-title">你的能力标签</div>
        <div class="ability-tags">
          ${labels.map(l => `<span class="ability-tag"><strong>${l.name}</strong> · ${l.text}</span>`).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = themeHtml + `
      <div class="monthly-grid">
        ${highlightHtml}
        ${lowHtml}
        ${rhythmHtml}
      </div>
    ` + labelsHtml;
  }

  function compareInsight(type) {
    const resultEl = document.getElementById('compareResult');
    const records = getRecordsArray();
    let html = '';
    const sect = (t, c, a) =>
      `<p style="margin:4px 0;"><span style="display:inline-block;min-width:64px;font-weight:700;color:#F59E0B;">${t}</span>${c}</p>` +
      `<p style="margin:6px 0 0 64px;font-weight:600;">${a}</p>`;

    if (type === 'mood-efficiency') {
      const groups = {};
      records.forEach(r => { if (!r.moodColor) return; (groups[r.moodColor] = groups[r.moodColor] || []).push(r); });
      const stats = Object.entries(groups)
        .map(([color, list]) => ({ name: moodColors.find(m => m.value === color)?.name || '', count: list.length, avg: avgRating(list) }))
        .filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg);
      if (stats.length >= 2) {
        const best = stats[0], worst = stats[stats.length - 1];
        html = sect('📊 情况', `当情绪是「<strong>${best.name}</strong>」时，你平均给自己 <strong>${formatNumber(best.avg)}</strong> 分；而当情绪是「<strong>${worst.name}</strong>」时，平均只有 <strong>${formatNumber(worst.avg)}</strong> 分。`,
          `→ 你心情好的时候，会觉得一天更顺、更值得。`)
          + sect('🧠 这说明', `「${best.name.split('/')[0].trim()}」的状态对你很有帮助，能让你对自己更满意。它不是运气，是你可以主动靠近的状态。`,
           `✅ 你可以：下次要做重要的事之前，先用你的方式让自己进入这种好状态——比如先听一首喜欢的歌。`);
      } else {
        html = '<p>情绪颜色的数据还不够多，再多记录几天，我就能帮你看得更准啦。</p>';
      }
    } else if (type === 'rating-reflection') {
      const high = records.filter(r => r.rating >= 4);
      const low = records.filter(r => r.rating && r.rating <= 2);
      if (high.length && low.length) {
        const hLen = high.reduce((s, r) => s + (r.reflection || '').length, 0) / high.length;
        const lLen = low.reduce((s, r) => s + (r.reflection || '').length, 0) / low.length;
        html = sect('📊 情况', `心情好的时候，你平均会写 <strong>${formatNumber(hLen)}</strong> 字反思；心情低落的时候，反而平均写 <strong>${formatNumber(lLen)}</strong> 字。`,
          `→ 越难过，你越会写下来倾诉。`)
          + sect('🧠 这说明', `你不开心时靠文字来消化情绪，这是在照顾自己，不是钻牛角尖。`,
           `✅ 你可以：隔几天翻回那段低潮期的记录，给当时的自己回一句话，你会发现自己已经走出来了。`);
      } else {
        html = '<p>目前高和低的记录都还不够，继续记录，这个对比会慢慢有意义。</p>';
      }
    } else if (type === 'plan-completion') {
      const withP = records.filter(r => r.tomorrow && r.tomorrow.trim());
      const withoutP = records.filter(r => !r.tomorrow || !r.tomorrow.trim());
      if (withP.length && withoutP.length) {
        const wA = avgRating(withP), oA = avgRating(withoutP);
        html = sect('📊 情况', `写了「明日计划」的日子，平均 <strong>${formatNumber(wA)}</strong> 分；没写计划的日子，平均 <strong>${formatNumber(oA)}</strong> 分。`,
          `→ 提前写下明天要做的事，第二天会更有方向。`)
          + sect('🧠 这说明', `哪怕只写一行「明天先做什么」，也能帮你少一点醒来时的茫然。`,
           `✅ 你可以：今晚睡前试写一行「明天最先做的一件事」，连做几天，看看心情有没有变好一点。`);
      } else {
        html = '<p>目前关于计划的记录还不够，试写一次「明日计划」，观察会不会带来变化。</p>';
      }
    }

    resultEl.innerHTML = html;
    resultEl.classList.add('show');
  }

  function renderSuggestions() {
    const container = document.getElementById('suggestList');
    const records = getRecordsArray();
    const week = getWeekRecords();
    const suggestions = [];

    // 周中低谷建议
    const weekdayGroups = [[], [], [], [], [], [], []];
    week.forEach(r => weekdayGroups[new Date(r.date).getDay()].push(r));
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const lowDay = weekdayGroups.map((list, i) => ({ day: i, avg: avgRating(list), count: list.length })).filter(x => x.count > 0).sort((a, b) => a.avg - b.avg)[0];
    if (lowDay && lowDay.avg <= 2.5) {
      suggestions.push({
        icon: '🍵',
        text: `你<strong>${dayNames[lowDay.day]}</strong>的情绪评分偏低，可能是这一天压力比较大。不妨在这天预留 15 分钟只做让自己放松的事，这不是偷懒，是蓄力。`
      });
    }

    // 平静状态建议
    const moodGroups = {};
    records.forEach(r => { if (r.moodColor) { moodGroups[r.moodColor] = moodGroups[r.moodColor] || []; moodGroups[r.moodColor].push(r); } });
    const calmColor = ['#0F766E', '#5ECCB8', '#A7F3D0', '#22D3EE'].find(c => moodGroups[c] && moodGroups[c].length >= 2 && avgRating(moodGroups[c]) >= 4);
    if (calmColor) {
      suggestions.push({
        icon: '🌿',
        text: '数据显示你在<strong>平静状态</strong>下效率/评分更高。下次有重要任务时，可以先做几次深呼吸或听一首喜欢的歌，再开始会比硬做更顺。'
      });
    }

    // 计划拆分建议
    const weekTasks = getThisWeekTasks();
    const weekTodos = getThisWeekTodos();
    const weeklyProgress = weekTasks.length ? weekTasks.filter(t => t.done).length / weekTasks.length : 1;
    const todoProgress = weekTodos.length ? weekTodos.filter(t => t.done).length / weekTodos.length : 1;
    if (weekTasks.length && weeklyProgress < todoProgress - 0.2) {
      suggestions.push({
        icon: '🪜',
        text: '你的周计划完成率比日待办低一些，可能是因为周目标看起来太大。试着在周日晚上把下周目标拆成 3-5 个「最小的下一步」，会更容易启动。'
      });
    }

    // 反思建议
    if (records.length >= 5 && records.reduce((s, r) => s + (r.reflection || '').length, 0) / records.length < 10) {
      suggestions.push({
        icon: '🪞',
        text: '你的反思大多比较简短，没关系。哪怕每天只写一句话「今天我学到了____」，也能帮你更清楚地看见自己的成长轨迹。'
      });
    }

    // 兜底
    if (!suggestions.length) {
      suggestions.push({
        icon: '🌱',
        text: '继续记录下去就好，数据会在你意想不到的时候，拼凑出属于你的成长地图。慢慢来，每一步都算数。'
      });
    }

    container.innerHTML = suggestions.slice(0, 3).map(s => `
      <div class="suggest-item">
        <div class="suggest-icon">${s.icon}</div>
        <div class="suggest-text">${s.text}</div>
      </div>
    `).join('');
  }

  // 日期详情
  function showDateDetail(dateStr) {
    const record = state.records[dateStr];
    const modal = document.getElementById('dateModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = formatDateCN(dateStr);

    if (!record) {
      body.innerHTML = '<p>这一天还没有记录。</p>';
    } else {
      const tagChips = (record.tags && record.tags.length)
        ? `<p><strong>标签：</strong>${record.tags.map(e => {
            const label = getTagLabel(e);
            return `<span class="selected-tag" style="margin:2px 4px 2px 0;"><span>${e}</span>${label ? `<span class="tag-label">${label}</span>` : ''}</span>`;
          }).join('')}</p>`
        : '';
      body.innerHTML = `
        ${record.completion ? `<p><strong>完成情况：</strong>${escapeHtml(record.completion)}</p>` : ''}
        ${record.moment ? `<p><strong>百态：</strong>${escapeHtml(record.moment)}</p>` : ''}
        ${tagChips}
        ${record.rating ? `<p><strong>评分：</strong>${'★'.repeat(record.rating)}${'☆'.repeat(5 - record.rating)}</p>` : ''}
        ${record.moodColor ? `<p><strong>情绪：</strong><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${record.moodColor};vertical-align:middle;margin-right:4px;"></span>${escapeHtml(moodColors.find(m => m.value === record.moodColor)?.name || '')}</p>` : ''}
        ${record.reflection ? `<p><strong>反思：</strong>${escapeHtml(record.reflection)}</p>` : ''}
        ${record.tomorrow ? `<p><strong>明日计划：</strong>${escapeHtml(record.tomorrow)}</p>` : ''}
      `;
    }
    modal.classList.add('active');
  }

  function closeDateModal(e) {
    if (e.target.id === 'dateModal') document.getElementById('dateModal').classList.remove('active');
  }

  // 事件绑定
  function initNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.disabled) return;
        navTo(item.dataset.target);
      });
    });
  }

  function initInputs() {
    const binds = [
      { id: 'newTodo', fn: addTodo },
      { id: 'newWeekly', fn: addWeeklyTask },
      { id: 'newNote', fn: addNote }
    ];
    binds.forEach(({ id, fn }) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keypress', e => { if (e.key === 'Enter') fn(); });
    });

    const insight = document.getElementById('weeklyInsight');
    if (insight) insight.addEventListener('input', saveWeeklyInsight);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 第二版吉祥物：眨眼、把玩珍珠、点击转圈冒星心
  function startReviewMascotBlink() {
    const box = document.getElementById('reviewMascot');
    const inner = document.getElementById('reviewMascotInner');
    if (!box || !inner) return;
    const EMO = ['✨','⭐','💗','🌟','💞','💖','🌸'];
    const spawnParticles = (n) => {
      for (let i = 0; i < n; i++) {
        const p = document.createElement('span');
        p.className = 'mascot-particle';
        p.textContent = EMO[(Math.random() * EMO.length) | 0];
        p.style.fontSize = (16 + Math.random() * 14) + 'px';
        p.style.left = (20 + Math.random() * 60) + '%';
        p.style.top = (10 + Math.random() * 40) + '%';
        p.style.setProperty('--px', (Math.random() * 80 - 40) + 'px');
        p.style.setProperty('--py', (-40 - Math.random() * 60) + 'px');
        p.style.setProperty('--pr', (Math.random() * 160 - 80) + 'deg');
        box.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    };
    const blink = () => {
      box.classList.add('blink');
      setTimeout(() => box.classList.remove('blink'), 240);
      scheduleBlink();
    };
    const scheduleBlink = () => setTimeout(blink, 2600 + Math.random() * 2400);
    const pearl = () => {
      box.classList.add('pearl');
      setTimeout(() => box.classList.remove('pearl'), 1200);
      schedulePearl();
    };
    const schedulePearl = () => setTimeout(pearl, 6000 + Math.random() * 3000);
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      inner.classList.remove('hop');
      void inner.offsetWidth;
      inner.classList.add('hop');
      setTimeout(() => inner.classList.remove('hop'), 750);
      spawnParticles(6 + ((Math.random() * 3) | 0));
    });
    setTimeout(scheduleBlink, 1500);
    setTimeout(schedulePearl, 3000);
  }

  // 每日记录国风吉祥物：坐石/撑伞/踱步自动循环 + 点击切换
  function initDailyMascot() {
    const box = document.getElementById('dailyMascot');
    if (!box) return;
    const modes = [
      { cls: 'seat',  sel: '.pose-sit' },
      { cls: 'stand', sel: '.pose-stand' },
      { cls: 'walk',  sel: '.pose-walk' }
    ];
    let idx = 0, timer = null;
    const apply = (i) => {
      idx = ((i % modes.length) + modes.length) % modes.length;
      box.className = 'mascot-daily ' + modes[idx].cls;
      box.querySelectorAll('.pose').forEach(p => p.classList.remove('active'));
      box.querySelector(modes[idx].sel).classList.add('active');
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { apply(idx + 1); schedule(); }, 7800);
    };
    box.addEventListener('click', () => { apply(idx + 1); schedule(); });
    (function blinkLoop() {
      timer2 = setTimeout(() => {
        const pose = box.querySelector('.pose.active');
        const im = pose && pose.querySelector('img');
        if (im) { im.classList.add('blink-anim'); setTimeout(() => im.classList.remove('blink-anim'), 260); }
        blinkLoop();
      }, 3200 + Math.random() * 3600);
    })();
    schedule();
  }

  // 语音输入：每个文本框自动加麦克风按钮，快捷键 Alt+V
  function initVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec = null;
    let vField = null;
    let listening = false;

    function setMicState(on) {
      listening = on;
      document.querySelectorAll('.mic-btn').forEach(b => b.classList.toggle('mic-on', on));
    }

    function bestField() {
      const a = document.activeElement;
      if (a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type === 'text'))) return a;
      return document.querySelector('input[type="text"], textarea');
    }

    function stop() {
      setMicState(false);
      if (rec) { try { rec.stop(); } catch (e) {} rec = null; }
    }

    function start(field, btn) {
      vField = field || bestField();
      if (!vField) return;
      if (!SR) { alert('当前浏览器不支持语音识别，请用 Edge 或 Chrome 打开本页面'); return; }
      vField.focus();
      rec = new SR();
      rec.lang = 'zh-CN';
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = function (e) {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (!e.results[i].isFinal) continue;
          const t = e.results[i][0].transcript.trim();
          if (!t || !vField) continue;
          vField.value = vField.value ? vField.value + (vField.tagName === 'TEXTAREA' ? '\n' : ' ') + t : t;
          vField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };
      rec.onend = function () { setMicState(false); rec = null; };
      rec.onerror = function (e) {
        setMicState(false); rec = null;
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') alert('麦克风权限被拒绝，请在浏览器地址栏允许使用麦克风');
      };
      setMicState(true);
      try { rec.start(); } catch (e) {}
    }

    function toggle(field, btn) {
      if (listening) { stop(); return; }
      start(field, btn);
    }

    document.querySelectorAll('input[type="text"], textarea').forEach(f => {
      if (f.parentNode.querySelector('.mic-btn')) return;
      const mic = document.createElement('button');
      mic.type = 'button';
      mic.className = 'mic-btn' + (f.tagName === 'TEXTAREA' ? ' mic-float' : '');
      mic.title = '语音输入（Alt+V）';
      mic.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm6-3a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.94V22h2v-3.06A8 8 0 0 0 20 11h-2z"/></svg>';
      mic.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(f, mic); });
      f.parentNode.insertBefore(mic, f.nextSibling);
    });

    document.addEventListener('keydown', e => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        e.stopPropagation();
        const f = bestField();
        toggle(f, f ? f.nextElementSibling : null);
      }
    });
  }

  // ---------- 独白 ----------
  function initDubai() {
    if (!Array.isArray(state.dubai)) state.dubai = [];
  }

  function dubaiTime(ts) {
    const d = new Date(ts);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function renderDubai() {
    initDubai();
    const list = document.getElementById('dubaiList');
    if (!list) return;
    const empty = document.getElementById('dubaiEmpty');
    const items = state.dubai.slice().sort((a, b) => b.time - a.time);
    if (!items.length) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    list.innerHTML = items.map(it => {
      const cls = it.type === 'collect' ? 'dubai-tag-collect' : 'dubai-tag-memo';
      const tag = it.type === 'collect' ? '收集' : '随记';
      return `
      <div class="dubai-item" data-id="${it.id}">
        <div class="dubai-item-head">
          <span class="dubai-tag ${cls}">${tag}</span>
          <span class="dubai-item-time">${dubaiTime(it.time)}</span>
          <span class="dubai-item-ops">
            <button class="btn-text" onclick="app.editDubai('${it.id}')">编辑</button>
            <button class="btn-text dubai-del" onclick="app.deleteDubai('${it.id}')">删除</button>
          </span>
        </div>
        <div class="dubai-item-text">${escapeHtml(it.text)}</div>
        <div class="dubai-edit-panel" style="display:none;">
          <textarea class="dubai-edit-area" rows="4">${escapeHtml(it.text)}</textarea>
          <div class="dubai-edit-ops">
            <button class="btn" onclick="app.saveDubai('${it.id}')">保存</button>
            <button class="btn-text" onclick="app.cancelDubai('${it.id}')">取消</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function pushDubai(type, text) {
    state.dubai.push({ id: 'd' + Date.now() + Math.random().toString(36).slice(2, 7), type: type, text: text, time: Date.now() });
  }

  function addDubai() {
    initDubai();
    const c = document.getElementById('dubaiCollect');
    const m = document.getElementById('dubaiMemo');
    const ct = (c && c.value.trim()) || '';
    const mt = (m && m.value.trim()) || '';
    if (!ct && !mt) { alert('先写点什么再收录吧～'); return; }
    if (ct) pushDubai('collect', ct);
    if (mt) pushDubai('memo', mt);
    if (c) c.value = '';
    if (m) m.value = '';
    saveData();
    renderDubai();
  }

  function editDubai(id) {
    const card = document.querySelector(`.dubai-item[data-id="${id}"]`);
    if (!card) return;
    const data = state.dubai.find(e => e.id === id);
    card.querySelector('.dubai-item-text').style.display = 'none';
    card.querySelector('.dubai-edit-panel').style.display = 'block';
    const ta = card.querySelector('.dubai-edit-area');
    if (data) ta.value = data.text;
    ta.focus();
  }

  function saveDubai(id) {
    const card = document.querySelector(`.dubai-item[data-id="${id}"]`);
    const it = state.dubai.find(e => e.id === id);
    if (!card || !it) return;
    const v = card.querySelector('.dubai-edit-area').value.trim();
    if (!v) { alert('内容不能为空'); return; }
    it.text = v;
    it.time = Date.now();
    saveData();
    renderDubai();
  }

  function cancelDubai() { renderDubai(); }

  function deleteDubai(id) {
    if (!confirm('确定删除这条独白吗？')) return;
    initDubai();
    state.dubai = state.dubai.filter(e => e.id !== id);
    saveData();
    renderDubai();
  }

  function init() {
    initTheme();
    initNav();
    initStarRating();
    initAutoSave();
    initInputs();
    initVoice();
    loadDailyForm();
    renderHome();
    renderPlan();
    setTimeout(showQuoteToast, 800);
    setTimeout(showSlideQuote, 2000);
    setTimeout(showHomeGreeting, 1200);
    startReviewMascotBlink();
    preloadPoses();
    bindHover();
    startAutoBlink();
  }

  return {
    init,
    navTo,
    setTheme,
    pokePartner,
    showHomeGreeting,
    clearRating,
    showQuoteToast,
    closeQuoteToast,
    showSlideQuote,
    hideSlideQuote,
    changeMiniMonth,
    addNote,
    toggleNote,
    deleteNote,
    clearDoneNotes,
    editNote,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearDoneTodos,
    changeTodoDate,
    goToday,
    editTodo,
    addWeeklyTask,
    toggleWeeklyTask,
    deleteWeeklyTask,
    changeWeekly,
    goThisWeek,
    editWeeklyTask,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    editGoal,
    changeDailyDate,
    goDailyToday,
    setDailyViewDate,
    editRecordOfDate,
    addPhotos,
    deletePhoto,
    openRecordPhoto,
    closePhotoLightbox,
    toggleMiniCal,
    miniCalNav,
    miniCalToday,
    changeDisplayMonth,
    markDate,
    unmarkDate,
    setChartRange,
    showDateDetail,
    closeDateModal,
    toggleTagPanel,
    removeTag,
    compareInsight,
    addDubai,
    editDubai,
    saveDubai,
    cancelDubai,
    deleteDubai
  };
})();

document.addEventListener('DOMContentLoaded', app.init);
