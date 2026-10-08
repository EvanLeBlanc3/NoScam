/* NoScam — app logic */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const view = $('#view');
  const LS = 'noscam.v1';

  /* ---------------- state ---------------- */
  const defaults = { sound: true, calm: false, size: 'md', trustName: '', trustPhone: '', history: [] };
  let S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS) || '{}'));
  const save = () => localStorage.setItem(LS, JSON.stringify(S));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- sound (Web Audio, synthesized — works offline) ---------------- */
  const Snd = {
    ctx: null,
    unlock() {
      if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone(f, d = .08, type = 'sine', vol = .05, delay = 0, to = null) {
      if (!S.sound || !this.ctx) return;
      const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .02);
    },
    tap() { this.tone(880, .045, 'sine', .03); },
    select() { this.tone(523, .08, 'sine', .045); this.tone(784, .12, 'sine', .04, .07); },
    yes() { this.tone(620, .09, 'triangle', .05); },
    no() { this.tone(440, .09, 'triangle', .05); },
    unsure() { this.tone(520, .07, 'sine', .035); this.tone(520, .07, 'sine', .03, .09); },
    back() { this.tone(600, .08, 'sine', .035, 0, 380); },
    scan() { for (let i = 0; i < 6; i++) this.tone(300 + i * 90, .09, 'sine', .022, i * .3); },
    scam() { this.tone(330, .28, 'sawtooth', .035, 0, 200); this.tone(260, .4, 'sawtooth', .035, .3, 150); },
    sus() { this.tone(523, .16, 'triangle', .05); this.tone(466, .26, 'triangle', .05, .18); },
    ok() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .22, 'sine', .045, i * .09)); },
    toggle(on) { this.tone(on ? 700 : 400, .07, 'sine', .04); }
  };
  ['touchstart', 'pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => Snd.unlock(), { passive: true }));
  const buzz = n => { try { navigator.vibrate && navigator.vibrate(n); } catch (e) { } };

  /* ---------------- effects ---------------- */
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('.sc,.btn,.ab,.sos');
    if (!el || S.calm) return;
    const r = el.getBoundingClientRect(), sz = Math.max(r.width, r.height), sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
    el.appendChild(sp); setTimeout(() => sp.remove(), 650);
  });
  function particles() {
    const p = $('#particles'); p.innerHTML = '';
    const glyphs = ['✦', '·', '✧', '•'];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 12 + Math.random() * 14 + 's';
      s.style.animationDelay = -Math.random() * 20 + 's';
      s.style.color = Math.random() > .5 ? '#5eead4' : '#a5b4fc';
      p.appendChild(s);
    }
  }
  function flash(cls) {
    if (S.calm) return;
    const f = $('#flash'); f.className = ''; void f.offsetWidth; f.className = cls;
  }
  function confetti(chars) {
    if (S.calm) return;
    for (let i = 0; i < 22; i++) {
      const c = document.createElement('div');
      c.className = 'conf'; c.textContent = chars[i % chars.length];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDelay = Math.random() * .6 + 's';
      c.style.animationDuration = 1.4 + Math.random() * 1.2 + 's';
      document.body.appendChild(c); setTimeout(() => c.remove(), 3200);
    }
  }
  function mood(m) { document.body.classList.remove('mood-scam', 'mood-sus', 'mood-ok'); if (m) document.body.classList.add('mood-' + m); }
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

  function applySettings() {
    document.body.classList.toggle('calm', !!S.calm);
    document.body.classList.remove('lg', 'xl');
    if (S.size !== 'md') document.body.classList.add(S.size);
    $('#soundBtn').textContent = S.sound ? '🔊' : '🔇';
  }

  /* ---------------- navigation ---------------- */
  let stack = [];      // [{fn, args}]
  let currentTab = 'home';
  function go(fn, args = [], { push = true, dir = 'fwd' } = {}) {
    if (push) stack.push({ fn, args });
    const old = view.firstElementChild;
    const draw = () => {
      view.innerHTML = '';
      const page = document.createElement('div');
      page.className = 'page' + (dir === 'back' ? ' back' : '');
      view.appendChild(page);
      fn(page, ...args);
      view.scrollTop = 0;
      $('#backBtn').classList.toggle('hidden', stack.length <= 1);
    };
    if (old && !S.calm) { old.classList.add('out'); setTimeout(draw, 180); } else draw();
  }
  function back() {
    if (stack.length <= 1) return;
    Snd.back(); stack.pop();
    const prev = stack[stack.length - 1];
    if (prev.fn !== resultView) mood(null);
    go(prev.fn, prev.args, { push: false, dir: 'back' });
  }
  $('#backBtn').onclick = back;
  $('#brandHome').onclick = () => switchTab('home');
  $('#soundBtn').onclick = () => { S.sound = !S.sound; save(); applySettings(); Snd.toggle(S.sound); toast(S.sound ? 'Sound on' : 'Sound off'); };
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
  function switchTab(t, args = []) {
    Snd.tap(); buzz(8); mood(null);
    currentTab = t;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    stack = [];
    const map = { home: homeView, library: libraryView, help: helpView, me: meView };
    go(map[t], args);
  }

  /* ---------------- HOME ---------------- */
  function homeView(p) {
    const hr = new Date().getHours();
    const hi = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    p.innerHTML = `
      <div class="hero">
        <div class="mut small">${hi} 👋</div>
        <h1>Is this a scam?</h1>
        <p>Pick what's happening. I'll ask a few quick yes-or-no questions and tell you what I think.</p>
        <div class="rule"><span style="font-size:1.4em">☎️</span><span><b>Golden rule:</b> hang up and call back using a number <u>you</u> look up yourself. Real people won't mind.</span></div>
      </div>
      <button class="sos" id="sos"><span class="e">🆘</span><div><b>Already paid or shared info?</b><span>Get step-by-step help right now →</span></div></button>
      <div class="search"><span>🔎</span><input id="q" placeholder="Search: gift card, toll, grandson…" autocomplete="off"></div>
      <div class="list" id="scList"></div>
      <h2>The 4 signs of a scam</h2>
      <div class="rules">${UNIVERSAL_RULES.map((r, i) => `<div class="rcard" style="animation-delay:${i * 60}ms"><div class="i">${r.i}</div><b>${esc(r.t)}</b><span class="mut">${esc(r.d)}</span></div>`).join('')}</div>
      <p class="disclaimer">Signs based on guidance from the FTC, CFPB, FCC &amp; FBI.</p>`;
    const list = $('#scList', p);
    const draw = (q = '') => {
      const ql = q.trim().toLowerCase();
      const items = SCENARIOS.filter(s => !ql || (s.title + ' ' + s.sub + ' ' + s.cat + ' ' + s.lib.join(' ') + ' ' + s.q.map(x => x.t).join(' ')).toLowerCase().includes(ql));
      list.innerHTML = items.length ? items.map((s, i) => `
        <button class="sc" data-id="${s.id}" style="--c:${s.color};animation-delay:${Math.min(i, 12) * 35}ms">
          <span class="ic">${s.icon}</span><span class="tx"><b>${esc(s.title)}</b><span>${esc(s.sub)}</span></span><span class="chev">›</span>
        </button>`).join('') : `<div class="box mut">No match. Try "Something else feels off" — clear the search to see it.</div>`;
      list.querySelectorAll('.sc').forEach(b => b.onclick = () => { Snd.select(); buzz(10); go(quizView, [b.dataset.id, []]); });
    };
    draw();
    $('#q', p).oninput = e => draw(e.target.value);
    $('#sos', p).onclick = () => switchTab('help');
  }

  /* ---------------- QUIZ ---------------- */
  function quizView(p, id, answers) {
    const s = SCENARIOS.find(x => x.id === id);
    const ans = answers.slice(0, s.q.length);
    if (ans.length >= s.q.length) ans.length = s.q.length - 1;  // coming back from the result
    let i = ans.length;
    p.innerHTML = `
      <div class="qhead" style="--c:${s.color}"><span class="ic">${s.icon}</span><b>${esc(s.title)}</b></div>
      <div class="prog"><i style="width:0"></i></div>
      <div class="qcount"></div>
      <div id="qwrap"></div>
      <button class="btn" id="prevQ" style="margin-top:14px;width:100%">‹ Previous question</button>`;
    const bar = $('.prog i', p), cnt = $('.qcount', p), wrap = $('#qwrap', p), prevB = $('#prevQ', p);
    const show = () => {
      const q = s.q[i];
      bar.style.width = (i / s.q.length * 100) + '%';
      cnt.textContent = `Question ${i + 1} of ${s.q.length}`;
      prevB.style.visibility = i ? 'visible' : 'hidden';
      wrap.innerHTML = `
        <div class="qcard">
          <div class="qt">${esc(q.t)}</div>
          <button class="whybtn">💡 Why am I asking?</button>
          <div class="why">${esc(q.why || '')}</div>
          <div class="ans">
            <button class="ab yes" data-a="y">Yes</button>
            <button class="ab no" data-a="n">No</button>
            <button class="ab unsure" data-a="u">🤷 Not sure</button>
          </div>
        </div>`;
      $('.whybtn', wrap).onclick = () => { Snd.tap(); $('.why', wrap).classList.toggle('on'); };
      wrap.querySelectorAll('.ab').forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        b.classList.add('picked'); buzz(12);
        ({ y: () => Snd.yes(), n: () => Snd.no(), u: () => Snd.unsure() })[a]();
        ans[i] = a;
        stack[stack.length - 1].args = [id, ans.slice(0, i + 1)];
        const card = $('.qcard', wrap);
        const next = () => {
          i++;
          if (i >= s.q.length) { bar.style.width = '100%'; go(scanView, [id, ans.slice()]); }
          else show();
        };
        if (S.calm) next(); else { card.classList.add('leave'); setTimeout(next, 260); }
      });
    };
    prevB.onclick = () => { if (i > 0) { Snd.back(); i--; ans.length = i; stack[stack.length - 1].args = [id, ans.slice()]; show(); } };
    show();
  }

  /* ---------------- SCANNING ---------------- */
  function scanView(p, id, ans) {
    // don't keep the scanning screen in the back-stack
    stack.pop();
    const msgs = ['Checking for pressure tactics…', 'Comparing against 50 known scams…', 'Sniffing for gift cards… 🐽', 'Consulting the grandma network…', 'Calculating risk…'];
    p.innerHTML = `<div class="scan"><div class="radar"><div class="sh">🛡️</div></div><p id="smsg">${msgs[0]}</p></div>`;
    Snd.scan();
    let k = 0;
    const t = setInterval(() => { k++; const m = $('#smsg', p); if (m && msgs[k]) m.textContent = msgs[k]; }, 430);
    setTimeout(() => { clearInterval(t); go(resultView, [id, ans, true]); }, S.calm ? 600 : 2200);
  }

  /* ---------------- SCORING ---------------- */
  function score(s, ans) {
    let max = 0, sc = 0, good = 0, crit = false;
    const flags = [], goods = [], unsure = [];
    s.q.forEach((q, i) => {
      const a = ans[i];
      if (q.w > 0) {
        max += q.w;
        if (a === 'y') { sc += q.w; flags.push({ f: q.f, crit: !!q.crit }); if (q.crit) crit = true; }
        else if (a === 'u') { sc += q.w * .4; unsure.push(q.f); }
      } else if (a === 'y') { sc += q.w; good += q.w; goods.push(q.g); }
    });
    let pct = Math.max(0, Math.min(1, sc / max));
    let level;
    if (crit) { level = good <= -5 ? 'sus' : 'scam'; pct = Math.max(pct, level === 'scam' ? .9 : .55); }
    else level = pct >= .5 ? 'scam' : pct >= .2 ? 'sus' : 'ok';
    flags.sort((a, b) => b.crit - a.crit);
    return { pct: Math.round(pct * 100), level, flags, goods, unsure, crit };
  }

  /* ---------------- RESULT ---------------- */
  const V = {
    scam: { t: 'This looks like a SCAM', c: '#ff4d6d', e: '🚨', sub: 'Big red flags showed up. Scammers are counting on you to act before you think — so let\'s not give them that.', act: '🛑 Stop. Hang up or stop replying.<br>Do NOT send money, codes, or personal info.' },
    sus: { t: 'Suspicious — verify first', c: '#fbbf24', e: '⚠️', sub: 'Some warning signs here. It might be real, but don\'t do anything until you\'ve checked it out yourself.', act: '⏸️ Pause. Verify using contact info <u>you</u> look up — not anything they gave you.' },
    ok: { t: 'Probably legit', c: '#34d399', e: '✅', sub: 'No major red flags based on your answers. Still trust your gut — if anything changes, run the check again.', act: '👍 Looks okay. Still: never share codes, and never pay with gift cards or crypto.' }
  };
  function resultView(p, id, ans, fresh) {
    const s = SCENARIOS.find(x => x.id === id);
    const r = score(s, ans);
    const v = V[r.level];
    if (fresh) {
      S.history.unshift({ d: Date.now(), id, ans, level: r.level, pct: r.pct });
      S.history = S.history.slice(0, 60); save();
      stack[stack.length - 1].args = [id, ans, false];
    }
    mood(r.level);
    const R = 92, C = Math.PI * R;
    const libItems = s.lib.map(l => LIBRARY.find(x => x.id === l)).filter(Boolean);
    p.innerHTML = `
      <div class="verdict">
        <div class="gauge">
          <svg viewBox="0 0 230 130">
            <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#34d399"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#ff4d6d"/></linearGradient></defs>
            <path d="M23 118 A92 92 0 0 1 207 118" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="18" stroke-linecap="round"/>
            <path id="arc" d="M23 118 A92 92 0 0 1 207 118" fill="none" stroke="url(#gg)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)"/>
          </svg>
          <div class="pct" style="color:${v.c}"><span id="pctN">0</span>%</div>
        </div>
        <div class="small mut">scam risk</div>
        <div class="vtitle ${r.level}">${v.e} ${v.t}</div>
        <p class="vsub">${v.sub}</p>
      </div>
      <div class="bigaction ${r.level}">${v.act}</div>
      ${r.flags.length ? `<div class="box"><h3>🚩 Red flags I spotted</h3>${r.flags.map(f => `<div class="flag"><span class="d r">!</span><span>${esc(f.f)}${f.crit ? ' <b style="color:var(--scam)">— major</b>' : ''}</span></div>`).join('')}</div>` : ''}
      ${r.unsure.length ? `<div class="box"><h3>🔍 Worth double-checking</h3>${r.unsure.map(f => `<div class="flag"><span class="d y">?</span><span>${esc(f)}</span></div>`).join('')}</div>` : ''}
      ${r.goods.length ? `<div class="box"><h3>💚 Good signs</h3>${r.goods.map(g => `<div class="flag"><span class="d g">✓</span><span>${esc(g)}</span></div>`).join('')}</div>` : ''}
      <div class="box"><h3>🧭 What to do now</h3>${s.steps.map((t, i) => `<div class="flag"><span class="d n">${i + 1}</span><span>${esc(t)}</span></div>`).join('')}</div>
      <div class="btnrow">
        ${S.trustPhone ? `<a class="btn pri full" href="tel:${esc(S.trustPhone.replace(/[^\d+]/g, ''))}">📞 Call ${esc(S.trustName || 'my trusted person')} before acting</a>` : `<button class="btn full" id="setTrust">👥 Add a trusted person to call</button>`}
        <button class="btn" id="shareR">📤 Share result</button>
        <button class="btn" id="againR">🔁 Check another</button>
        ${r.level !== 'ok' ? `<button class="btn full" id="paidR" style="border-color:rgba(255,77,109,.5)">🆘 I already paid or shared info</button>` : ''}
      </div>
      ${libItems.length ? `<div class="box"><h3>📚 Related scams</h3><div class="chips">${libItems.map(l => `<button class="chip" data-l="${l.id}">${esc(l.n)}</button>`).join('')}</div></div>` : ''}
      ${r.level !== 'ok' ? `<div class="box"><h3>📣 Report it</h3>${REPORT_LINKS.map(l => `<div class="flag"><span class="d n">→</span><span><a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)}</a><br><span class="mut small">${esc(l.d)}</span></span></div>`).join('')}</div>` : ''}
      <p class="disclaimer">NoScam gives guidance, not a guarantee. When in doubt, don't pay, and verify through official contact info. In danger? Call 911.</p>`;

    // animate gauge + counter
    requestAnimationFrame(() => setTimeout(() => {
      const arc = $('#arc', p); if (arc) arc.style.strokeDashoffset = C * (1 - r.pct / 100);
      const n = $('#pctN', p); const t0 = performance.now();
      const tick = now => { const k = Math.min(1, (now - t0) / 1200); if (n) n.textContent = Math.round(r.pct * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, 120));
    if (fresh) setTimeout(() => {
      if (r.level === 'scam') { Snd.scam(); flash('red'); buzz([60, 40, 60]); }
      else if (r.level === 'sus') { Snd.sus(); buzz(40); }
      else { Snd.ok(); flash('green'); confetti(['🛡️', '✨', '💚', '✅']); }
    }, 700);

    const st = $('#setTrust', p); if (st) st.onclick = () => switchTab('me');
    $('#againR', p).onclick = () => switchTab('home');
    const pr = $('#paidR', p); if (pr) pr.onclick = () => switchTab('help');
    p.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { Snd.select(); go(libraryView, ['All', '', b.dataset.l]); });
    $('#shareR', p).onclick = async () => {
      Snd.tap();
      const txt = `NoScam check: ${s.title}\nResult: ${v.t} (${r.pct}% scam risk)` +
        (r.flags.length ? `\nRed flags: ${r.flags.map(f => f.f).join('; ')}` : '') +
        `\nNext steps: ${s.steps.join(' ')}`;
      try {
        if (navigator.share) await navigator.share({ title: 'NoScam result', text: txt });
        else { await navigator.clipboard.writeText(txt); toast('Copied to clipboard'); }
      } catch (e) { }
    };
  }

  /* ---------------- LIBRARY ---------------- */
  function libraryView(p, cat = 'All', query = '', openId = null) {
    const cats = ['All', ...new Set(LIBRARY.map(l => l.c))];
    p.innerHTML = `
      <h1>Top ${LIBRARY.length} Scams</h1>
      <p class="mut small" style="margin-top:0">The scams hitting Americans most — and how to spot them. Tap one to learn more.</p>
      <div class="search"><span>🔎</span><input id="lq" placeholder="Search scams…" value="${esc(query)}" autocomplete="off"></div>
      <div class="hscroll">${cats.map(c => `<button class="chip ${c === cat ? 'on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div id="libList"></div>
      <p class="disclaimer">Compiled from FTC, FBI IC3, CFPB, FCC and Fraud.org guidance.</p>`;
    const listEl = $('#libList', p);
    let curCat = cat, curQ = query;
    const draw = () => {
      const ql = curQ.trim().toLowerCase();
      const items = LIBRARY.map((l, i) => ({ ...l, num: i + 1 })).filter(l =>
        (curCat === 'All' || l.c === curCat) && (!ql || (l.n + ' ' + l.how + ' ' + l.s.join(' ') + ' ' + l.a.join(' ')).toLowerCase().includes(ql)));
      listEl.innerHTML = items.map((l, i) => `
        <div class="lib" data-id="${l.id}" style="animation-delay:${Math.min(i, 10) * 30}ms">
          <button><span class="num">${l.num}</span><span class="nm"><span>${esc(l.c)}</span><b>${esc(l.n)}</b></span><span class="chev">›</span></button>
          <div class="body"><div class="inner">
            <div>${esc(l.how)}</div>
            <h4 class="r">🚩 Red flags</h4><ul>${l.s.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            <h4 class="g">🛡️ How to stay safe</h4><ul>${l.a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          </div></div>
        </div>`).join('') || `<div class="box mut">No scams match that search.</div>`;
      listEl.querySelectorAll('.lib > button').forEach(b => b.onclick = () => toggleAcc(b.parentElement));
    };
    draw();
    $('#lq', p).oninput = e => { curQ = e.target.value; draw(); };
    p.querySelectorAll('.hscroll .chip').forEach(c => c.onclick = () => {
      Snd.tap(); curCat = c.dataset.c;
      p.querySelectorAll('.hscroll .chip').forEach(x => x.classList.toggle('on', x === c)); draw();
    });
    if (openId) setTimeout(() => {
      const el = listEl.querySelector(`[data-id="${openId}"]`);
      if (el) { toggleAcc(el, true); el.scrollIntoView({ behavior: S.calm ? 'auto' : 'smooth', block: 'center' }); }
    }, 350);
  }
  function toggleAcc(el, quiet) {
    if (!quiet) Snd.tap();
    const body = el.querySelector('.body');
    const open = el.classList.toggle('open');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
  }

  /* ---------------- HELP (already scammed) ---------------- */
  function helpView(p) {
    p.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,rgba(255,77,109,.35),rgba(99,102,241,.25))">
        <h1>Take a breath. 🫶</h1>
        <p>It happens to smart, careful people every day — the FBI says scammers are <i>that</i> good. Acting quickly can help you get money back. Pick what happened:</p>
      </div>
      <div id="recList"></div>
      <h2>Report it</h2>
      <div class="box" style="margin-top:0">${REPORT_LINKS.map(l => `<div class="flag"><span class="d n">→</span><span><a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)}</a><br><span class="mut small">${esc(l.d)}</span></span></div>`).join('')}</div>
      <div class="box"><h3>🗂️ Keep a record</h3>
        <div class="flag"><span class="d n">1</span><span>Screenshot texts, emails, and call logs.</span></div>
        <div class="flag"><span class="d n">2</span><span>Save receipts, card numbers, and transaction IDs.</span></div>
        <div class="flag"><span class="d n">3</span><span>Write down names, numbers, and what they said while it's fresh.</span></div>
        <div class="flag"><span class="d n">4</span><span>Watch out for "recovery" offers afterward — those are usually a second scam.</span></div>
      </div>
      <p class="disclaimer">If you feel unsafe or someone is at your door, call 911.</p>`;
    $('#recList', p).innerHTML = RECOVERY.map((r, i) => `
      <div class="lib" style="animation-delay:${i * 35}ms">
        <button><span class="num" style="background:rgba(255,77,109,.22);font-size:1.2em">${r.icon}</span><span class="nm"><b>${esc(r.t)}</b></span><span class="chev">›</span></button>
        <div class="body"><div class="inner">${r.steps.map((s, k) => `<div class="flag"><span class="d r">${k + 1}</span><span>${esc(s)}</span></div>`).join('')}</div></div>
      </div>`).join('');
    p.querySelectorAll('#recList .lib > button').forEach(b => b.onclick = () => toggleAcc(b.parentElement));
  }

  /* ---------------- ME / settings ---------------- */
  function meView(p) {
    const dot = { scam: 'var(--scam)', sus: 'var(--sus)', ok: 'var(--ok)' };
    const lab = { scam: 'Scam', sus: 'Suspicious', ok: 'Probably legit' };
    p.innerHTML = `
      <h1>Me</h1>
      <div class="box"><h3>👥 My trusted person</h3>
        <p class="mut small" style="margin:0">Scammers want you isolated. I'll put a one-tap "call before you act" button on every result.</p>
        <input class="field" id="tn" placeholder="Name (e.g., Sarah)" value="${esc(S.trustName)}">
        <input class="field" id="tp" placeholder="Phone number" inputmode="tel" value="${esc(S.trustPhone)}">
      </div>
      <div class="box"><h3>🎛️ Settings</h3>
        <div class="row"><span>Sound effects</span><button class="sw ${S.sound ? 'on' : ''}" id="swS" aria-label="Sound"></button></div>
        <div class="row"><span>Calm mode<br><span class="mut small">Fewer animations &amp; effects</span></span><button class="sw ${S.calm ? 'on' : ''}" id="swC" aria-label="Calm mode"></button></div>
        <div class="row"><span>Text size</span><div class="seg" id="seg">
          <button data-s="md" class="${S.size === 'md' ? 'on' : ''}">A</button>
          <button data-s="lg" class="${S.size === 'lg' ? 'on' : ''}" style="font-size:1.1em">A</button>
          <button data-s="xl" class="${S.size === 'xl' ? 'on' : ''}" style="font-size:1.25em">A</button></div></div>
      </div>
      <div class="box"><h3>🔐 Family safe word</h3>
        <p class="small" style="margin:0;line-height:1.45">Agree on a secret word with family — say it in person, not by text. If a "relative" calls in a panic and can't say it, hang up. The FCC recommends this to beat AI voice cloning. (I don't store it — it's safest in your head.)</p>
      </div>
      <div class="box"><h3>🕘 My checks <span class="mut small">(${S.history.length})</span></h3>
        <div id="hist">${S.history.length ? S.history.map((h, i) => {
          const sc = SCENARIOS.find(x => x.id === h.id); if (!sc) return '';
          return `<button class="hist" data-i="${i}" style="width:100%;text-align:left"><span class="dot" style="background:${dot[h.level]}"></span><span style="flex:1"><b>${esc(sc.title)}</b><br><span class="mut small">${lab[h.level]} · ${h.pct}% · ${new Date(h.d).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></span><span class="mut">›</span></button>`;
        }).join('') : '<p class="mut small" style="margin:0">No checks yet. Stay skeptical out there. 🕵️</p>'}</div>
      </div>
      <div class="box"><h3>💾 Backup</h3>
        <p class="mut small" style="margin:0 0 4px">Save your settings and history to a file, so clearing Safari data won't wipe them.</p>
        <div class="btnrow" style="margin-top:8px">
          <button class="btn" id="exp">⬇️ Export</button>
          <button class="btn" id="imp">⬆️ Import</button>
          <button class="btn full" id="clr" style="color:#ffb3c0">🗑️ Clear history</button>
        </div>
        <input type="file" id="impF" accept="application/json,.json" hidden>
      </div>
      <div class="box"><h3>ℹ️ About NoScam</h3>
        <p class="small mut" style="margin:0;line-height:1.45">Works offline. Questions and red flags are based on public guidance from the FTC, CFPB, FCC, FBI IC3 (2025 report) and Fraud.org's Top Scams of 2025. NoScam is guidance, not legal or financial advice.</p>
      </div>`;
    const saveTrust = () => { S.trustName = $('#tn', p).value.trim(); S.trustPhone = $('#tp', p).value.trim(); save(); };
    $('#tn', p).onchange = saveTrust; $('#tp', p).onchange = () => { saveTrust(); toast('Trusted person saved'); };
    $('#swS', p).onclick = e => { S.sound = !S.sound; save(); applySettings(); e.currentTarget.classList.toggle('on', S.sound); Snd.toggle(S.sound); };
    $('#swC', p).onclick = e => { S.calm = !S.calm; save(); applySettings(); e.currentTarget.classList.toggle('on', S.calm); Snd.toggle(S.calm); };
    p.querySelectorAll('#seg button').forEach(b => b.onclick = () => { S.size = b.dataset.s; save(); applySettings(); Snd.tap(); p.querySelectorAll('#seg button').forEach(x => x.classList.toggle('on', x === b)); });
    p.querySelectorAll('.hist').forEach(b => b.onclick = () => { const h = S.history[+b.dataset.i]; Snd.select(); go(resultView, [h.id, h.ans, false]); });
    $('#exp', p).onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `noscam-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000); toast('Backup saved');
    };
    $('#imp', p).onclick = () => $('#impF', p).click();
    $('#impF', p).onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const d = JSON.parse(rd.result); S = Object.assign({}, defaults, d); save(); applySettings(); toast('Backup restored'); switchTab('me'); } catch (err) { toast('That file didn\'t work'); } };
      rd.readAsText(f);
    };
    $('#clr', p).onclick = () => { if (confirm('Clear all saved checks?')) { S.history = []; save(); toast('History cleared'); switchTab('me'); } };
  }

  /* ---------------- boot ---------------- */
  applySettings(); particles();
  try { screen.orientation && screen.orientation.lock && screen.orientation.lock('portrait').catch(() => { }); } catch (e) { }
  go(homeView);
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
})();
