/* ============================================================
   Chapter 3 · Multiplication & Division
   Tiny quiz engine shared by every exercise in this chapter.

   Each exercise supplies only its data:

     Quiz.mount({
       tag, title, hint, home,
       questions: [ { stem, build(host) }, ... ]
     });

   Inside build() use the field helpers — Quiz.blank() and
   Quiz.choice() — and the engine takes care of checking,
   marking, navigation, scoring and the result screen.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- tiny DOM helper ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- VOICE + SOUND (matches chapter-1 / chapter-2) ---------- */
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;

  function ensureAudio(){
    if(!audioCtx) audioCtx = new AudioCtx();
  }

  function speak(text){
    ensureAudio();
    var synth = window.speechSynthesis;
    if(!synth) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1.1;
    synth.speak(u);
  }

  function playTone(freq, dur, type){
    ensureAudio();
    type = type || 'sine';
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  }

  function soundCorrect(){
    playTone(523, 0.12);
    setTimeout(function(){ playTone(659, 0.12); }, 100);
    setTimeout(function(){ playTone(784, 0.2); }, 200);
    speak('Correct!');
  }

  function soundWrong(){
    playTone(330, 0.25, 'square');
    setTimeout(function(){ playTone(262, 0.35, 'square'); }, 200);
    speak('Try again!');
  }

  function soundCongrats(){
    playTone(523, 0.12);
    setTimeout(function(){ playTone(659, 0.12); }, 120);
    setTimeout(function(){ playTone(784, 0.12); }, 240);
    setTimeout(function(){ playTone(1047, 0.35); }, 360);
    speak('Congratulations!');
  }

  /* ---------- answer normalisation ----------
     "1,020" · " 1020 " · "Commutative" all compare cleanly. */
  function norm(v) {
    return String(v == null ? '' : v)
      .replace(/[,\s]/g, '')
      .toLowerCase();
  }

  /* ---------- field: a typed blank ---------- */
  function blank(answer, opts) {
    opts = opts || {};
    var input = el('input', 'blank');
    var text = String(answer);

    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = opts.placeholder || '?';
    input.setAttribute('aria-label', opts.label || 'answer');
    input.style.width = (opts.width || Math.max(text.length + 1, 3)) + 'ch';
    if (!opts.text) input.inputMode = 'numeric';

    input._f = {
      el: input,
      filled: function () { return input.value.trim() !== ''; },
      correct: function () { return norm(input.value) === norm(answer); },
      mark: function (state) {
        input.classList.remove('good', 'bad');
        if (state) input.classList.add(state);
      },
      lock: function () { input.readOnly = true; },
      reveal: function () { input.value = text; },
      value: function () { return input.value; },
      setValue: function (v) { input.value = v; },
      focus: function () { input.focus(); input.select(); }
    };

    input.addEventListener('input', function () {
      if (!opts.text) input.value = input.value.replace(/[^0-9]/g, '');
      input.style.width = Math.max(input.value.length + 1, opts.width || 3) + 'ch';
      input._f.mark('');
      Quiz._clearMsg();
    });

    return input;
  }

  /* ---------- field: a pill picker ---------- */
  function choice(options, answer, opts) {
    opts = opts || {};
    var wrap = el('div', 'choices');
    var chosen = null;
    var buttons = [];

    options.forEach(function (label) {
      var b = el('button', 'pick', label);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (b.disabled) return;
        chosen = label;
        buttons.forEach(function (x) { x.classList.remove('on', 'good', 'bad'); });
        b.classList.add('on');
        Quiz._clearMsg();
      });
      buttons.push(b);
      wrap.appendChild(b);
    });

    function highlight(state) {
      buttons.forEach(function (b) {
        b.classList.remove('good', 'bad');
        if (b.textContent === chosen && state) {
          b.classList.remove('on');
          b.classList.add(state);
        }
      });
    }

    wrap._f = {
      el: wrap,
      filled: function () { return chosen !== null; },
      correct: function () { return norm(chosen) === norm(answer); },
      mark: highlight,
      lock: function () { buttons.forEach(function (b) { b.disabled = true; }); },
      reveal: function () {
        chosen = answer;
        buttons.forEach(function (b) {
          b.classList.remove('on', 'bad');
          if (norm(b.textContent) === norm(answer)) b.classList.add('good');
        });
      },
      value: function () { return chosen; },
      setValue: function (v) {
        if (v == null) return;
        chosen = v;
        buttons.forEach(function (b) { b.classList.toggle('on', b.textContent === v); });
      },
      focus: function () { buttons[0].focus(); }
    };

    if (opts.label) {
      var box = el('div');
      box.style.textAlign = 'center';
      box.appendChild(el('div', 'pick-label', opts.label));
      box.style.display = 'grid';
      box.style.gap = '10px';
      box.appendChild(wrap);
      box._f = wrap._f;
      return box;
    }
    return wrap;
  }

  /* ---------- a maths sentence: sentence(['796', '×', blank(208), '=', ...]) ---------- */
  function sentence(parts) {
    /* a long sentence wraps to several lines, so it gets a smaller scale */
    var row = el('div', parts.length > 8 ? 'sentence long' : 'sentence');
    parts.forEach(function (p) {
      if (typeof p === 'string') {
        var cls = /^[×÷+\-=]$/.test(p) ? 'op' : (/^[()]$/.test(p) ? 'paren' : '');
        row.appendChild(el('span', cls, p));
      } else {
        row.appendChild(p);
      }
    });
    return row;
  }

  /* ---------- a captioned control (large 3D answer card) ---------- */
  function labelled(caption, node) {
    var w = el('div', 'ans-card');
    var isQ = caption.toLowerCase().indexOf('quotient') !== -1;
    var isR = caption.toLowerCase().indexOf('remainder') !== -1;
    if (isQ) w.className += ' quotient-card';
    if (isR) w.className += ' remainder-card';
    var icon = isQ ? '🎯 ' : (isR ? '🧩 ' : '');
    w.appendChild(el('div', 'ans-card-title', icon + caption));
    w.appendChild(node);
    return w;
  }


  /* ---------- a horizontal group ---------- */
  function row(nodes, gap) {
    var w = el('div');
    w.style.cssText = 'display:flex;flex-wrap:wrap;gap:' + (gap || 26) +
      'px;align-items:flex-end;justify-content:center;';
    nodes.forEach(function (n) { w.appendChild(n); });
    return w;
  }

  /* ============================================================
     The engine
     ============================================================ */
  /* a drawing that shrinks to whatever space is left on the board */
  function art(viewBox, inner) {
    var box = el('div', 'art');
    box.innerHTML = '<svg viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid meet" ' +
                    'xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';

    /* The hand-written viewBoxes are wider than the drawing they hold, so the
       picture sat off to one side: multiply-by-tens draws x 60-533 inside a
       720-wide box, leaving it 63 units left of centre. Slide the viewBox
       origin so the drawing sits in the middle of it. Width and height are
       kept exactly as authored, so the artwork renders at the same size and
       aspect ratio as before — only its position changes. */
    var svg = box.firstChild;
    var vb = viewBox.split(/[ ,]+/).map(Number);
    var recentre = function () {
      if (!svg.isConnected) return;
      var b;
      try { b = svg.getBBox(); } catch (e) { return; }          /* not laid out yet */
      if (!b || !b.width || !b.height) return;
      svg.setAttribute('viewBox',
        (b.x + b.width / 2 - vb[2] / 2) + ' ' +
        (b.y + b.height / 2 - vb[3] / 2) + ' ' + vb[2] + ' ' + vb[3]);
    };
    requestAnimationFrame(function () { requestAnimationFrame(recentre); });
    /* text metrics move once the webfont lands, so measure again after it */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recentre);
    return box;
  }

  var Quiz = {
    blank: blank,
    choice: choice,
    sentence: sentence,
    art: art,
    labelled: labelled,
    row: row,
    el: el,
    speak: speak,
    soundCorrect: soundCorrect,
    soundWrong: soundWrong,
    soundCongrats: soundCongrats,

    _clearMsg: function () {
      if (this._msg) { this._msg.textContent = ''; this._msg.className = 'msg'; }
    },

    mount: function (cfg) {
      var self = this;
      var qs = cfg.questions;
      var at = 0;
      var state = qs.map(function () {
        return { solved: false, tries: 0, clean: true, saved: null };
      });

      /* ---- shell ---- */
      document.title = cfg.title + ' · Chapter 3';
      var home = el('a', 'home',
        '<svg viewBox="0 0 16 16"><path d="M8 1.2 1 7h2v6h3.6V9.2h2.8V13H13V7h2L8 1.2z"/></svg> Home');
      home.href = cfg.home || '../index.html';

      var stage = el('main', 'stage');
      var card = el('section', 'quiz');
      var head = el('header', 'quiz-head');
      var titleBox = el('div');
      if (cfg.tag) titleBox.appendChild(el('span', 'tag', cfg.tag));
      titleBox.appendChild(el('h1', null, cfg.title));
      var dots = el('div', 'dots');
      head.appendChild(titleBox);
      head.appendChild(dots);

      var hint = el('p', 'hint', cfg.hint || '');
      var board = el('div', 'board');

      var msg = el('p', 'msg');
      this._msg = msg;

      var nav = el('nav', 'nav');
      var prev = el('button', 'btn ghost', '← Prev');
      var help = el('button', 'btn ghost', 'Show me');
      var checkBtn = el('button', 'btn primary', 'Check answer');
      var nextBtn = el('button', 'btn primary', 'Next →');
      nextBtn.disabled = true;
      [prev, help, checkBtn, nextBtn].forEach(function (b) { b.type = 'button'; });
      help.style.minWidth = '120px';
      nav.appendChild(prev);
      nav.appendChild(help);
      nav.appendChild(checkBtn);
      nav.appendChild(nextBtn);

      card.appendChild(head);
      if (cfg.hint) card.appendChild(hint);
      card.appendChild(board);
      card.appendChild(msg);
      card.appendChild(nav);
      stage.appendChild(card);
      document.body.appendChild(home);
      document.body.appendChild(stage);

      /* ---- modals ---- */
      var popTimer = null;
      var modal = el('div', 'overlay');
      var pop = el('section', 'pop');
      var popIcon = el('div', 'emoji', '🎉');
      var popTitle = el('h2', null, 'Correct!');
      var popText = el('p');
      var popActions = el('div', 'actions');
      var popBtn = el('button', 'btn primary', 'Continue');
      popBtn.type = 'button';
      popActions.appendChild(popBtn);
      var popBand = el('div', 'pop-band');
      popBand.appendChild(popIcon);
      popBand.appendChild(popTitle);
      [popBand, popText, popActions].forEach(function (n) { pop.appendChild(n); });
      modal.appendChild(pop);

      var finish = el('div', 'overlay');
      var fin = el('section', 'pop');
      var finText = el('div');
      var finActions = el('div', 'actions');
      var again = el('button', 'btn primary', 'Play again');
      var back = el('a', 'btn ghost', 'Back to chapter');
      again.type = 'button';
      back.href = cfg.home || '../index.html';
      back.textContent = 'Home';
      back.style.display = 'inline-flex';
      back.style.alignItems = 'center';
      back.style.justifyContent = 'center';
      back.style.textDecoration = 'none';
      finActions.appendChild(again);
      finActions.appendChild(back);
      fin.appendChild(finText);
      fin.appendChild(finActions);
      finish.appendChild(fin);

      document.body.appendChild(modal);
      document.body.appendChild(finish);

      /* ---- helpers ---- */
      function fields() {
        return Array.prototype.filter
          .call(board.querySelectorAll('*'), function (n) { return n._f; })
          .filter(function (n) { return !n.parentNode._f; });
      }

      function save() {
        state[at].saved = fields().map(function (n) { return n._f.value(); });
      }

      function isUnlocked(idx) {
        if (idx === 0) return true;
        if (state[idx] && state[idx].solved) return true;
        for (var k = 0; k < idx; k++) {
          if (!state[k] || !state[k].solved) return false;
        }
        return true;
      }

      function drawDots() {
        dots.innerHTML = '';
        qs.forEach(function (q, i) {
          var d = el('button', 'dot', String(i + 1));
          var unlocked = isUnlocked(i);
          d.type = 'button';
          d.title = 'Question ' + (i + 1) + ' of ' + qs.length;
          d.setAttribute('aria-label', d.title);
          if (i === at) d.classList.add('at');
          if (state[i].solved) d.classList.add(state[i].clean ? 'ok' : 'no');
          if (!unlocked) {
            d.disabled = true;
            d.classList.add('locked');
          }
          d.onclick = function () {
            if (!isUnlocked(i)) return;
            save();
            at = i;
            draw();
          };
          dots.appendChild(d);
        });
      }

      function draw() {
        var s = state[at];
        board.innerHTML = '';
        self._clearMsg();

        var q = qs[at];
        if (q.stem) board.appendChild(el('p', 'stem', q.stem));
        q.build(board, Quiz);


        var fs = fields();
        if (s.saved) fs.forEach(function (n, i) { n._f.setValue(s.saved[i]); });
        if (s.solved) {
          fs.forEach(function (n) { n._f.mark('good'); n._f.lock(); });
        }

        prev.disabled = at === 0;
        help.hidden = s.solved || s.tries < 2;
        checkBtn.disabled = s.solved;
        nextBtn.disabled = !s.solved || at === qs.length - 1;
        nextBtn.textContent = 'Next →';

        drawDots();
        if (!s.solved && fs.length) fs[0]._f.focus();
      }

      function check() {
        var s = state[at];

        var fs = fields();
        var blankLeft = fs.filter(function (n) { return !n._f.filled(); });
        if (blankLeft.length) {
          msg.className = 'msg bad';
          msg.textContent = 'Fill in every box before checking.';
          blankLeft[0]._f.focus();
          return;
        }

        var wrong = [];
        fs.forEach(function (n) {
          var ok = n._f.correct();
          n._f.mark(ok ? 'good' : 'bad');
          if (!ok) wrong.push(n);
        });

        if (wrong.length) {
          s.tries++;
          s.clean = false;
          help.hidden = s.tries < 2;
          pop.className = 'pop wrong';
          popIcon.textContent = '🤔';
          popTitle.textContent = 'Not quite yet';
          popText.textContent = wrong.length === 1
            ? 'One answer needs another look — it is marked in red.'
            : wrong.length + ' answers need another look — they are marked in red.';
          popActions.style.display = 'none';
          soundWrong();
          modal.classList.add('show');
          popTimer && clearTimeout(popTimer);
          popTimer = setTimeout(function () { modal.classList.remove('show'); }, 1400);
          return;
        }

        s.solved = true;
        save();
        fs.forEach(function (n) { n._f.lock(); });
        drawDots();
        checkBtn.disabled = true;
        nextBtn.disabled = at === qs.length - 1;

        soundCorrect();
        confetti({ count: 45 });

        var isLast = at === qs.length - 1;
        if (isLast) soundCongrats();

        pop.className = 'pop';
        popIcon.textContent = s.clean ? '🎉' : '👍';
        popTitle.textContent = s.clean ? 'Perfect!' : 'Got it!';
        popText.textContent = qs[at].praise ||
          (s.clean ? 'First try — beautifully done.' : 'You stuck with it and worked it out.');
        popActions.style.display = 'none';
        modal.classList.add('show');
        popTimer && clearTimeout(popTimer);
        popTimer = setTimeout(function () {
          modal.classList.remove('show');
          if (isLast) showResult();
        }, 1400);
      }

      function advance() {
        if (at === qs.length - 1) { showResult(); return; }
        save();
        at++;
        draw();
      }

      function showResult() {
        var clean = state.filter(function (s) { return s.solved && s.clean; }).length;
        var stars = clean === qs.length ? 3 : (clean >= qs.length * 0.6 ? 2 : 1);
        finText.innerHTML =
          '<div class="pop-band"><div class="emoji">' +
            (stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💪') + '</div>' +
          '<h2>' + (stars === 3 ? 'Flawless!' : stars === 2 ? 'Well done!' : 'Good effort!') + '</h2></div>' +
          '<p>You finished every question in <b>' + cfg.title + '</b>.</p>' +
          '<div class="score"><b>' + clean + '</b><span>of ' + qs.length + ' on the first try</span></div>' +
          '<div class="stars">' + ('★ '.repeat(stars) + '☆ '.repeat(3 - stars)).trim() + '</div>';
        finish.classList.add('show');
        confetti({ count: 85, spread: Math.min(window.innerWidth, window.innerHeight) * 0.75 });
        again.focus();
      }

      /* ---- wiring ---- */
      prev.onclick = function () { if (at > 0) { save(); at--; draw(); } };
      checkBtn.onclick = check;
      nextBtn.onclick = function () { if (!nextBtn.disabled) advance(); };
      help.onclick = function () {
        var s = state[at];
        s.clean = false;
        fields().forEach(function (n) { n._f.reveal(); n._f.mark('good'); n._f.lock(); });
        s.solved = true;
        save();
        msg.className = 'msg good';
        msg.textContent = 'Here is the worked answer — try the next one on your own.';
        help.hidden = true;
        checkBtn.disabled = true;
        nextBtn.disabled = at === qs.length - 1;
        nextBtn.textContent = 'Next →';
        drawDots();
      };
      again.onclick = function () {
        at = 0;
        state = qs.map(function () { return { solved: false, tries: 0, clean: true, saved: null }; });
        finish.classList.remove('show');
        draw();
      };

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        if (finish.classList.contains('show') || modal.classList.contains('show')) return;
        e.preventDefault();
        check();
      });

      draw();
    }
  };

  /* ---------- CONFETTI ---------- */
  var CONFETTI_COLOURS = ['#7D6BEF', '#EF9F2B', '#10B981', '#FF2E93', '#3B82F6', '#F59E0B'];
  function confetti(opts){
    opts = opts || {};
    var x = opts.x || window.innerWidth / 2;
    var y = opts.y || window.innerHeight * 0.45;
    var count = opts.count || 40;
    var spread = opts.spread || Math.min(window.innerWidth, window.innerHeight) * 0.6;
    var layer = document.getElementById('quiz-confetti');
    if(!layer){
      layer = document.createElement('div');
      layer.id = 'quiz-confetti';
      layer.className = 'cft-layer';
      document.body.appendChild(layer);
    }
    var frag = document.createDocumentFragment();
    for(var i = 0; i < count; i++){
      var ang = -Math.PI * (0.05 + Math.random() * 0.9);
      var dist = spread * (0.3 + Math.random() * 0.8);
      var bx = Math.cos(ang) * dist;
      var by = Math.sin(ang) * dist * 0.75;
      var fall = window.innerHeight * (0.5 + Math.random() * 0.5);
      var size = 6 + Math.random() * 8;
      var dur = 1.4 + Math.random() * 1.0;
      var s = document.createElement('span');
      s.className = 'cft';
      s.style.cssText = [
        'left:' + x.toFixed(1) + 'px',
        'top:' + y.toFixed(1) + 'px',
        'width:' + size.toFixed(1) + 'px',
        'height:' + (size * (Math.random() < .4 ? 1 : 1.6)).toFixed(1) + 'px',
        'background:' + CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
        'border-radius:' + (Math.random() < .4 ? '50%' : '3px'),
        '--bx:' + bx.toFixed(1) + 'px',
        '--by:' + by.toFixed(1) + 'px',
        '--ex:' + (bx + (Math.random() * 2 - 1) * 60).toFixed(1) + 'px',
        '--ey:' + (by + fall).toFixed(1) + 'px',
        '--rot:' + Math.round(Math.random() * 900 - 450) + 'deg',
        'animation-delay:' + (Math.random() * 0.1).toFixed(2) + 's',
        'animation-duration:' + dur.toFixed(2) + 's'
      ].join(';');
      frag.appendChild(s);
      setTimeout(function(){ s.remove(); }, (dur + 0.4) * 1000);
    }
    layer.appendChild(frag);
  }

  Quiz.confetti = confetti;
  global.Quiz = Quiz;
})(window);

