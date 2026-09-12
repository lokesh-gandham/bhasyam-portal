/* Shared Grade 3 quiz UX — sound, confetti, celebration from base-ten.html */
(function (window) {
    'use strict';

    var STANDARD_COLORS = ['#4fc3f7', '#ffd54f', '#ff9f45', '#7ed957', '#ff6b6b', '#4ecdc4'];
    var audioCtx = null;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function beep(freq, dur, type) {
        try {
            var ctx = getCtx();
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.type = type || 'sine';
            o.frequency.value = freq;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.14, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur / 1000);
            o.start();
            o.stop(ctx.currentTime + dur / 1000);
        } catch (e) { }
    }

    var sfx = {
        correct: function () {
            beep(660, 110, 'sine');
            setTimeout(function () { beep(880, 160, 'sine'); }, 110);
        },
        wrong: function () {
            beep(180, 220, 'sawtooth');
        },
        star: function () {
            beep(720, 90, 'triangle');
        },
        good: function () {
            beep(660, 110, 'sine');
            setTimeout(function () { beep(880, 160, 'sine'); }, 110);
        },
        bad: function () {
            beep(180, 220, 'sawtooth');
        },
        finish: function () {
            [523, 659, 784, 1047].forEach(function (f, i) {
                setTimeout(function () { beep(f, 150, 'sine'); }, i * 130);
            });
        },
        add: function () { beep(720, 90, 'triangle'); },
        remove: function () { beep(340, 90, 'triangle'); },
        maxed: function () { beep(200, 120, 'sawtooth'); }
    };

    function burstConfetti(fromEl, color) {
        if (typeof window.confetti !== 'function') return;
        var origin = { x: 0.5, y: 0.42 };
        if (fromEl && fromEl.getBoundingClientRect) {
            var rect = fromEl.getBoundingClientRect();
            origin = {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            };
        }
        window.confetti({
            particleCount: 30,
            spread: 70,
            origin: origin,
            startVelocity: 20,
            colors: [color || '#4fc3f7', '#ffd54f', '#ff9f45', '#7ed957', '#ff6b6b', '#4ecdc4']
        });
    }

    function showCorrectEmoji() {
        var colors = ['#ff6fb5', '#ffd54f', '#7ed957', '#4fc3f7', '#b388ff'];
        for (var i = 0; i < 18; i++) {
            var piece = document.createElement('span');
            var angle = (Math.PI * 2 * i) / 18;
            var distance = 90 + Math.random() * 100;
            piece.className = 'celebration-piece';
            piece.style.setProperty('--x', (Math.cos(angle) * distance) + 'px');
            piece.style.setProperty('--y', (Math.sin(angle) * distance) + 'px');
            piece.style.background = colors[i % colors.length];
            piece.style.animationDelay = (Math.random() * 0.12) + 's';
            document.body.appendChild(piece);
            setTimeout(function (el) { el.remove(); }, 1600, piece);
        }
        var emoji = document.createElement('div');
        emoji.className = 'emoji-pop';
        emoji.textContent = '🥳';
        document.body.appendChild(emoji);
        setTimeout(function () { emoji.remove(); }, 1850);
    }

    function showWrongEmoji() {
        var emoji = document.createElement('div');
        emoji.className = 'emoji-pop';
        emoji.textContent = '😔';
        emoji.style.fontSize = '70px';
        document.body.appendChild(emoji);
        setTimeout(function () { emoji.remove(); }, 1500);
    }

    function wrapConfetti() {
        var original = window.confetti;
        if (typeof original !== 'function' || original.__quizUiWrapped) return;
        function wrapped(opts) {
            opts = opts || {};
            return original({
                particleCount: 30,
                spread: 70,
                startVelocity: 20,
                origin: opts.origin || { x: 0.5, y: 0.42 },
                colors: STANDARD_COLORS.slice()
            });
        }
        wrapped.__quizUiWrapped = true;
        ['reset', 'create'].forEach(function (key) {
            if (typeof original[key] === 'function') wrapped[key] = original[key].bind(original);
        });
        window.confetti = wrapped;
    }

    wrapConfetti();
    var tries = 0;
    var timer = setInterval(function () {
        wrapConfetti();
        tries += 1;
        if (tries > 40) clearInterval(timer);
    }, 50);

    window.quizUiSfx = sfx;
    window.quizUiBeep = beep;
    window.burstConfetti = burstConfetti;
    window.showCorrectEmoji = showCorrectEmoji;
    window.showWrongEmoji = showWrongEmoji;

    document.addEventListener('click', function unlock() {
        try { getCtx(); } catch (e) { }
        document.removeEventListener('click', unlock);
    });

    function enhanceSharedButtons(root) {
        root = root || document;
        root.querySelectorAll('.btn-check, .check-btn').forEach(function (btn) {
            if (!btn.querySelector('i')) {
                btn.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-check check-icon"></i> ');
            }
        });
        root.querySelectorAll('#prevBtn, #prev, #previous, #previousButton, .btn-prev, .btn-prev-abs, .prev-btn, .nav .prev, button.nav.previous').forEach(function (btn) {
            var icon = btn.querySelector('.fa-chevron-left, .fa-angles-left');
            if (icon) {
                icon.className = 'fa-solid fa-angles-left nav-icon';
            } else {
                btn.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-angles-left nav-icon"></i> ');
            }
        });
        root.querySelectorAll('#nextBtn, #next, #nextButton, .btn-next, .btn-next-abs, .next-btn, .nav .next, button.nav.next').forEach(function (btn) {
            var icon = btn.querySelector('.fa-chevron-right, .fa-angles-right');
            if (icon) {
                icon.className = 'fa-solid fa-angles-right nav-icon';
            } else {
                btn.insertAdjacentHTML('beforeend', ' <i class="fa-solid fa-angles-right nav-icon"></i>');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { enhanceSharedButtons(document); });
    } else {
        enhanceSharedButtons(document);
    }
    document.addEventListener('DOMContentLoaded', function () {
        if (!window.MutationObserver) return;
        var obs = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) enhanceSharedButtons(node);
                });
            });
        });
        obs.observe(document.body, { childList: true, subtree: true });
    });
})(window);
