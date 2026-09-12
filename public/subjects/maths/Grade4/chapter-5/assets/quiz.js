/* ============================================================
   Chapter 5 · Factors & Multiples
   Quiz engine shared by all activities in Chapter 5.
   Includes audio tones, speech synthesis, question numbering,
   responsive grid alignment, and confetti on completion.
   ============================================================ */
(function (global) {
  'use strict';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* Audio & Speech */
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
    try {
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
    } catch(e){}
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

  function norm(v) {
    return String(v == null ? '' : v).replace(/[,\s]/g, '').toLowerCase();
  }

  var Quiz = {
    blank: function (answer, opts) {
      opts = opts || {};
      var input = el('input', 'blank');
      var target = Array.isArray(answer) ? answer : [answer];

      input.type = 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = opts.placeholder || '?';
      if (opts.width) input.style.width = (opts.width + 1.5) + 'ch';
      input.setAttribute('aria-label', opts.label || 'answer');

      input._f = {
        check: function () {
          var val = norm(input.value);
          var isOk = target.some(function (t) { return norm(t) === val; });
          return isOk;
        },
        mark: function (cls) {
          input.className = 'blank ' + (cls || '');
        },
        reveal: function () {
          input.value = target[0];
        },
        lock: function () { input.disabled = true; },
        focus: function () { input.focus(); }
      };
      return input;
    },

    choice: function (options, correct, opts) {
      opts = opts || {};
      var wrap = el('div', 'choices');
      wrap.setAttribute('role', 'radiogroup');
      wrap.setAttribute('aria-label', opts.label || 'choices');

      var chosen = null;
      options.forEach(function (opt) {
        var btn = el('button', 'choice-btn', opt);
        btn.type = 'button';
        btn.onclick = function () {
          Array.prototype.forEach.call(wrap.children, function (c) { c.classList.remove('sel'); });
          btn.classList.add('sel');
          chosen = opt;
        };
        wrap.appendChild(btn);
      });

      wrap._f = {
        check: function () { return norm(chosen) === norm(correct); },
        mark: function (cls) {
          Array.prototype.forEach.call(wrap.children, function (c) {
            if (norm(c.textContent) === norm(correct)) c.className = 'choice-btn good';
            else if (c.classList.contains('sel')) c.className = 'choice-btn bad';
          });
        },
        reveal: function () {
          Array.prototype.forEach.call(wrap.children, function (c) {
            if (norm(c.textContent) === norm(correct)) c.className = 'choice-btn good';
          });
          chosen = correct;
        },
        lock: function () {
          Array.prototype.forEach.call(wrap.children, function (c) { c.disabled = true; });
        },
        focus: function () {
          if (wrap.firstElementChild) wrap.firstElementChild.focus();
        }
      };
      return wrap;
    },

    sentence: function (parts) {
      var box = el('div', 'sentence');
      parts.forEach(function (p) {
        if (typeof p === 'string') {
          var s = el('span', null, p);
          if ('×÷=+-'.indexOf(p) !== -1) s.className = 'op';
          box.appendChild(s);
        } else if (p && p.nodeType) {
          box.appendChild(p);
        }
      });
      return box;
    },

    art: function (viewBox, svgContent) {
      var wrap = el('div', 'art');
      wrap.innerHTML = '<svg viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg">' + svgContent + '</svg>';
      return wrap;
    },

    mount: function (cfg) {
      var qs = cfg.questions || [];
      var at = 0;
      var state = qs.map(function () { return { solved: false, clean: true, tries: 0 }; });

      var homeUrl = cfg.home || '../index.html';
      var homeBtn = el('a', 'home', '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Chapter 5');
      homeBtn.href = homeUrl;
      document.body.appendChild(homeBtn);

      var stage = el('div', 'stage');
      var card = el('div', 'quiz');
      stage.appendChild(card);
      document.body.appendChild(stage);

      /* Head */
      var head = el('div', 'quiz-head');
      var title = el('h1', null, cfg.title);
      var dots = el('div', 'dots');
      head.appendChild(title);
      head.appendChild(dots);
      card.appendChild(head);

      /* Board */
      var board = el('div', 'board');
      card.appendChild(board);

      /* Foot */
      var foot = el('div', 'quiz-foot');
      var msg = el('div', 'msg');
      var btnGroup = el('div', 'btn-group');
      var prevBtn = el('button', 'btn btn-secondary', '← Prev');
      var helpBtn = el('button', 'btn btn-secondary', 'Help');
      var checkBtn = el('button', 'btn btn-primary', 'Check Answer');
      var nextBtn = el('button', 'btn btn-primary', 'Next →');

      btnGroup.appendChild(prevBtn);
      btnGroup.appendChild(helpBtn);
      btnGroup.appendChild(checkBtn);
      btnGroup.appendChild(nextBtn);
      foot.appendChild(msg);
      foot.appendChild(btnGroup);
      card.appendChild(foot);

      /* Overlay Modal */
      var finishOverlay = el('div', 'finish-overlay');
      finishOverlay.innerHTML =
        '<div class="finish-card">' +
          '<div class="stars" id="end-stars">★★★</div>' +
          '<h2>Activity Complete!</h2>' +
          '<div class="score" id="end-score">0 / 0</div>' +
          '<p id="end-msg">Great job practicing Factors and Multiples!</p>' +
          '<div style="display:flex;gap:12px;margin-top:12px;">' +
            '<button class="btn btn-secondary" id="again-btn">Try Again</button>' +
            '<a class="btn btn-primary" href="' + homeUrl + '">Back to Chapter 5</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(finishOverlay);

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
        qs.forEach(function (q, idx) {
          var d = el('button', 'dot', String(idx + 1));
          var unlocked = isUnlocked(idx);
          if (idx === at) d.classList.add('at');
          if (state[idx].solved) {
            d.classList.add(state[idx].clean ? 'ok' : 'no');
          }
          if (!unlocked) {
            d.disabled = true;
            d.classList.add('locked');
          }
          d.onclick = function () {
            if (!isUnlocked(idx)) return;
            at = idx;
            draw();
          };
          dots.appendChild(d);
        });
      }

      function getFields() {
        var inputs = board.querySelectorAll('.blank');
        var choices = board.querySelectorAll('.choices');
        var res = [];
        inputs.forEach(function (i) { if (i._f) res.push(i._f); });
        choices.forEach(function (c) { if (c._f) res.push(c._f); });
        return res;
      }

      function draw() {
        board.innerHTML = '';
        msg.textContent = '';
        msg.className = 'msg';

        var q = qs[at];

        /* Question pill badge */
        var qPill = el('div', 'q-num-pill', 'Question ' + (at + 1) + ' of ' + qs.length);
        board.appendChild(qPill);

        if (q.stem) {
          var stemEl = el('div', 'stem', q.stem);
          board.appendChild(stemEl);
        }

        /* Build question UI */
        var QHelpers = {
          blank: Quiz.blank,
          choice: Quiz.choice,
          sentence: Quiz.sentence,
          art: Quiz.art,
          el: el
        };
        q.build(board, QHelpers);

        drawDots();

        prevBtn.disabled = at === 0;
        var s = state[at];
        if (s.solved) {
          getFields().forEach(function (f) { f.reveal(); f.mark('good'); f.lock(); });
          checkBtn.disabled = true;
          helpBtn.style.display = 'none';
          msg.className = 'msg good';
          msg.textContent = q.praise || 'Solved!';
        } else {
          checkBtn.disabled = false;
          helpBtn.style.display = 'inline-flex';
        }

        nextBtn.textContent = at === qs.length - 1 ? 'Finish →' : 'Next →';

        /* Focus first blank */
        var fields = getFields();
        if (fields.length > 0 && !s.solved) fields[0].focus();
      }

      function check() {
        var fields = getFields();
        if (fields.length === 0) return;
        var s = state[at];
        s.tries++;

        var allOk = fields.every(function (f) { return f.check(); });

        if (allOk) {
          s.solved = true;
          fields.forEach(function (f) { f.mark('good'); f.lock(); });
          msg.className = 'msg good';
          msg.textContent = qs[at].praise || 'Correct!';
          soundCorrect();
          checkBtn.disabled = true;
          helpBtn.style.display = 'none';
          drawDots();
          if (at === qs.length - 1 && qs.every(function(item, i){ return state[i].solved; })) {
            setTimeout(showFinish, 600);
          }
        } else {
          s.clean = false;
          fields.forEach(function (f) {
            if (f.check()) f.mark('good');
            else f.mark('bad');
          });
          msg.className = 'msg bad';
          msg.textContent = 'Check your answer and try again!';
          soundWrong();
        }
      }

      function showFinish() {
        var cleanCount = state.filter(function (s) { return s.solved && s.clean; }).length;
        var total = qs.length;
        var stars = cleanCount === total ? '★★★' : (cleanCount >= total / 2 ? '★★☆' : '★☆☆');
        document.getElementById('end-stars').textContent = stars;
        document.getElementById('end-score').textContent = cleanCount + ' / ' + total;
        finishOverlay.classList.add('show');
        soundCongrats();
      }

      checkBtn.onclick = check;
      prevBtn.onclick = function () { if (at > 0) { at--; draw(); } };
      nextBtn.onclick = function () {
        if (at < qs.length - 1) { at++; draw(); }
        else showFinish();
      };
      helpBtn.onclick = function () {
        var s = state[at];
        s.clean = false;
        s.solved = true;
        getFields().forEach(function (f) { f.reveal(); f.mark('good'); f.lock(); });
        msg.className = 'msg good';
        msg.textContent = 'Worked answer revealed.';
        checkBtn.disabled = true;
        helpBtn.style.display = 'none';
        drawDots();
      };

      document.getElementById('again-btn').onclick = function () {
        finishOverlay.classList.remove('show');
        at = 0;
        state = qs.map(function () { return { solved: false, clean: true, tries: 0 }; });
        draw();
      };

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !finishOverlay.classList.contains('show')) {
          e.preventDefault();
          check();
        }
      });

      draw();
    }
  };

  global.Quiz = Quiz;
})(window);
