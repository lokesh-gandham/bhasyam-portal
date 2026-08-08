(function () {
  const config = window.lesson6Config;
  if (!config) return;

  const state = {
    current: 0,
    answered: [],
    matched: new Set(),
    selectedLeft: null,
    selectedGridCells: [],
    selectedKindWord: null,
    gridDragging: false,
    gridPointerMoved: false,
    popupTimer: null,
    completionRunning: false
  };

  const finalPopupVideo = "../assets/images/finalpopoutvideo.mp4";

  const icons = {
    school: '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="18" y="32" width="84" height="44" rx="4" fill="#f7d77f"/><path d="M16 34 60 12l44 22" fill="#df6e5d"/><rect x="52" y="50" width="16" height="26" fill="#6e4b3a"/><rect x="28" y="44" width="14" height="12" fill="#8fd3ff"/><rect x="78" y="44" width="14" height="12" fill="#8fd3ff"/></svg>',
    park: '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="8" y="64" width="104" height="12" rx="6" fill="#68bd6a"/><rect x="30" y="50" width="60" height="12" rx="3" fill="#c77b42"/><rect x="36" y="60" width="7" height="16" fill="#7a5138"/><rect x="78" y="60" width="7" height="16" fill="#7a5138"/><circle cx="30" cy="31" r="18" fill="#65bd70"/><circle cx="54" cy="25" r="22" fill="#56aa61"/><circle cx="78" cy="33" r="17" fill="#77c878"/><rect x="55" y="38" width="9" height="28" fill="#8d5b37"/></svg>',
    shop: '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="20" y="35" width="80" height="42" rx="4" fill="#f7c775"/><path d="M24 20h72l8 18H16z" fill="#ef6b81"/><path d="M16 38h88" stroke="#fff" stroke-width="6" stroke-dasharray="12 12"/><rect x="50" y="52" width="20" height="25" fill="#7a5138"/><rect x="28" y="50" width="15" height="12" fill="#9be7ff"/></svg>',
    bakery: '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="22" y="28" width="76" height="48" rx="6" fill="#f9d18a"/><path d="M22 36h76" stroke="#9c613b" stroke-width="4"/><ellipse cx="46" cy="54" rx="18" ry="10" fill="#c87939"/><ellipse cx="74" cy="54" rx="18" ry="10" fill="#e2a15c"/><path d="M35 22c6-10 18-9 23 0 4-10 17-10 23 0" fill="none" stroke="#c87939" stroke-width="6" stroke-linecap="round"/></svg>',
    hat: '<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="58" rx="42" ry="12" fill="#171720"/><path d="M38 22h44l-8 34H46z" fill="#22232b"/><path d="M42 45h36" stroke="#cf3b96" stroke-width="7"/><path d="M50 22c7-12 14-12 20 0" fill="#32333d"/><path d="M59 11v25M44 22l30 0M51 14l16 16M67 14 51 31" stroke="#ffc42e" stroke-width="4" stroke-linecap="round"/></svg>',
    wand: '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M34 72 82 24" stroke="#1f2634" stroke-width="10" stroke-linecap="round"/><path d="M30 76 42 64" stroke="#e6b15f" stroke-width="10" stroke-linecap="round"/><path d="M83 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#ffd13d"/><circle cx="62" cy="18" r="4" fill="#ffd13d"/><circle cx="95" cy="48" r="4" fill="#70c2ff"/></svg>',
    stars: '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M28 50l7 14 15 2-11 11 3 15-14-8-14 8 3-15L6 66l15-2z" fill="#ffc22c"/><path d="M75 18l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z" fill="#8b7bff"/><path d="M58 46l5 10 11 1-8 8 2 11-10-6-10 6 2-11-8-8 11-1z" fill="#56c8d8"/></svg>',
    door: '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M30 76V34c0-17 13-28 30-28s30 11 30 28v42z" fill="#6b6f79"/><path d="M42 76V36c0-11 8-18 18-18s18 7 18 18v40z" fill="#a86335"/><path d="M60 18v58" stroke="#754426" stroke-width="3"/><circle cx="68" cy="52" r="3" fill="#f1cd64"/><rect x="24" y="76" width="72" height="8" rx="4" fill="#6d9f55"/></svg>',
    sad: '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="60" cy="45" r="32" fill="#ffd36b"/><circle cx="48" cy="38" r="4" fill="#3c3153"/><circle cx="72" cy="38" r="4" fill="#3c3153"/><path d="M45 64c8-10 22-10 30 0" fill="none" stroke="#3c3153" stroke-width="5" stroke-linecap="round"/></svg>',
    happy: '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="60" cy="45" r="32" fill="#ffd36b"/><circle cx="48" cy="38" r="4" fill="#3c3153"/><circle cx="72" cy="38" r="4" fill="#3c3153"/><path d="M43 58c9 12 25 12 34 0" fill="none" stroke="#3c3153" stroke-width="5" stroke-linecap="round"/></svg>',
    surprised: '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="60" cy="45" r="32" fill="#ffd36b"/><circle cx="48" cy="38" r="4" fill="#3c3153"/><circle cx="72" cy="38" r="4" fill="#3c3153"/><ellipse cx="60" cy="60" rx="9" ry="11" fill="#3c3153"/><path d="M34 19l-8-9M86 19l8-9" stroke="#e95d94" stroke-width="5" stroke-linecap="round"/></svg>',
    shocked: '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="60" cy="45" r="32" fill="#ffd36b"/><circle cx="47" cy="38" r="6" fill="#3c3153"/><circle cx="73" cy="38" r="6" fill="#3c3153"/><ellipse cx="60" cy="61" rx="12" ry="13" fill="#3c3153"/><path d="M25 32h16M79 32h16" stroke="#3c3153" stroke-width="4" stroke-linecap="round"/></svg>',
    books: '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="18" y="24" width="18" height="52" rx="3" fill="#ef6b81"/><rect x="40" y="18" width="18" height="58" rx="3" fill="#5aa9e6"/><rect x="62" y="27" width="18" height="49" rx="3" fill="#66b86e"/><rect x="84" y="33" width="12" height="43" rx="3" fill="#f0b74b"/><path d="M44 24h10M22 34h10M66 38h10" stroke="#fff" stroke-width="3"/></svg>',
    toys: '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="40" cy="52" r="18" fill="#70c2ff"/><path d="M40 34v36M22 52h36" stroke="#fff" stroke-width="5"/><rect x="68" y="36" width="28" height="28" rx="5" fill="#ef6b81"/><circle cx="77" cy="45" r="3" fill="#fff"/><circle cx="88" cy="55" r="3" fill="#fff"/></svg>',
    stones: '<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="42" cy="58" rx="25" ry="16" fill="#8f98a7"/><ellipse cx="74" cy="54" rx="26" ry="18" fill="#6f7782"/><ellipse cx="64" cy="38" rx="18" ry="13" fill="#aab2bd"/></svg>',
    papers: '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M34 16h42l14 14v44H34z" fill="#f7fbff" stroke="#98a6b8" stroke-width="3"/><path d="M76 16v15h14" fill="#d7e8fb"/><path d="M44 42h32M44 53h28M44 64h22" stroke="#98a6b8" stroke-width="4" stroke-linecap="round"/></svg>',
    magicTree: '<svg viewBox="0 0 520 360" aria-hidden="true"><rect x="0" y="0" width="520" height="360" rx="18" fill="#fff5cb"/><rect x="0" y="245" width="520" height="115" fill="#bde4be"/><circle cx="120" cy="128" r="62" fill="#76bd68"/><circle cx="170" cy="105" r="76" fill="#62ad58"/><circle cx="220" cy="136" r="64" fill="#83c875"/><rect x="160" y="160" width="38" height="108" rx="12" fill="#8b5c37"/><rect x="286" y="90" width="170" height="100" rx="10" fill="#fff8dd" stroke="#9a7543" stroke-width="5"/><path d="M316 125h110M316 153h84" stroke="#7a5c33" stroke-width="8" stroke-linecap="round"/><circle cx="92" cy="270" r="32" fill="#f1aa66"/><circle cx="84" cy="262" r="5" fill="#2c223f"/><circle cx="101" cy="262" r="5" fill="#2c223f"/><path d="M80 280c9 7 19 7 28 0" fill="none" stroke="#2c223f" stroke-width="4" stroke-linecap="round"/><path d="M314 68l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z" fill="#ffc536"/></svg>'
  };

  function el(id) {
    return document.getElementById(id);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/_/g, "blank"));
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  function showMessage(text, type) {
    const message = el("message");
    if (!message) return;
    message.textContent = text || "";
    message.className = "message" + (type ? " " + type : "");
  }

  function speakPopup(kind) {
    if (kind === "ok") {
      speak("Correct");
    } else if (kind === "bad") {
      speak("Try again");
    }
  }

  function closePopup(pop) {
    pop.classList.remove("show");
    setTimeout(() => pop.remove(), 220);
  }

  function spawnConfetti() {
    const colors = ["#f2a3bf", "#b8a5e0", "#7ed4b8", "#f0c97a", "#8ec5e8", "#ff6b8a", "#ffd13d", "#6bcf7f"];
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const w = Math.random() * 10 + 6;
      const h = Math.random() * 14 + 6;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.4;
      const duration = Math.random() * 0.8 + 1;
      const rotation = Math.random() * 720 - 360;
      const sway = Math.random() * 60 - 30;
      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.cssText = `
        left: ${left}%;
        width: ${w}px;
        height: ${h}px;
        background: ${color};
        border-radius: 2px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        --sway: ${sway}px;
      `;
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 4500);
  }

  function showAnswerBorder() {}

  function drawChromaKeyFrame(video, canvas, context) {
    if (video.readyState < 2 || !canvas.isConnected) return;
    if (video.videoWidth && video.videoHeight) {
      const maxCanvasEdge = 520;
      const scale = Math.min(1, maxCanvasEdge / video.videoWidth, maxCanvasEdge / video.videoHeight);
      const targetWidth = Math.max(1, Math.round(video.videoWidth * scale));
      const targetHeight = Math.max(1, Math.round(video.videoHeight * scale));
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const isGreenScreen = green > 82 && green > red * 1.18 && green > blue * 1.18;
      if (isGreenScreen) {
        const strength = Math.min(255, (green - Math.max(red, blue)) * 2.2);
        data[index + 3] = Math.max(0, 255 - strength);
        data[index + 1] = Math.max(0, green - strength * 0.45);
      }
    }

    context.putImageData(frame, 0, 0);
  }

  function showFinalCard(body) {
    document.querySelectorAll(".popout").forEach(item => item.remove());
    spawnConfetti();
    const pop = document.createElement("div");
    pop.className = "popout show final-popout";
    pop.innerHTML = `
      <div class="pop-card final-pop-card" role="dialog" aria-modal="true" aria-labelledby="finalTitle">
        <img src="../assets/images/mickeymouse-removebg-preview.png" alt="" class="final-mickey">
        <div class="final-copy">
          <p class="final-kicker">Wonderful work!</p>
          <h3 id="finalTitle">Congratulations!</h3>
          <p class="final-body">${body}</p>
        </div>
        <button class="final-replay" type="button">Play Again</button>
      </div>
    `;
    document.body.appendChild(pop);
    pop.querySelector(".final-replay").onclick = () => location.reload();
  }

  function showCompletionSequence(body) {
    if (state.completionRunning) return;
    state.completionRunning = true;
    clearTimeout(state.popupTimer);
    document.querySelectorAll(".popout, .walk-stage").forEach(item => item.remove());
    showFinalCard(body);
    state.popupTimer = setTimeout(() => {
      state.completionRunning = false;
    }, 4200);
  }

  function showPopup(kind, title, body) {
    clearTimeout(state.popupTimer);
    document.querySelectorAll(".popout").forEach(item => item.remove());
    speakPopup(kind);
    if (kind === "done") {
      showCompletionSequence(body);
      return;
    }
    showAnswerBorder(kind);
    const icon = kind === "ok" ? "&#10003;" : "&#10007;";
    const pop = document.createElement("div");
    pop.className = "popout show" + (kind === "bad" ? " pop-wrong" : "");
    pop.innerHTML = `<div class="pop-card${kind === "bad" ? " pop-wrong" : ""}"><span class="pop-icon">${icon}</span><h3>${title}</h3><p>${body}</p></div>`;
    document.body.appendChild(pop);
    state.popupTimer = setTimeout(() => closePopup(pop), 1150);
  }

  function finishIfReady() {
    const allAnswered = state.answered.length > 0 && state.answered.every(Boolean);
    const allMatched = config.type === "match" && config.pairs && state.matched.size === config.pairs.length;
    if (allAnswered || allMatched) {
      setTimeout(() => showPopup("done", "Great job!", "You completed this activity."), 1300);
    }
  }

  function setNav() {
    const prev = el("prevBtn");
    const next = el("nextBtn");
    if (!prev || !next) return;
    if (config.type === "match") {
      prev.disabled = state.current === 0;
      next.disabled = state.current >= config.pairs.length - 1 || !state.matched.has(state.current);
      return;
    }
    prev.disabled = state.current === 0;
    next.disabled = state.current === config.questions.length - 1 || !state.answered[state.current];
  }

  function optionColors(index) {
    return ["#f4c6d4", "#b8d8f0", "#b0dfc4", "#d0c4e8"][index % 4];
  }

  function escapeText(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function kindScene(name) {
    const scenes = {
      gift: `<svg viewBox="0 0 240 160" aria-hidden="true"><rect x="0" y="124" width="240" height="36" rx="18" fill="#dff6df"/><circle cx="72" cy="50" r="20" fill="#ffd19b"/><path d="M49 45c6-24 43-24 48 0-13-5-31-5-48 0z" fill="#4b2d20"/><rect x="52" y="72" width="40" height="46" rx="14" fill="#ff7b55"/><path d="M55 92h35" stroke="#fff0b8" stroke-width="7" stroke-linecap="round"/><circle cx="172" cy="50" r="20" fill="#ffd19b"/><path d="M150 48c8-25 44-22 48 2-17-6-32-5-48-2z" fill="#6b3f25"/><rect x="150" y="72" width="44" height="46" rx="14" fill="#59c6df"/><rect x="105" y="84" width="34" height="30" rx="5" fill="#ffba45"/><path d="M122 84v30M105 96h34" stroke="#ff5f6d" stroke-width="5"/><path d="M117 84c-14-15-28 0 5 0 24-16 35-1 0 0z" fill="none" stroke="#ff5f6d" stroke-width="5" stroke-linecap="round"/></svg>`,
      teacher: `<svg viewBox="0 0 240 160" aria-hidden="true"><rect x="0" y="124" width="240" height="36" rx="18" fill="#e4f2ff"/><rect x="40" y="22" width="88" height="68" rx="8" fill="#7fcf9b"/><path d="M55 42h44M55 60h28" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="168" cy="58" r="20" fill="#ffd19b"/><path d="M147 58c3-25 39-27 44-1-12-7-30-6-44 1z" fill="#734526"/><rect x="147" y="82" width="44" height="44" rx="14" fill="#ffcc57"/><path d="M139 86c-18-18-25-35-16-47" stroke="#ffcc57" stroke-width="9" stroke-linecap="round"/><circle cx="124" cy="38" r="5" fill="#ffd19b"/><rect x="142" y="122" width="56" height="10" rx="5" fill="#8d6b52"/></svg>`,
      sorryBall: `<svg viewBox="0 0 240 160" aria-hidden="true"><rect x="0" y="124" width="240" height="36" rx="18" fill="#fff1d5"/><circle cx="72" cy="54" r="19" fill="#ffd19b"/><path d="M51 52c4-22 38-25 43-2-14-6-28-5-43 2z" fill="#593621"/><rect x="52" y="76" width="42" height="45" rx="14" fill="#ff7b55"/><circle cx="160" cy="58" r="19" fill="#ffd19b"/><path d="M140 56c4-23 38-24 43-2-12-7-27-6-43 2z" fill="#6a432a"/><rect x="140" y="80" width="42" height="42" rx="14" fill="#61c7ea"/><circle cx="116" cy="112" r="16" fill="#ffcd4b"/><path d="M105 101l22 22M127 101l-22 22" stroke="#fff" stroke-width="5"/><path d="M98 86c14 12 25 13 38 0" stroke="#8b7bff" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
      bookPlease: `<svg viewBox="0 0 240 160" aria-hidden="true"><rect x="0" y="124" width="240" height="36" rx="18" fill="#edf7d7"/><rect x="94" y="82" width="52" height="38" rx="4" fill="#8b624a"/><path d="M100 88h40M100 100h34" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="58" r="19" fill="#ffd19b"/><path d="M49 56c5-24 39-24 43-2-13-5-27-5-43 2z" fill="#51321f"/><rect x="49" y="80" width="42" height="42" rx="14" fill="#60c5a8"/><path d="M91 89c18-9 35-8 50 0" stroke="#60c5a8" stroke-width="9" stroke-linecap="round"/><circle cx="176" cy="58" r="19" fill="#ffd19b"/><path d="M155 57c5-25 38-24 43-2-15-6-27-5-43 2z" fill="#6b3f25"/><rect x="155" y="80" width="42" height="42" rx="14" fill="#f59c53"/></svg>`,
      helloA: `<svg viewBox="0 0 240 190" aria-hidden="true"><rect x="0" y="148" width="240" height="42" rx="20" fill="#e6f8df"/><path d="M44 26h72a18 18 0 0 1 18 18v18a18 18 0 0 1-18 18H78l-20 20 7-20H44a18 18 0 0 1-18-18V44a18 18 0 0 1 18-18z" fill="#ffd97c"/><text x="79" y="58" text-anchor="middle" font-size="22" font-family="CCSYIntro" font-weight="700" fill="#4e405c">Hello</text><circle cx="72" cy="112" r="20" fill="#ffd19b"/><path d="M50 109c6-25 41-24 44-1-14-5-28-5-44 1z" fill="#302037"/><rect x="51" y="134" width="42" height="42" rx="14" fill="#ff7048"/><path d="M94 132c20-10 30-21 32-37" stroke="#ff7048" stroke-width="8" stroke-linecap="round"/><circle cx="154" cy="114" r="19" fill="#ffd19b"/><path d="M134 112c4-22 37-23 41-1-12-6-25-6-41 1z" fill="#533523"/><rect x="134" y="136" width="42" height="39" rx="14" fill="#52bce6"/></svg>`,
      helloB: `<svg viewBox="0 0 240 190" aria-hidden="true"><rect x="0" y="148" width="240" height="42" rx="20" fill="#e6f8df"/><path d="M88 24h76a18 18 0 0 1 18 18v20a18 18 0 0 1-18 18h-27l-20 19 6-19H88a18 18 0 0 1-18-18V42a18 18 0 0 1 18-18z" fill="#ffdc87"/><text x="126" y="58" text-anchor="middle" font-size="22" font-family="CCSYIntro" font-weight="700" fill="#4e405c">Hello</text><circle cx="80" cy="115" r="20" fill="#ffd19b"/><path d="M58 113c5-24 41-24 44-1-14-7-29-7-44 1z" fill="#543521"/><rect x="59" y="138" width="42" height="40" rx="14" fill="#58bee5"/><path d="M103 132c18 4 31 2 42-10" stroke="#58bee5" stroke-width="8" stroke-linecap="round"/><circle cx="164" cy="114" r="19" fill="#ffd19b"/><path d="M143 112c4-24 37-23 41-1-13-6-26-6-41 1z" fill="#33213a"/><rect x="144" y="137" width="40" height="40" rx="14" fill="#ff784f"/></svg>`,
      thankYou: `<svg viewBox="0 0 240 190" aria-hidden="true"><rect x="0" y="148" width="240" height="42" rx="20" fill="#e6f8df"/><path d="M83 16h84a18 18 0 0 1 18 18v34a18 18 0 0 1-18 18h-36l-22 20 7-20H83a18 18 0 0 1-18-18V34a18 18 0 0 1 18-18z" fill="#ffdc87"/><text x="126" y="46" text-anchor="middle" font-size="18" font-family="CCSYIntro" font-weight="700" fill="#4e405c">Thank</text><text x="126" y="66" text-anchor="middle" font-size="18" font-family="CCSYIntro" font-weight="700" fill="#4e405c">you</text><circle cx="110" cy="112" r="20" fill="#ffd19b"/><path d="M88 110c6-26 40-23 44 0-13-6-28-6-44 0z" fill="#6b4b2a"/><rect x="90" y="136" width="40" height="42" rx="14" fill="#78c96f"/><rect x="137" y="86" width="9" height="92" rx="4" fill="#8b624a"/><circle cx="164" cy="118" r="16" fill="#ffd19b"/><path d="M147 116c4-20 30-20 34-1-12-5-22-5-34 1z" fill="#3a2630"/><rect x="148" y="138" width="34" height="36" rx="12" fill="#ff8d57"/></svg>`,
      welcome: `<svg viewBox="0 0 240 190" aria-hidden="true"><rect x="0" y="148" width="240" height="42" rx="20" fill="#e6f8df"/><rect x="122" y="54" width="60" height="110" rx="6" fill="#8fc7e8"/><rect x="133" y="66" width="38" height="98" rx="4" fill="#fff2dc"/><path d="M70 28h94a22 22 0 0 1 22 22v44a22 22 0 0 1-22 22h-46l-28 25 9-25H70a22 22 0 0 1-22-22V50a22 22 0 0 1 22-22z" fill="#ffdc87"/><text x="117" y="66" text-anchor="middle" font-size="19" font-family="CCSYIntro" font-weight="700" fill="#4e405c">You</text><text x="117" y="88" text-anchor="middle" font-size="19" font-family="CCSYIntro" font-weight="700" fill="#4e405c">are</text><text x="117" y="110" text-anchor="middle" font-size="19" font-family="CCSYIntro" font-weight="700" fill="#4e405c">welcome</text><circle cx="100" cy="127" r="18" fill="#ffd19b"/><path d="M82 126c4-21 33-21 37 0-12-6-24-6-37 0z" fill="#2f2133"/><rect x="84" y="149" width="36" height="32" rx="12" fill="#ff7b55"/></svg>`
    };
    return scenes[name] || scenes.helloA;
  }

  function answerLabel(question) {
    if (typeof question.answer === "string") return question.answer;
    const option = question.options && question.options[question.answer];
    return typeof option === "string" ? option : option.text;
  }

  function normalizeAnswer(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function renderProgress() {
    const progress = el("progressDots");
    if (!progress) return;
    progress.innerHTML = config.questions.map((_, index) => {
      const dotNum = index + 1;
      const isActive = index === state.current;
      const isCompleted = state.answered[index] && !isActive;
      let cls = "progress-dot";
      cls += ` dot-${dotNum}`;
      if (isActive) cls += " active";
      if (isCompleted) cls += " completed";
      return `<span class="${cls}">${dotNum}</span>`;
    }).join("");
  }

  function renderChoose() {
    const question = config.questions[state.current];
    const pill = el("questionPill");
    if (pill) {
      pill.textContent = `Question ${state.current + 1} of ${config.questions.length}`;
      pill.className = `question-pill pill-${state.current + 1}`;
    }
    const questionCopy = el("questionCopy");
    if (questionCopy) {
      questionCopy.textContent = question.q;
      questionCopy.classList.toggle("question-wrap-left", Boolean(question.wrapLeft));
    }
    el("sceneCard").innerHTML = question.image
      ? `<img src="${question.image}" alt="${question.imageAlt || question.q}">`
      : (icons[question.scene || "magicTree"] || icons.magicTree);
    renderProgress();

    const options = el("chooseOptions");
    options.innerHTML = "";
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "big-option";
      button.style.setProperty("--option-color", optionColors(index));
      const optionArt = option.image
        ? `<img src="${option.image}" alt="">`
        : (icons[option.icon] || icons.stars);
      button.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-art">${optionArt}</span>
        <span class="option-text">${option.text}</span>
      `;
      button.onclick = () => chooseAnswer(index, button, options);
      if (state.answered[state.current]) {
        button.disabled = true;
        button.classList.add(index === question.answer ? "correct" : "disabled");
      }
      options.appendChild(button);
    });
    showMessage("", "");
    setNav();
  }

  function renderQuestionSet() {
    const question = config.questions[state.current];
    const area = el("oppositeArea");
    if (!area) return;

    const questionImg = question.questionImage
      ? `<img src="${question.questionImage}" alt="" class="opp-question-img">`
      : "";
    const wordList = config.words || config.questions.map(item => item.baseWord || "");
    const grid = config.grid || [];
    const answerText = typeof question.options[question.answer] === "string"
      ? question.options[question.answer]
      : question.options[question.answer].text;
    const shouldReveal = state.answered[state.current];
    const revealedPaths = config.questions
      .filter((_, index) => state.answered[index])
      .flatMap(item => item.answerPath || []);
    const isActiveCell = (rowIndex, colIndex) => revealedPaths.some(([row, col]) => row === rowIndex && col === colIndex);
    const isCurrentAnswerCell = (rowIndex, colIndex) => (question.answerPath || [])
      .some(([row, col]) => row === rowIndex && col === colIndex);
    const isWordDone = (word) => config.questions.some((item, index) => item.baseWord === word && state.answered[index]);

    area.innerHTML = `
      <div class="opp-layout">
        <aside class="opp-word-list-card" aria-label="Given words">
          <span class="opp-list-title">Words</span>
          ${wordList.map((word, index) => `
            <span class="opp-list-word${word === question.baseWord ? " active" : ""}${isWordDone(word) ? " done" : ""}">
              ${word}
            </span>
          `).join("")}
        </aside>

        <section class="opp-grid-card">
          <p class="opp-question-text">${question.q}</p>
          <div class="opp-letter-grid" aria-label="Opposite word grid">
            ${grid.map((row, rowIndex) => row.map((letter, colIndex) => `
              <button type="button" class="opp-letter-cell${isActiveCell(rowIndex, colIndex) ? " revealed" : ""}" data-row="${rowIndex}" data-col="${colIndex}" aria-label="Letter ${letter}">${letter}</button>
            `).join("")).join("")}
          </div>
        </section>

        <aside class="opp-reveal-card">
          <div class="opp-question-image-box">
            ${questionImg}
            <span class="opp-image-label">${question.baseWord || "Word"}</span>
          </div>
          <div class="opp-answer-reveal${shouldReveal ? " show" : ""}" id="oppAnswerReveal">
            ${shouldReveal && question.answerImage ? `
              <div class="opp-answer-content">
                <img src="${question.answerImage}" alt="" class="opp-answer-img">
                <span class="opp-answer-label">${answerText}</span>
              </div>
            ` : `<span class="opp-empty-state">Correct answer image appears here</span>`}
          </div>
        </aside>
      </div>
    `;

    state.selectedGridCells = [];
    state.gridDragging = false;
    state.gridPointerMoved = false;

    const clearGridSelection = () => {
      state.selectedGridCells = [];
      area.querySelectorAll(".opp-letter-cell.selected").forEach(cell => cell.classList.remove("selected"));
    };


    const addGridCell = (cell, shouldToggle = false) => {
      if (!cell || state.answered[state.current]) return;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (cell.classList.contains("revealed") && !isCurrentAnswerCell(row, col)) return;
      const key = `${cell.dataset.row},${cell.dataset.col}`;
      const selectedIndex = state.selectedGridCells.findIndex(item => item.key === key);
      if (selectedIndex !== -1) {
        if (shouldToggle) {
          state.selectedGridCells.splice(selectedIndex, 1);
          cell.classList.remove("selected", "selected-again", "wrong");
        }
        return;
      }
      state.selectedGridCells.push({
        key,
        row,
        col,
        letter: cell.textContent.trim()
      });
      cell.classList.add("selected");
    };

    const revealOppositeAnswer = () => {
      state.answered[state.current] = true;
      area.querySelectorAll(".opp-letter-cell.selected").forEach(cell => cell.classList.remove("selected"));
      const reveal = el("oppAnswerReveal");
      if (reveal && question.answerImage) {
        reveal.innerHTML = `
          <div class="opp-answer-content">
            <img src="${question.answerImage}" alt="" class="opp-answer-img">
            <span class="opp-answer-label">${answerText}</span>
          </div>
        `;
        reveal.classList.add("show");
      }
      (question.answerPath || []).forEach(([row, col]) => {
        const cell = area.querySelector(`.opp-letter-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
          cell.classList.remove("selected");
          cell.classList.add("revealed");
        }
      });
      showPopup("ok", "Correct!", question.success || "Correct answer.");
      setNav();
      finishIfReady();
    };

    const evaluateGridSelection = () => {
      if (!state.selectedGridCells.length || state.answered[state.current]) return;
      const selectedWord = state.selectedGridCells.map(cell => cell.letter).join("").toLowerCase();
      const reversedWord = state.selectedGridCells.map(cell => cell.letter).reverse().join("").toLowerCase();
      const targetWord = answerText.toLowerCase();
      if (state.selectedGridCells.length < targetWord.length) return;
      const selectedPath = state.selectedGridCells.map(cell => [cell.row, cell.col]);
      const targetPath = question.answerPath || [];
      const isConsecutivePath = selectedPath.every(([row, col], index) => {
        if (index === 0) return true;
        const [previousRow, previousCol] = selectedPath[index - 1];
        const rowStep = Math.abs(row - previousRow);
        const colStep = Math.abs(col - previousCol);
        return rowStep <= 1 && colStep <= 1 && (rowStep + colStep) > 0;
      });
      const sameAnswerCells = selectedPath.length === targetPath.length
        && targetPath.every(([row, col]) => selectedPath.some(([selectedRow, selectedCol]) => selectedRow === row && selectedCol === col));
      if (sameAnswerCells || ((selectedWord === targetWord || reversedWord === targetWord) && isConsecutivePath)) {
        revealOppositeAnswer();
      } else {
        area.querySelectorAll(".opp-letter-cell.selected").forEach(cell => cell.classList.add("wrong"));
        showPopup("bad", "Try again", "Select the opposite word letters beside each other.");
        setTimeout(() => {
          area.querySelectorAll(".opp-letter-cell.wrong").forEach(cell => cell.classList.remove("wrong"));
          clearGridSelection();
        }, 600);
      }
    };

    area.querySelectorAll(".opp-letter-cell").forEach(cell => {
      cell.onpointerdown = (event) => {
        event.preventDefault();
        state.gridDragging = true;
        state.gridPointerMoved = false;
        cell.setPointerCapture(event.pointerId);
        addGridCell(cell, true);
      };
      cell.onpointerenter = () => {
        if (state.gridDragging) {
          state.gridPointerMoved = true;
          addGridCell(cell);
        }
      };
      cell.onpointerup = () => {
        state.gridDragging = false;
        evaluateGridSelection();
      };
    });

    area.onpointermove = (event) => {
      if (!state.gridDragging) return;
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const cell = hit && hit.closest(".opp-letter-cell");
      if (cell && area.contains(cell)) {
        state.gridPointerMoved = true;
        addGridCell(cell);
      }
    };

    area.onpointerup = () => {
      if (state.gridDragging) {
        state.gridDragging = false;
        evaluateGridSelection();
      }
    };

    showMessage("", "");
    setNav();
  }

  function chooseAnswer(index, button, area) {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    if (index === question.answer) {
      state.answered[state.current] = true;
      [...area.children].forEach((item, itemIndex) => {
        item.disabled = true;
        item.classList.add(itemIndex === index ? "correct" : "disabled");
      });
      if (question.answerImage) {
        showAnswerImage(question.answerImage, question.options[index]);
      }
      showPopup("ok", "Correct!", question.success || "Correct answer.");
      setNav();
      finishIfReady();
    } else {
      button.classList.add("wrong");
      showPopup("bad", "Try again", "Choose another option.");
      setTimeout(() => button.classList.remove("wrong"), 500);
    }
  }

  function showAnswerImage(imageSrc, label) {
    const reveal = el("answerReveal");
    if (!reveal) return;
    reveal.innerHTML = `
      <div class="answer-reveal-content">
        <img src="${imageSrc}" alt="${label}" class="answer-reveal-img">
        <span class="answer-reveal-label">${label}</span>
      </div>
    `;
    reveal.classList.add("show");
  }

  function renderMatch() {
    const area = el("matchArea");
    if (!area) return;

    const currentIndex = Math.min(state.current, config.pairs.length - 1);
    state.current = currentIndex;
    const pair = config.pairs[currentIndex];
    const isCurrentMatched = state.matched.has(currentIndex);
    const wordImage = pair.wordImage
      ? `<img src="${pair.wordImage}" alt="" class="match-word-img">`
      : "";

    const meanings = config.pairs
      .map((p, i) => ({ ...p, originalIndex: i }))
      .sort((a, b) => a.order - b.order);

    area.innerHTML = `
      <div class="match-left question-change">
        <span class="match-round-badge">Question ${currentIndex + 1} of ${config.pairs.length}</span>
        <span class="match-word-label">Q${currentIndex + 1}. ${pair.word}</span>
        ${wordImage}
      </div>
      <div class="match-options-wrap">
        <div class="match-meanings-grid" id="meaningsGrid">
        ${meanings.map(m => {
          const mImg = m.meaningImage
            ? `<img src="${m.meaningImage}" alt="" class="match-meaning-img">`
            : "";
          const isCorrectChoice = isCurrentMatched && m.originalIndex === currentIndex;
          return `
            <button type="button" class="match-meaning-btn${isCorrectChoice ? " correct" : ""}" data-index="${m.originalIndex}" ${isCurrentMatched ? "disabled" : ""}>
              <span class="match-meaning-inner">
                ${mImg}
                <span class="match-meaning-text">${m.meaning}</span>
              </span>
            </button>
          `;
        }).join("")}
        </div>
      </div>
    `;

    area.querySelectorAll(".match-meaning-btn:not(.correct)").forEach(btn => {
      btn.onclick = () => {
        const chosenIndex = parseInt(btn.dataset.index);
        if (chosenIndex === currentIndex) {
          state.matched.add(currentIndex);
          btn.classList.add("correct");
          btn.disabled = true;
          area.querySelectorAll(".match-meaning-btn").forEach(item => item.disabled = true);
          showPopup("ok", "Correct!", `"${pair.word}" means "${pair.meaning}".`);
          setNav();
          finishIfReady();
        } else {
          btn.classList.add("wrong");
          showPopup("bad", "Try again", "That's not the right meaning.");
          setTimeout(() => btn.classList.remove("wrong"), 500);
        }
      };
    });

    showMessage("", "");
    setNav();
  }

  function renderWordChips(bank, answeredWord = "") {
    const reviewAnswer = normalizeAnswer(answeredWord);
    return bank.map(word => {
      const normalizedWord = normalizeAnswer(word);
      const matchingIndexes = config.questions
        .map((question, index) => normalizeAnswer(answerLabel(question)) === normalizedWord ? index : -1)
        .filter(index => index >= 0);
      const isUsed = config.type !== "fill" && matchingIndexes.length > 0 && matchingIndexes.every(index => state.answered[index]);
      const isAnsweredChip = reviewAnswer && normalizedWord === reviewAnswer;
      const isDisabled = Boolean(reviewAnswer) || isUsed;
      return `<button type="button" class="kind-chip${isUsed ? " used" : ""}${isAnsweredChip ? " answered selected" : state.selectedKindWord === word ? " selected" : ""}" draggable="${isDisabled ? "false" : "true"}" data-word="${escapeText(word)}" ${isDisabled ? "disabled" : ""}>${escapeText(word)}</button>`;
    }).join("");
  }

  function handleKindAnswer(index, word, area, expectedAnswer = "") {
    if (!word || state.answered[index]) return;
    if (config.type === "kind-bubbles") {
      const nextIndex = state.answered.findIndex(answered => !answered);
      if (index !== nextIndex) return;
    }
    const question = config.questions[index];
    const answer = expectedAnswer || answerLabel(question);
    if (normalizeAnswer(word) === normalizeAnswer(answer)) {
      state.answered[index] = true;
      state.selectedKindWord = null;
      showPopup("ok", "Correct!", question.success || `${answer} fits here.`);
      render();
      setNav();
      finishIfReady();
      return;
    }
    const target = area.querySelector(`[data-kind-index="${index}"]`);
    if (target) {
      target.classList.add("wrong");
      setTimeout(() => target.classList.remove("wrong"), 520);
    }
    showPopup("bad", "Try again", "Choose the kind word that fits this picture.");
  }

  function wireKindInteractions(area) {
    area.querySelectorAll(".kind-chip:not(.used)").forEach(chip => {
      chip.onclick = () => {
        state.selectedKindWord = chip.dataset.word;
        area.querySelectorAll(".kind-chip").forEach(item => item.classList.toggle("selected", item === chip));
        if (config.type === "fill") {
          handleKindAnswer(state.current, chip.dataset.word, area, answerLabel(config.questions[state.current]));
        } else if (config.type === "kind-bubbles") {
          const activeIndex = state.answered.findIndex(answered => !answered);
          if (activeIndex >= 0) {
            handleKindAnswer(activeIndex, chip.dataset.word, area, answerLabel(config.questions[activeIndex]));
          }
        }
      };
      chip.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", chip.dataset.word);
        state.selectedKindWord = chip.dataset.word;
      };
    });

    area.querySelectorAll("[data-kind-index]").forEach(target => {
      target.onclick = () => handleKindAnswer(parseInt(target.dataset.kindIndex), state.selectedKindWord, area, target.dataset.answer);
      target.ondragover = (event) => {
        if (!target.classList.contains("filled")) event.preventDefault();
      };
      target.ondrop = (event) => {
        event.preventDefault();
        handleKindAnswer(parseInt(target.dataset.kindIndex), event.dataTransfer.getData("text/plain"), area, target.dataset.answer);
      };
    });
  }

  function renderFillBlanks() {
    const area = el("fillBlanksArea");
    if (!area) return;
    const bank = config.wordBank || [];
    const question = config.questions[state.current];
    const answer = answerLabel(question);
    const isDone = state.answered[state.current];
    const questionVisual = question.image
      ? `<img src="${question.image}" alt="${question.imageAlt || "Question image"}" class="fill-hero-img">`
      : kindScene(question.scene);
    const textBefore = question.textBefore || "";
    const textAfter = question.textAfter || "";
    const blankButton = `
      <button type="button" class="fill-blank fill-main-blank inline-dash${isDone ? " filled" : ""}" aria-label="Fill blank" data-kind-index="${state.current}" data-answer="${escapeText(answer)}" ${isDone ? "disabled" : ""}>
        ${isDone ? escapeText(answer) : ""}
      </button>
    `;

    area.innerHTML = `
      <div class="kind-page fill-page single-fill-page">
        <article class="fill-question-panel${isDone ? " done" : ""}">
          <div class="fill-question-copy">
            <p class="fill-single-sentence inline-fill-sentence">
              <span class="fill-question-text inline-fill-text"><span class="fill-question-number">Q${state.current + 1}.</span>${textBefore ? `<span>${escapeText(textBefore)}</span>` : ""}${blankButton}<span>${escapeText(textAfter).trimStart()}</span></span>
            </p>
          </div>
          <div class="fill-hero">
            ${questionVisual}
          </div>
        </article>
        <div class="kind-word-bank" aria-label="Kind words">
          ${renderWordChips(bank, isDone ? answer : "")}
        </div>
      </div>
    `;

    wireKindInteractions(area);
    showMessage("", "");
    setNav();
  }

  function renderKindBubbles() {
    const area = el("kindBubblesArea");
    if (!area) return;
    const bank = config.wordBank || [];
    const activeIndex = state.answered.findIndex(answered => !answered);

    area.innerHTML = `
      <div class="kind-page bubble-page">
        <div class="kind-word-bank bubble-bank" aria-label="Kind words">
          ${renderWordChips(bank)}
        </div>
        <div class="bubble-scenes">
          ${config.questions.map((question, index) => {
            const answer = answerLabel(question);
            const isDone = state.answered[index];
            const isActive = index === activeIndex;
            const sceneArt = question.image
              ? `<img src="${question.image}" alt="${question.imageAlt || ""}" class="kind-scene-img">`
              : kindScene(question.scene);
            const bubbleClass = question.bubbleSide ? ` bubble-${question.bubbleSide}` : "";
            return `
              <article class="kind-scene-card${isDone ? " done" : ""}${isActive ? " active" : ""}">
                <div class="kind-scene-art">${sceneArt}</div>
                <button type="button" class="speech-drop${bubbleClass}${isDone ? " filled" : ""}${!isDone && !isActive ? " waiting" : ""}" data-kind-index="${index}" data-answer="${escapeText(answer)}" ${isDone || !isActive ? "disabled" : ""}>
                  ${isDone ? escapeText(answer) : "Fill the bubble"}
                </button>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;

    wireKindInteractions(area);
    showMessage("", "");
  }

  function wireNav() {
    const prev = el("prevBtn");
    const next = el("nextBtn");
    if (!prev || !next) return;
    prev.onclick = () => {
      if (state.current === 0) return;
      state.current--;
      state.selectedKindWord = null;
      render();
    };
    next.onclick = () => {
      if (config.type === "match") {
        if (state.current >= config.pairs.length - 1 || !state.matched.has(state.current)) return;
        state.current++;
        render();
        return;
      }
      if (state.current >= config.questions.length - 1 || !state.answered[state.current]) return;
      state.current++;
      state.selectedKindWord = null;
      render();
    };
  }

  function renderTransform() {
    const question = config.questions[state.current];
    const pill = el("questionPill");
    if (pill) {
      pill.textContent = `Question ${state.current + 1} of ${config.questions.length}`;
      pill.className = `question-pill pill-${state.current + 1}`;
    }
    renderProgress();

    const frame = document.querySelector(".transformer-frame");
    const suffixChoices = el("suffixChoices");
    const answer = pluralAnswer(question);
    const answeredTransform = state.answered[state.current];
    const imageMarkup = question.image
      ? `<img src="${question.image}" alt="${escapeText(question.singular)}">`
      : "";

    if (frame) {
      frame.className = "transformer-frame plural-typing-frame";
      const singularImageCard = `<div class="plural-image-card"><div class="plural-visual singular-visual">${imageMarkup}</div></div>`;
      const allPluralImages = Array.from({ length: 4 }, (_, index) => `<span class="plural-visual-item">${imageMarkup.replace(`alt="${escapeText(question.singular)}"`, `alt="${escapeText(question.singular)} ${index + 1}"`)}</span>`).join("");
      const pluralImageCard = `<div class="plural-image-card plural-images-card"><div class="plural-visual plural-visuals">${allPluralImages}</div></div>`;
      frame.innerHTML = `
        <article class="plural-side plural-singular">
          <span class="plural-side-label singular-label">Singular</span>
          ${singularImageCard}
          <div class="plural-word-label">${escapeText(question.singular)}</div>
        </article>
        <div class="plural-arrow" aria-hidden="true">
          <span></span>
        </div>
        <article class="plural-side plural-result">
          <span class="plural-side-label plural-label">Plural</span>
          ${pluralImageCard}
          <span class="plural-qmark">?</span>
        </article>
      `;
      let letterRow = el("pluralLetterRow");
      if (!letterRow) {
        letterRow = document.createElement("div");
        letterRow.id = "pluralLetterRow";
        letterRow.className = "plural-letter-row";
        frame.parentNode.insertBefore(letterRow, suffixChoices);
      }
      buildPluralCircles(answer, answeredTransform);
      window.setTimeout(() => {
        if (!answeredTransform) document.querySelector(".plural-letter-circle")?.focus();
      }, 80);
    }

    if (suffixChoices) suffixChoices.innerHTML = "";
    showMessage("", "");
    setNav();
  }

  function pluralAnswer(question) {
    const suffix = (question.suffixes?.[question.answer] || "").replace("+", "").trim();
    return `${question.singular}${suffix}`.trim();
  }

  function buildPluralCircles(answer, disabled) {
    const row = el("pluralLetterRow");
    if (!row) return;
    row.innerHTML = "";
    answer.split("").forEach((letter, index) => {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className = "plural-letter-circle";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.dataset.answer = letter.toLowerCase();
      input.disabled = disabled;
      if (disabled) {
        input.value = letter.toUpperCase();
        input.classList.add("correct");
      }
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
        if (input.value && index < answer.length - 1) row.children[index + 1]?.focus();
        checkPluralTyping();
      });
      input.addEventListener("keydown", event => {
        if (event.key === "Backspace" && !input.value && index > 0) {
          const previous = row.children[index - 1];
          if (previous && !previous.disabled) {
            previous.focus();
            previous.value = "";
          }
        }
      });
      input.addEventListener("paste", event => {
        event.preventDefault();
        const letters = (event.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/[^a-z]/gi, "")
          .toUpperCase()
          .split("");
        letters.forEach((char, offset) => {
          const target = row.children[index + offset];
          if (target && !target.disabled) target.value = char;
        });
        checkPluralTyping();
      });
      row.appendChild(input);
    });
  }

  function checkPluralTyping() {
    if (state.answered[state.current]) return;
    const answer = pluralAnswer(config.questions[state.current]).toLowerCase();
    const circles = [...document.querySelectorAll(".plural-letter-circle")];
    const value = circles.map(circle => circle.value.toLowerCase()).join("");
    if (value.length < answer.length) return;

    if (value === answer) {
      state.answered[state.current] = true;
      circles.forEach(circle => {
        circle.disabled = true;
        circle.classList.add("correct");
      });
      showPopup("ok", "Correct!", "Correct answer.");
      setNav();
      finishIfReady();
    } else {
      circles.forEach(circle => circle.classList.add("wrong"));
      showPopup("bad", "Try again", "Type the plural word.");
      setTimeout(() => {
        circles.forEach(circle => {
          circle.classList.remove("wrong");
          circle.value = "";
        });
        circles[0]?.focus();
      }, 700);
    }
  }

  function handleSuffix(index, btn, area, question) {
    if (state.answered[state.current]) return;
    if (index === question.answer) {
      state.answered[state.current] = true;
      const suffix = question.suffixes[index].replace("+ ", "");
      const pluralWord = el("pluralPreview");
      if (pluralWord) {
        pluralWord.textContent = question.singular + suffix;
        pluralWord.classList.add("answered");
      }
      const ruleBadge = el("ruleBadge");
      if (ruleBadge) ruleBadge.textContent = question.rule;

      [...area.children].forEach((item, itemIndex) => {
        item.disabled = true;
        item.classList.add(itemIndex === index ? "correct" : "disabled");
      });

      const pluralCard = document.querySelector(".plural-card");
      if (pluralCard) pluralCard.classList.add("revealed");

      showPopup("ok", "Correct!", question.success || "Correct answer.");
      setNav();
      finishIfReady();
    } else {
      btn.classList.add("wrong");
      showPopup("bad", "Try again", "Choose another suffix.");
      setTimeout(() => btn.classList.remove("wrong"), 500);
    }
  }

  function render() {
    if (config.type === "choose") renderChoose();
    else if (config.type === "match") renderMatch();
    else if (config.type === "transform") renderTransform();
    else if (config.type === "fill") renderFillBlanks();
    else if (config.type === "kind-bubbles") renderKindBubbles();
    else renderQuestionSet();
  }

  state.answered = Array((config.questions || []).length).fill(false);
  wireNav();
  render();
})();
