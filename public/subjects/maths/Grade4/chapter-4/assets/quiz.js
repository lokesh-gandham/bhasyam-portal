/* ============================================================
   Chapter 4 · Geometry Quiz Engine (with Audio & Voice Speech)
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

  function norm(v) {
    return String(v == null ? '' : v).replace(/[,\s°]/g, '').toLowerCase();
  }

  /* ---------- VOICE & AUDIO SYNTHESIS ENGINE ---------- */
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var touched = false;

  function ensureAudio() {
    if (!audioCtx && AudioCtx) {
      try { audioCtx = new AudioCtx(); } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      try { audioCtx.resume(); } catch (e) {}
    }
  }

  ['pointerdown', 'click', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (e.isTrusted) {
        touched = true;
        ensureAudio();
      }
    }, true);
  });

  function speak(text) {
    ensureAudio();
    var synth = global.speechSynthesis;
    if (!synth) return;
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.1;
      synth.speak(u);
    } catch (e) {}
  }

  function playTone(freq, dur, type) {
    try {
      ensureAudio();
      if (!audioCtx) return;
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
    } catch (e) {}
  }

  function soundCorrect() {
    playTone(523, 0.12);
    setTimeout(function () { playTone(659, 0.12); }, 100);
    setTimeout(function () { playTone(784, 0.2); }, 200);
    speak('Correct!');
  }

  function soundWrong() {
    playTone(330, 0.25, 'square');
    setTimeout(function () { playTone(262, 0.35, 'square'); }, 200);
    speak('Try again!');
  }

  function soundCongrats() {
    playTone(523, 0.12);
    setTimeout(function () { playTone(659, 0.12); }, 120);
    setTimeout(function () { playTone(784, 0.12); }, 240);
    setTimeout(function () { playTone(1047, 0.35); }, 360);
    speak('Congratulations!');
  }

  function buzz(ms) {
    if (touched && global.navigator && navigator.vibrate) {
      try { navigator.vibrate(ms || 140); } catch (e) { /* not supported */ }
    }
  }

  function shake(node) {
    node.classList.remove('shake');
    void node.offsetWidth;
    node.classList.add('shake');
    setTimeout(function () { node.classList.remove('shake'); }, 480);
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ============================================================
     Fields
     ============================================================ */
  function blank(answer, opts) {
    opts = opts || {};
    var input = el('input', 'blank');
    var text = String(answer);

    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = opts.placeholder || '?';
    input.setAttribute('aria-label', opts.label || 'answer');
    var width = opts.width || Math.max(text.length + 1, 3);
    input.style.width = width + 'ch';
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
      clear: function () {
        input.value = '';
        input.style.width = width + 'ch';
        input.classList.remove('good', 'bad');
      },
      reveal: function () { input.value = text; },
      value: function () { return input.value; },
      setValue: function (v) { input.value = v; },
      focus: function () { input.focus(); input.select(); }
    };

    input.addEventListener('input', function () {
      if (!opts.text) input.value = input.value.replace(/[^0-9]/g, '');
      input.style.width = Math.max(input.value.length + 1, width) + 'ch';
      input._f.mark('');
      Quiz._clearMsg();
    });

    return input;
  }

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

    wrap._f = {
      el: wrap,
      filled: function () { return chosen !== null; },
      correct: function () { return norm(chosen) === norm(answer); },
      mark: function (state) {
        buttons.forEach(function (b) {
          b.classList.remove('good', 'bad');
          if (b.textContent === chosen && state) {
            b.classList.remove('on');
            b.classList.add(state);
          }
        });
      },
      lock: function () { buttons.forEach(function (b) { b.disabled = true; }); },
      clear: function () {
        chosen = null;
        buttons.forEach(function (b) { b.classList.remove('on', 'good', 'bad'); });
      },
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
      var box = el('div', 'field-stack');
      box.appendChild(el('div', 'field-label', opts.label));
      box.appendChild(wrap);
      box._f = wrap._f;
      return box;
    }
    return wrap;
  }

  function line(parts, cls) {
    var row = el('div', cls || 'sentence');
    var flows = cls === 'claim';
    parts.forEach(function (p, i) {
      if (typeof p === 'string') {
        row.appendChild(el('span', /^[×÷+\-=]$/.test(p) ? 'op' : '', p));
      } else {
        row.appendChild(p);
      }
      if (!flows || i === parts.length - 1) return;
      var next = parts[i + 1];
      if (typeof next === 'string' && /^[.,;:!?]/.test(next)) return;
      row.appendChild(document.createTextNode(' '));
    });
    return row;
  }

  function sentence(parts) { return line(parts, 'sentence'); }
  function claim(parts) { return line(parts, 'claim'); }

  function labelled(caption, node) {
    var w = el('div', 'field-stack');
    w.appendChild(el('div', 'field-label', caption));
    w.appendChild(node);
    return w;
  }

  function row(nodes) {
    var w = el('div', 'field-row');
    nodes.forEach(function (n) { w.appendChild(n); });
    return w;
  }

  function figure(viewBox, inner) {
    var f = el('div', 'figure');
    f.innerHTML = '<svg viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
    return f;
  }

  function table(headings, rows) {
    var t = el('table', 'grid-table');
    var head = el('tr');
    headings.forEach(function (h) { head.appendChild(el('th', null, h)); });
    t.appendChild(head);
    rows.forEach(function (cells) {
      var tr = el('tr');
      cells.forEach(function (c, i) {
        var td = el('td', i === 0 ? 'name' : null);
        if (typeof c === 'string') td.textContent = c; else td.appendChild(c);
        tr.appendChild(td);
      });
      t.appendChild(tr);
    });
    return t;
  }

  /* ============================================================
     The shell both modes share
     ============================================================ */
  function shell(cfg) {
    document.title = cfg.title + ' · Chapter 4';

    var p = (window.location.pathname || '').toLowerCase();
    if (!document.body.className.match(/theme-/)) {
      if (p.indexOf('count-segments') !== -1) {
        document.body.classList.add('theme-blue');
      } else if (p.indexOf('lines-and-rays') !== -1) {
        document.body.classList.add('theme-coral');
      } else if (p.indexOf('angles') !== -1) {
        document.body.classList.add('theme-emerald');
      } else if (p.indexOf('curves') !== -1) {
        document.body.classList.add('theme-purple');
      } else if (p.indexOf('complete-the-pattern') !== -1) {
        document.body.classList.add('theme-amber');
      } else if (p.indexOf('match-the-solids') !== -1) {
        document.body.classList.add('theme-teal');
      } else if (p.indexOf('parts-of-a-circle') !== -1) {
        document.body.classList.add('theme-pink');
      } else if (p.indexOf('shape-patterns') !== -1) {
        document.body.classList.add('theme-indigo');
      } else if (p.indexOf('patterns') !== -1) {
        document.body.classList.add('theme-violet');
      } else if (p.indexOf('symmetry') !== -1) {
        document.body.classList.add('theme-orange');
      } else {
        document.body.classList.add('theme-emerald');
      }
    }

    var stage = el('main', 'stage');
    var quiz = el('section', 'quiz');

    var head = el('header', 'quiz-head');
    var headLeft = el('div', 'head-left');
    var home = el('a', 'home',
      '<svg viewBox="0 0 16 16"><path d="M8 1.2 1 7h2v6h3.6V9.2h2.8V13H13V7h2L8 1.2z"/></svg> Home');
    home.href = cfg.home || '../newindex.html';
    headLeft.appendChild(home);
    headLeft.appendChild(el('h1', null, cfg.title));
    var dots = el('div', 'dots');
    head.appendChild(headLeft);
    head.appendChild(dots);

    var hint = el('p', 'hint', cfg.hint || '');
    var board = el('div', 'board');
    var msg = el('p', 'msg');
    var nav = el('nav', 'nav');
    var navLeft = el('div', 'nav-left');
    var navCenter = el('div', 'nav-center');
    var navRight = el('div', 'nav-right');
    nav.appendChild(navLeft);
    nav.appendChild(navCenter);
    nav.appendChild(navRight);

    quiz.appendChild(head);
    if (cfg.hint) quiz.appendChild(hint);
    quiz.appendChild(board);
    quiz.appendChild(msg);
    quiz.appendChild(nav);
    stage.appendChild(quiz);
    document.body.appendChild(stage);

    /* feedback modal (popout directly on screen) */
    var modal = el('div', 'overlay');
    var pop = el('section', 'pop');
    var popIcon = el('div', 'emoji');
    var popTitle = el('h2');
    var popText = el('p');
    var popActions = el('div', 'actions');
    popActions.style.display = 'none';

    var popHead = el('div', 'pop-head');
    popHead.appendChild(popIcon);
    popHead.appendChild(popTitle);
    [popHead, popText, popActions].forEach(function (n) { pop.appendChild(n); });
    modal.appendChild(pop);

    /* final result modal */
    var finish = el('div', 'overlay');
    var fin = el('section', 'pop');
    var finText = el('div');
    var finActions = el('div', 'actions');
    var again = el('button', 'btn primary', 'Play again');
    var back = el('a', 'btn ghost', 'Home');
    again.type = 'button';
    back.href = cfg.home || '../newindex.html';
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

    return {
      dots: dots, board: board, msg: msg, nav: nav,
      navLeft: navLeft, navCenter: navCenter, navRight: navRight,
      modal: modal, pop: pop, popIcon: popIcon, popTitle: popTitle,
      popText: popText, popActions: popActions,
      finish: finish, finText: finText, again: again
    };
  }

  /* ============================================================
     The engine
     ============================================================ */
  var Quiz = {
    blank: blank, choice: choice, sentence: sentence, claim: claim,
    labelled: labelled, row: row, figure: figure, table: table, el: el,
    speak: speak, soundCorrect: soundCorrect, soundWrong: soundWrong, soundCongrats: soundCongrats,

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

      var ui = shell(cfg);
      this._msg = ui.msg;

      /* Check stays disabled until at least one answer box on the question
         is filled; typing in any box re-evaluates it. (check() still asks
         for every part before it will mark anything.) */
      function updateCheck() {
        var s = state[at];
        if (s && s.solved) { checkBtn.disabled = true; return; }
        var fs = fields();
        checkBtn.disabled = fs.length === 0 || !fs.some(function (n) { return n._f.filled(); });
      }
      ui.board.addEventListener('input', updateCheck);
      ui.board.addEventListener('click', updateCheck);

      /* Separate buttons on bottom navigation bar */
      var prev = el('button', 'btn ghost', '← Previous');
      var help = el('button', 'btn ghost', 'Show me');
      var checkBtn = el('button', 'btn primary', 'Check answer');
      var nextBtn = el('button', 'btn primary', 'Next →');
      [prev, help, checkBtn, nextBtn].forEach(function (b) { b.type = 'button'; });
      ui.navLeft.appendChild(prev);
      ui.navLeft.appendChild(help);
      ui.navCenter.appendChild(checkBtn);
      ui.navRight.appendChild(nextBtn);

      var popTimer = null;

      function isUnlocked(idx) {
        if (idx === 0) return true;
        if (state[idx] && state[idx].solved) return true;
        for (var k = 0; k < idx; k++) {
          if (!state[k] || !state[k].solved) return false;
        }
        return true;
      }

      var dotButtons = qs.map(function (q, i) {
        var d = el('button', 'dot');
        d.type = 'button';
        d.title = 'Question ' + (i + 1) + (q.short ? ' — ' + q.short : '');
        d.setAttribute('aria-label', d.title);
        d.onclick = function () {
          if (!isUnlocked(i)) return;
          save();
          at = i;
          draw();
        };
        ui.dots.appendChild(d);
        return d;
      });

      function fields() {
        return Array.prototype.filter
          .call(ui.board.querySelectorAll('*'), function (n) { return n._f; })
          .filter(function (n) { return !n.parentNode._f; });
      }

      function save() {
        if (state[at]) state[at].saved = fields().map(function (n) { return n._f.value(); });
      }

      function paintDots() {
        dotButtons.forEach(function (d, i) {
          var unlocked = isUnlocked(i);
          d.disabled = !unlocked;
          d.classList.toggle('locked', !unlocked);
          d.classList.toggle('at', i === at);
          d.classList.toggle('ok', state[i].solved && state[i].clean);
          d.classList.toggle('no', state[i].solved && !state[i].clean);
        });
      }

      function draw() {
        var s = state[at];
        var q = qs[at];
        ui.board.innerHTML = '';
        ui.board.className = 'board';
        self._clearMsg();

        if (q.stem) ui.board.appendChild(el('p', 'stem', q.stem));
        q.build(ui.board, Quiz);

        var fs = fields();
        if (s.saved) fs.forEach(function (n, i) { n._f.setValue(s.saved[i]); });
        if (s.solved) {
          fs.forEach(function (n) { n._f.mark('good'); n._f.lock(); });
        } else if (s.saved) {
          /* coming back to a part checked earlier: answers that were
             already right stay locked in green, the rest are open. */
          fs.forEach(function (n) {
            if (n._f.filled() && n._f.correct()) { n._f.mark('good'); n._f.lock(); }
          });
        }

        prev.disabled = at === 0;
        help.hidden = s.solved || s.tries < 2;
        updateCheck();
        nextBtn.disabled = !s.solved || at === qs.length - 1;
        nextBtn.style.visibility = (at === qs.length - 1) ? 'hidden' : 'visible';
        nextBtn.style.display = 'inline-block';

        paintDots();
        if (!s.solved && fs.length) fs[0]._f.focus();
      }

      function check() {
        var s = state[at];
        if (s.solved) return;

        var fs = fields();
        var toGrade = fs.filter(function (n) { return n._f.filled(); });
        if (!toGrade.length) {
          ui.msg.className = 'msg bad';
          ui.msg.textContent = 'Fill in an answer first.';
          soundWrong();
          fs[0] && fs[0]._f.focus();
          return;
        }

        /* Grade whatever the child has filled in so far — they can check
           one answer at a time. Right answers lock in green; the rest of
           the boxes stay open. */
        var wrong = [];
        toGrade.forEach(function (n) {
          var ok = n._f.correct();
          n._f.mark(ok ? 'good' : 'bad');
          if (ok) n._f.lock();
          else wrong.push(n);
        });
        var stillEmpty = fs.filter(function (n) { return !n._f.filled(); }).length;

        if (wrong.length || stillEmpty) {
          if (wrong.length) { s.tries++; s.clean = false; help.hidden = s.tries < 2; }
          save();                        /* remember the locked-in right answers */

          if (wrong.length) {
            buzz(150);
            shake(ui.board);
            ui.pop.className = 'pop wrong';
            ui.popIcon.textContent = '🤔';
            ui.popTitle.textContent = 'Not quite yet';
            ui.popText.textContent = wrong.length === 1
              ? 'One answer needs another look — try that box again.'
              : wrong.length + ' answers need another look — try those boxes again.';
            soundWrong();
          } else {
            ui.pop.className = 'pop';
            ui.popIcon.textContent = '👍';
            ui.popTitle.textContent = 'Right so far!';
            ui.popText.textContent = stillEmpty === 1
              ? 'That is correct. One more box to fill, then check again.'
              : 'Correct! ' + stillEmpty + ' more boxes to fill, then check again.';
            soundCorrect();
          }
          if (ui.popActions) ui.popActions.style.display = 'none';
          ui.modal.classList.add('show');

          popTimer && clearTimeout(popTimer);
          popTimer = setTimeout(function () {
            ui.modal.classList.remove('show');
            wrong.forEach(function (n) { if (n._f.clear) n._f.clear(); else n._f.mark(''); });
            var next = wrong[0] || fs.filter(function (n) { return !n._f.filled(); })[0];
            next && next._f.focus();
            updateCheck();
          }, wrong.length ? 1500 : 1200);
          return;
        }

        s.solved = true;
        save();
        fs.forEach(function (n) { n._f.lock(); });
        paintDots();
        checkBtn.disabled = true;
        nextBtn.disabled = at === qs.length - 1;

        confetti.burst({ count: 90 });
        ui.pop.className = 'pop';
        ui.popIcon.textContent = s.clean ? '🎉' : '👍';
        ui.popTitle.textContent = s.clean ? 'Perfect!' : 'Got it!';
        var praiseText = qs[at].praise || (s.clean ? 'First try — beautifully done.' : 'You stuck with it and worked it out.');
        ui.popText.textContent = praiseText;
        if (ui.popActions) ui.popActions.style.display = 'none';
        ui.modal.classList.add('show');

        soundCorrect();

        popTimer && clearTimeout(popTimer);
popTimer = setTimeout(function () {
  ui.modal.classList.remove('show');

  // Only show final result after answering the LAST question.
  if (at === qs.length - 1 && s.solved) {
    showResult();
  }
}, 1600);
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
        var titleMsg = stars === 3 ? 'Flawless!' : (stars === 2 ? 'Well done!' : 'Good effort!');
        ui.finText.innerHTML =
          '<div class="pop-head">' +
          '<div class="emoji">' + (stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💪') + '</div>' +
          '<h2>' + titleMsg + '</h2>' + '</div>' +
          '<p>You finished every question in ' + cfg.title + '.</p>' +
          '<div class="score"><b>' + clean + '</b><span>of ' + qs.length + ' on the first try</span></div>' +
          '<div class="stars">' + ('★ '.repeat(stars) + '☆ '.repeat(3 - stars)).trim() + '</div>';
        ui.finish.classList.add('show');
        confetti.rain();
        ui.again.focus();

        soundCongrats();
      }

      prev.onclick = function () { if (at > 0) { save(); at--; draw(); } };
      checkBtn.onclick = check;
      nextBtn.onclick = function () { if (!nextBtn.disabled) advance(); };
      help.onclick = function () {
        var s = state[at];
        s.clean = false;
        s.solved = true;
        fields().forEach(function (n) { n._f.reveal(); n._f.mark('good'); n._f.lock(); });
        save();
        ui.msg.className = 'msg good';
        ui.msg.textContent = 'Here is the answer — try the next one on your own.';
        help.hidden = true;
        checkBtn.disabled = true;
        nextBtn.disabled = at === qs.length - 1;
        paintDots();
        soundCorrect();
      };
      ui.again.onclick = function () {
        at = 0;
        state = qs.map(function () { return { solved: false, tries: 0, clean: true, saved: null }; });
        ui.finish.classList.remove('show');
        draw();
      };

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || ui.finish.classList.contains('show')) return;
        e.preventDefault();
        if (ui.modal.classList.contains('show')) {
          ui.modal.classList.remove('show');
          popTimer && clearTimeout(popTimer);
          if (state[at].solved) {
            if (at === qs.length - 1) showResult();
            else advance();
          }
        } else if (!state[at].solved) {
          check();
        } else if (at < qs.length - 1) {
          advance();
        }
      });

      draw();
    },

    matching: function (cfg) {
      var ui = shell(cfg);
      this._msg = ui.msg;

      var rounds = cfg.rounds;
      var total = rounds.reduce(function (n, r) { return n + r.pairs.length; }, 0);

      var restart = el('button', 'btn danger small', 'Start again');
      restart.type = 'button';
      ui.navCenter.appendChild(restart);

      var dotButtons = [];
      for (var i = 0; i < total; i++) {
        var d = el('button', 'dot');
        d.type = 'button';
        d.disabled = true;
        d.style.cursor = 'default';
        ui.dots.appendChild(d);
        dotButtons.push(d);
      }

      var roundAt, picked, doneHere, doneAll, misses;
      var NS = 'http://www.w3.org/2000/svg';
      var matchEl = null, wires = null, wired = [];

      function svgEl(tag) { return document.createElementNS(NS, tag); }

      /* joins every matched pair with a line across the middle band */
      function drawWires() {
        if (!wires || !matchEl) return;
        while (wires.firstChild) wires.removeChild(wires.firstChild);
        var box = matchEl.getBoundingClientRect();
        wired.forEach(function (p) {
          var ra = p.top.getBoundingClientRect(), rb = p.bottom.getBoundingClientRect();
          var pts = [
            [ra.left + ra.width / 2 - box.left, ra.bottom - box.top],
            [rb.left + rb.width / 2 - box.left, rb.top - box.top]
          ];
          var line = svgEl('line');
          line.setAttribute('x1', pts[0][0]); line.setAttribute('y1', pts[0][1]);
          line.setAttribute('x2', pts[1][0]); line.setAttribute('y2', pts[1][1]);
          wires.appendChild(line);
          pts.forEach(function (pt) {
            var dot = svgEl('circle');
            dot.setAttribute('cx', pt[0]);
            dot.setAttribute('cy', pt[1]);
            dot.setAttribute('r', 5);
            wires.appendChild(dot);
          });
        });
      }
      window.addEventListener('resize', drawWires);

      /* an order where nothing lands in its own column */
      function derange(n) {
        var order = [], i, j, t;
        for (i = 0; i < n; i++) order.push(i);
        if (n < 2) return order;
        order = shuffle(order);
        for (i = 0; i < n; i++) {
          if (order[i] !== i) continue;
          j = i === n - 1 ? 0 : i + 1;
          t = order[i]; order[i] = order[j]; order[j] = t;
        }
        return order;
      }

      function tileFor(value) {
        var b = el('button', 'tile');
        b.type = 'button';
        if (value && value.img) {
          b.classList.add('pic');
          var img = el('img');
          img.src = value.img;
          img.alt = value.alt || '';
          b.appendChild(img);
        } else if (value && value.svg) {
          b.classList.add('pic');
          b.innerHTML = value.svg;
        } else {
          b.textContent = value;
        }
        return b;
      }

      function deal() {
        roundAt = 0;
        doneAll = 0;
        misses = 0;
        dotButtons.forEach(function (d) { d.className = 'dot'; });
        build();
      }

      function build() {
        var round = rounds[roundAt];
        picked = null;
        doneHere = 0;
        wired = [];
        ui.board.innerHTML = '';
        ui.board.className = 'board fill';

        var match = el('div', 'match');
        matchEl = match;
        wires = svgEl('svg');
        wires.setAttribute('class', 'wires');
        match.appendChild(wires);

        var left = el('div', 'match-col');
        var right = el('div', 'match-col');
        left.style.gridTemplateColumns = right.style.gridTemplateColumns =
          'repeat(' + round.pairs.length + ', 1fr)';

        round.pairs.forEach(function (pair, i) {
          var b = tileFor(pair[0]);
          b.dataset.key = String(i);
          b.dataset.side = 'left';
          b.onclick = function () { tap(b); };
          left.appendChild(b);
        });
        derange(round.pairs.length).forEach(function (i) {
          var b = tileFor(round.pairs[i][1]);
          b.dataset.key = String(i);
          b.dataset.side = 'right';
          b.onclick = function () { tap(b); };
          right.appendChild(b);
        });

        match.appendChild(left);
        match.appendChild(right);
        ui.board.appendChild(match);
        tally();
      }

      function tally() {
        var round = rounds[roundAt];
        ui.msg.className = 'msg';
        ui.msg.textContent =
          (rounds.length > 1 ? (round.name || 'Matching ' + (roundAt + 1)) + ' · ' : '') +
          doneHere + ' of ' + round.pairs.length + ' matched here · ' +
          doneAll + ' of ' + total + ' altogether';
      }

      function clearPick() {
        if (picked) picked.classList.remove('on');
        picked = null;
      }

      function tap(tile) {
        if (tile.disabled) return;

        if (!picked) {
          picked = tile;
          tile.classList.add('on');
          return;
        }
        if (picked === tile) { clearPick(); return; }
        if (picked.dataset.side === tile.dataset.side) {
          clearPick();
          picked = tile;
          tile.classList.add('on');
          return;
        }

        var a = picked, b = tile;
        clearPick();

        if (a.dataset.key === b.dataset.key) {
          /* right pair — confetti only, no pop-up */
          [a, b].forEach(function (t) {
            t.classList.remove('on', 'miss');
            t.classList.add('done');
            t.disabled = true;
          });
          wired.push({
            top:    a.dataset.side === 'left' ? a : b,
            bottom: a.dataset.side === 'left' ? b : a
          });
          drawWires();
          setTimeout(drawWires, 200);
          confetti.at(b, { count: 55 });
          dotButtons[doneAll].classList.add('ok');
          doneAll++;
          doneHere++;
          tally();
          soundCorrect();
          if (doneHere === rounds[roundAt].pairs.length) {
            setTimeout(roundAt < rounds.length - 1 ? askNext : result, 550);
          }
        } else {
          /* wrong pair — just a shake and a buzz */
          misses++;
          buzz(160);
          soundWrong();
          [a, b].forEach(function (t) {
            t.classList.add('miss');
            shake(t);
            setTimeout(function () { t.classList.remove('miss'); }, 620);
          });
        }
      }

      function askNext() {
        var here = rounds[roundAt], next = rounds[roundAt + 1];
        confetti.burst({ count: 90 });
        ui.pop.className = 'pop';
        ui.popIcon.textContent = '\u2705';
        ui.popTitle.textContent = (here.name || 'Matching ' + (roundAt + 1)) + ' finished!';
        ui.popText.textContent = 'All ' + here.pairs.length + ' pairs matched. ' +
          'Shall we go on to ' + (next.name || 'the next matching') + '?';
        if (ui.popActions) {
          ui.popActions.innerHTML = '';
          var cont = el('button', 'btn primary', 'Continue \u2192');
          cont.type = 'button';
          cont.onclick = function () {
            ui.modal.classList.remove('show');
            roundAt++;
            build();
          };
          ui.popActions.appendChild(cont);
          ui.popActions.style.display = 'flex';
        }
        ui.modal.classList.add('show');
        soundCongrats();
      }

      function result() {
        var stars = misses === 0 ? 3 : (misses <= total / 2 ? 2 : 1);
        var titleMsg = stars === 3 ? 'Every pair, first time!' : 'Both matchings done!';
        ui.finText.innerHTML =
          '<div class="pop-head">' +
          '<div class="emoji">' + (stars === 3 ? '\uD83C\uDFC6' : stars === 2 ? '\u2B50' : '\uD83D\uDCAA') + '</div>' +
          '<h2>' + titleMsg + '</h2>' + '</div>' +
          '<p>You matched all ' + total + ' pairs in ' + cfg.title + '.</p>' +
          '<div class="score"><b>' + misses + '</b><span>' +
          (misses === 1 ? 'wrong try along the way' : 'wrong tries along the way') + '</span></div>' +
          '<div class="stars">' + ('\u2605 '.repeat(stars) + '\u2606 '.repeat(3 - stars)).trim() + '</div>';
        ui.finish.classList.add('show');
        confetti.rain();
        ui.again.focus();
        soundCongrats();
      }

      restart.onclick = deal;
      ui.again.onclick = function () { ui.finish.classList.remove('show'); deal(); };

      deal();
    }
  };

  global.Quiz = Quiz;
})(window);
