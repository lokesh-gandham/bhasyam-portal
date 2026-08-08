(function () {
  const config = window.lesson5Config;
  const fallbackImage = "../assets/images/lesson5/placeholder.svg";
  const state = {
    current: 0,
    answered: [],
    score: 0,
    selectedLetters: [],
    usedLetters: [],
    selectedMatch: null,
    matched: new Set(),
    animalIntro: true,
    crosswordComplete: false,
    crosswordLetters: {},
    selectedCrosswordWord: null,
    finalShown: false,
    popupTimer: null
  };

  const page = document.getElementById("lessonPage");
  const questionEl = document.getElementById("questionTitle");
  const imageWrap = document.getElementById("questionImageWrap");
  const optionsEl = document.getElementById("optionsArea");
  const messageEl = document.getElementById("message");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const layout = document.querySelector(".activity-layout");

  if (!config || !page) return;

  const questionCount = (config.questions || []).length;
  state.answered = Array(questionCount).fill(false);
  const pageModeClasses = ["word-page", "plural-page", "blank-page"];

  function setPageMode(mode) {
    page.classList.remove(...pageModeClasses);
    if (mode) page.classList.add(`${mode}-page`);
  }

  function img(src, alt) {
    const safeSrc = src || fallbackImage;
    const safeAlt = alt || "Picture";
    return `<img src="${safeSrc}" alt="${safeAlt}" onerror="this.onerror=null;this.src='${fallbackImage}';">`;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  function playSound(type) {
    const sound = document.getElementById(type === "correct" ? "correctSound" : "wrongSound");
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function announceFeedback(type) {
    playSound(type);
    speak(type === "correct" ? "Correct" : "Try again");
  }

  function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message" + (type ? " " + type : "");
  }

  function smallConfetti() {
    if (typeof confetti !== "function") return;
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  }

  function bigConfetti() {
    if (typeof confetti !== "function") return;
    confetti({ particleCount: 80, spread: 110, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } }), 200);
  }

  function confettiMarkup() {
    return Array.from({ length: 24 }, (_, index) => `<span style="--i:${index}"></span>`).join("");
  }

  function closePopup(popup) {
    if (!popup) return;
    popup.classList.remove("show");
    window.setTimeout(() => popup.remove(), 220);
  }

  function showPopup(type, title, body, voice, options = {}) {
    clearTimeout(state.popupTimer);
    document.querySelectorAll(".feedback-popout").forEach(item => item.remove());

    const popup = document.createElement("div");
    popup.className = `feedback-popout ${type}`;
    popup.innerHTML = `
      <div class="feedback-confetti" aria-hidden="true">${confettiMarkup()}</div>
      <div class="feedback-card" role="dialog" aria-live="assertive">
        <div class="feedback-badge">${type === "wrong" ? "!" : type === "final" ? "A+" : "OK"}</div>
        <h3>${title}</h3>
        ${body ? `<p>${body}</p>` : ""}
        ${type === "final" ? '<button class="playAgain-btn" type="button">Play again</button>' : ""}
      </div>
    `;
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add("show"));

    const playBtn = popup.querySelector(".playAgain-btn");
    if (playBtn) playBtn.onclick = () => location.reload();
    if (options.sticky) {
      if (options.closeOnOverlay) {
        popup.addEventListener("click", (e) => { if (e.target === popup) closePopup(popup); });
      }
    } else {
      state.popupTimer = window.setTimeout(() => closePopup(popup), options.duration || 1500);
    }
  }

  function showFeedback(type, message, voice) {
    const good = type === "correct";
    setMessage("", "");
    announceFeedback(good ? "correct" : "wrong");
    if (good) smallConfetti();
    showPopup(
      type,
      good ? "Correct!" : "Try again",
      "",
      voice || message,
      { duration: good ? 1450 : 1300 }
    );
  }

  function finalMessage() {
    const labels = {
      mcq: "Choose options",
      word: "Jumbled words",
      match: "Opposites",
      crossword: "Young ones",
      animal: "Young ones",
      plural: "Singular / plural",
      blank: "Fill in the blanks",
      paint: "Colour picture"
    };
    return `You completed ${labels[config.type] || "this activity"}.`;
  }

  function activityComplete() {
    if (config.type === "match") return state.matched.size === (config.pairs || []).length;
    if (config.type === "crossword") return state.crosswordComplete;
    if (config.type === "animal" && state.animalIntro) return false;
    return questionCount > 0 && state.answered.every(Boolean);
  }

  function showFinal(delay = 1600) {
    if (state.finalShown || !activityComplete()) return;
    state.finalShown = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    window.setTimeout(() => {
      bigConfetti();
      showPopup("final", "Great job!", finalMessage(), "", { sticky: true });
    }, delay);
  }

  function setCommon(question) {
    setPageMode("");
    if (layout) layout.className = "activity-layout question-enter";
    imageWrap.className = "question-media";
    imageWrap.removeAttribute("style");
    questionEl.textContent = question.q;
    imageWrap.innerHTML = img(question.img, question.q);
    setMessage("", "");
    prevBtn.disabled = state.current === 0;
    nextBtn.disabled = state.finalShown || state.current === questionCount - 1 || !state.answered[state.current];
  }

  function optionMarkup(option) {
    return `<span class="option-image">${img(option.img, option.text)}</span><span class="option-text">${option.text}</span>`;
  }

  function makeOption(option, index, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-card";
    button.innerHTML = optionMarkup(option);
    button.onclick = () => handler(index, button);
    return button;
  }

  function renderMcq() {
    const question = config.questions[state.current];
    setCommon(question);
    optionsEl.className = "options-grid";
    optionsEl.innerHTML = "";
    question.options.forEach((option, index) => {
      const button = makeOption(option, index, chooseOption);
      if (state.answered[state.current]) {
        button.disabled = true;
        button.classList.add(index === question.answer ? "correct" : "disabled");
      }
      optionsEl.appendChild(button);
    });
  }

  function chooseOption(index, button) {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    const cards = [...optionsEl.children];
    if (index === question.answer) {
      state.answered[state.current] = true;
      state.score++;
      cards.forEach((card, cardIndex) => {
        card.disabled = true;
        card.classList.add(cardIndex === index ? "correct" : "disabled");
      });
      showFeedback("correct", "Correct", "Correct");
      showFinal();
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    } else {
      button.classList.add("wrong");
      showFeedback("wrong", "Try again", "Try again");
      setTimeout(() => button.classList.remove("wrong"), 650);
    }
  }

  function renderWord() {
    const question = config.questions[state.current];
    setCommon(question);
    setPageMode("word");
    optionsEl.className = "word-area";
    optionsEl.innerHTML = `
      <div class="answer-slots" id="answerSlots"></div>
      <div class="letter-options" id="letterOptions"></div>
      <div class="controls">
        <button class="word-btn" id="clearBtn" type="button"><i class="fa-solid fa-rotate-left"></i> Clear</button>
      </div>
    `;

    state.selectedLetters = [];
    state.usedLetters = Array(question.options.length).fill(false);

    const slots = document.getElementById("answerSlots");
    const letterOptions = document.getElementById("letterOptions");

    for (let i = 0; i < question.answer.length; i++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "letter-slot";
      slot.onclick = () => removeLetter(i);
      slots.appendChild(slot);
    }

    question.options.forEach((option, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "word-tile";
      tile.textContent = option.text;
      tile.onclick = () => chooseLetter(index);
      letterOptions.appendChild(tile);
    });

    document.getElementById("clearBtn").onclick = clearWord;

    if (state.answered[state.current]) {
      fillSolvedWord();
      [...letterOptions.children].forEach(tile => tile.classList.add("used"));
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    }
  }

  function chooseLetter(index) {
    if (state.answered[state.current] || state.usedLetters[index]) return;
    const question = config.questions[state.current];
    if (state.selectedLetters.length >= question.answer.length) return;
    state.usedLetters[index] = true;
    state.selectedLetters.push(index);
    syncWord();
  }

  function removeLetter(slotIndex) {
    if (state.answered[state.current] || slotIndex >= state.selectedLetters.length) return;
    const letterIndex = state.selectedLetters[slotIndex];
    state.usedLetters[letterIndex] = false;
    state.selectedLetters.splice(slotIndex, 1);
    syncWord();
  }

  function clearWord() {
    if (state.answered[state.current]) return;
    state.selectedLetters = [];
    state.usedLetters = state.usedLetters.map(() => false);
    document.getElementById("answerSlots").classList.remove("wrong", "correct");
    syncWord();
    setMessage("", "");
  }

  function syncWord() {
    const question = config.questions[state.current];
    const slots = [...document.getElementById("answerSlots").children];
    const letterCards = [...document.getElementById("letterOptions").children];
    slots.forEach((slot, index) => {
      const selectedIndex = state.selectedLetters[index];
      slot.textContent = selectedIndex === undefined ? "" : question.options[selectedIndex].text;
      slot.classList.toggle("filled", selectedIndex !== undefined);
    });
    letterCards.forEach((card, index) => card.classList.toggle("used", state.usedLetters[index]));
    if (state.selectedLetters.length === question.answer.length && !state.answered[state.current]) {
      setTimeout(() => checkWord(), 400);
    }
  }

  function checkWord() {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    const answer = state.selectedLetters.map(index => question.options[index].text).join("");
    if (answer.toLowerCase() === question.answer.toLowerCase()) {
      state.answered[state.current] = true;
      state.score++;
      fillSolvedWord();
      showFeedback("correct", "Correct", "Correct");
      showFinal();
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    } else {
      const slots = document.getElementById("answerSlots");
      slots.classList.add("wrong");
      setTimeout(() => {
        slots.classList.remove("wrong");
        clearWord();
      }, 500);
        showFeedback("wrong", "Try again", "Try again");
    }
  }

  function fillSolvedWord() {
    const question = config.questions[state.current];
    const slotsContainer = document.getElementById("answerSlots");
    const slots = [...slotsContainer.children];
    const clearBtn = document.getElementById("clearBtn");
    const letterOptions = document.getElementById("letterOptions");
    const answerLetters = question.answer.split("");
    const letterMap = {};
    question.options.forEach((opt, i) => { letterMap[opt.text.toLowerCase()] = i; });
    slotsContainer.classList.add("correct");
    slots.forEach((slot, index) => {
      const letter = answerLetters[index].toLowerCase();
      const optIndex = letterMap[letter];
      const opt = optIndex !== undefined ? question.options[optIndex] : null;
      slot.textContent = opt ? opt.text : answerLetters[index];
      slot.classList.remove("filled");
      slot.classList.add("correct");
      slot.disabled = true;
    });
    if (clearBtn) clearBtn.disabled = true;
    if (letterOptions) {
      letterOptions.classList.add("solved");
      [...letterOptions.children].forEach(tile => {
        tile.disabled = true;
        tile.classList.add("used");
      });
    }
  }

  function renderMatch() {
    layout.className = "activity-layout full-board question-enter";
    imageWrap.className = "question-media";
    imageWrap.innerHTML = "";
    imageWrap.style.display = "none";
    questionEl.textContent = config.title || "Q1. Match the following.";
    optionsEl.className = "match-board";
    setMessage("", "");
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    const left = document.createElement("div");
    const right = document.createElement("div");
    left.className = "match-column";
    right.className = "match-column";

    function badgeMarkup(text, side, matched) {
      const color = side === "left" ? "#7c5cbf" : "#3d9bc0";
      const opacity = matched ? "0.55" : "1";
      return `<span class="match-badge" style="background:${color};color:#fff;opacity:${opacity};">${text}</span>`;
    }

    config.pairs.forEach((pair, index) => {
      const matched = state.matched.has(index);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "match-card";
      card.dataset.index = index;
      card.innerHTML = `${badgeMarkup(index + 1, "left", matched)}${img(pair.leftImg, pair.left)}`;
      card.onclick = () => selectLeft(card, index);
      if (matched) card.classList.add("correct");
      left.appendChild(card);
    });

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    config.pairs.map((pair, index) => ({ ...pair, index })).sort((a, b) => a.order - b.order).forEach((pair, sortedIndex) => {
      const matched = state.matched.has(pair.index);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "match-card";
      card.dataset.index = pair.index;
      card.innerHTML = `${badgeMarkup(letters[sortedIndex], "right", matched)}${img(pair.rightImg, pair.right)}`;
      card.onclick = () => selectRight(card, pair.index);
      if (matched) card.classList.add("correct");
      right.appendChild(card);
    });

    optionsEl.innerHTML = "";
    optionsEl.append(left, right);
    drawMatchLines();
    document.querySelector(".controls").style.display = "none";
  }

  function drawMatchLines() {
    const oldSvg = optionsEl.querySelector(".match-lines");
    if (oldSvg) oldSvg.remove();
    if (state.matched.size === 0) return;

    const boardRect = optionsEl.getBoundingClientRect();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("match-lines");

    const leftCards = [...optionsEl.querySelectorAll(".match-column:first-child .match-card")];
    const rightCards = [...optionsEl.querySelectorAll(".match-column:last-child .match-card")];

    state.matched.forEach(index => {
      const leftCard = leftCards[index];
      const rightCard = rightCards.find(c => parseInt(c.dataset.index) === index);
      if (!leftCard || !rightCard) return;

      const lr = leftCard.getBoundingClientRect();
      const rr = rightCard.getBoundingClientRect();

      const x1 = lr.right - boardRect.left;
      const y1 = lr.top + lr.height / 2 - boardRect.top;
      const x2 = rr.left - boardRect.left;
      const y2 = rr.top + rr.height / 2 - boardRect.top;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
      path.classList.add("match-line-path");
      svg.appendChild(path);

      const dot1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot1.setAttribute("cx", x1);
      dot1.setAttribute("cy", y1);
      dot1.setAttribute("r", 7);
      dot1.classList.add("match-line-dot");
      svg.appendChild(dot1);

      const dot2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot2.setAttribute("cx", x2);
      dot2.setAttribute("cy", y2);
      dot2.setAttribute("r", 7);
      dot2.classList.add("match-line-dot");
      svg.appendChild(dot2);
    });

    optionsEl.style.position = "relative";
    optionsEl.appendChild(svg);
  }

  function showMatchEmoji(emoji) {
    const old = document.querySelector(".match-emoji");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "match-emoji";
    el.textContent = emoji;
    optionsEl.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function selectLeft(card, index) {
    if (state.matched.has(index)) return;
    state.selectedMatch = index;
    document.querySelectorAll(".match-column:first-child .match-card").forEach(item => item.classList.remove("selected"));
    card.classList.add("selected");
  }

  function selectRight(card, index) {
    if (state.selectedMatch === null || state.matched.has(index)) return;
    if (state.selectedMatch === index) {
      state.matched.add(index);
      state.selectedMatch = null;
      renderMatch();
      showFeedback("correct", "Correct", "Correct");
      showMatchEmoji("?");
      smallConfetti();
      showFinal();
    } else {
      showFeedback("wrong", "Try again", "Try again");
      showMatchEmoji("?");
    }
  }

  function renderAnimal() {
    if (state.animalIntro) {
      layout.className = "activity-layout full-board question-enter";
      imageWrap.style.display = "none";
      questionEl.textContent = config.gridTitle || "Q1. Look at the animals and their young ones.";
      optionsEl.className = "animal-grid-wrap";
      optionsEl.innerHTML = `<div class="animal-grid">${config.grid.map(item => `
        <div class="animal-cell">
          ${img(item.img, item.animal)}
          <span>${item.animal}</span>
          <small>${item.young}</small>
        </div>`).join("")}</div>`;
      setMessage("Look at the grid, then tap next.", "");
      prevBtn.disabled = true;
      nextBtn.disabled = false;
      return;
    }
    const question = config.questions[state.current];
    layout.className = "activity-layout animal-question-layout question-enter";
    imageWrap.style.display = "flex";
    imageWrap.className = "question-media animal-hero";
    imageWrap.removeAttribute("style");
    questionEl.textContent = question.q;
    imageWrap.innerHTML = img(question.img, question.q);
    optionsEl.className = "options-grid";
    optionsEl.innerHTML = "";
    question.options.forEach((option, index) => {
      const button = makeOption(option, index, chooseOption);
      if (state.answered[state.current]) {
        button.disabled = true;
        button.classList.add(index === question.answer ? "correct" : "disabled");
      }
      optionsEl.appendChild(button);
    });
    setMessage("", "");
    prevBtn.disabled = state.current === 0;
    nextBtn.disabled = state.finalShown || state.current === questionCount - 1 || !state.answered[state.current];
  }

  function renderCrossword() {
    const words = config.words || [];
    const rows = config.rows || 7;
    const cols = config.cols || 10;
    const cells = new Map();
    if (!state.crosswordLetters || Array.isArray(state.crosswordLetters)) state.crosswordLetters = {};

    words.forEach((word, wordIndex) => {
      const given = new Set(word.given || []);
      word.answer.split("").forEach((letter, offset) => {
        const row = word.row + (word.dir === "down" ? offset : 0);
        const col = word.col + (word.dir === "across" ? offset : 0);
        const key = `${row}-${col}`;
        if (!cells.has(key)) {
          cells.set(key, { row, col, letter: letter.toLowerCase(), starts: [], startIndexes: [], words: [], given: false });
        }
        const cell = cells.get(key);
        cell.letter = letter.toLowerCase();
        cell.words.push(wordIndex);
        if (given.has(offset)) cell.given = true;
        if (offset === 0) {
          cell.starts.push(word.number);
          cell.startIndexes.push(wordIndex);
        }
      });
    });

    const fillableKeys = [...cells.entries()]
      .filter(([, cell]) => !cell.given)
      .map(([key]) => key);

    function cellKeyFor(word, offset) {
      const row = word.row + (word.dir === "down" ? offset : 0);
      const col = word.col + (word.dir === "across" ? offset : 0);
      return `${row}-${col}`;
    }

    function isWordSolved(word) {
      return word.answer.split("").every((letter, offset) => {
        const key = cellKeyFor(word, offset);
        return state.crosswordLetters[key] === letter.toLowerCase();
      });
    }

    layout.className = "activity-layout full-board question-enter";
    imageWrap.style.display = "none";
    questionEl.textContent = config.title || "Q1. Young ones crossword";
    optionsEl.className = "young-crossword";
    setMessage("", "");
    document.querySelector(".controls").style.display = "none";

    const grid = Array.from({ length: rows }, (_, row) => (
      Array.from({ length: cols }, (_, col) => {
        const cell = cells.get(`${row}-${col}`);
        if (!cell) return `<span class="cw-blank" aria-hidden="true"></span>`;
        const starts = cell.starts.map(num => `<span>${num}</span>`).join("");
        const key = `${row}-${col}`;
        const value = state.crosswordLetters[key] ? cell.letter.toUpperCase() : "";
        const solved = value ? " solved" : "";
        const given = cell.given ? " given" : "";
        const start = cell.startIndexes.length ? " start" : "";
        const fillable = !value && !cell.given ? " fillable" : "";
        return `
          <button class="cw-cell${solved}${given}${start}${fillable}" type="button"
            data-key="${key}" data-letter="${cell.letter}" data-words="${cell.words.join(",")}" data-starts="${cell.startIndexes.join(",")}">
            <span class="cw-number">${starts}</span>
            <span class="cw-letter">${value}</span>
          </button>`;
      }).join("")
    )).join("");

    function markerMarkup(marker) {
      return `
        <span class="cw-animal ${marker.className || ""}" title="${marker.label || ""}">
          ${marker.img ? `<img src="${marker.img}" alt="${marker.label || "Animal"}">` : ""}
        </span>`;
    }

    const markers = (config.markers || []).map(markerMarkup).join("");

    const clues = words.map((word, index) => `
      <li class="clue-item${isWordSolved(word) ? " solved" : ""}" data-clue="${index}">
        <strong>${word.number}.</strong> ${word.clue}
      </li>
    `).join("");

    const promptMarkup = config.prompt ? `<p class="crossword-prompt">${config.prompt}</p>` : "";

    optionsEl.innerHTML = `
      <section class="crossword-panel">
        ${promptMarkup}
        <div class="crossword-workspace">
          <div class="crossword-scene">
            <div class="crossword-stage">
              <div class="crossword-grid" style="grid-template-columns:repeat(${cols}, var(--cw-cell));grid-template-rows:repeat(${rows}, var(--cw-cell));">
                ${grid}
              </div>
              ${markers}
            </div>
          </div>
          <aside class="clue-box">
            <h3>clue box</h3>
            <ol>${clues}</ol>
          </aside>
        </div>
        <div class="crossword-actions">
          <button class="word-btn reset-crossword" id="resetCrosswordBtn" type="button"><i class="fa-solid fa-rotate-left"></i> Reset</button>
        </div>
      </section>`;

    const resetBtn = document.getElementById("resetCrosswordBtn");
    const crosswordCells = [...optionsEl.querySelectorAll(".cw-cell")];
    const clueItems = [...optionsEl.querySelectorAll(".clue-item")];
    const gridEl = optionsEl.querySelector(".crossword-grid");
    const stageEl = optionsEl.querySelector(".crossword-stage");
    resetBtn.disabled = state.crosswordComplete || state.finalShown;

    let activePopup = null;

    function closeActivePopup() {
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }
      clueItems.forEach(item => item.classList.remove("highlight"));
    }

    function completeIfReady() {
      if (fillableKeys.every(key => state.crosswordLetters[key])) {
        state.crosswordComplete = true;
        resetBtn.disabled = true;
        smallConfetti();
        showFinal(1600);
      }
    }

    function showLetterChoicePopup(key, cell, cellEl) {
      closeActivePopup();

      if (state.crosswordLetters[key] || cell.given) return;

      const correctLetter = cell.letter.toLowerCase();

      const allLetters = new Set();
      cell.words.forEach(wi => {
        words[wi].answer.split("").forEach(l => allLetters.add(l.toLowerCase()));
      });
      const wrongPool = [...allLetters].filter(l => l !== correctLetter);
      const fallbackAlpha = "abcdefghijklmnopqrstuvwxyz".split("").filter(l => l !== correctLetter);
      const pool = wrongPool.length > 0 ? wrongPool : fallbackAlpha;
      const wrongLetter = pool[Math.floor(Math.random() * pool.length)];

      const pair = [correctLetter, wrongLetter];
      for (let i = pair.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pair[i], pair[j]] = [pair[j], pair[i]];
      }

      const popup = document.createElement("div");
      popup.className = "letter-choice-popup";

      pair.forEach(letter => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "letter-choice-btn";
        btn.textContent = letter.toUpperCase();
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (letter === correctLetter) {
            state.crosswordLetters[key] = letter;
            closeActivePopup();

            const cwLetter = cellEl.querySelector(".cw-letter");
            if (cwLetter) cwLetter.textContent = letter.toUpperCase();
            cellEl.classList.add("solved");
            cellEl.classList.remove("fillable");

            let wordJustCompleted = false;
            cell.words.forEach(wi => {
              if (isWordSolved(words[wi])) {
                const ci = clueItems.find(c => Number(c.dataset.clue) === wi);
                if (ci) ci.classList.add("solved");
                if (!state._shownWords) state._shownWords = {};
                if (!state._shownWords[wi]) {
                  state._shownWords[wi] = true;
                  wordJustCompleted = true;
                }
              }
            });

            if (wordJustCompleted) {
              playSound("correct");
              speak("Correct");
              smallConfetti();
              showPopup("correct", "Correct!", "", "Correct", { duration: 1400 });
            }
            completeIfReady();
          } else {
            playSound("wrong");
            speak("Try again");
            showPopup("wrong", "Try again", "", "Try again", { duration: 1200 });
          }
        });
        popup.appendChild(btn);
      });

      const stageRect = (stageEl || gridEl).getBoundingClientRect();
      const cellRect = cellEl.getBoundingClientRect();
      const [, colValue] = key.split("-").map(Number);
      const openLeft = colValue >= cols - 3;
      popup.classList.toggle("popup-left", openLeft);
      popup.style.left = ((openLeft ? cellRect.left : cellRect.right) - stageRect.left) + "px";
      popup.style.top = (cellRect.top + cellRect.height / 2 - stageRect.top) + "px";

      (stageEl || gridEl).appendChild(popup);
      activePopup = popup;

      cell.words.forEach(wi => {
        const ci = clueItems.find(c => Number(c.dataset.clue) === wi);
        if (ci && !isWordSolved(words[wi])) ci.classList.add("highlight");
      });
    }

    crosswordCells.forEach(cell => {
      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state.crosswordComplete || state.finalShown) return;
        const key = cell.dataset.key;
        const cellData = cells.get(key);
        if (!cellData) return;
        if (state.crosswordLetters[key] || cellData.given) return;
        showLetterChoicePopup(key, cellData, cell);
      });
    });

    document.addEventListener("click", (e) => {
      if (activePopup && !activePopup.contains(e.target) && !e.target.closest(".cw-cell")) {
        closeActivePopup();
      }
    });

    resetBtn.onclick = () => {
      if (state.crosswordComplete || state.finalShown) return;
      state.crosswordComplete = false;
      state.crosswordLetters = {};
      state._shownWords = {};
      closeActivePopup();
      renderCrossword();
    };
  }

  function renderPlural() {
    const question = config.questions[state.current];
    setPageMode("plural");
    layout.className = "activity-layout full-board question-enter";
    imageWrap.style.display = "none";
   questionEl.innerHTML = ``;
questionEl.style.display = "none";
    const answer = pluralAnswer(question);
    const done = Boolean(state.answered[state.current]);
    optionsEl.className = "plural-typing";
    optionsEl.innerHTML = `
      <article class="plural-side plural-singular">
        <span class="card-label" style="background:linear-gradient(135deg,#f8d0dd,#f0a0b8);color:#fff;font-family:var(--heading-font);font-size:14px;font-weight:700;padding:4px 14px;border-radius:16px;text-transform:uppercase;letter-spacing:1px;align-self:center;flex-shrink:0;min-width:110px;text-align:center;">Singular</span>
        <div class="plural-visual singular-visual">${img(question.img, question.word)}</div>
        <div class="plural-word-label">${question.word}</div>
      </article>
      <div class="plural-arrow" aria-hidden="true">
        <img src="../assets/images/arrow-removebg-preview.png" alt="">
      </div>
      <article class="plural-side plural-result">
        <span class="card-label" style="background:linear-gradient(135deg,#b8e0f5,#8ec5e8);color:#fff;font-family:var(--heading-font);font-size:14px;font-weight:700;padding:4px 14px;border-radius:16px;text-transform:uppercase;letter-spacing:1px;align-self:center;flex-shrink:0;min-width:110px;text-align:center;">Plural</span>
        <div class="plural-visual plural-visuals">
          ${Array.from({ length: 4 }, (_, index) => `<span>${img(question.img, `${question.word} ${index + 1}`)}</span>`).join("")}
        </div>
        <span class="plural-qmark" style="font-size:40px;font-weight:bold;color:#2d2440;align-self:center;flex-shrink:0;">?</span>
      </article>
    `;
    let letterRow = document.getElementById("pluralLetterRow");
    if (!letterRow) {
      letterRow = document.createElement("div");
      letterRow.id = "pluralLetterRow";
      letterRow.className = "plural-letter-row";
      layout.parentNode.insertBefore(letterRow, messageEl);
    }
    buildPluralCircles(answer, done);
    setMessage("", "");
    prevBtn.disabled = state.current === 0;
    nextBtn.disabled = state.finalShown || state.current === questionCount - 1 || !done;

    window.setTimeout(() => {
      if (!done) document.querySelector(".plural-letter-circle")?.focus();
    }, 80);
  }

  function pluralAnswer(question) {
    return (question.options?.[question.answer]?.text || question.word || "").trim();
  }

  function buildPluralCircles(answer, disabled) {
    const row = document.getElementById("pluralLetterRow");
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
      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && index > 0) {
          const prev = row.children[index - 1];
          if (prev && !prev.disabled) {
            prev.focus();
            prev.value = "";
          }
        }
      });
      input.addEventListener("paste", (event) => {
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
    const question = config.questions[state.current];
    const answer = pluralAnswer(question).toLowerCase();
    const circles = [...document.querySelectorAll(".plural-letter-circle")];
    const value = circles.map(circle => circle.value.toLowerCase()).join("");
    if (value.length < answer.length) return;

    if (value === answer) {
      state.answered[state.current] = true;
      state.score++;
      circles.forEach(circle => {
        circle.disabled = true;
        circle.classList.add("correct");
      });
      showFeedback("correct", "Correct", "Correct");
      showFinal();
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    } else {
      circles.forEach(circle => circle.classList.add("wrong"));
      showFeedback("wrong", "Try again", "Try again");
      setTimeout(() => {
        circles.forEach(circle => {
          circle.classList.remove("wrong");
          circle.value = "";
        });
        circles[0]?.focus();
      }, 700);
    }
  }
  function renderBlank() {
    const question = config.questions[state.current];
    setCommon(question);
    setPageMode("blank");
    layout.className = "activity-layout full-board question-enter";
    imageWrap.style.display = "none";
    questionEl.textContent = "Fill in the blanks";
    optionsEl.className = "blank-area";

    if (question.answers) {
      state.blankSlots = state.blankSlots || {};
      if (!state.blankSlots[state.current]) {
        state.blankSlots[state.current] = new Array(question.answers.length).fill(null);
      }
      const parts = question.sentence.split("___");
      let sentence = parts[0];
      for (let i = 0; i < question.answers.length; i++) {
        sentence += `<span class="blank-slot" id="blankSlot${i}">___</span>`;
        sentence += parts[i + 1] || "";
      }
      optionsEl.innerHTML = `<div class="sentence-card">${sentence}</div><div class="blank-inline-media">${img(question.img, question.q)}</div><div class="word-bank" id="wordBank"></div>`;
      const bank = document.getElementById("wordBank");
      question.options.forEach((option, index) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "bank-tile";
        tile.innerHTML = `<span>${option.text}</span>`;
        tile.onclick = () => chooseBlankMulti(index, tile);
        if (state.answered[state.current] || state.blankSlots[state.current].includes(index)) {
          tile.disabled = true;
          tile.classList.add("used");
        }
        bank.appendChild(tile);
      });
      if (state.answered[state.current]) {
        for (let i = 0; i < question.answers.length; i++) {
          const slot = document.getElementById(`blankSlot${i}`);
          if (slot) slot.textContent = question.options[question.answers[i]].text;
        }
      }
    } else {
      const sentence = question.sentence.replace("___", `<span class="blank-slot" id="blankSlot">___</span>`);
      optionsEl.innerHTML = `<div class="sentence-card">${sentence}</div><div class="blank-inline-media">${img(question.img, question.q)}</div><div class="word-bank" id="wordBank"></div>`;
      const bank = document.getElementById("wordBank");
      question.options.forEach((option, index) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "bank-tile";
        tile.innerHTML = `<span>${option.text}</span>`;
        tile.onclick = () => chooseBlank(index, tile);
        if (state.answered[state.current]) {
          tile.disabled = true;
          tile.classList.add(index === question.answer ? "correct" : "disabled");
        }
        bank.appendChild(tile);
      });
      if (state.answered[state.current]) document.getElementById("blankSlot").textContent = question.options[question.answer].text;
    }
  }

  function chooseBlank(index, tile) {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    if (index === question.answer) {
      document.getElementById("blankSlot").textContent = question.options[index].text;
      state.answered[state.current] = true;
      state.score++;
      tile.classList.add("correct");
      [...document.getElementById("wordBank").children].forEach((item, itemIndex) => {
        item.disabled = true;
        if (itemIndex !== index) item.classList.add("disabled");
      });
      showFeedback("correct", "Correct", "Correct");
      showFinal();
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    } else {
      tile.classList.add("wrong");
      showFeedback("wrong", "Try again", "Try again");
      setTimeout(() => tile.classList.remove("wrong"), 650);
    }
  }

  function chooseBlankMulti(index, tile) {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    const slots = state.blankSlots[state.current];
    const emptyIndex = slots.indexOf(null);
    if (emptyIndex === -1) return;

    slots[emptyIndex] = index;
    tile.disabled = true;
    tile.classList.add("used");

    const slotEl = document.getElementById(`blankSlot${emptyIndex}`);
    if (slotEl) slotEl.textContent = question.options[index].text;

    if (!slots.includes(null)) {
      const allCorrect = slots.every((slotIdx, i) => slotIdx === question.answers[i]);
      if (allCorrect) {
        state.answered[state.current] = true;
        state.score++;
        [...document.getElementById("wordBank").children].forEach((t, tileIndex) => {
          t.disabled = true;
          t.classList.toggle("correct", question.answers.includes(tileIndex));
          t.classList.remove("used");
        });
        slots.forEach((slotIdx, i) => {
          const slot = document.getElementById(`blankSlot${i}`);
          if (slot) slot.classList.add("correct");
        });
        showFeedback("correct", "Correct", "Correct");
        showFinal();
        nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
      } else {
        const tiles = [...document.getElementById("wordBank").children];
        for (let i = 0; i < slots.length; i++) {
          const slot = document.getElementById(`blankSlot${i}`);
          const isCorrect = slots[i] === question.answers[i];
          if (slot) {
            slot.classList.toggle("correct", isCorrect);
            slot.classList.toggle("wrong", !isCorrect);
            if (!isCorrect) slot.textContent = "___";
          }
          const usedIdx = slots[i];
          if (usedIdx !== null && tiles[usedIdx]) {
            tiles[usedIdx].classList.toggle("correct", isCorrect);
            if (!isCorrect) {
              tiles[usedIdx].classList.remove("used");
              tiles[usedIdx].disabled = false;
            }
          }
          if (!isCorrect) slots[i] = null;
        }
        showFeedback("wrong", "Try again", "Try again");
        window.setTimeout(() => {
          document.querySelectorAll(".blank-slot.wrong").forEach(slot => slot.classList.remove("wrong"));
        }, 650);
      }
    }
  }

  function renderPaint() {
    const question = config.questions[state.current];
    layout.className = "activity-layout full-board question-enter";
    imageWrap.style.display = "none";
    questionEl.textContent = "Colour the picture with the right color.";
    optionsEl.className = "paint-layout";
    optionsEl.innerHTML = `
      <div class="picture-stage" id="paintStage">
        <div class="paint-wrap">
          <img class="paint-img" id="paintImage" src="${question.img}" alt="${question.q}" onerror="this.onerror=null;this.src='${fallbackImage}';">
        </div>
      </div>
      <div class="palette-board" id="paletteBoard"></div>
    `;
    const paintImage = document.getElementById("paintImage");
    const palette = document.getElementById("paletteBoard");
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "swatch-card";
      button.innerHTML = `<span class="swatch-dot" style="background:${option.color}"></span><span>${option.text}</span>`;
      button.onclick = () => choosePaint(index, button, paintImage);
      if (state.answered[state.current]) {
        button.disabled = true;
        button.classList.add(index === question.answer ? "correct" : "disabled");
        if (index === question.answer) paintImage.src = question.filledImg || question.img;
      }
      palette.appendChild(button);
    });
    setMessage("", "");
    prevBtn.disabled = state.current === 0;
    nextBtn.disabled = state.finalShown || state.current === questionCount - 1 || !state.answered[state.current];
  }

  function choosePaint(index, button, paintImage) {
    if (state.answered[state.current]) return;
    const question = config.questions[state.current];
    if (index === question.answer) {
      paintImage.src = question.filledImg || question.img;
      state.answered[state.current] = true;
      state.score++;
      [...document.getElementById("paletteBoard").children].forEach((item, itemIndex) => {
        item.disabled = true;
        item.classList.add(itemIndex === index ? "correct" : "disabled");
      });
      showFeedback("correct", "Correct", "Correct");
      showFinal();
      nextBtn.disabled = state.finalShown || state.current === questionCount - 1;
    } else {
      button.classList.add("wrong");
      showFeedback("wrong", "Try again", "Try again");
      setTimeout(() => button.classList.remove("wrong"), 650);
    }
  }

  function render() {
    imageWrap.style.display = "flex";
    if (config.type === "word") renderWord();
    else if (config.type === "match") renderMatch();
    else if (config.type === "crossword") renderCrossword();
    else if (config.type === "animal") renderAnimal();
    else if (config.type === "plural") renderPlural();
    else if (config.type === "blank") renderBlank();
    else if (config.type === "paint") renderPaint();
    else renderMcq();
  }

  prevBtn.onclick = () => {
    if (state.finalShown) return;
    if (config.type === "animal" && !state.animalIntro && state.current === 0) {
      state.animalIntro = true;
      render();
      return;
    }
    if (state.current === 0) return;
    state.current--;
    render();
  };

  nextBtn.onclick = () => {
    if (state.finalShown) return;
    if (config.type === "animal" && state.animalIntro) {
      state.animalIntro = false;
      render();
      return;
    }
    if (state.current >= questionCount - 1 || !state.answered[state.current]) return;
    state.current++;
    render();
  };

  render();
})();

