(function () {
  const STYLE_ID = "grade-answer-frame-style";
  const FRAME_CLASS = "grade-answer-frame";
  let lastKey = "";
  let lastAt = 0;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${FRAME_CLASS} {
        position: fixed;
        inset: 0;
        z-index: 15;
        pointer-events: none;
        box-sizing: border-box;
        border: 2px solid #10b981;
        border-radius: 8px;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45), 0 0 18px rgba(16,185,129,0.26);
        animation: gradeAnswerFramePulse 1.25s ease forwards;
        overflow: hidden;
      }
      .${FRAME_CLASS} .frame-paper {
        position: absolute;
        top: 8px;
        left: -5px;
        width: 10px;
        height: 14px;
        border-radius: 2px;
        background: #ffd166;
        box-shadow: 0 2px 5px rgba(0,0,0,0.18);
        animation: gradeAnswerPaperTrace 1.15s ease-in forwards;
        opacity: 0.95;
      }
      .${FRAME_CLASS}.wrong {
        border-color: #ef5350;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45), 0 0 18px rgba(239,83,80,0.26);
      }
      .${FRAME_CLASS}.wrong .frame-paper { background: #ff8f8f; }
      @keyframes gradeAnswerFramePulse {
        0% { opacity: 0; }
        16% { opacity: 1; }
        76% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes gradeAnswerPaperTrace {
        0% { transform: translateY(0) rotate(12deg); }
        100% { transform: translateY(calc(100vh - 28px)) rotate(192deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function showAnswerFrame() {}

  function typeFromNode(node) {
    if (!node || node.nodeType !== 1) return "";
    const classes = node.classList;
    if (classes.contains("kid-correct")) return "correct";
    if (classes.contains("kid-wrong")) return "wrong";
    if (classes.contains("feedback-popout")) {
      if (classes.contains("correct")) return "correct";
      if (classes.contains("wrong")) return "wrong";
    }
    if (classes.contains("popout") && classes.contains("show")) {
      if (classes.contains("pop-wrong")) return "wrong";
      if (!node.querySelector(".pop-help")) return "correct";
    }
    return "";
  }

  function inspect(node) {
    const type = typeFromNode(node);
    if (type) showAnswerFrame(type);
  }

  window.showAnswerFrame = showAnswerFrame;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === "attributes") {
        inspect(mutation.target);
      } else {
        mutation.addedNodes.forEach(inspect);
      }
    });
  });

  function startObserver() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  }
})();
