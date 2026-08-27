/* ============================================================
   app.js, behaviour layer
   Depends on data.js (window.CC)
   ============================================================ */
(function () {
  'use strict';
  var D = window.CC;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Math.round(n).toLocaleString(); };

  /* ---------------------------------------------------------
     NAV, PROGRESS, MOBILE MENU
     --------------------------------------------------------- */
  var nav = $('#nav'), bar = $('#progress'), burger = $('#burger'), links = $('#navLinks');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('stuck', y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    links.classList.toggle('open'); burger.classList.toggle('on');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.classList.remove('on'); }
  });

  /* ---------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------- */
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  function bindReveal(root) {
    $$('.rv:not(.in)', root).forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 65) + 'ms';
      io.observe(el);
    });
  }
  bindReveal(document);

  /* ---------------------------------------------------------
     COUNT UP
     --------------------------------------------------------- */
  var cio = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target;
      var target = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      var pre = el.dataset.pre || '', suf = el.dataset.suf || '';
      var fmt = function (v) { return dec ? v.toFixed(dec) : Math.round(v).toLocaleString(); };
      if (reduce) { el.textContent = pre + fmt(target) + suf; return; }
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1500, 1), e2 = 1 - Math.pow(1 - p, 3), v = target * e2;
        el.textContent = pre + fmt(v) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------------------------------------------------------
     BANDWIDTH BARS
     --------------------------------------------------------- */
  var bwio = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      bwio.unobserve(e.target);
      e.target.style.width = e.target.dataset.w + '%';
    });
  }, { threshold: 0.4 });
  $$('.bw-fill').forEach(function (el) { bwio.observe(el); });

  /* ---------------------------------------------------------
     AMBIENT PARTICLE FIELD
     --------------------------------------------------------- */
  var cv = $('#bgCanvas');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), pts = [], W = 0, H = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = { x: -9999, y: -9999 };
    function resize() {
      W = cv.width = window.innerWidth * dpr;
      H = cv.height = window.innerHeight * dpr;
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
      var n = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 17000), 105);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22 * dpr, vy: (Math.random() - 0.5) * 0.22 * dpr,
          r: (Math.random() * 1.35 + 0.5) * dpr,
          c: Math.random() > 0.72 ? '255,77,104' : (Math.random() > 0.60 ? '0,229,255' : '228,0,43')
        });
      }
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    window.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
    resize();
    var LINK = 132 * dpr, PULL = 168 * dpr;
    (function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var mdx = mouse.x - p.x, mdy = mouse.y - p.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < PULL) { p.x += (mdx / md) * 0.42; p.y += (mdy / md) * 0.42; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',.65)'; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(228,60,90,' + (0.20 * (1 - d / LINK)) + ')';
            ctx.lineWidth = 0.7 * dpr; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ---------------------------------------------------------
     COST CITATION MODAL
     --------------------------------------------------------- */
  var scrim = $('#mdlScrim'), mdlHost = $('#mdlHost'), lastFocus = null;

  function renderModal(key) {
    var c = D.COSTS[key];
    if (!c) return;
    var isEst = c.basis === 'estimate';

    var lineRows = c.lines.map(function (l) {
      var zero = l[2] === 0;
      return '<tr><td class="li-n">' + l[0] + '<em>' + l[1] + '</em></td>' +
        '<td class="li-p' + (zero ? ' zero' : '') + '">' + (zero ? 'Provided' : money(l[2])) + '</td></tr>';
    }).join('');

    var showSum = ['greenfield', 'pilot', 'savings', 'opex', 'phase2'].indexOf(key) !== -1;
    var sum = c.lines.reduce(function (a, l) { return a + l[2]; }, 0);
    if (showSum) {
      lineRows += '<tr class="li-sum"><td class="li-n">Total</td><td class="li-p">' + money(sum) + '</td></tr>';
    }

    var asmHtml = c.assumptions.map(function (a) {
      return '<span>' + a[0] + ': <b>' + a[1] + '</b></span>';
    }).join('');

    var srcHtml = c.sources.map(function (s, i) {
      var host = '';
      try { host = new URL(s[1]).hostname.replace('www.', ''); } catch (e) { host = s[1]; }
      return '<a href="' + s[1] + '" target="_blank" rel="noopener">' +
        '<span class="sn">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="sb"><span class="stt">' + s[0] + '</span><span class="sm">' + host + '</span></span>' +
        '<span class="sx">&#8599;</span></a>';
    }).join('');

    mdlHost.innerHTML =
      '<div class="mdl" role="dialog" aria-modal="true" aria-label="' + c.title + '">' +
        '<div class="mdl-top">' +
          '<button class="mdl-x" id="mdlClose" aria-label="Close">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
          '<div class="eyebrow">' + (isEst ? 'Estimated figure' : 'Verified figure') +
            '<span class="' + (isEst ? 'est-tag' : 'ver-tag') + '">' + (isEst ? 'Modelled' : 'Vendor listed') + '</span></div>' +
          '<h3>' + c.title + '</h3>' +
          '<div class="fig">' + c.figure + '</div>' +
          '<div class="figsub">' + c.figsub + '</div>' +
        '</div>' +
        '<div class="mdl-body">' +
          '<p>' + c.intro + '</p>' +
          '<div class="mdl-sec">Line by line breakdown</div>' +
          '<table class="li-tbl"><tbody>' + lineRows + '</tbody></table>' +
          '<div class="mdl-sec">Assumptions</div>' +
          '<div class="asm">' + asmHtml + '</div>' +
          '<div class="mdl-sec">Sources, ' + c.sources.length + ' references</div>' +
          '<div class="mdl-src">' + srcHtml + '</div>' +
        '</div>' +
      '</div>';

    $('#mdlClose').addEventListener('click', closeModal);
  }

  function openModal(key) {
    lastFocus = document.activeElement;
    renderModal(key);
    scrim.classList.add('on');
    document.body.classList.add('mdl-open');
    var x = $('#mdlClose'); if (x) x.focus();
  }
  function closeModal() {
    scrim.classList.remove('on');
    document.body.classList.remove('mdl-open');
    mdlHost.innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }
  scrim.addEventListener('click', function (e) { if (e.target === scrim) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && scrim.classList.contains('on')) closeModal(); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cost]');
    if (t) { e.preventDefault(); openModal(t.dataset.cost); }
  });

  /* ---------------------------------------------------------
     DUE DILIGENCE
     --------------------------------------------------------- */
  var ddHost = $('#ddList'), ddNav = $('#ddNav');
  var CATS = {
    hardware: 'Hardware and cost',
    procure: 'Procurement',
    govern: 'Governance and continuity',
    funding: 'Funding'
  };
  var ST = {
    lock: ['st-lock', 'Answered'],
    prog: ['st-prog', 'In progress'],
    sched: ['st-sched', 'Meeting scheduled']
  };

  function renderDD(cat) {
    var items = D.DILIGENCE.filter(function (d) { return cat === 'all' || d.cat === cat; });
    ddHost.innerHTML = items.map(function (d, i) {
      var s = ST[d.st];
      var citeBtn = d.cite
        ? '<div class="src"><span class="lbl">Costed detail</span>' +
          '<button class="chip chip-cy" data-cost="' + d.cite + '" type="button">' +
          'Open the sourced breakdown &#8599;</button></div>'
        : '';
      return '<div class="qa rv">' +
        '<button class="qa-q" type="button">' +
          '<span class="qa-num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="qa-txt">' + d.q + '</span>' +
          '<span class="st ' + s[0] + '"><i></i>' + s[1] + '</span>' +
          '<span class="qa-caret"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span>' +
        '</button>' +
        '<div class="qa-body"><div class="qa-inner">' + d.a + citeBtn + '</div></div>' +
      '</div>';
    }).join('');
    bindReveal(ddHost);
  }

  if (ddHost) {
    ddHost.addEventListener('click', function (e) {
      var btn = e.target.closest('.qa-q');
      if (!btn) return;
      var qa = btn.parentElement, body = $('.qa-body', qa);
      var open = qa.classList.toggle('open');
      body.style.maxHeight = open ? (body.scrollHeight + 40) + 'px' : '0px';
    });

    ddNav.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', ddNav).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      renderDD(b.dataset.cat);
    });

    // counts in the filter buttons
    $$('button', ddNav).forEach(function (b) {
      var c = b.dataset.cat;
      var n = c === 'all' ? D.DILIGENCE.length : D.DILIGENCE.filter(function (d) { return d.cat === c; }).length;
      var em = document.createElement('em');
      em.textContent = n;
      b.appendChild(em);
    });
    renderDD('all');
  }

  /* ---------------------------------------------------------
     WORKLOAD EXPLORER
     --------------------------------------------------------- */
  var wlList = $('#wlList'), wlPanel = $('#wlPanel');

  function renderWorkload(w) {
    var rows = [
      ['24 GB', 'Consumer class', w.levels.g24],
      ['48 GB', 'The pilot card', w.levels.g48],
      ['96 GB', 'The growth target', w.levels.g96]
    ];
    wlPanel.innerHTML =
      '<div class="acc acc-cy"></div>' +
      '<h3>' + w.full + '</h3>' +
      '<div class="wl-tag">' + w.tag + '</div>' +
      '<p class="desc">' + w.desc + '</p>' +
      '<div class="vram">' + rows.map(function (r) {
        var lv = r[2];
        return '<div class="vrow" title="' + r[1] + '">' +
          '<div class="cap">' + r[0] + '</div>' +
          '<div class="vtrack"><div class="vfill ' + lv[1] + '" data-w="' + lv[0] + '"></div></div>' +
          '<div class="verdict ' + lv[1] + '">' + lv[2] + '</div></div>';
      }).join('') + '</div>' +
      '<div class="wl-meaning"><b>What this means.</b> ' + w.meaning + '</div>' +
      '<div class="wl-links">' + w.links.map(function (l) {
        return '<a class="chip chip-cy" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' &#8599;</a>';
      }).join('') + '</div>';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $$('.vfill', wlPanel).forEach(function (f) { f.style.width = f.dataset.w + '%'; });
      });
    });
  }

  if (wlList && wlPanel) {
    D.WORKLOADS.forEach(function (w, i) {
      var b = document.createElement('button');
      b.className = 'wl-btn' + (i === 0 ? ' on' : '');
      b.type = 'button';
      b.innerHTML = '<span class="dotm"></span><span>' + w.name + '</span>';
      b.addEventListener('click', function () {
        $$('.wl-btn', wlList).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        renderWorkload(w);
      });
      wlList.appendChild(b);
    });
    renderWorkload(D.WORKLOADS[0]);
  }

  /* ---------------------------------------------------------
     BILL OF MATERIALS COST BUILDER
     --------------------------------------------------------- */
  var bomHost = $('#bomList');
  var bomState = {};
  D.BOM.forEach(function (b) { bomState[b.id] = b.on; });

  function renderBOM() {
    bomHost.innerHTML = D.BOM.map(function (b) {
      var on = bomState[b.id];
      return '<div class="bom-row' + (on ? '' : ' off') + '" data-id="' + b.id + '" role="button" tabindex="0">' +
        '<span class="bom-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#04060d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
        '<span class="bom-name">' + b.name + '<em>' + b.src + (b.lab ? ' &middot; Smart Lab can provide' : '') + '</em></span>' +
        '<span class="bom-price">' + money(b.price) + '</span>' +
      '</div>';
    }).join('');
    recalcBOM();
  }

  function recalcBOM() {
    var total = 0, avoided = 0;
    D.BOM.forEach(function (b) {
      if (bomState[b.id]) total += b.price;
      else if (b.lab) avoided += b.price;
    });
    $('#bomTotal').textContent = money(total);
    $('#bomAvoided').textContent = money(avoided);
    var full = D.BOM.reduce(function (a, b) { return a + b.price; }, 0);
    $('#bomFull').textContent = money(full);
  }

  if (bomHost) {
    function toggleBom(id) {
      bomState[id] = !bomState[id];
      var row = $('.bom-row[data-id="' + id + '"]', bomHost);
      row.classList.toggle('off', !bomState[id]);
      recalcBOM();
    }
    bomHost.addEventListener('click', function (e) {
      var r = e.target.closest('.bom-row');
      if (r) toggleBom(r.dataset.id);
    });
    bomHost.addEventListener('keydown', function (e) {
      var r = e.target.closest('.bom-row');
      if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleBom(r.dataset.id); }
    });
    $('#bomPreset').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', $('#bomPreset')).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var p = b.dataset.preset;
      D.BOM.forEach(function (item) {
        if (p === 'pilot')      bomState[item.id] = (item.id === 'gpu48' || item.id === 'riser');
        else if (p === 'phase2')bomState[item.id] = (item.id === 'gpu48' || item.id === 'gpu96' || item.id === 'riser');
        else                    bomState[item.id] = true;
      });
      renderBOM();
    });
    renderBOM();
  }

  /* ---------------------------------------------------------
     OWN VERSUS RENT MODEL
     --------------------------------------------------------- */
  var CONFIGS = {
    pilot: { label: '48 GB pilot', capex: 5530, watts: 300, rate: 1.40 },
    ess:   { label: '96 GB phase two', capex: 17450, watts: 900, rate: 2.60 },
    full:  { label: 'Greenfield build', capex: 29409, watts: 900, rate: 3.67 }
  };
  var KWH = 0.16, PUE = 1.4, LIFE = 4;
  var cfgKey = 'pilot';
  var hrsEl = $('#hrs'), rateEl = $('#rate'), segEl = $('#cfgSeg');

  function recalc() {
    if (!hrsEl || !rateEl) return;
    var c = CONFIGS[cfgKey];
    var hrs = parseInt(hrsEl.value, 10), rate = parseFloat(rateEl.value);

    $('#hrsVal').textContent = hrs + ' hrs';
    $('#rateVal').textContent = '$' + rate.toFixed(2) + '/hr';
    hrsEl.style.setProperty('--p', ((hrs - 5) / 163 * 100) + '%');
    rateEl.style.setProperty('--p', ((rate - 0.5) / 9.5 * 100) + '%');

    var gpuHrs = hrs * 52.18;
    var cloudYear = gpuHrs * rate;
    var powerYear = (c.watts / 1000) * gpuHrs * KWH * PUE;
    var be = cloudYear > powerYear ? c.capex / ((cloudYear - powerYear) / 12) : Infinity;
    var cloudLife = cloudYear * LIFE;
    var ownedLife = c.capex + powerYear * LIFE;
    var saved = cloudLife - ownedLife;
    var perHr = ownedLife / (gpuHrs * LIFE);

    $('#roBreak').textContent = !isFinite(be) ? 'n/a' : be < 1 ? '<1' : be > 120 ? '120+' : be.toFixed(1);
    $('#roCapex').textContent = money(c.capex);
    $('#roCloudY').textContent = money(cloudYear);
    $('#roCloud').textContent = money(cloudLife);
    $('#roOwned').textContent = money(ownedLife);
    $('#roHrs').textContent = Math.round(gpuHrs).toLocaleString();
    $('#roPerHr').textContent = '$' + perHr.toFixed(2);
    var sv = $('#roSaved');
    sv.textContent = saved >= 0 ? money(saved) : '-' + money(-saved);
    sv.style.color = saved >= 0 ? 'var(--mint)' : 'var(--scarlet-soft)';
  }

  if (segEl) {
    segEl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', segEl).forEach(function (x) { x.classList.remove('on'); });
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
     TERMINAL BOOT SEQUENCE
     --------------------------------------------------------- */
  var term = $('#termLines');
  if (term) {
    var LINES = [
      ['dm', '$ '], ['cy', 'compute-collaborative --status'], ['br', ''],
      ['dm', '  host          '], ['ok', 'illinois tech smart lab'], ['br', ''],
      ['dm', '  hosting       '], ['ok', 'agreed, prof. jeremy hajek'], ['br', ''],
      ['dm', '  owner         '], ['wn', 'pending, prof. yutong wang'], ['br', ''],
      ['dm', '  vendor        '], ['ok', 'amazon, osl preferred'], ['br', ''],
      ['dm', '  pilot card    '], ['ok', 'rtx a6000 48gb gddr6 ecc'], ['br', ''],
      ['dm', '  warranty      '], ['ok', '3 years, repair or replace'], ['br', ''],
      ['dm', '  capital ask   '], ['cy', '$5,530'], ['br', ''],
      ['dm', '  opex / year   '], ['cy', 'under $1,000 gpu electricity'], ['br', ''],
      ['dm', '  cloud equiv   '], ['er', '$12,000 / year, recurring'], ['br', ''],
      ['dm', '  written docs  '], ['wn', 'in progress, 3 confirmations'], ['br', ''],
      ['dm', '  access model  '], ['ok', 'vpn > ssh > queue, logged'], ['br', ''],
      ['br', ''],
      ['dm', '$ '], ['cy', 'awaiting approval']
    ];
    if (reduce) {
      term.innerHTML = LINES.map(function (l) {
        return l[0] === 'br' ? '<br>' : '<span class="' + l[0] + '">' + l[1] + '</span>';
      }).join('');
    } else {
      var ti = 0, ci = 0, cur = '';
      var tio = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        tio.disconnect();
        (function type() {
          if (ti >= LINES.length) { term.innerHTML = cur + '<span class="cur"></span>'; return; }
          var L = LINES[ti];
          if (L[0] === 'br') { cur += '<br>'; ti++; ci = 0; setTimeout(type, 40); return; }
          if (ci === 0) cur += '<span class="' + L[0] + '">';
          if (ci < L[1].length) {
            cur += L[1][ci] === ' ' ? '&nbsp;' : L[1][ci];
            ci++;
            term.innerHTML = cur + '</span><span class="cur"></span>';
            setTimeout(type, 12);
          } else { cur += '</span>'; ti++; ci = 0; setTimeout(type, 55); }
        })();
      }, { threshold: 0.35 });
      tio.observe(term);
    }
  }

  /* ---------------------------------------------------------
     YEAR
     --------------------------------------------------------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
