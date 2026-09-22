(function () {
  'use strict';
  /* 不跟随"减弱动态效果"设置，保证效果始终生效（用户明确要求） */
  var hoverable = window.matchMedia('(any-hover: hover)').matches;
  var body = document.body;

  /* ---- 入场动画 fill 解除：floatIn 的 forwards 填充会压制悬停系统的内联 transform，
         动画播完即清除填充（保留 fx-idle 常驻呼吸），让上浮/倾斜即时生效 ---- */
  function fxFinishEntrance(c) {
    c.dataset.fxIn = '1';
    c.style.animation = c.classList.contains('fx-idle')
      ? 'fxIdleFloat var(--fx-flt-t, 6s) ease-in-out infinite'
      : 'none';
    c.style.opacity = '1';
    c.style.transform = 'translateY(0)';
  }
  document.addEventListener('animationend', function (e) {
    var c = e.target;
    if (!c || !c.classList || !c.classList.contains('card')) return;
    if (e.animationName !== 'floatIn') return;
    fxFinishEntrance(c);
  }, true);
  setTimeout(function () {
    document.querySelectorAll('.card').forEach(function (c) {
      if (c.dataset.fxIn !== '1') fxFinishEntrance(c);
    });
  }, 800);

  /* ---- ②+③ 卡片悬停系统：上浮 + 光标视差 + 3D 倾斜 ----
     走 CSS 过渡 + 原生样式写入（transform / rotate 独立属性），不依赖 GSAP，任何浏览器都稳定生效。
     进入 → 弹性上浮（小卡 -10 / 中卡 -9 / 长卡 -8，绿色×1.1 夜晚×0.85）+ 分级放大；
     移动 → 视差平移 + 3D 倾斜（rotate 独立属性与 transform 合成），指数平滑跟手；
     移出 → 弹性回正。与吉祥物相交不倾斜不动视差；拖拽排序时让路。 */
  if (hoverable) {
    var LARGE_SEL = '.input-card,.plan-card,.streak-card,.summary-auto-card,' +
                    '.timeline-card,.calendar-card,.chart-card,.insight-card,' +
                    '.insight-status-card,.insight-suggest-card,.summary-card';
    var SIZE_S_SEL = '.stat-card,.sticky-note,.mini-calendar-card';
    var MASCOTS = [].slice.call(document.querySelectorAll('#dailyMascot, #reviewMascot, #partner, .mascot-feedback'));
    var FX_SLOW = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), rotate 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease, border-color 0.45s ease';
    var FX_FAST = 'transform 0.14s ease-out, rotate 0.14s ease-out, box-shadow 0.3s ease';
    function cardCfg(card) {
      var large = card.matches(LARGE_SEL), small = card.matches(SIZE_S_SEL);
      var mode = body.classList.contains('mode-green') ? 1.1
               : (body.classList.contains('dark-mode') ? 0.85 : 1);
      return {
        lift: (large ? -8 : (small ? -10 : -9)) * mode,  /* 上浮：长卡沉稳、小卡轻盈 */
        scale: large ? 1 : (small ? 1.04 : 1.03),        /* 长卡不放大（防遮挡） */
        depth: large ? 6 : (small ? 10 : 8),             /* 视差深度：光标偏移×深度 */
        tilt: (large ? 0.9 : 1) * (body.classList.contains('mode-green') ? 5.5
             : (body.classList.contains('dark-mode') ? 4 : 4.5)) /* 3D 倾斜最大角度 */
      };
    }
    function hitMascot(r) {
      return MASCOTS.some(function (m) {
        var mr = m.getBoundingClientRect();
        if (mr.width < 2 || mr.height < 2) return false;
        return !(r.right < mr.left || r.left > mr.right || r.bottom < mr.top || r.top > mr.bottom);
      });
    }
    function cardTF(cfg, cx, cy) {
      var px = cx * cfg.depth, py = cy * cfg.depth * 0.72;
      var sc = cfg.scale === 1 ? '' : ' scale(' + cfg.scale + ')';
      /* perspective() 内联进 transform：嵌套在 grid-2 等容器里的卡片同样获得 3D 立体感 */
      return 'perspective(1400px) translate(' + px.toFixed(2) + 'px,' + (cfg.lift + py).toFixed(2) + 'px)' + sc;
    }
    function fxStep(card) {
      card._fxRAF = null;
      if (!card._fxOn) return;
      var cfg = card._fxCfg;
      if (body.classList.contains('fx-sorting')) { /* 拖拽排序让路：只留上浮，平移/倾斜归零 */
        card.style.transition = FX_SLOW;
        card.style.transform = cardTF(cfg, 0, 0);
        card.style.rotate = '';
        return;
      }
      card._fxCX += (card._fxTX - card._fxCX) * 0.16;
      card._fxCY += (card._fxTY - card._fxCY) * 0.16;
      if (Date.now() - card._fxT > 240) card.style.transition = FX_FAST; /* 上浮弹簧先走完，再切快速跟手 */
      if (card._fxNear) { /* 与吉祥物相交：文本框/本月概览/随手记/统计卡保留视差+左右倾斜（角度减半防遮挡），其余只上浮 */
        var fxExempt = card.classList.contains('input-card') ||
                       card.classList.contains('mini-calendar-card') ||
                       card.classList.contains('sticky-note') ||
                       card.classList.contains('stat-card');
        if (fxExempt) {
          card.style.transform = cardTF(cfg, card._fxCX, card._fxCY);
          var nx = -card._fxCY * cfg.tilt * 0.5, ny = card._fxCX * cfg.tilt * 0.5;
          var nmag = Math.hypot(nx, ny);
          card.style.rotate = nmag < 0.05 ? '' : (nx / nmag).toFixed(3) + ' ' + (ny / nmag).toFixed(3) + ' 0 ' + nmag.toFixed(2) + 'deg';
        } else {
          card.style.transform = cardTF(cfg, 0, 0);
          card.style.rotate = '';
        }
      } else {
        card.style.transform = cardTF(cfg, card._fxCX, card._fxCY);
        var rx = -card._fxCY * cfg.tilt, ry = card._fxCX * cfg.tilt;
        var mag = Math.hypot(rx, ry);
        if (mag < 0.05) card.style.rotate = '';
        else card.style.rotate = (rx / mag).toFixed(3) + ' ' + (ry / mag).toFixed(3) + ' 0 ' + mag.toFixed(2) + 'deg';
      }
      if (Math.abs(card._fxTX - card._fxCX) > 0.0015 || Math.abs(card._fxTY - card._fxCY) > 0.0015) {
        card._fxRAF = requestAnimationFrame(fxStep.bind(null, card));
      }
    }
    document.addEventListener('pointerover', function (e) {
      var card = e.target && e.target.closest ? e.target.closest('.card') : null;
      if (!card || card._fxOn) return;
      if (body.classList.contains('fx-sorting')) return;
      fxFinishEntrance(card); /* 兜底：无论入场动画是否重播过，悬停瞬间解除 fill 压制，效果必生效 */
      card._fxOn = true;
      card._fxCfg = cardCfg(card);
      card._fxTX = card._fxTY = card._fxCX = card._fxCY = 0;
      card._fxNear = false;
      card._fxT = Date.now();
      card.style.transition = FX_SLOW;
      card.style.transform = cardTF(card._fxCfg, 0, 0);
      card.style.rotate = '';
    }, true);
    document.addEventListener('pointerout', function (e) {
      var card = e.target && e.target.closest ? e.target.closest('.card') : null;
      if (!card || !card._fxOn) return;
      var to = e.relatedTarget;
      if (to && (to === card || card.contains(to))) return; /* 仍在卡片内部 */
      card._fxOn = false;
      card._fxRAF = null;
      card.style.transition = FX_SLOW;
      card.style.transform = body.classList.contains('fx-sorting') ? '' : 'translateY(0)';
      card.style.rotate = '';
    }, true);
    document.addEventListener('pointermove', function (e) {
      var card = e.target && e.target.closest ? e.target.closest('.card') : null;
      if (!card || !card._fxOn || !card._fxCfg) return;
      var r = card.getBoundingClientRect();
      var r2 = { top: r.top - 26, left: r.left - 18, right: r.right + 18, bottom: r.bottom + 18 }; /* 倾斜投影余量 */
      card._fxNear = card.classList.contains('mini-calendar-card') ? false : hitMascot(r2); /* 本月概览始终保留完整倾斜 */
      card._fxTX = (e.clientX - r.left) / r.width - 0.5;
      card._fxTY = (e.clientY - r.top) / r.height - 0.5;
      if (!card._fxRAF) card._fxRAF = requestAnimationFrame(fxStep.bind(null, card));
    }, true);
  }

  /* ---- 按钮点击涟漪（很淡）+ 星点迸发（品牌色，增强情绪反馈） ---- */
  document.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('.btn, .action-btn, .icon-btn, .seg-btn');
      if (!el) return;
      var r = el.getBoundingClientRect();
      var d = Math.max(r.width, r.height) * 1.05;
      var s = document.createElement('span');
      s.className = 'fx-ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      el.appendChild(s);
      var cols = ['--fx-spark1', '--fx-spark2', '--fx-spark3'];
      var cs = getComputedStyle(el);
      for (var i = 0; i < 3; i++) {
        var k = document.createElement('i');
        k.className = 'fx-spark';
        k.style.background = (cs.getPropertyValue(cols[i]) || '#4ADE80').trim();
        var ang = -145 + Math.random() * 110; /* 向按钮上半部散开 */
        var dist = 12 + Math.random() * 14;
        k.style.setProperty('--fx-sx', (Math.cos(ang * Math.PI / 180) * dist).toFixed(1) + 'px');
        k.style.setProperty('--fx-sy', (Math.sin(ang * Math.PI / 180) * dist).toFixed(1) + 'px');
        s.appendChild(k);
      }
      s.addEventListener('animationend', function () { s.remove(); });
    });

  /* ---- 首页两个主按钮：轻微碰撞推挤 + 震动摇晃 ----
     悬停一个 → 对方只被轻推一点并小幅震动（不推远）；松开 → 弹性回弹 */
  var quickBtns = document.querySelectorAll('.quick-actions .action-btn');
  if (hoverable && window.gsap && quickBtns.length === 2) {
    var qA = quickBtns[0], qB = quickBtns[1];
    function qDir(neighbor, self) {
      var rn = neighbor.getBoundingClientRect();
      var rs = self.getBoundingClientRect();
      if (rn.left >= rs.right - 4) return [1, 0];
      if (rn.right <= rs.left + 4) return [-1, 0];
      if (rn.top >= rs.bottom - 4) return [0, 1];
      return [0, -1];
    }
    function qKnock(neighbor, self) {
      gsap.killTweensOf(neighbor);
      neighbor.style.animation = 'none';
      neighbor.style.transition = 'none'; /* 避免与 GSAP 逐帧位移打架 */
      var d = qDir(neighbor, self);
      var wob = d[0] ? 3.5 : 2.5; /* 横向推挤只留一点，主体是震动 */
      gsap.to(neighbor, {
        x: d[0] * 6, y: d[1] * 7, scale: 0.97,
        duration: 0.42, ease: 'power2.out',
        keyframes: [
          { rotation: wob, duration: 0.14 },
          { rotation: -wob * 0.7, duration: 0.11 },
          { rotation: wob * 0.35, duration: 0.1 },
          { rotation: 0, duration: 0.09 }
        ]
      });
    }
    function qRelease(neighbor) {
      var hov = neighbor.matches(':hover');
      gsap.to(neighbor, {
        x: 0, y: hov ? -10 : 0, scale: hov ? 1.05 : 1, rotation: 0,
        duration: 0.65, ease: 'elastic.out(1, 0.42)',
        onComplete: function () {
          neighbor.style.animation = '';
          neighbor.style.transition = '';
          gsap.set(neighbor, { clearProps: 'transform' }); /* 交还给 CSS 悬停态 */
        }
      });
    }
    qA.addEventListener('mouseenter', function () { qKnock(qB, qA); });
    qA.addEventListener('mouseleave', function () { qRelease(qB); });
    qB.addEventListener('mouseenter', function () { qKnock(qA, qB); });
    qB.addEventListener('mouseleave', function () { qRelease(qA); });
  }

  /* ---- 通用按压：蓄力回弹（.action-btn / .btn / .mic-btn，委托监听覆盖动态按钮）
     点一下也完整走完"按下 → 再往深处压一瞬（蓄力）→ 弹射 → 稳稳落定"，
     无需长按，表达用力的过程，稳重不轻浮 ---- */
  if (window.gsap) {
    var pressedBtn = null;
    document.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;
      var b = e.target.closest('.action-btn, .btn, .mic-btn');
      if (!b || pressedBtn) return;
      pressedBtn = b;
      var an = getComputedStyle(b).animationName;
      if (an && an !== 'none') b.style.animation = 'none';
      gsap.killTweensOf(b);
      gsap.to(b, { scale: 0.96, scaleY: 0.91, y: 3, duration: 0.08, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(b, { boxShadow: 'inset 0 5px 9px rgba(0,0,0,.18)', duration: 0.18, ease: 'power1.out' });
    }, true);
    function pressRelease() {
      var b = pressedBtn;
      if (!b) return;
      pressedBtn = null;
      gsap.killTweensOf(b);
      var tl = gsap.timeline();
      /* 蓄力：缓慢而深地再压（重物压入），越压越沉 */
      tl.to(b, { scale: 0.94, scaleY: 0.84, y: 5, duration: 0.26, ease: 'power2.in' })
        .to(b, { boxShadow: 'inset 0 8px 14px rgba(0,0,0,.24)', duration: 0.26, ease: 'power1.in' }, 0)
        /* 释放：沉重地抬起，不弹射 */
        .to(b, { scale: 1.03, scaleY: 1.09, y: -1.5, duration: 0.16, ease: 'power2.out' })
        /* 落定：仅一次轻微过冲，稳稳停住 */
        .to(b, { scale: 1, scaleY: 1, y: 0, duration: 0.62, ease: 'back.out(1.2)' })
        .add(function () {
          b.style.boxShadow = '';
          b.style.animation = '';
          gsap.set(b, { clearProps: 'transform' });
        });
    }
    document.addEventListener('pointerup', pressRelease, true);
    document.addEventListener('pointercancel', pressRelease, true);
  }

  /* ---- 修复原版逻辑：点哪个麦克风，只有它变红 ----
     原 setMicState(true) 会让所有 .mic-btn 都加 mic-on，这里在事件后把其余的都去掉 */
  function fxMicCorrect(target) {
    if (!target || !target.classList || !target.classList.contains('mic-btn')) return;
    if (!target.classList.contains('mic-on')) return;
    document.querySelectorAll('.mic-btn.mic-on').forEach(function (x) {
      if (x !== target) x.classList.remove('mic-on');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.mic-btn');
    if (b) setTimeout(function () { fxMicCorrect(b); }, 0);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'v' || e.key === 'V')) {
      var f = document.activeElement;
      if (f && (f.tagName === 'TEXTAREA' || (f.tagName === 'INPUT' && f.type === 'text'))) {
        var nb = f.nextElementSibling;
        setTimeout(function () { fxMicCorrect(nb && nb.classList.contains('mic-btn') ? nb : null); }, 0);
      }
    }
  }, true);

  /* ---- 拖拽排序（GSAP 自研，无 Draggable 依赖）：随手记 / 每日待办 / 每周任务 / 阶段目标 ----
     拖动项紧贴指针 + 放大悬浮投影；其余项弹簧让位（弹性轻弹，柔软错开）；
     松手落位弹性归位；顺序存入 localStorage，列表重渲染后自动恢复 */
  if (window.gsap) {
    var fxSortBusy = false;
    function fxSortApply(container, key) {
      if (fxSortBusy) return;
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem(key)); } catch (e) {}
      if (!saved || !saved.length) return;
      var kids = [].slice.call(container.children).filter(function (c) { return c.dataset && c.dataset.id; });
      if (!kids.length) return;
      var keep = saved.filter(function (id) { return kids.some(function (k) { return String(k.dataset.id) === String(id); }); });
      kids.forEach(function (k) { if (keep.indexOf(String(k.dataset.id)) === -1) keep.push(String(k.dataset.id)); });
      var matched = keep.length === kids.length;
      if (matched) {
        for (var m = 0; m < keep.length; m++) {
          if (String(kids[m].dataset.id) !== String(keep[m])) { matched = false; break; }
        }
      }
      if (matched) return;
      fxSortBusy = true;
      try {
        for (var i = 0; i < keep.length; i++) {
          var ci = container.children[i];
          if (ci && String(ci.dataset && ci.dataset.id) === String(keep[i])) continue;
          var el = null;
          for (var j = i; j < keep.length; j++) {
            var cand = container.children[j];
            if (cand && String(cand.dataset && cand.dataset.id) === String(keep[i])) { el = cand; break; }
          }
          if (el && el !== ci) container.insertBefore(el, ci);
        }
      } finally { fxSortBusy = false; }
    }
    function fxSortSave(container, key) {
      var ids = [].slice.call(container.children).map(function (c) { return c.dataset && c.dataset.id; }).filter(Boolean);
      try { localStorage.setItem(key, JSON.stringify(ids)); } catch (e) {}
    }
    function fxMakeSorter(container, key) {
      if (container._fxSort) return;
      container._fxSort = true;
      var slots = null, selfIdx = -1, newIdx = -1, startY = 0, startX = 0, gap = 12, slotH = 0;
      var item = null, dragOn = false, qY = null, lastDy = 0;
      function beginDrag(t, e) {
        item = t; dragOn = false; startY = e.clientY; startX = e.clientX;
        var kids = [].slice.call(container.children);
        slots = kids.map(function (k) {
          var r = k.getBoundingClientRect();
          return { el: k, top: r.top, h: r.height || 0 };
        });
        selfIdx = slots.map(function (s) { return s.el; }).indexOf(item);
        if (slots.length > 1) gap = slots[1].top - slots[0].top - slots[0].h;
        if (!(gap > 1 && gap < 80)) gap = 12;
        slotH = (slots[0].h || 44) + gap;
        qY = gsap.quickTo(item, 'y', { duration: 0.02, ease: 'power1.out' });
      }
      function onMove(e) {
        if (!slots) return;
        var dy = e.clientY - startY, dx = e.clientX - startX;
        if (!dragOn && Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
        if (!dragOn) {
          dragOn = true;
          item.classList.add('fx-dragging');
          item.style.zIndex = 40;
          gsap.to(item, { scale: 1.04, duration: 0.14, ease: 'power3.out' });
          try { item.setPointerCapture(e.pointerId); } catch (err) {}
          document.body.classList.add('fx-sorting');
        }
        e.preventDefault();
        /* 严格限制在列表范围内拖动，不允许拖出框 */
        var maxY = (slots.length - 1) * slotH;
        var y = Math.max(0, Math.min(maxY, dy));
        lastDy = y;
        qY(y);
        var v = Math.round(y / slotH);
        if (v < 0) v = 0;
        if (v > slots.length - 1) v = slots.length - 1;
        if (v !== newIdx) {
          newIdx = v;
          /* 让路式：拖拽项经过处，其它项平滑让位（方向与拖拽相反，始终平行不覆盖） */
          for (var j = 0; j < slots.length; j++) {
            if (j === selfIdx) continue;
            var d = 0;
            if (newIdx > selfIdx && j > selfIdx && j <= newIdx) d = -slotH;
            if (newIdx < selfIdx && j >= newIdx && j < selfIdx) d = slotH;
            var el2 = slots[j].el;
            gsap.killTweensOf(el2, 'y');
            gsap.to(el2, { y: d, duration: 0.16, ease: 'power3.out', overwrite: 'auto' });
          }
        }
      }
      function endDrag() {
        if (!slots) return;
        var ni = newIdx, si = selfIdx, wasDrag = dragOn;
        var it = item;
        var rest = wasDrag ? (lastDy - (ni >= 0 ? ni * slotH : 0)) : 0;
        slots = null; newIdx = -1; selfIdx = -1; dragOn = false;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', endDrag);
        document.removeEventListener('pointercancel', endDrag);
        document.body.classList.remove('fx-sorting');
        if (!wasDrag) { item = null; return; }
        if (ni >= 0 && ni < container.children.length && ni !== si) {
          var kids = [].slice.call(container.children);
          var el = kids[si];
          container.removeChild(el);
          kids = [].slice.call(container.children);
          var target = kids[Math.max(0, Math.min(ni, kids.length))];
          if (target) container.insertBefore(el, target); else container.appendChild(el);
        }
        fxSortSave(container, key);
        /* 换位后只留一点残差，从鼠标位置平滑滑入新槽位，全程不跳变 */
        gsap.set(it, { y: rest });
        gsap.to(it, {
          y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.6)', overwrite: 'auto',
          onComplete: function () {
            it.classList.remove('fx-dragging');
            it.style.zIndex = '';
            gsap.set(it, { clearProps: 'transform' });
          }
        });
        [].slice.call(container.children).forEach(function (k) {
          if (k !== it) { gsap.killTweensOf(k, 'y'); gsap.to(k, { y: 0, duration: 0.16, ease: 'power2.out', overwrite: 'auto' }); }
        });
        item = null;
      }
      container.addEventListener('pointerdown', function (e) {
        if (e.button && e.button !== 0) return;
        var t = e.target;
        if (t.closest('button, input, select, a, textarea')) return;
        var it = t.closest('.note-item, .todo-item, .goal-card');
        if (!it || it.parentNode !== container || container.children.length < 2) return;
        beginDrag(it, e);
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointercancel', endDrag);
      });
    }
    /* 三个垂直列表：初始化 + 重渲染后恢复顺序 */
    ['noteList', 'todoList', 'weeklyList'].forEach(function (id) {
      var c = document.getElementById(id);
      if (!c) return;
      fxSortApply(c, 'fx_sort_' + id);
      fxMakeSorter(c, 'fx_sort_' + id);
      new MutationObserver(function () { fxSortApply(c, 'fx_sort_' + id); }).observe(c, { childList: true });
    });
    /* 阶段目标：按分组（月/学期/年）分别排序，组被重渲染后重建 */
    function fxInitGoalGroups() {
      [].slice.call(document.querySelectorAll('#goalGroups .goal-group')).forEach(function (g) {
        var title = g.querySelector('.goal-group-title');
        var key = 'fx_sort_goalgroup_' + (title ? title.textContent.replace(/\s+/g, '') : 'x');
        if (g._fxGoalKey === key) return;
        g._fxGoalKey = key;
        fxSortApply(g, key);
        fxMakeSorter(g, key);
      });
    }
    var fxGoalGroupsEl = document.getElementById('goalGroups');
    if (fxGoalGroupsEl) {
      fxInitGoalGroups();
      new MutationObserver(fxInitGoalGroups).observe(fxGoalGroupsEl, { childList: true });
    }
  }

  /* ---- 侧边栏切换：内容滑入式转场（三模式各自气质）+ 液体条同步滑动 ----
     正常→如纸张轻轻放上；绿色→如嫩芽生长破土（微弹性）；夜晚→如星光逐一点亮。
     向下导航从下方滑入、向上导航从上方滑入，如页面在垂直空间流转。 */
  var fxNavOrder = [].slice.call(document.querySelectorAll('.nav-item')).map(function (n) { return n.getAttribute('data-target'); });
  var fxPrevTarget = null;
  if (window.gsap) {
    document.addEventListener('click', function (e) {
      var it = e.target.closest('.nav-item');
      if (!it) return;
      var cur = document.querySelector('.section.active');
      fxPrevTarget = cur ? cur.id : fxPrevTarget;
    }, true);
    function fxSectionEnter(sec) {
      var prevIdx = fxNavOrder.indexOf(fxPrevTarget);
      var newIdx = fxNavOrder.indexOf(sec.id);
      var dir = newIdx > prevIdx ? 1 : (newIdx < prevIdx ? -1 : 0);
      var green = document.body.classList.contains('mode-green');
      var night = document.body.classList.contains('dark-mode');
      var d0 = dir === 0 ? 1 : dir;
      gsap.killTweensOf(sec);
      if (sec._fxCardTween) {
        sec._fxCardTween.kill();
        (sec._fxCardList || []).forEach(function (c) { c.style.animation = ''; });
        gsap.set(sec._fxCardList || [], { autoAlpha: 1, clearProps: 'transform' });
      }
      /* ① 整块板块入场：三模式各自气质，贴合页面温馨手账风（无科技感） */
      if (green) {
        /* 绿色·蓬勃生机：板块从下方"发芽"生长，柔和弹性 */
        gsap.fromTo(sec, { y: 44 * d0, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.15)', overwrite: 'auto' });
      } else if (night) {
        /* 夜晚·宁静平和：如月光缓缓浮现，几乎无位移 */
        gsap.fromTo(sec, { y: 10 * d0, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power1.out', overwrite: 'auto' });
      } else {
        /* 正常·简约大气：如纸张轻轻放上 */
        gsap.fromTo(sec, { y: 26 * d0, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
      }
      /* ② 卡片依次入场：三模式不同姿态（贴纸贴上 / 嫩芽破土 / 星光点亮） */
      var cards = [].slice.call(sec.querySelectorAll('.card')).filter(function (c) {
        return getComputedStyle(c).display !== 'none';
      });
      if (cards.length) {
        cards.forEach(function (c) { c.style.animation = 'none'; });
        sec._fxCardList = cards;
        var tl = gsap.timeline({ onComplete: function () {
          cards.forEach(function (c) { c.style.animation = ''; });
          sec._fxCardTween = null;
        } });
        cards.forEach(function (c, i) {
          var at = 0.06 + i * (green ? 0.06 : 0.05);
          if (green) {
            tl.fromTo(c, { y: 18, autoAlpha: 0, scale: 0.985, rotation: 0.6 },
              { y: 0, autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.3)' }, at);
          } else if (night) {
            tl.fromTo(c, { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.5, ease: 'sine.out' }, at);
          } else {
            tl.fromTo(c, { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, at);
          }
        });
        sec._fxCardTween = tl;
        if (window.__fxRevealMark) window.__fxRevealMark(cards); /* 切换动画已接管，跳过滚动入场 */
      }
    }
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type !== 'attributes' || m.attributeName !== 'class') return;
        var t = m.target;
        if (!t.classList || !t.classList.contains('section')) return;
        if (t.classList.contains('active')) fxSectionEnter(t);
        else gsap.set(t, { clearProps: 'all' });
      });
    }).observe(document.getElementById('main') || document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ---- ⑥ 滚动入场：内容进入视口时依次浮现（三模式各自姿态 + 运动重量）
     正常→轻快浮起；绿色→嫩芽式生长；夜晚→缓慢点亮。
     大卡沉稳（时长 +0.12s）、小卡轻快，体现"不同大小不同运动重量"。 ---- */
  if ('IntersectionObserver' in window && window.gsap) {
    var fxRevealDone = new WeakSet();
    var fxRevealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var c = en.target;
        if (!en.isIntersecting || fxRevealDone.has(c)) return;
        fxRevealDone.add(c);
        fxRevealIO.unobserve(c);
        var green = document.body.classList.contains('mode-green');
        var night = document.body.classList.contains('dark-mode');
        var sz = fxRevealSize(c);
        if (green) {
          gsap.fromTo(c, { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.4 + sz, ease: 'back.out(1.2)', overwrite: 'auto' });
        } else if (night) {
          gsap.fromTo(c, { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.6 + sz, ease: 'sine.out', overwrite: 'auto' });
        } else {
          gsap.fromTo(c, { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.32 + sz, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    }, { threshold: 0.02 });
    function fxRevealSize(c) {
      var w = c.offsetWidth || 300;
      if (w < 260) return 0;      /* 小卡：轻快 */
      if (w < 430) return 0.06;   /* 中卡 */
      return 0.12;                /* 全宽长卡：沉稳 */
    }
    window.__fxRevealMark = function (cards) {
      cards.forEach(function (c) {
        if (fxRevealDone.has(c)) return;
        fxRevealDone.add(c);
        fxRevealIO.unobserve(c);
      });
    };
    document.querySelectorAll('.section .card').forEach(function (c) {
      if (getComputedStyle(c).display === 'none') return;
      fxRevealIO.observe(c);
    });
  }

  /* ---- ⑦ 绿色手账风专属：背景装饰随滚动分级视差流动（小元素快、大元素慢）
     星星/光点轻快、叶子居中、花朵沉稳、流星最远，滚动时层间错动出纵深感。
     惯性平滑跟随：滚动停止后装饰继续轻柔滑到目标位，无生硬顿挫。
     用 translate 独立属性叠加，不与原有 twinkle/fall/sway 动画冲突。 ---- */
  var fxDeco = document.querySelector('.decorations');
  if (fxDeco && window.gsap && 'translate' in document.documentElement.style) {
    var fxDecoEls = [];
    fxDeco.querySelectorAll('.star, .leaf, .flower, .dot-float, .shooting-star').forEach(function (el) {
      var sp = 0.14;
      if (el.classList.contains('leaf')) sp = 0.10;
      else if (el.classList.contains('flower')) sp = 0.07;
      else if (el.classList.contains('dot-float')) sp = 0.16;
      else if (el.classList.contains('shooting-star')) sp = 0.05;
      fxDecoEls.push({ el: el, sp: sp });
    });
    var fxDecoCur = 0, fxDecoRun = false;
    function fxDecoApply() {
      var v = fxDecoCur;
      for (var i = 0; i < fxDecoEls.length; i++) {
        fxDecoEls[i].el.style.translate = '0 ' + Math.round(v * fxDecoEls[i].sp) + 'px';
      }
    }
    function fxDecoStep() {
      fxDecoRun = false;
      if (fxDeco.offsetParent === null) { fxDecoCur = 0; return; } /* 非绿色模式不可见 */
      var target = window.scrollY || 0;
      if (Math.abs(target - fxDecoCur) < 0.5) {
        fxDecoCur = target;
        fxDecoApply();
        return;
      }
      fxDecoCur += (target - fxDecoCur) * 0.14; /* 指数逼近：丝滑惯性 */
      fxDecoApply();
      fxDecoRun = true;
      requestAnimationFrame(fxDecoStep);
    }
    window.addEventListener('scroll', function () {
      if (!fxDecoRun) { fxDecoRun = true; requestAnimationFrame(fxDecoStep); }
    }, { passive: true });
    fxDecoStep();
  }

  /* ---- 侧边栏 tab：无缝液体滑（起步即走、落定即稳，永远跟随激活项） ----
     唯一同步入口 navSyncPill：
     · 初始 / 布局就绪 / 窗口缩放 → 直接吸附，杜绝错位；
     · active 变化（点击、程序化跳转、自动恢复）→ MutationObserver 捕获，
       按"液体条当前矩形 → 目标矩形"的实时差值纯平移 0.18s，连点不跳变。 */
  var navSidebar = document.getElementById('sidebar');
  var navPill = navSidebar && navSidebar.querySelector('.nav-liquid');
  function navActiveItem() {
    return navSidebar ? navSidebar.querySelector('.nav-item.active') : null;
  }
  function navItemRect(item) {
    if (!navSidebar || !item) return null;
    var sr = navSidebar.getBoundingClientRect();
    var ir = item.getBoundingClientRect();
    return { left: ir.left - sr.left, top: ir.top - sr.top, width: ir.width, height: ir.height };
  }
  function navSyncPill(item, animate) {
    if (!navPill || !item) return;
    var r = navItemRect(item);
    if (!r) return;
    gsap.killTweensOf(navPill);
    if (animate && window.gsap) {
      var pr = navPill.getBoundingClientRect();
      var sr = navSidebar.getBoundingClientRect();
      var dY = r.top - (pr.top - sr.top);
      var dL = r.left - (pr.left - sr.left);
      if (Math.abs(dY) > 0.5 || Math.abs(dL) > 0.5) {
        /* 纯平移：快速顺滑，无形变、无水光、无中途鼓起 */
        gsap.to(navPill, { y: '+=' + (Math.round(dY * 100) / 100), x: '+=' + (Math.round(dL * 100) / 100), duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
      }
    } else {
      navPill.style.left = r.left + 'px';
      navPill.style.top = r.top + 'px';
      navPill.style.width = r.width + 'px';
      navPill.style.height = r.height + 'px';
      if (window.gsap) gsap.set(navPill, { x: 0, y: 0, clearProps: 'transform' });
      else navPill.style.transform = '';
    }
  }
  if (navSidebar && navPill) {
    navSyncPill(navActiveItem(), false);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type !== 'attributes' || m.attributeName !== 'class') return;
        var t = m.target;
        if (!t.classList || !t.classList.contains('nav-item')) return;
        if (t.classList.contains('active')) {
          navSyncPill(t, true);
          if (t.getAttribute('data-target') === 'home' && window.fxGreetReplay) window.fxGreetReplay();
        }
      });
    }).observe(navSidebar, { subtree: true, attributes: true, attributeFilter: ['class'] });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { navSyncPill(navActiveItem(), false); });
    } else {
      navSyncPill(navActiveItem(), false);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { navSyncPill(navActiveItem(), false); });
    }
    window.addEventListener('resize', function () { navSyncPill(navActiveItem(), false); });
  }

  /* ---- 主题切换：柔和光幕闪一下 + 卡片按模式气质重新入场 ---- */
  var veil = document.getElementById('fxVeil');
  if (veil) {
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.seg-btn')) return;
      veil.animate(
        [{ opacity: 0 }, { opacity: 0.32 }, { opacity: 0 }],
        { duration: 640, easing: 'ease-in-out' }
      );
    }, true);
  }

  document.addEventListener('click', function (e) {
      if (!e.target.closest('.seg-btn')) return;
      var cards = [].slice.call(document.querySelectorAll('.section.active .card'));
      setTimeout(function () {
        var green = body.classList.contains('mode-green');
        var night = body.classList.contains('dark-mode');
        cards.forEach(function (c, i) {
          if (green) {
            c.animate(
              [{ transform: 'translateY(14px) scale(.98)', opacity: 0.4 },
               { transform: 'translateY(0) scale(1)', opacity: 1 }],
              { duration: 520, delay: i * 70, easing: 'cubic-bezier(.34,1.56,.64,1)' }
            );
          } else if (night) {
            c.animate(
              [{ transform: 'translateY(8px)', opacity: 0.55, filter: 'blur(4px)' },
               { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }],
              { duration: 600, delay: i * 60, easing: 'ease-out' }
            );
          } else {
            c.animate(
              [{ transform: 'translateY(10px) scale(.985)', opacity: 0.5 },
               { transform: 'translateY(0) scale(1)', opacity: 1 }],
              { duration: 450, delay: i * 50, easing: 'cubic-bezier(.16,1,.3,1)' }
            );
          }
        });
      }, 130);
    }, true);

  /* ============================================================
     交互增强层 · 高级细节（只加不减，不改任何原设计）
     数字滚动 / 磁性按钮 / 卡片流光描边 / 标题描画 / 完成能量注入
     ============================================================ */

  /* ---- 数字滚动增长：进入板块时数据从 0 轻盈跳到真实值 ----
     支持 纯数字 / a/b / n% / 前缀+数字+后缀（如"12天"）；平均分保留一位小数 */
  var FX_NUM_SEL = '.stat-value, .streak-number, .review-stat-value, .progress-line, .progress-text, .goal-percent';
  function fxNumParts(text) {
    if (!text) return null;
    var s = text.replace(/\s+/g, ' ').trim();
    var m = s.match(/^([^\d]*?)(\d+(?:\.\d+)?)\s*\/\s*(\d+)$/);
    if (m) return { pre: m[1], a: +m[2], b: +m[3], fmt: 'ab' };
    m = s.match(/^([^\d]*?)(\d+(?:\.\d+)?)\s*%$/);
    if (m) return { pre: m[1], a: +m[2], fmt: 'pct' };
    m = s.match(/^([^\d]*?)(\d+(?:\.\d+)?)(.*)$/);
    if (m && m[2] !== '') return { pre: m[1], a: +m[2], suf: m[3], fmt: 'mix' };
    return null;
  }
  function fxCountEl(el, delay) {
    var p = fxNumParts(el.textContent);
    if (!p || p.a > 99999) return;
    if (el._fxCnt) cancelAnimationFrame(el._fxCnt);
    var dec = p.a % 1 !== 0 ? 1 : 0;
    var dur = 0.9, t0 = performance.now() + delay * 1000;
    function step(now) {
      var e = Math.max(0, Math.min(1, (now - t0) / (dur * 1000)));
      var v = p.a * (1 - Math.pow(1 - e, 4));
      var num = dec ? v.toFixed(1) : String(Math.round(v));
      if (p.fmt === 'ab') el.textContent = p.pre + num + '/' + p.b;
      else if (p.fmt === 'pct') el.textContent = p.pre + num + '%';
      else el.textContent = p.pre + num + p.suf;
      if (e < 1) el._fxCnt = requestAnimationFrame(step); else el._fxCnt = null;
    }
    el._fxCnt = requestAnimationFrame(step);
  }
  function fxSectionCount(sec) {
    if (!sec) return;
    var els = [].slice.call(sec.querySelectorAll(FX_NUM_SEL));
    els.forEach(function (el, i) {
      if (getComputedStyle(el).display === 'none') return;
      fxCountEl(el, i * 0.06);
    });
  }

  /* ---- 标题描画：进入板块时一道笔触从标题下划过（瞬态，不残留） ---- */
  function fxTitleStroke(sec) {
    if (!sec || !window.gsap) return;
    var h1 = sec.querySelector('.page-header h1');
    if (!h1) return;
    var s = document.createElement('span');
    s.className = 'fx-titlestroke';
    h1.appendChild(s);
    gsap.fromTo(s, { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.inOut', onComplete: function () {
        gsap.to(s, { opacity: 0, duration: 0.45, delay: 0.3, onComplete: function () { s.remove(); } });
      } });
  }

  /* ---- 板块激活时：数字滚动 + 标题描画（含初始激活页） ---- */
  var fxMainEl = document.getElementById('main');
  if (fxMainEl) {
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type !== 'attributes' || m.attributeName !== 'class') return;
        var t = m.target;
        if (!t.classList || !t.classList.contains('section')) return;
        if (t.classList.contains('active')) { fxSectionCount(t); fxTitleStroke(t); }
      });
    }).observe(fxMainEl, { subtree: true, attributes: true, attributeFilter: ['class'] });
    function fxInitActive() {
      var act = document.querySelector('.section.active');
      if (act) { fxSectionCount(act); fxTitleStroke(act); }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fxInitActive);
    else fxInitActive();
  }

  /* ---- 磁性按钮：.btn-text 被光标轻轻吸引（弹簧回正），细腻的高级手感 ---- */
  if (hoverable && window.gsap) {
    var fxMagBtn = null, fxMagQX = null, fxMagQY = null;
    document.addEventListener('pointerover', function (e) {
      var b = e.target.closest ? e.target.closest('.btn-text') : null;
      if (!b || b === fxMagBtn || b.disabled) return;
      if (body.classList.contains('fx-sorting')) return;
      fxMagBtn = b;
      gsap.killTweensOf(fxMagBtn);
      fxMagQX = gsap.quickTo(fxMagBtn, 'x', { duration: 0.22, ease: 'power2.out' });
      fxMagQY = gsap.quickTo(fxMagBtn, 'y', { duration: 0.22, ease: 'power2.out' });
    }, true);
    document.addEventListener('pointermove', function (e) {
      if (!fxMagBtn || !fxMagQX || !fxMagQY) return;
      var r = fxMagBtn.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width / 2);
      var my = e.clientY - (r.top + r.height / 2);
      var max = Math.min(r.width, r.height) * 0.14;
      if (max < 3) max = 3;
      if (max > 7) max = 7;
      var d = Math.sqrt(mx * mx + my * my);
      var pull = d < 70 ? (1 - d / 70) : 0;
      if (pull <= 0) return;
      var px = Math.max(-max, Math.min(max, mx * 0.4)) * pull;
      var py = Math.max(-max, Math.min(max, my * 0.4)) * pull;
      fxMagQX(px);
      fxMagQY(py);
    }, true);
    document.addEventListener('pointerout', function (e) {
      var b = e.target.closest ? e.target.closest('.btn-text') : null;
      if (!b || b !== fxMagBtn) return;
      var to = e.relatedTarget;
      if (to && b.contains(to)) return; /* 仍在按钮内部移动，不释放 */
      var old = fxMagBtn; fxMagBtn = null; fxMagQX = fxMagQY = null;
      gsap.to(old, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto',
        onComplete: function () { gsap.set(old, { clearProps: 'transform' }); } });
    }, true);
  }

  /* ---- 卡片描边流光：悬停时一道品牌色柔光沿边框掠过（数据类卡片） ---- */
  if (hoverable) {
    var FX_SWEEP_SEL = '.stat-card, .streak-card, .summary-auto-card, .chart-card, ' +
                       '.timeline-card, .calendar-card, .insight-card, .insight-status-card, ' +
                       '.insight-suggest-card, .plan-card';
    document.addEventListener('pointerover', function (e) {
      var c = e.target.closest ? e.target.closest(FX_SWEEP_SEL) : null;
      if (!c || !c.querySelector) return;
      if (body.classList.contains('fx-sorting')) return;
      var ov = c._fxSweep;
      if (!ov) {
        ov = document.createElement('span');
        ov.className = 'fx-bsweep';
        c.appendChild(ov);
        c._fxSweep = ov;
      }
      ov.classList.add('on');
    }, true);
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest ? e.target.closest(FX_SWEEP_SEL) : null;
      if (!c || !c._fxSweep) return;
      var to = e.relatedTarget;
      if (to && (to === c || c.contains(to))) return;
      c._fxSweep.classList.remove('on');
    }, true);
  }

  /* ---- 完成能量注入：勾选待办/随手记、松手目标滑杆时，操作点泛起绿色能量脉冲 ---- */
  function fxPulseAt(x, y) {
    var p = document.createElement('span');
    p.className = 'fx-pulse';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    document.body.appendChild(p);
    p.addEventListener('animationend', function () { p.remove(); });
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.todo-checkbox, .note-dot');
    if (!c) return;
    var r = c.getBoundingClientRect();
    fxPulseAt(r.left + r.width / 2, r.top + r.height / 2);
  }, true);
  document.addEventListener('change', function (e) {
    var s = e.target.closest('.goal-slider');
    if (!s) return;
    var r = s.getBoundingClientRect();
    fxPulseAt(r.left + r.width / 2, r.top + r.height / 2);
  }, true);

  /* ============================================================
     交互增强层 · 第二批（只加不减，不改任何原设计）
     按钮扫光 / 卡片光标柔光 / 滑杆数值气泡 / 目标达成星光 /
     勾选盖章微震 / 光标伴星
     ============================================================ */

  /* ---- 卡片光标柔光：柔光随光标在卡片表面游走 ----
     在内容层(z-index:2)之下，只照亮纸面，绝不遮文字；
     拖拽排序时让路，不参与 */
  if (hoverable) {
    var FX_SPOT_SEL = '.stat-card, .streak-card, .summary-auto-card, .chart-card, ' +
                      '.timeline-card, .calendar-card, .insight-card, .insight-status-card, ' +
                      '.insight-suggest-card, .plan-card, .input-card';
    document.addEventListener('pointerover', function (e) {
      var c = e.target.closest ? e.target.closest(FX_SPOT_SEL) : null;
      if (!c) return;
      if (body.classList.contains('fx-sorting')) return;
      var sp = c._fxSpot;
      if (!sp) {
        sp = document.createElement('span');
        sp.className = 'fx-spot';
        c.appendChild(sp);
        c._fxSpot = sp;
      }
      sp.classList.add('on');
    }, true);
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest ? e.target.closest(FX_SPOT_SEL) : null;
      if (!c || !c._fxSpot) return;
      var r = c.getBoundingClientRect();
      c._fxSpot.style.setProperty('--fx-sx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      c._fxSpot.style.setProperty('--fx-sy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }, true);
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest ? e.target.closest(FX_SPOT_SEL) : null;
      if (!c || !c._fxSpot) return;
      var to = e.relatedTarget;
      if (to && (to === c || c.contains(to))) return;
      c._fxSpot.classList.remove('on');
    }, true);
  }

  /* ---- 滑杆数值气泡 + 目标达成星光 ----
     拖动/聚焦滑杆时拇指上方浮现实时百分比；松手推到 100% 时绽放小星星 */
  var fxBubble = null;
  function fxStarBurst(x, y) {
    for (var i = 0; i < 5; i++) {
      var s = document.createElement('span');
      s.className = 'fx-star';
      s.textContent = '✦';
      var ang = -150 + Math.random() * 120; /* 向上扇形 */
      var dist = 26 + Math.random() * 34;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--fx-sx', (Math.cos(ang * Math.PI / 180) * dist).toFixed(1) + 'px');
      s.style.setProperty('--fx-sy', (Math.sin(ang * Math.PI / 180) * dist).toFixed(1) + 'px');
      s.style.setProperty('--fx-sr', (Math.random() * 320 - 160).toFixed(0) + 'deg');
      document.body.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
    }
  }
  function fxBubblePos(sl) {
    if (!fxBubble) return;
    var r = sl.getBoundingClientRect();
    var min = sl.min ? parseFloat(sl.min) : 0;
    var max = sl.max ? parseFloat(sl.max) : 100;
    var v = parseFloat(sl.value) || 0;
    var p = max > min ? Math.max(0, Math.min(1, (v - min) / (max - min))) : 0;
    fxBubble.style.left = (r.left + p * r.width) + 'px';
    fxBubble.style.top = Math.max(6, r.top - 32) + 'px';
    fxBubble.textContent = Math.round(v) + '%';
  }
  function fxBubbleShow(sl) {
    if (!fxBubble) {
      fxBubble = document.createElement('span');
      fxBubble.className = 'fx-slide-bubble';
      document.body.appendChild(fxBubble);
    }
    fxBubblePos(sl);
  }
  function fxBubbleHide(sl, burst) {
    var b = fxBubble;
    fxBubble = null;
    if (b) {
      b.classList.add('out');
      b.addEventListener('animationend', function () { b.remove(); });
    }
    if (burst && sl) {
      var r = sl.getBoundingClientRect();
      var min = sl.min ? parseFloat(sl.min) : 0;
      var max = sl.max ? parseFloat(sl.max) : 100;
      var v = parseFloat(sl.value) || 0;
      var p = max > min ? (v - min) / (max - min) : 0;
      fxStarBurst(r.left + p * r.width, r.top);
    }
  }
  document.addEventListener('pointerdown', function (e) {
    var sl = e.target.closest('.goal-slider');
    if (!sl) return;
    fxBubbleShow(sl);
  }, true);
  document.addEventListener('focusin', function (e) {
    if (e.target.classList && e.target.classList.contains('goal-slider')) fxBubbleShow(e.target);
  }, true);
  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('goal-slider')) fxBubblePos(e.target);
  }, true);
  document.addEventListener('pointerup', function (e) {
    var sl = e.target.closest('.goal-slider');
    if (!sl) return;
    var max = sl.max ? parseFloat(sl.max) : 100;
    fxBubbleHide(sl, parseFloat(sl.value) >= max);
  }, true);
  document.addEventListener('pointercancel', function (e) {
    var sl = e.target.closest('.goal-slider');
    if (sl) fxBubbleHide(sl, false);
  }, true);
  document.addEventListener('focusout', function (e) {
    if (e.target.classList && e.target.classList.contains('goal-slider')) fxBubbleHide(null, false);
  }, true);
  window.addEventListener('scroll', function () { fxBubbleHide(null, false); }, { passive: true });

  /* ---- 勾选盖章微震：勾选待办/随手记时，圆点如橡皮章按压回弹 ----
     只动 transform，背景过渡保留原样（颜色渐变不变） */
  if (window.gsap) {
    document.addEventListener('click', function (e) {
      var c = e.target.closest('.todo-checkbox, .note-dot');
      if (!c) return;
      if (body.classList.contains('fx-sorting')) return;
      var cs = c.style.transition;
      c.style.transition = 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease';
      gsap.killTweensOf(c);
      gsap.fromTo(c,
        { scaleX: 1.25, scaleY: 0.72, rotation: -10, transformOrigin: '50% 90%' },
        { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.52, ease: 'elastic.out(1, 0.5)',
          onComplete: function () {
            c.style.transition = cs;
            gsap.set(c, { clearProps: 'transform' });
          } });
    }, true);
  }

  /* ============================================================
     交互增强层 · 第三批（只加不减，不改任何原设计）
     卡片常驻生命力：呼吸上浮 / 边缘辉光 / 顶部流光条
     每张卡注入 .fx-idle（呼吸上浮）+ .fx-halo（辉光条）；
     流光条颜色按每张卡自身边框色取色（粉色框配粉色光），
     切换主题时自动重取；相位错开，页面如星野般各自呼吸
     ============================================================ */
  (function fxIdleInit() {
    function fxRgbOf(s) {
      var m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
      return [+m[1], +m[2], +m[3]];
    }
    function fxTintCards() {
      var dark = body.classList.contains('dark-mode');
      var green = body.classList.contains('mode-green');
      [].slice.call(document.querySelectorAll('.card')).forEach(function (c) {
        var bc = fxRgbOf(getComputedStyle(c).borderTopColor);
        if (!bc) {
          /* 取色失败兜底：按模式用主题色，避免灰黑伪影 */
          bc = green ? [245, 158, 11]
             : dark ? [143, 161, 181]
             : [52, 178, 102];
        }
        /* 正常模式·首页本月概览：白色扫光，避免浅绿边框带来的绿光 */
        if (!dark && !green && c.closest('#home') && c.classList.contains('mini-calendar-card')) {
          c.style.setProperty('--fx-strip-c', 'rgb(243,246,250)');
          c.style.setProperty('--fx-halo-c', 'rgba(190,210,235,0.4)');
          return;
        }
        /* 绿色模式·文本框/洞察板块：银白发光条，绿色太多反而庸俗，银白更雅致 */
        if (green && (c.classList.contains('input-card') || c.closest('#insight'))) {
          c.style.setProperty('--fx-strip-c', 'rgb(224,230,238)');
          c.style.setProperty('--fx-halo-c', 'rgba(203,213,225,0.4)');
          return;
        }
        /* 夜晚·文本框：静谧灰调，不随边框色，弱化辉光 */
        if (dark && c.classList.contains('input-card')) {
          c.style.setProperty('--fx-strip-c', 'rgb(156,165,175)');
          c.style.setProperty('--fx-halo-c', 'rgba(150,161,174,0.3)');
          return;
        }
        /* 正常/绿色模式·首页随手记：暖黄发光条，匹配金色胶带边框 */
        if (!dark && c.closest('#home') && c.classList.contains('sticky-note')) {
          c.style.setProperty('--fx-strip-c', '#f0c94d');
          c.style.setProperty('--fx-halo-c', 'rgba(232,197,71,0.55)');
          return;
        }
        var k = dark ? 0.4 : 0.06;
        var lt = bc.map(function (v) { return Math.round(v + (255 - v) * k); });
        c.style.setProperty('--fx-strip-c', 'rgb(' + lt.join(',') + ')');
        c.style.setProperty('--fx-halo-c', 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',0.62)');
        c.style.setProperty('--fx-spot', 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',0.14)');
        c.style.setProperty('--fx-spot2', 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',0.07)');
      });
    }
    var cards = document.querySelectorAll('.card');
    [].slice.call(cards).forEach(function (c, i) {
      c.classList.add('fx-idle');
      var h = document.createElement('span');
      h.className = 'fx-halo';
      h.setAttribute('aria-hidden', 'true');
      c.appendChild(h);
      h.style.setProperty('--fx-halo-d', ((i * 0.61) % 4.2).toFixed(2) + 's');
    });
    fxTintCards();
    function fxSetTint(tint, dark) {
      /* 切换瞬间：全部卡片先上"新模式主题色"（非灰色、非旧色），边框过渡结束再取各卡边框适配色 */
      [].slice.call(document.querySelectorAll('.card')).forEach(function (c) {
        if (body.classList.contains('mode-green') && (c.classList.contains('input-card') || c.closest('#insight'))) {
          /* 绿色模式文本框/洞察板块发光条：银白，与取色结果一致，切换瞬间不闪色 */
          c.style.setProperty('--fx-strip-c', 'rgb(224,230,238)');
          c.style.setProperty('--fx-halo-c', 'rgba(203,213,225,0.4)');
          return;
        }
        if (dark && c.classList.contains('input-card')) {
          c.style.setProperty('--fx-strip-c', 'rgb(156,165,175)');
          c.style.setProperty('--fx-halo-c', 'rgba(150,161,174,0.3)');
          return;
        }
        if (!dark && !body.classList.contains('mode-green') && c.closest('#home') && c.classList.contains('mini-calendar-card')) {
          c.style.setProperty('--fx-strip-c', 'rgb(243,246,250)');
          c.style.setProperty('--fx-halo-c', 'rgba(190,210,235,0.4)');
          return;
        }
        if (!dark && c.closest('#home') && c.classList.contains('sticky-note')) {
          c.style.setProperty('--fx-strip-c', '#f0c94d');
          c.style.setProperty('--fx-halo-c', 'rgba(232,197,71,0.55)');
          return;
        }
        var lt = tint.map(function (v) { return Math.round(v + (255 - v) * 0.06); });
        c.style.setProperty('--fx-strip-c', 'rgb(' + lt.join(',') + ')');
        c.style.setProperty('--fx-halo-c', 'rgba(' + tint[0] + ',' + tint[1] + ',' + tint[2] + ',0.62)');
        c.style.setProperty('--fx-spot', 'rgba(' + tint[0] + ',' + tint[1] + ',' + tint[2] + ',0.14)');
        c.style.setProperty('--fx-spot2', 'rgba(' + tint[0] + ',' + tint[1] + ',' + tint[2] + ',0.07)');
      });
    }
    var tintTimer = null;
    new MutationObserver(function () {
      var dark = body.classList.contains('dark-mode');
      var tint = body.classList.contains('mode-green') ? [245, 158, 11]
               : dark ? [143, 161, 181]
               : [52, 178, 102];
      fxSetTint(tint, dark);
      clearTimeout(tintTimer);
      tintTimer = setTimeout(fxTintCards, 450);
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ---- 输入卡片聚焦点亮：光标落进文本框时，卡片亮起一圈同色柔光 ---- */
  document.addEventListener('focusin', function (e) {
    var card = e.target.closest('.input-card');
    if (card) card.classList.add('fx-card-focus');
  }, true);
  document.addEventListener('focusout', function (e) {
    var card = e.target.closest('.input-card');
    if (card) card.classList.remove('fx-card-focus');
  }, true);
})();

/* ============================================================
   交互增强层 · 第四批（只加不减，不改任何原设计）
   磁吸按钮 / 标题文字解算 / 数字滚动 / 滚动进度条 / 胶片噪点 DOM
   ============================================================ */
(function () {
  var body = document.body;

  /* ---- ① 磁吸按钮：悬停时被光标轻轻吸住，离开弹性回正 ----
     只作用于主按钮 .btn / .action-btn；
     用 translate 独立属性实现，不与 GSAP 蓄力回弹的 transform 冲突；
     按下瞬间归零让位给蓄力动画，释放后恢复磁吸 */
  var MAG_SEL = '.btn, .action-btn';
  var magMode = body.classList.contains('dark-mode') ? 0.8 : 1;
  [].slice.call(document.querySelectorAll(MAG_SEL)).forEach(function (b) {
    b.classList.add('fx-mag');
    b.addEventListener('pointermove', function (e) {
      if (b._fxPress) return;
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * 0.16 * magMode;
      var dy = (e.clientY - (r.top + r.height / 2)) * 0.2 * magMode;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) { dx = 0; dy = 0; }
      b.classList.add('fx-mag-fast');
      b.style.translate = dx.toFixed(2) + 'px ' + dy.toFixed(2) + 'px';
    });
    b.addEventListener('pointerdown', function () {
      b._fxPress = true;
      b.classList.remove('fx-mag-fast');
      b.classList.add('fx-mag-press');
      b.style.translate = '0 0';
    });
    b.addEventListener('pointerup', function () {
      b._fxPress = false;
      b.classList.remove('fx-mag-press');
      b.classList.add('fx-mag-fast');
    });
    b.addEventListener('pointerleave', function () {
      b._fxPress = false;
      b.classList.remove('fx-mag-fast', 'fx-mag-press');
      b.style.translate = '';
    });
  });

  /* ---- ② 标题文字解算：悬停时字符滚动解算回原文 ----
     全角字符集保证宽度一致不抖动；移出立即还原；
     每次悬停重新取原文，避免外部更新文本后缓存过期 */
  var SCRAMBLE_CHARS = '日月火水木金土一二三四五六七八九十零甲乙丙丁天地人和';
  document.addEventListener('pointerover', function (e) {
    var h = e.target && e.target.closest ? e.target.closest('.page-header h1') : null;
    if (!h || h.id === 'greeting' || h._fxScr) return;
    h.classList.add('fx-scramble');
    h._fxScr = true;
    var txt = h.textContent;
    h.setAttribute('data-fx-txt', txt);
    var start = performance.now();
    var dur = 700;
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var done = Math.floor(t * txt.length);
      var out = '';
      for (var i = 0; i < txt.length; i++) {
        var ch = txt[i];
        if (ch === ' ' || ch === '\u3000') { out += ch; continue; }
        out += i < done ? ch : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      h.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
      else { h.textContent = txt; h._fxScr = false; }
    })(start);
  }, true);
  document.addEventListener('pointerout', function (e) {
    var h = e.target && e.target.closest ? e.target.closest('.page-header h1') : null;
    if (!h || h.id === 'greeting' || !h._fxScr) return;
    h._fxScr = false;
    h.textContent = h.getAttribute('data-fx-txt');
  }, true);

  /* ---- ③ 数字滚动：统计数字进入视野时从 0 滚至现值，之后数值变化平滑滚动 ----
     动画期间挂起观察避免递归；非数字（如状态文字）自动跳过 */
  function fxRollNum(el, from, to) {
    if (!(to > from)) { el.textContent = String(to); return; }
    var start = performance.now(), dur = 900;
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (to - from) * e));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = String(to);
    })(start);
  }
  var numEls = [].slice.call(document.querySelectorAll(
    '.stat-value, .streak-number, .review-stat-value'));
  numEls.forEach(function (el) {
    var v = parseInt(el.textContent, 10);
    el._fxLastNum = isNaN(v) ? 0 : v;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(el);
        var cur = parseInt(el.textContent, 10);
        if (!isNaN(cur) && cur > 0) {
          el._fxRolling = true;
          fxRollNum(el, 0, cur);
          setTimeout(function () { el._fxRolling = false; }, 1000);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });
  var numObs = new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      var el = m.target;
      if (el._fxRolling) return;
      var v = parseInt(el.textContent, 10);
      if (isNaN(v)) return;
      var from = el._fxLastNum != null ? el._fxLastNum : v;
      if (v === from) return;
      el._fxRolling = true;
      fxRollNum(el, from, v);
      el._fxLastNum = v;
      setTimeout(function () { el._fxRolling = false; }, 1000);
    });
  });
  numEls.forEach(function (el) {
    numObs.observe(el, { childList: true, characterData: true, subtree: true });
  });

  /* ---- ④ 胶片噪点层 + ⑤ 滚动进度条（DOM 注入，样式在 CSS 第四批） ---- */
  var grain = document.createElement('div');
  grain.id = 'fxGrain';
  grain.setAttribute('aria-hidden', 'true');
  body.appendChild(grain);

  var prog = document.createElement('div');
  prog.id = 'fxScrollProg';
  prog.setAttribute('aria-hidden', 'true');
  body.appendChild(prog);
  var ticking = false;
  function fxProgUpdate() {
    var doc = document.scrollingElement || document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(fxProgUpdate); }
  }, { passive: true });
  window.addEventListener('resize', fxProgUpdate);
  fxProgUpdate();
})();

