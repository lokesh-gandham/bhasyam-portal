/* ============================================================
   Chapter 4 · confetti
   One shared full-screen canvas, no library, no network.

     confetti.burst()                 — from the middle of the screen
     confetti.burst({x, y, count})    — from a point
     confetti.at(element)             — from the middle of an element
     confetti.rain()                  — a wide celebration from the top

   Honours prefers-reduced-motion: it simply does nothing.
   ============================================================ */
(function (global) {
  'use strict';

  var COLORS = ['#4C5FD5', '#F2704A', '#F4C542', '#2FB57C', '#8A6BE2', '#3AA7E0', '#E4557F'];
  var canvas = null, ctx = null, parts = [], raf = null;

  var calm = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    var d = global.devicePixelRatio || 1;
    canvas.width = global.innerWidth * d;
    canvas.height = global.innerHeight * d;
    canvas.style.width = global.innerWidth + 'px';
    canvas.style.height = global.innerHeight + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function ensure() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    /* just under the pop-up overlay, so confetti flies behind the card */
    canvas.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    size();
    global.addEventListener('resize', size);
  }

  function spawn(n, x, y, power, angle, spread) {
    for (var i = 0; i < n; i++) {
      var a = angle == null ? Math.random() * Math.PI * 2
                            : angle + (Math.random() - 0.5) * spread;
      var v = power * (0.45 + Math.random() * 0.9);
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 3.2,
        w: 5 + Math.random() * 7,
        h: 4 + Math.random() * 8,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.55,
        colour: COLORS[(Math.random() * COLORS.length) | 0],
        life: 0,
        max: 70 + Math.random() * 60
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, global.innerWidth, global.innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++;
      p.vy += 0.3;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      var fadeFrom = p.max * 0.7;
      var alpha = p.life > fadeFrom ? Math.max(0, 1 - (p.life - fadeFrom) / (p.max - fadeFrom)) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.life >= p.max || p.y > global.innerHeight + 60) parts.splice(i, 1);
    }
    if (parts.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, global.innerWidth, global.innerHeight);
    }
  }

  global.confetti = {
    burst: function (o) {
      if (calm) return;
      o = o || {};
      ensure();
      spawn(
        o.count || 80,
        o.x == null ? global.innerWidth / 2 : o.x,
        o.y == null ? global.innerHeight / 2 : o.y,
        o.power || 9,
        o.angle,
        o.spread || Math.PI
      );
    },

    at: function (element, o) {
      if (calm || !element) return;
      var r = element.getBoundingClientRect();
      o = o || {};
      o.x = r.left + r.width / 2;
      o.y = r.top + r.height / 2;
      o.count = o.count || 45;
      o.power = o.power || 7;
      this.burst(o);
    },

    rain: function () {
      if (calm) return;
      ensure();
      var w = global.innerWidth;
      spawn(70, w * 0.2, -20, 11, Math.PI / 2.6, 1.1);
      spawn(70, w * 0.8, -20, 11, Math.PI - Math.PI / 2.6, 1.1);
      setTimeout(function () { spawn(60, w / 2, global.innerHeight * 0.35, 11); }, 160);
    }
  };
})(window);
