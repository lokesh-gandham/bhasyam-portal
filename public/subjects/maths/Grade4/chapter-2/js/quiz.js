/* ============================================================
   Chapter 2 — shared assessment engine.
   Popout, voice, confetti, streak tracking, sound effects.
   ============================================================ */
(function(){
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var streak = 0;

  function ensureAudio(){
    if(!audioCtx) {
      try { audioCtx = new AudioCtx(); } catch(e){}
    }
  }

  function speak(text){
    ensureAudio();
    var synth = window.speechSynthesis;
    if(!synth) return;
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1.1;
      synth.speak(u);
    } catch(e){}
  }

  function playTone(freq, dur, type){
    ensureAudio();
    if(!audioCtx) return;
    try {
      type = type || 'sine';
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch(e){}
  }

  function soundCorrect(){
    playTone(523.25, 0.12); // C5
    setTimeout(function(){ playTone(659.25, 0.12); }, 90); // E5
    setTimeout(function(){ playTone(783.99, 0.22); }, 180); // G5
    speak('Correct!');
  }

  function soundWrong(){
    playTone(330, 0.2, 'triangle');
    setTimeout(function(){ playTone(261.63, 0.3, 'triangle'); }, 150);
    speak('Try again!');
  }

  function soundCongrats(){
    playTone(523.25, 0.12);
    setTimeout(function(){ playTone(659.25, 0.12); }, 100);
    setTimeout(function(){ playTone(783.99, 0.12); }, 200);
    setTimeout(function(){ playTone(1046.50, 0.4); }, 300);
    speak('Superb work!');
  }

  var popupHideTimer = null;
  var popupRemoveTimer = null;

  function clearPopupTimers(){
    clearTimeout(popupHideTimer);
    clearTimeout(popupRemoveTimer);
  }

  function showPopout(type, msg, onClose){
    clearPopupTimers();

    var overlay = document.getElementById('quiz-popup-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'quiz-popup-overlay';
      overlay.className = 'popup-overlay';
      document.body.appendChild(overlay);
    }

    var isOk = type === 'correct';
    var isHint = type === 'hint';
    var icon = isOk ? '🎉' : (isHint ? '💡' : '💡');
    var label = isOk ? 'Correct Answer' : (isHint ? 'Curiosity Hint' : 'Keep Learning');
    var title = isOk ? 'Brilliant!' : (isHint ? 'Here\'s a Clue!' : 'Almost There!');
    var cls = isOk ? 'correct' : (isHint ? 'hint' : 'wrong');

    overlay.innerHTML =
      '<section class="answer-popup ' + cls + '" role="status" aria-live="polite">' +
        '<div class="popup-body">' +
          '<div class="popup-icon" aria-hidden="true">' + icon + '</div>' +
          '<div class="popup-label">' + label + '</div>' +
          '<h2 class="popup-title">' + title + '</h2>' +
          '<p class="popup-message">' + msg + '</p>' +
          '<div class="popup-track" aria-hidden="true">' +
            '<div class="popup-bar"></div>' +
          '</div>' +
        '</div>' +
      '</section>';

    overlay.classList.remove('hide');
    void overlay.offsetWidth;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    if(isOk){
      soundCorrect();
      confetti({ count: 45 });
    } else if(!isHint) {
      soundWrong();
    }

    var autoCloseTime = isHint ? 3200 : 2200;
    popupHideTimer = setTimeout(function(){
      overlay.classList.remove('show');
      overlay.classList.add('hide');
      popupRemoveTimer = setTimeout(function(){
        overlay.classList.remove('hide');
        overlay.setAttribute('aria-hidden', 'true');
        if(onClose) onClose();
      }, 300);
    }, autoCloseTime);
  }

  function showHint(msg, onClose){
    showPopout('hint', msg, onClose);
  }

  function showCongrats(score, total, stars, onClose){
    clearPopupTimers();

    var overlay = document.getElementById('quiz-popup-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'quiz-popup-overlay';
      overlay.className = 'popup-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML =
      '<section class="answer-popup congrats" role="status" aria-live="polite">' +
        '<div class="popup-body">' +
          '<div class="popup-icon" aria-hidden="true">🏆</div>' +
          '<div class="popup-label">Quiz Completed!</div>' +
          '<h2 class="popup-title">Awesome Job!</h2>' +
          '<div class="popup-stars">' +
            '<span class="popup-star" aria-hidden="true">⭐</span>' +
            '<span class="popup-star" aria-hidden="true">⭐</span>' +
            '<span class="popup-star" aria-hidden="true">⭐</span>' +
          '</div>' +
          '<div class="popup-score">Score: ' + score + ' / ' + total + '</div>' +
          '<p class="popup-message">You are a Subtraction Explorer!</p>' +
          '<div class="popup-actions">' +
            '<button class="btn btn-again" id="popup-again">Play Again 🔄</button>' +
            '<a href="../index.html" class="btn btn-menu" id="popup-menu">Chapter Hub 🏠</a>' +
          '</div>' +
        '</div>' +
      '</section>';

    overlay.classList.remove('hide');
    void overlay.offsetWidth;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    soundCongrats();
    confetti({ count: 90, spread: Math.min(window.innerWidth, window.innerHeight) * 0.8 });
    setTimeout(function(){ confetti({ count: 50 }); }, 450);

    var againBtn = document.getElementById('popup-again');
    if(againBtn){
      againBtn.onclick = function(){
        clearPopupTimers();
        overlay.classList.remove('show');
        overlay.classList.add('hide');
        popupRemoveTimer = setTimeout(function(){
          overlay.classList.remove('hide');
          overlay.setAttribute('aria-hidden', 'true');
          if(onClose) onClose();
        }, 300);
      };
    }
  }

  /* ---------- CONFETTI ---------- */
  var CONFETTI_COLOURS = [
    '#ff825c', '#6c59e8', '#15956f', '#f5a623', '#4938b1', '#ff5252', '#00d2d3'
  ];

  function confettiLayerEl(){
    var layer = document.getElementById('quiz-confetti');
    if(!layer){
      layer = document.createElement('div');
      layer.id = 'quiz-confetti';
      layer.className = 'cft-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    return layer;
  }

  function confetti(opts){
    opts = opts || {};
    var x = opts.x, y = opts.y;
    if(x === undefined) x = window.innerWidth / 2;
    if(y === undefined) y = window.innerHeight * 0.45;

    var count  = opts.count || 40;
    var spread = opts.spread || Math.min(window.innerWidth, window.innerHeight) * 0.6;
    var layer  = confettiLayerEl();
    var frag   = document.createDocumentFragment();

    for(var i = 0; i < count; i++){
      var ang  = -Math.PI * (0.05 + Math.random() * 0.9);
      var dist = spread * (0.3 + Math.random() * 0.8);
      var bx   = Math.cos(ang) * dist;
      var by   = Math.sin(ang) * dist * 0.75;
      var fall = window.innerHeight * (0.5 + Math.random() * 0.5);
      var size = 6 + Math.random() * 8;
      var dur  = 1.4 + Math.random() * 1.0;

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

  function incrementStreak(){
    streak++;
    return streak;
  }

  function resetStreak(){
    streak = 0;
    return streak;
  }

  window.Quiz2 = {
    speak: speak,
    soundCorrect: soundCorrect,
    soundWrong: soundWrong,
    soundCongrats: soundCongrats,
    showPopout: showPopout,
    showHint: showHint,
    showCongrats: showCongrats,
    confetti: confetti,
    incrementStreak: incrementStreak,
    resetStreak: resetStreak,
    clearPopupTimers: clearPopupTimers
  };
})();