/* ============================================================
   交互增强层 · 第五批：首页问候语大字 · 常亮 + 主题色高亮光带持续扫过（视频同款活跃度）
   文字常态全亮可读；一条双字高亮光带从左到右循环扫过，扫过即恢复，永不停歇
   每次切回首页都会从第一个字重新扫过（window.fxGreetReplay）
   文字内容与字样一个不变；原 hover 乱码解算已对该元素停用
   ============================================================ */
(function () {
  var greet = document.getElementById('greeting');
  if (!greet) return;

  var timers = [];
  var suspended = false;
  var spans = null;
  var sweepIndex = 0;
  var STEP = 110;

  function clearFx() {
    timers.forEach(clearTimeout);
    timers = [];
    if (spans) {
      for (var i = 0; i < spans.length; i++) spans[i].className = 'fx-gc fx-lit';
    }
  }

  function sweepStep() {
    var n = spans.length;
    if (!n) return;
    for (var k = 0; k < n; k++) {
      spans[k].classList.remove('fx-sweep');
      spans[k].classList.remove('fx-sweep-prev');
    }
    spans[sweepIndex].classList.add('fx-sweep');
    if (sweepIndex > 0) spans[sweepIndex - 1].classList.add('fx-sweep-prev');
    sweepIndex = (sweepIndex + 1) % n;
    timers.push(setTimeout(sweepStep, STEP));
  }

  function beginSweep() {
    clearFx();
    sweepIndex = 0;
    sweepStep();
  }

  function initGreet() {
    clearFx();
    var chars = Array.from(greet.textContent);
    if (!chars.length) return;
    greet.textContent = '';
    spans = chars.map(function (ch) {
      var s = document.createElement('span');
      s.className = 'fx-gc fx-lit';
      s.textContent = ch;
      greet.appendChild(s);
      return s;
    });
    beginSweep();
  }

  function initGreetSafe() {
    suspended = true;
    initGreet();
    requestAnimationFrame(function () { suspended = false; });
  }

  /* 文本更新（时段问候/回首页）时：重建并立即开始扫光 */
  var obs = new MutationObserver(function () {
    if (suspended) return;
    initGreetSafe();
  });
  obs.observe(greet, { childList: true, subtree: true });

  /* 每次切到首页：从第一个字重新扫过（文本不变时不重建） */
  window.fxGreetReplay = function () {
    if (!greet || suspended) return;
    if (spans && spans.length) beginSweep();
    else initGreetSafe();
  };

  initGreetSafe();
})();

