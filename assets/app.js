/* ============================================================
   THE COMPUTE COLLABORATIVE — app.js
   Background field, reveals, counters, workload explorer,
   build-vs-rent economics model.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. NAV + SCROLL PROGRESS
     --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('progress');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('stuck', y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    links.classList.toggle('open');
    burger.classList.toggle('on');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.classList.remove('on'); }
  });

  /* ---------------------------------------------------------
     2. REVEAL ON SCROLL
     --------------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.rv').forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 6, 5) * 70) + 'ms';
    io.observe(el);
  });

  /* ---------------------------------------------------------
     3. COUNT-UP NUMBERS
     --------------------------------------------------------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target;
      var target = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      var pre = el.dataset.pre || '';
      var suf = el.dataset.suf || '';
      if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
      var t0 = null, dur = 1500;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        var v = target * e;
        el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------------------------------------------------------
     4. AMBIENT PARTICLE / CIRCUIT FIELD
     --------------------------------------------------------- */
  var cv = document.getElementById('bgCanvas');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d');
    var pts = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      W = cv.width = window.innerWidth * dpr;
      H = cv.height = window.innerHeight * dpr;
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
      var density = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 17000), 110);
      pts = [];
      for (var i = 0; i < density; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22 * dpr,
          vy: (Math.random() - 0.5) * 0.22 * dpr,
          r: (Math.random() * 1.35 + 0.5) * dpr,
          c: Math.random() > 0.86 ? '228,0,43' : (Math.random() > 0.82 ? '118,185,0' : '0,229,255')
        });
      }
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    window.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
    resize();

    var LINK = 132 * dpr, PULL = 168 * dpr;

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // cursor attraction
        var mdx = mouse.x - p.x, mdy = mouse.y - p.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < PULL) {
          p.x += (mdx / md) * 0.42;
          p.y += (mdy / md) * 0.42;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',.65)';
        ctx.fill();

        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(90,170,230,' + (0.16 * (1 - d / LINK)) + ')';
            ctx.lineWidth = 0.7 * dpr;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------------------------------------------------------
     5. WORKLOAD EXPLORER
     --------------------------------------------------------- */
  var WORKLOADS = [
    {
      id: 'hunyuan',
      name: 'HunyuanVideo — Text-to-Video',
      tag: 'Generative video · Tencent',
      desc: 'Open-source 13B text-to-video foundation model. The official repository states that generating a 720p, 129-frame clip requires a minimum of 60 GB of GPU memory, was tested on a single 80 GB GPU, and that 80 GB is recommended for best quality.',
      levels: { g24: [10, 'no', 'Cannot load'], g48: [55, 'no', 'Below minimum'], g96: [96, 'great', 'Full quality'] },
      meaning: 'This single workload is the clearest argument for 96 GB. A 48 GB card cannot reach the documented minimum for 720p generation — a 96 GB RTX PRO 6000 clears it with headroom to spare.',
      links: [
        ['HunyuanVideo — single-GPU inference', 'https://github.com/Tencent-Hunyuan/HunyuanVideo#-single-gpu-inference'],
        ['Multi-GPU parallel inference (xDiT)', 'https://github.com/Tencent-Hunyuan/HunyuanVideo#-parallel-inference-on-multiple-gpus-by-xdit']
      ]
    },
    {
      id: 'wan',
      name: 'Wan 2.1 / 2.2 — Video Foundation Models',
      tag: 'T2V · I2V · Video editing',
      desc: 'Open video foundation models covering text-to-video, image-to-video, video editing, and image generation. Smaller variants run in roughly 48 GB of VRAM; the 14B class is comfortable at 80 GB.',
      levels: { g24: [26, 'no', 'Small models only'], g48: [76, 'ok', 'Entry-level work'], g96: [98, 'great', 'Production class'] },
      meaning: '48 GB unlocks real student video generation today. 96 GB is what makes it fast enough to run inside a 90-minute workshop or a 36-hour hackathon.',
      links: [
        ['Wan2.1 repository', 'https://github.com/Wan-Video/Wan2.1'],
        ['Wan2.1-T2V-14B on Hugging Face', 'https://huggingface.co/Wan-AI/Wan2.1-T2V-14B']
      ]
    },
    {
      id: 'avatar',
      name: 'LiveAvatar — Real-Time Streaming Avatars',
      tag: 'Real-time · Audio-driven',
      desc: 'Streaming, audio-driven avatar generation with infinite length. Real-time research demonstrations are documented against an 80 GB-class GPU because frames must be produced faster than they are consumed.',
      levels: { g24: [12, 'no', 'Not viable'], g48: [50, 'no', 'Not real-time'], g96: [94, 'great', 'Real-time demo'] },
      meaning: 'Real-time is a hard threshold, not a preference. Either the GPU sustains the frame budget or the demo does not exist. This is the use case that validates 80 GB-class or multi-GPU compute.',
      links: [['Quark-Vision LiveAvatar', 'https://huggingface.co/Quark-Vision/LiveAvatar']]
    },
    {
      id: 'llm',
      name: 'Local LLM Serving & Fine-Tuning',
      tag: 'Private inference · LoRA · RAG',
      desc: 'Running open-weight models on hardware you control — no per-token billing, no data leaving campus. A 70B model needs roughly 40 GB quantized to 4-bit, or 140 GB+ at full precision. Fine-tuning adds optimizer and gradient state on top of weights.',
      levels: { g24: [30, 'tight', '7B–13B only'], g48: [72, 'ok', '70B quantized'], g96: [97, 'great', '70B + fine-tune'] },
      meaning: 'This is the workhorse. A 96 GB card serves a 70B-class assistant to an entire workshop room while a 48 GB card handles individual student fine-tuning jobs in parallel.',
      links: [
        ['Hugging Face model hub', 'https://huggingface.co/models'],
        ['vLLM — high-throughput serving', 'https://github.com/vllm-project/vllm']
      ]
    },
    {
      id: 'robotics',
      name: 'Robotics Simulation + Reinforcement Learning',
      tag: 'Isaac Sim · ITR · Smart Lab',
      desc: 'NVIDIA Isaac Sim documents an RTX-class GPU with substantial VRAM for photorealistic robot simulation. Reinforcement learning multiplies the requirement because thousands of environments are stepped in parallel on one device.',
      levels: { g24: [42, 'tight', 'Basic scenes'], g48: [80, 'ok', 'Multi-env RL'], g96: [96, 'great', 'Full fidelity'] },
      meaning: 'Illinois Tech Robotics and Smart Lab teams could train and validate robot behaviour in simulation before risking physical hardware — turning a broken servo into a failed rollout.',
      links: [['NVIDIA Isaac Sim — requirements', 'https://docs.isaacsim.omniverse.nvidia.com/5.1.0/installation/requirements.html']]
    },
    {
      id: 'diffusion',
      name: 'High-Quality Image Generation',
      tag: 'Diffusion · Design assets · Datasets',
      desc: 'Modern diffusion models benefit substantially from 24–48 GB when working at higher resolution, with larger base models, ControlNets, and multi-image batches for dataset synthesis.',
      levels: { g24: [62, 'ok', 'Solid workflows'], g48: [92, 'great', 'Pro resolution'], g96: [99, 'great', 'Batch + train'] },
      meaning: 'A shared 48 GB GPU lets students produce professional-quality images, synthetic datasets, design assets, and visual prototypes without paying per-generation cloud fees.',
      links: [['Hugging Face Diffusers', 'https://huggingface.co/docs/diffusers/index']]
    },
    {
      id: 'arvr',
      name: 'AR / VR Simulation Environments',
      tag: 'IGDA · Immersive systems',
      desc: '24 GB supports basic VR scenes. High-fidelity environments with realistic lighting, embedded AI agents, and complex interaction systems push well past that — especially when rendering and inference share one device.',
      levels: { g24: [45, 'tight', 'Basic scenes'], g48: [84, 'ok', 'High fidelity'], g96: [97, 'great', 'Scene + agents'] },
      meaning: 'Students can prototype immersive training tools, interactive simulations, and AR/VR research projects — the exact portfolio work that game-design and HCI employers ask to see.',
      links: [['Blender — GPU rendering', 'https://docs.blender.org/manual/en/latest/render/cycles/gpu_rendering.html']]
    },
    {
      id: 'voice',
      name: 'Voice Cloning, ASR & Speech Synthesis',
      tag: 'Accessibility · Media · Agents',
      desc: 'Speech recognition and neural speech synthesis are comparatively light per model, but real applications stack them: ASR into an LLM into a vocoder, all resident simultaneously and all latency-sensitive.',
      levels: { g24: [58, 'ok', 'Single model'], g48: [88, 'great', 'Full pipeline'], g96: [98, 'great', 'Multi-user'] },
      meaning: 'Accessibility tooling, multilingual campus media, and conversational agents all become buildable student projects rather than API bills.',
      links: [['Hugging Face — audio models', 'https://huggingface.co/models?pipeline_tag=automatic-speech-recognition']]
    }
  ];

  var wlList = document.getElementById('wlList');
  var wlPanel = document.getElementById('wlPanel');

  function renderWorkload(w) {
    var rows = [
      ['24 GB', 'Consumer / RTX 4090 class', w.levels.g24],
      ['48 GB', 'RTX 6000 Ada / PRO 5000', w.levels.g48],
      ['96 GB', 'RTX PRO 6000 Blackwell', w.levels.g96]
    ];
    var html = '' +
      '<div class="acc acc-cy"></div>' +
      '<h3>' + w.name + '</h3>' +
      '<div class="wl-tag">' + w.tag + '</div>' +
      '<p class="desc">' + w.desc + '</p>' +
      '<div class="vram">' +
      rows.map(function (r) {
        var lv = r[2];
        return '<div class="vrow" title="' + r[1] + '">' +
          '<div class="cap">' + r[0] + '</div>' +
          '<div class="vtrack"><div class="vfill ' + lv[1] + '" data-w="' + lv[0] + '"></div></div>' +
          '<div class="verdict ' + lv[1] + '">' + lv[2] + '</div>' +
          '</div>';
      }).join('') +
      '</div>' +
      '<div class="wl-meaning"><b>What this means:</b> ' + w.meaning + '</div>' +
      '<div class="wl-links">' +
      w.links.map(function (l) {
        return '<a class="chip chip-cy" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' &#8599;</a>';
      }).join('') +
      '</div>';

    wlPanel.innerHTML = html;
    // animate bars after paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wlPanel.querySelectorAll('.vfill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
      });
    });
  }

  if (wlList && wlPanel) {
    WORKLOADS.forEach(function (w, i) {
      var b = document.createElement('button');
      b.className = 'wl-btn' + (i === 0 ? ' on' : '');
      b.type = 'button';
      b.innerHTML = '<span class="dotm"></span><span>' + w.name.split(' — ')[0] + '</span>';
      b.addEventListener('click', function () {
        wlList.querySelectorAll('.wl-btn').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        renderWorkload(w);
      });
      wlList.appendChild(b);
    });
    renderWorkload(WORKLOADS[0]);
  }

  /* ---------------------------------------------------------
     6. BUILD-vs-RENT ECONOMICS MODEL
     --------------------------------------------------------- */
  var CONFIGS = {
    pilot:  { label: '48 GB Pilot',     capex: 11000, watts: 300, rate: 0.79, gpus: 1 },
    ess:    { label: '96 GB Essential', capex: 18500, watts: 600, rate: 1.65, gpus: 1 },
    full:   { label: 'Full Cluster',    capex: 32600, watts: 1200, rate: 3.20, gpus: 3 }
  };
  var KWH = 0.12;           // $/kWh, Illinois commercial approximation
  var LIFE_YEARS = 4;       // conservative service life

  var cfgKey = 'ess';
  var hrsEl = document.getElementById('hrs');
  var rateEl = document.getElementById('rate');
  var segEl = document.getElementById('cfgSeg');

  function money(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function recalc() {
    if (!hrsEl || !rateEl) return;
    var c = CONFIGS[cfgKey];
    var hrsWeek = parseInt(hrsEl.value, 10);
    var rate = parseFloat(rateEl.value);

    // label updates
    document.getElementById('hrsVal').textContent = hrsWeek + ' hrs';
    document.getElementById('rateVal').textContent = '$' + rate.toFixed(2) + '/hr';
    hrsEl.style.setProperty('--p', ((hrsWeek - 5) / (168 - 5) * 100) + '%');
    rateEl.style.setProperty('--p', ((rate - 0.5) / (4.0 - 0.5) * 100) + '%');

    var gpuHrsYear = hrsWeek * 52.18 * c.gpus;
    var cloudYear = gpuHrsYear * rate;

    // owned running cost: electricity at load + ~15% overhead for host/cooling
    var powerYear = (c.watts / 1000) * (hrsWeek * 52.18) * KWH * 1.15;

    var breakEvenMonths = cloudYear > powerYear
      ? c.capex / ((cloudYear - powerYear) / 12)
      : Infinity;

    var cloudLife = cloudYear * LIFE_YEARS;
    var ownedLife = c.capex + powerYear * LIFE_YEARS;
    var saved = cloudLife - ownedLife;
    var costPerHour = ownedLife / (gpuHrsYear * LIFE_YEARS);

    var beText = !isFinite(breakEvenMonths) ? '—'
      : breakEvenMonths < 1 ? '<1'
      : breakEvenMonths > 120 ? '120+'
      : breakEvenMonths.toFixed(1);

    document.getElementById('roBreak').textContent = beText;
    document.getElementById('roCapex').textContent = money(c.capex);
    document.getElementById('roCloud').textContent = money(cloudLife);
    document.getElementById('roOwned').textContent = money(ownedLife);
    document.getElementById('roHrs').textContent = Math.round(gpuHrsYear).toLocaleString();
    document.getElementById('roPerHr').textContent = '$' + costPerHour.toFixed(2);

    var savedEl = document.getElementById('roSaved');
    savedEl.textContent = (saved >= 0 ? money(saved) : '-' + money(-saved));
    savedEl.style.color = saved >= 0 ? 'var(--mint)' : 'var(--scarlet-soft)';
  }

  if (segEl) {
    segEl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      segEl.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      cfgKey = b.dataset.cfg;
      rateEl.value = CONFIGS[cfgKey].rate;
      recalc();
    });
    hrsEl.addEventListener('input', recalc);
    rateEl.addEventListener('input', recalc);
    recalc();
  }

  /* ---------------------------------------------------------
     7. YEAR STAMP
     --------------------------------------------------------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
