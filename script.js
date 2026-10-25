(function () {
  /* ---------------- 导航 ---------------- */
  var nav = document.querySelector('.mainnav');
  var list = document.getElementById('nav-list');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && list && toggle) {
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    list.addEventListener('click', function (e) {
      if (e.target.closest('a') && list.classList.contains('open')) {
        list.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    function onScroll() {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var links = Array.prototype.slice.call(list.querySelectorAll('a'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var visible = {};
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var bestId = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) { bestRatio = visible[id]; bestId = id; }
        });
        if (!bestId) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + bestId);
        });
      }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });

      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  /* ---------------- 图集：30 张风景 + 30 张校园 ---------------- */
  var scenery = [
    ['hero-clearwater-bay', '清水湾 · 十二公里海岸线'],
    ['fenjiezhou-island', '分界洲岛 · 珊瑚与白沙'],
    ['xincun-harbour', '新村港 · 疍家渔排'],
    ['li-village', '黎族村落 · 船形屋与黎锦'],
    ['mango-orchard', '芒果园 · 北纬十八度的收成'],
    ['clearwater-resort', '清水湾度假区 · 椰林与泳池'],
    ['coastal-road', '滨海旅游公路 · 椰林夹道'],
    ['lingshui-city', '陵水河畔 · 城市与海湾'],
    ['xiangshui-bay', '香水湾 · 礁石与浪'],
    ['daidai-island', '呆呆岛 · 木栈道通向白沙滩'],
    ['diaoluo-mountain', '吊罗山 · 雨林瀑布'],
    ['lian-lagoon', '黎安潟湖 · 渔排日落'],
    ['monkey-island', '南湾猴岛 · 跨海缆车'],
    ['clearwater-marina', '清水湾码头 · 黄昏停泊'],
    ['winter-vegetables', '冬季瓜菜基地 · 田洋连片'],
    ['aquaculture', '深海网箱 · 海上牧场'],
    ['lingshui-cape-lighthouse', '陵水角 · 灯塔与礁石海岸'],
    ['nanwan-forest-trail', '南湾半岛 · 雨林步道与榕树气根'],
    ['xincun-fishing-nets', '新村港 · 晾晒的渔网与浮球'],
    ['li-brocade-weaving', '黎锦织造 · 经纬之间的色彩'],
    ['coconut-grove-path', '椰林小径 · 通向海边的红土路'],
    ['lingshui-rice-paddy', '乡间稻田 · 稻浪与远山云层'],
    ['lingshui-night-market', '小城夜市 · 灯火与蒸汽'],
    ['clearwater-surfing', '清水湾 · 浪花里的冲浪者'],
    ['lingshui-river-sunrise', '陵水河 · 入海口的日出'],
    ['coral-reef-shallow', '浅海 · 珊瑚礁与热带鱼群'],
    ['tropical-fruit-stall', '路边果摊 · 芒果与莲雾的色彩'],
    ['coastal-boardwalk', '海边栈道 · 穿过防风林'],
    ['lingshui-harbour-dawn', '渔港清晨 · 桅杆与薄雾'],
    ['diaoluo-waterfall', '吊罗山 · 溪瀑与青苔']
  ];

  var campus = [
    ['lian-gate', '校园主入口 · 椰林大道'],
    ['lian-campus', '教学楼连廊 · 面向海湾'],
    ['lian-library', '图书馆 · 水平遮阳与海景'],
    ['lian-reading-room', '阅览室 · 靠窗的位置'],
    ['lian-library-stacks', '书架区 · 通高木构'],
    ['lian-cafe', '咖啡馆 · 落地窗与椰林'],
    ['lian-classroom', '阶梯教室 · 研讨与讲授'],
    ['lian-lab', '创客实验室 · 动手的下午'],
    ['lian-sports', '运动场 · 傍晚的跑道'],
    ['lian-dorm', '生活区 · 宿舍与步道'],
    ['lian-activity', '草坪活动 · 社团市集'],
    ['lian-night', '校园夜色 · 灯火与海湾'],
    ['lian-canteen', '食堂 · 明亮的午餐时间'],
    ['lian-auditorium', '报告厅 · 一场讲座的温度'],
    ['lian-studio', '媒体演播室 · 灯架与镜头'],
    ['lian-language-lab', '语言实验室 · 隔音座位与耳机'],
    ['lian-courtyard', '内庭院 · 白墙、连廊与浅水'],
    ['lian-rooftop-deck', '屋顶平台 · 黄昏的海'],
    ['lian-study-room', '自习室 · 台灯下的长桌'],
    ['lian-corridor-night', '夜里的连廊 · 灯带与玻璃'],
    ['lian-bike-lane', '自行车道 · 树影与单车'],
    ['lian-plaza-fountain', '入口广场 · 浅水喷泉'],
    ['lian-cafe-counter', '咖啡馆吧台 · 暖光与蒸汽'],
    ['lian-library-atrium', '图书馆中庭 · 天窗与环廊'],
    ['lian-gym', '体育馆 · 木地板与看台'],
    ['lian-track-night', '夜晚跑道 · 灯光弧线'],
    ['lian-lawn-gathering', '大草坪 · 帐篷与社团市集'],
    ['lian-welcome-hall', '接待大厅 · 玻璃与海'],
    ['lian-sea-view-deck', '观海平台 · 台阶与栏杆'],
    ['lian-art-exhibition', '艺术展厅 · 白墙与射灯']
  ];

  var grid = document.getElementById('photo-grid');
  var count = document.getElementById('photo-count');
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function renderGallery(setKey) {
    if (!grid) return;
    var items = setKey === 'campus' ? campus : scenery;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var img = items[i][0];
      var cap = items[i][1];
      html += '<figure class="photo-card">' +
        '<img src="./assets/' + img + '.jpg" alt="' + cap + '" loading="lazy" />' +
        '<span class="idx">' + pad2(i + 1) + '</span>' +
        '<figcaption>' + cap + '</figcaption>' +
        '</figure>';
    }
    grid.innerHTML = html;
    if (count) count.textContent = '共 ' + items.length + ' 张';
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabButtons.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
      btn.setAttribute('aria-selected', 'true');
      renderGallery(btn.getAttribute('data-set'));
    });
  });
  if (grid) renderGallery('scenery');

  /* ---------------- MBTI 风景人格 ---------------- */
  var mbtiQs = [
    { q: '周末有一整天空闲，你更想——', a: ['约上朋友去海边市集', '一个人找家咖啡馆坐着'], k: ['E', 'I'] },
    { q: '第一次到清水湾，你会先——', a: ['往人多的沙滩走，看看大家在做什么', '找一段没人的海岸，先听浪声'], k: ['E', 'I'] },
    { q: '面对一个陌生海湾，你更习惯——', a: ['先看地图和介绍，弄清方位', '先凭感觉走，走到哪算哪'], k: ['S', 'N'] },
    { q: '做旅行计划时，你倾向于——', a: ['把想去的点排成清单', '只定一个大方向，留出空白'], k: ['S', 'N'] },
    { q: '朋友说“这地方没什么意思”，你会——', a: ['问他具体哪里不好，值不值得改行程', '先顾他的感受，换个轻松的地方'], k: ['T', 'F'] },
    { q: '选住处时，你优先看——', a: ['交通、配套与性价比', '窗外的风景和安静程度'], k: ['T', 'F'] },
    { q: '出发前一周，你的状态是——', a: ['行程表已经列到小时', '只订了第一晚，其他到了再说'], k: ['J', 'P'] },
    { q: '遇到连着下雨，你会——', a: ['启用备选方案，按计划走', '临时改去室内，随遇而安'], k: ['J', 'P'] }
  ];

  var mbtiResults = {
    INTJ: { name: '灯塔型', place: '分界洲岛 · 清晨', img: 'fenjiezhou-island', desc: '你习惯先看清全局，再决定靠近哪一段海岸。清晨的岛，人少、光线干净，正合你意。' },
    INTP: { name: '观察者', place: '吊罗山 · 雨林栈道', img: 'diaoluo-mountain', desc: '你更在意事物怎么运转。雨林里的水汽、根系与光，够你安静地看很久。' },
    ENTJ: { name: '行程总指挥', place: '滨海公路 · 一路向东', img: 'coastal-road', desc: '你喜欢把路线握在手里。一条临海公路，随时能停，也随时能出发。' },
    ENTP: { name: '路线试验家', place: '黎安潟湖 · 渔排', img: 'lian-lagoon', desc: '你讨厌重复的路线。潟湖上的木屋与渔排，是可以临时改主意的地方。' },
    INFJ: { name: '静水者', place: '呆呆岛 · 木栈道', img: 'daidai-island', desc: '你外表平静，心里有自己的潮汐。木栈道尽头的那片浅滩，适合慢慢走。' },
    INFP: { name: '拾贝者', place: '香水湾 · 日落', img: 'xiangshui-bay', desc: '你容易被光线和细节打动。傍晚的礁石与浪，是给你准备的一小段独处。' },
    ENFJ: { name: '同行召集人', place: '新村港 · 疍家渔排', img: 'xincun-harbour', desc: '你总能把人聚在一起。渔排上的木屋与海风，适合一群人围坐聊天。' },
    ENFP: { name: '赶海的人', place: '校园草坪 · 社团市集', img: 'lian-activity', desc: '你对新鲜事没有抵抗力。帐篷、展板和陌生人，都是你愿意停下来聊聊的理由。' },
    ISTJ: { name: '清单派', place: '环岛高铁陵水站', img: 'lingshui-station', desc: '你相信秩序带来效率。从站台到县城，一路都有清晰的指示牌。' },
    ISFJ: { name: '照顾者', place: '黎族村落 · 船形屋', img: 'li-village', desc: '你习惯先照顾别人。村落里的船形屋与织锦，是慢下来才看得见的细节。' },
    ESTJ: { name: '秩序派', place: '港口与冷链园区', img: 'port-logistics', desc: '你关心事情能不能按时完成。码头、冷库与货车，是你看得懂的节奏。' },
    ESFJ: { name: '招待者', place: '校园食堂 · 午餐时间', img: 'lian-canteen', desc: '你在意大家吃得好不好。热闹、明亮、有人气的地方，最能让你放松。' },
    ISTP: { name: '动手派', place: '深海网箱 · 海上牧场', img: 'aquaculture', desc: '你不太爱说，但很会做。网箱、船只与绳索，比讲稿更有意思。' },
    ISFP: { name: '漫游者', place: '清水湾码头 · 黄昏', img: 'clearwater-marina', desc: '你跟着感觉走。停泊的船、渐暗的天色，比任何行程都更值得停留。' },
    ESTP: { name: '追浪者', place: '南湾猴岛 · 跨海缆车', img: 'monkey-island', desc: '你需要一点速度和高度。缆车越过渔排的那一刻，你会觉得来对了。' },
    ESFP: { name: '晒背族', place: '清水湾 · 白沙滩', img: 'hero-clearwater-bay', desc: '你把假期交给阳光。找一片沙滩躺下，就是最好的安排。' }
  };

  var mbtiStage = document.getElementById('mbti-stage');
  var mbtiState = { index: 0, score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } };

  function mbtiIntro() {
    mbtiState = { index: 0, score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } };
    mbtiStage.innerHTML =
      '<p class="q-text">如果陵水是一种性格，你希望自己在这里是什么样子？</p>' +
      '<p class="mbti-desc">八道题，大约一分钟。答完会得到一个四字母类型，以及一处适合你去的地方。</p>' +
      '<button class="btn-solid" type="button" id="mbti-start">开始测试</button>';
    document.getElementById('mbti-start').addEventListener('click', mbtiQuestion);
  }

  function mbtiQuestion() {
    var i = mbtiState.index;
    if (i >= mbtiQs.length) { mbtiResult(); return; }
    var item = mbtiQs[i];
    var html =
      '<div class="mbti-progress"><span>第 ' + (i + 1) + ' / ' + mbtiQs.length + ' 题</span><span>' +
      Math.round((i / mbtiQs.length) * 100) + '%</span></div>' +
      '<div class="bar"><span style="width:' + Math.round((i / mbtiQs.length) * 100) + '%"></span></div>' +
      '<p class="q-text">' + item.q + '</p>' +
      '<button class="opt-btn" type="button" data-k="' + item.k[0] + '">' + item.a[0] + '</button>' +
      '<button class="opt-btn" type="button" data-k="' + item.k[1] + '">' + item.a[1] + '</button>';
    mbtiStage.innerHTML = html;

    Array.prototype.forEach.call(mbtiStage.querySelectorAll('.opt-btn'), function (btn) {
      btn.addEventListener('click', function () {
        mbtiState.score[btn.getAttribute('data-k')] += 1;
        mbtiState.index += 1;
        mbtiQuestion();
      });
    });
  }

  function mbtiResult() {
    var s = mbtiState.score;
    var type =
      (s.E >= s.I ? 'E' : 'I') +
      (s.S >= s.N ? 'S' : 'N') +
      (s.T >= s.F ? 'T' : 'F') +
      (s.J >= s.P ? 'J' : 'P');
    var r = mbtiResults[type] || mbtiResults.INFJ;
    mbtiStage.innerHTML =
      '<div class="mbti-result">' +
      '<img src="./assets/' + r.img + '.jpg" alt="' + r.place + '" loading="lazy" />' +
      '<div class="mbti-type">' + type + '</div>' +
      '<div class="mbti-name">' + r.name + '</div>' +
      '<p class="mbti-desc">' + r.desc + '</p>' +
      '<p class="mbti-place">推荐去看看：' + r.place + '</p>' +
      '<button class="btn-line" type="button" id="mbti-again">再测一次</button>' +
      '</div>';
    document.getElementById('mbti-again').addEventListener('click', mbtiIntro);
  }

  if (mbtiStage) mbtiIntro();

  /* ---------------- 快问快答 ---------------- */
  var quizData = [
    {
      q: '陵水黎族自治县位于海南岛的哪个方位？',
      opts: ['东南部', '西北部', '东北部', '西南部'],
      a: 0,
      exp: '陵水在海南岛东南部，东临南海，南接三亚，是自由贸易港南部组团的一部分。'
    },
    {
      q: '下面哪个景区不在陵水？',
      opts: ['分界洲岛', '南湾猴岛', '天涯海角', '呆呆岛'],
      a: 2,
      exp: '天涯海角在三亚。分界洲岛、南湾猴岛与呆呆岛都在陵水。'
    },
    {
      q: '陵水冬季北运的代表性农产品是？',
      opts: ['苹果', '冬季瓜菜', '小麦', '人参'],
      a: 1,
      exp: '陵水冬季温暖，秋冬种、冬春收的瓜菜北运，是当地农业的传统优势。'
    },
    {
      q: '黎安国际教育创新试验区主要聚焦什么？',
      opts: ['重化工', '国际教育与中外合作办学', '矿产开采', '汽车制造'],
      a: 1,
      exp: '试验区是海南自由贸易港教育开放的平台，聚焦中外合作办学与国际教育服务。'
    },
    {
      q: '环岛高铁陵水站属于哪条线路？',
      opts: ['京广高铁', '海南环岛高铁', '沪昆高铁', '广深港高铁'],
      a: 1,
      exp: '陵水站位于海南环岛高铁东段，向北连接海口，向南连接三亚。'
    },
    {
      q: '新村港最具特色的海上景观是？',
      opts: ['集装箱码头', '疍家渔排', '盐田', '风电塔'],
      a: 1,
      exp: '新村港的疍家渔排连片浮在海面，木屋与网箱构成独特的水上聚落。'
    }
  ];

  var quizStage = document.getElementById('quiz-stage');
  var quizState = { index: 0, right: 0, timer: null, left: 0, locked: false };

  function clearQuizTimer() {
    if (quizState.timer) { clearInterval(quizState.timer); quizState.timer = null; }
  }

  function quizIntro() {
    clearQuizTimer();
    quizState = { index: 0, right: 0, timer: null, left: 0, locked: false };
    quizStage.innerHTML =
      '<p class="q-text">六道题，每题十秒。</p>' +
      '<p class="mbti-desc">关于区位、农业、交通与黎安试验区。答完会给出解析，答错不扣分。</p>' +
      '<button class="btn-solid" type="button" id="quiz-start">开始答题</button>';
    document.getElementById('quiz-start').addEventListener('click', quizQuestion);
  }

  function quizQuestion() {
    clearQuizTimer();
    var i = quizState.index;
    if (i >= quizData.length) { quizFinish(); return; }
    quizState.locked = false;
    var item = quizData[i];
    var html =
      '<div class="mbti-progress"><span>第 ' + (i + 1) + ' / ' + quizData.length + ' 题</span><span id="quiz-left">10s</span></div>' +
      '<div class="quiz-timer"><span id="quiz-bar"></span></div>' +
      '<p class="q-text">' + item.q + '</p>';

    for (var j = 0; j < item.opts.length; j++) {
      html += '<button class="opt-btn" type="button" data-idx="' + j + '">' + item.opts[j] + '</button>';
    }
    html += '<div id="quiz-extra"></div>';
    quizStage.innerHTML = html;

    Array.prototype.forEach.call(quizStage.querySelectorAll('.opt-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (quizState.locked) return;
        quizAnswer(parseInt(btn.getAttribute('data-idx'), 10));
      });
    });

    quizState.left = 10;
    var bar = document.getElementById('quiz-bar');
    var leftLabel = document.getElementById('quiz-left');
    if (bar) bar.style.width = '100%';

    quizState.timer = setInterval(function () {
      quizState.left -= 0.1;
      if (quizState.left <= 0) {
        quizState.left = 0;
        clearQuizTimer();
        quizAnswer(-1);
        return;
      }
      if (bar) bar.style.width = (quizState.left * 10) + '%';
      if (leftLabel) leftLabel.textContent = Math.ceil(quizState.left) + 's';
    }, 100);
  }

  function quizAnswer(picked) {
    if (quizState.locked) return;
    quizState.locked = true;
    clearQuizTimer();

    var item = quizData[quizState.index];
    var buttons = quizStage.querySelectorAll('.opt-btn');
    var correct = item.a;

    Array.prototype.forEach.call(buttons, function (btn, idx) {
      btn.disabled = true;
      if (idx === correct) btn.classList.add('is-right');
      if (idx === picked && picked !== correct) btn.classList.add('is-wrong');
    });

    if (picked === correct) quizState.right += 1;

    var extra = document.getElementById('quiz-extra');
    if (extra) {
      extra.innerHTML =
        '<div class="quiz-feedback">' +
        (picked === correct ? '答对了。' : (picked < 0 ? '时间到。' : '这题答错了。')) +
        '正确答案：' + item.opts[correct] + '。' + item.exp + '</div>' +
        '<button class="btn-line" type="button" id="quiz-next">' +
        (quizState.index + 1 >= quizData.length ? '查看结果' : '下一题') +
        '</button>';
      document.getElementById('quiz-next').addEventListener('click', function () {
        quizState.index += 1;
        quizQuestion();
      });
    }
  }

  function quizFinish() {
    clearQuizTimer();
    var score = quizState.right;
    quizStage.innerHTML =
      '<div class="quiz-score">' + score + ' / ' + quizData.length + '</div>' +
      '<p class="mbti-desc">' +
      (score >= 5 ? '你对陵水已经很熟了，可以带朋友逛。' :
        score >= 3 ? '基础不错，再翻翻上面的几栏，会更清楚。' :
          '没关系，往上看看风景和产业，再来一次。') +
      '</p>' +
      '<button class="btn-line" type="button" id="quiz-again">再来一次</button>';
    document.getElementById('quiz-again').addEventListener('click', quizIntro);
  }

  if (quizStage) quizIntro();
})();
