(function () {
  const script = document.currentScript;
  const videoSrc = new URL("../grade1_lesson4/assets/images/finalpopoutvideo.mp4", script.src).href;
  const navButtonSelector = [
    "#prevBtn",
    "#nextBtn",
    ".controls > button.prev",
    ".controls > button.next",
    ".match-controls > button.prev",
    ".match-controls > button.next",
    ".mean-controls > button.prev",
    ".mean-controls > button.next",
    ".prof-controls > button.prev",
    ".prof-controls > button.next",
    ".control-row > .nav-btn.prev",
    ".control-row > .nav-btn.next",
    "button.nav-btn.prev",
    "button.nav-btn.next"
  ].join(",");
  let running = false;
  let afterWalkCallbacks = [];
  let blobVideoUrl = "";
  let navLocked = false;

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

  function finishWalk() {
    const callbacks = afterWalkCallbacks;
    afterWalkCallbacks = [];
    running = false;
    callbacks.forEach(callback => callback());
  }

  function showMickeyWalk(afterWalk) {
    if (typeof afterWalk === "function") afterWalkCallbacks.push(afterWalk);
    if (running) return;
    running = true;
    document.querySelectorAll(".shared-mickey-walk-stage").forEach(item => item.remove());

    const stage = document.createElement("div");
    stage.className = "shared-mickey-walk-stage";
    stage.innerHTML = `
      <svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
        <filter id="sharedMickeyGreenScreenKey" color-interpolation-filters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    1.8 -3.4 1.8 0 0.85" />
        </filter>
      </svg>
      <div class="shared-mickey-walking-character" aria-hidden="true">
        <video class="shared-mickey-walk-source" autoplay muted loop playsinline></video>
        <canvas class="shared-mickey-walk-canvas" width="360" height="360"></canvas>
      </div>
    `;
    document.body.appendChild(stage);

    const video = stage.querySelector(".shared-mickey-walk-source");
    const canvas = stage.querySelector(".shared-mickey-walk-canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let frameId = 0;
    let canPaint = Boolean(context);

    function showVideoFallback() {
      if (frameId) cancelAnimationFrame(frameId);
      canvas.replaceWith(video);
      video.className = "shared-mickey-walk-canvas shared-mickey-walk-video-fallback";
      video.style.opacity = "1";
      video.play().catch(() => {});
    }

    const paint = () => {
      if (!canPaint) return;
      try {
        drawChromaKeyFrame(video, canvas, context);
        frameId = requestAnimationFrame(paint);
      } catch (error) {
        canPaint = false;
        showVideoFallback();
      }
    };

    function startVideoWithSource(source) {
      video.src = source;
      if (!context) {
        showVideoFallback();
        return;
      }
      video.play().catch(showVideoFallback);
      paint();
    }

    if (blobVideoUrl) {
      startVideoWithSource(blobVideoUrl);
    } else {
      fetch(videoSrc)
        .then(response => response.ok ? response.blob() : Promise.reject())
        .then(blob => {
          blobVideoUrl = URL.createObjectURL(blob);
          startVideoWithSource(blobVideoUrl);
        })
        .catch(() => startVideoWithSource(videoSrc));
    }

    setTimeout(() => {
      if (frameId) cancelAnimationFrame(frameId);
      stage.classList.add("leaving");
      setTimeout(() => {
        stage.remove();
        finishWalk();
      }, 260);
    }, 3600);
  }

  function finalPopupConfetti() {
    if (typeof confetti !== "function") return;
    confetti({ particleCount: 80, spread: 110, origin: { y: 0.62 } });
    setTimeout(() => confetti({ particleCount: 40, spread: 75, origin: { y: 0.72 } }), 180);
  }

  function isFinalPopupActive(element) {
    const style = getComputedStyle(element);
    if (style.display === "none") return false;
    return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
  }

  function setFinalNavLock(locked) {
    navLocked = locked;
    document.body.classList.toggle("shared-mickey-nav-locked", locked);
    document.querySelectorAll(navButtonSelector).forEach((button) => {
      if (!("disabled" in button)) return;
      button.disabled = locked || button.disabled;
      button.setAttribute("aria-disabled", locked ? "true" : String(button.disabled));
    });
  }

  function checkFinalPopups() {
    let hasActiveFinalPopup = false;

    document.querySelectorAll("#finalPopup, .feedback-popout.final, .popout.final-popout").forEach((popup) => {
      if (!isFinalPopupActive(popup)) return;
      hasActiveFinalPopup = true;
      if (popup.dataset.mickeyWalkShown === "true") return;
      popup.dataset.mickeyWalkShown = "true";
      popup.classList.remove("shared-mickey-final-ready");
      popup.classList.add("shared-mickey-delayed-final");
      setFinalNavLock(true);
      showMickeyWalk(() => {
        popup.classList.remove("shared-mickey-delayed-final");
        popup.classList.add("shared-mickey-final-ready");
        finalPopupConfetti();
      });
    });

    if (hasActiveFinalPopup || running || navLocked) {
      setFinalNavLock(hasActiveFinalPopup || running || navLocked);
    }
  }

  function blockLockedNavClick(event) {
    if (!navLocked) return;
    const navButton = event.target.closest(navButtonSelector);
    if (!navButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function startObserver() {
    checkFinalPopups();
    document.addEventListener("click", blockLockedNavClick, true);
    const observer = new MutationObserver(checkFinalPopups);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      subtree: true
    });
    setInterval(checkFinalPopups, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }
})();