/* ============================================================
   交互增强层 · 第六批：高光扫过 + 吉祥物互动 + 卡片点击涟漪
   纯叠加效果：不改任何元素/文字/字体/边框，不减弱旧效果
   ============================================================ */
(function () {
  if (!window.matchMedia('(any-hover: hover)').matches) return;
  var body = document.body;

  /* ① 注入整卡高光层（一次 hover 掠扫一次），并按卡片边框色逐卡取色 */
  function fxTintShine() {
    var dark = body.classList.contains('dark-mode');
    var green = body.classList.contains('mode-green');
    [].slice.call(document.querySelectorAll('.card')).forEach(function (c) {
      var sh = c.querySelector('.fx-shine');
      if (!sh) return;
      if (dark) {
        sh.style.setProperty('--fx-shine-c', 'rgba(6,10,16,0.32)');
        return;
      }
      /* 绿色模式：全部卡片悬停高光统一白色 */
      if (green) {
        sh.style.setProperty('--fx-shine-c', 'rgba(250,252,255,0.38)');
        return;
      }
      /* 正常模式·首页本月概览：白色扫光（与文本框白核一致），避免浅绿边框的绿光 */
      if (c.closest('#home') && c.classList.contains('mini-calendar-card')) {
        sh.style.setProperty('--fx-shine-c', 'rgba(250,252,255,0.38)');
        return;
      }
      var m = getComputedStyle(c).borderTopColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) sh.style.setProperty('--fx-shine-c', 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',0.15)');
      else sh.style.setProperty('--fx-shine-c', green ? 'rgba(245,158,11,0.15)' : 'rgba(52,178,102,0.15)');
    });
  }
  [].slice.call(document.querySelectorAll('.card')).forEach(function (c) {
    var s = document.createElement('span');
    s.className = 'fx-shine';
    s.setAttribute('aria-hidden', 'true');
    c.appendChild(s);
  });
  fxTintShine();
  var shineTimer = null;
  new MutationObserver(function () {
    fxTintShine();                 /* 立即取色 */
    clearTimeout(shineTimer);
    shineTimer = setTimeout(fxTintShine, 450); /* 边框过渡结束后再取一次，避免取到过渡中间色 */
  }).observe(body, { attributes: true, attributeFilter: ['class'] });

  /* ② 吉祥物悬停：弹跳 + 冒出爱心泡泡 */
  var MASCOT_SEL = '#dailyMascot, #reviewMascot, #mascotFeedback, .mascot-review-inner';
  document.addEventListener('pointerover', function (e) {
    var m = e.target && e.target.closest ? e.target.closest(MASCOT_SEL) : null;
    if (!m || m._fxPopT) return;
    m._fxPopT = true;
    m.classList.add('fx-mascot-bounce');
    var r = m.getBoundingClientRect();
    var chars = ['♥', '✦', '✿'];
    for (var i = 0; i < 3; i++) {
      var b = document.createElement('span');
      b.className = 'mx-pop';
      b.textContent = chars[i];
      b.style.left = (r.left + r.width * (0.22 + i * 0.28)).toFixed(1) + 'px';
      b.style.top = (r.top + 2) + 'px';
      b.style.fontSize = (11 + i * 2.5) + 'px';
      b.style.animationDelay = (i * 0.14) + 's';
      body.appendChild(b);
      (function (el) {
        el.addEventListener('animationend', function () { el.remove(); });
      })(b);
    }
    setTimeout(function () {
      m.classList.remove('fx-mascot-bounce');
      m._fxPopT = false;
    }, 950);
  }, true);

  /* ③ 卡片点击涟漪（雨滴落水：双圈波纹，跳过输入区/按钮等已有反馈的区域） */
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest) return;
    if (e.target.closest('input, textarea, select, .btn, .action-btn, .icon-btn, .seg-btn')) return;
    var card = e.target.closest('.card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    for (var k = 0; k < 2; k++) {
      var s = document.createElement('span');
      s.className = 'fx-card-ripple';
      var sz = 100 + k * 14;
      s.style.width = s.style.height = sz + 'px';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      s.style.animationDelay = (k * 0.22) + 's';
      s.style.opacity = k === 0 ? 0.42 : 0.3;
      card.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
    }
  }, true);
})();
