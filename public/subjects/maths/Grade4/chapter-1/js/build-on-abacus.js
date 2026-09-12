/* ============================================================
   Launch Pad Q2 — build a number on the abacus.
   Questions for this exercise only; the shared engine is quiz.js.
   ============================================================ */
const NAMES = ['Th','H','T','O'];

function capName(s){
  s = String(s || '').trim();
  if(!s) return s;
  s = s.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* "Make this number" card beside a live "You built" card */
function targetRow(stage, target, built){
  const row = document.createElement('div');
  row.className = 'target-row';
  row.innerHTML = `
    <div class="target"><span class="lbl">Make this number</span><span class="num">${target}</span></div>
    <div class="built"><span class="lbl">You built</span><span class="num">${built}</span></div>`;
  stage.appendChild(row);
  const val = row.querySelector('.built .num');
  return { set(v){ val.textContent = v; } };
}

/* build the given number by putting beads on the rods AND write the number name */
function buildAndNameQ(target, choices, correct){
  let widget, out, nameField;

  /* Persist across retries within the same question: once a half (abacus
     or name) is correct it stays locked in, even after a wrong Check on
     the other half. These only get cleared by reset() on a full restart. */
  let abacusCorrect = false, nameCorrect = false;
  let lockedAbacusVal = null, lockedNameVal = null;

  return {
    prompt: 'Build the number shown, then write its name in words.',
    hint: 'How to play: tap a rod (Th, H, T, O) to add one bead, or tap the &minus; button under a rod to take one away. Match the "You built" number to the target. Then type the number in words and press Check.',
    retry: '',

    render(stage, ready, saved){
      const primaryBtn = document.getElementById('q-primary');

      /* The number to build is on screen at all times, next to a live
         read-out of what the child has built, so the question text never
         has to be re-read. */
      const builtVal = abacusCorrect ? lockedAbacusVal : '0000';
      out = targetRow(stage, target, builtVal);

      function refreshCheckState(){
        const hasAbacus = abacusCorrect || /[1-9]/.test(widget.value());
        const hasName   = nameCorrect || nameField.value.trim().length > 0;
        if(hasAbacus && hasName) ready();
        else if(primaryBtn) primaryBtn.disabled = true;
      }

      if(abacusCorrect){
        /* correct half: shown locked at its correct value, no interaction */
        widget = Quiz.abacus(stage, NAMES, { counts: lockedAbacusVal.split('').map(Number), editable:false });
      } else {
        widget = Quiz.abacus(stage, NAMES, {
          counts: null,
          onChange: v => { out.set(v); refreshCheckState(); }
        });
      }

      const nameWrap = document.createElement('div');
      nameWrap.className = 'inline-answer';
      const nameVal = nameCorrect ? lockedNameVal : '';
      const nameDisabled = nameCorrect ? 'disabled' : '';
      nameWrap.innerHTML = `
        <label>Number Name</label>
        <textarea class="name-input" rows="1" placeholder="Write it in words" autocomplete="off" ${nameDisabled}>${nameVal}</textarea>
      `;
      stage.appendChild(nameWrap);
      nameField = nameWrap.querySelector('.name-input');
      Quiz.autoGrow(nameField);

      if(!nameCorrect){
        nameField.addEventListener('input', () => {
          /* live capitalize: first letter of the whole string capital,
             everything else forced lowercase — cursor position preserved */
          const pos = nameField.selectionStart;
          const before = nameField.value;
          const hadTrailingSpace = /\s$/.test(before);
          let after = capName(before);
          if(hadTrailingSpace && !/\s$/.test(after)) after += ' ';
          if(after !== before){
            nameField.value = after;
            nameField.setSelectionRange(pos, pos);
          }
          Quiz.autoGrow(nameField);
          refreshCheckState();
        });
        nameField.addEventListener('keydown', e => { if(e.key === 'Enter') e.preventDefault(); });
      }

      /* set the correct initial Check-button state for this render
         (handles first load, and re-render after a partial-wrong retry) */
      refreshCheckState();
    },

    renderLocked(stage, saved){
      const abacusVal = saved ? saved.abacus : target;
      out = targetRow(stage, target, abacusVal);
      widget = Quiz.abacus(stage, NAMES, { counts: abacusVal.split('').map(Number), editable:false });

      const nameWrap = document.createElement('div');
      nameWrap.className = 'inline-answer';
      const nameVal = capName(saved ? saved.name : choices[correct]);
      nameWrap.innerHTML = `
        <label>Number Name</label>
        <textarea class="name-input" rows="1" disabled>${nameVal}</textarea>
      `;
      stage.appendChild(nameWrap);
      Quiz.autoGrow(nameWrap.querySelector('.name-input'));
    },

    check(){
      const currentAbacus = widget.value();
      if(!abacusCorrect && +currentAbacus === +target){
        abacusCorrect = true;
        lockedAbacusVal = currentAbacus;
      }

      const typedNow = nameCorrect ? lockedNameVal : nameField.value.trim();
      const correctName = choices[correct].toLowerCase();
      if(!nameCorrect && typedNow.toLowerCase() === correctName){
        nameCorrect = true;
        lockedNameVal = capName(nameField.value);
      }

      if(abacusCorrect && nameCorrect){
        return {
          ok: true,
          answer: { abacus: lockedAbacusVal, name: lockedNameVal },
          msg: `Correct — ${target} is ${choices[correct]}.`
        };
      }

      /* not fully correct: whichever half just matched is now locked in;
         the engine will clear/re-render, and our render() above will show
         the locked half fixed and the other half empty for another try,
         with Check disabled until both halves have something in them */
      if(!abacusCorrect && !nameCorrect){
        this.retry = 'Not quite — check both the abacus and the number name.';
      } else if(!abacusCorrect){
        this.retry = `The number name is correct and locked in. Now build ${target} on the abacus.`;
      } else {
        this.retry = `The abacus is correct and locked in. Try the number name again.`;
      }
      return { ok:false, msg:this.retry };
    },

    /* called on a full quiz restart (Play Again) so old lock state
       doesn't leak into the next attempt */
    reset(){
      abacusCorrect = false;
      nameCorrect = false;
      lockedAbacusVal = null;
      lockedNameVal = null;
    }
  };
}

/* ---- Local override: swap abacus interaction for this quiz only ----
   Tapping a rod now REMOVES a bead; the small button now ADDS a bead ("+").
   This reassigns Quiz.abacus AFTER quiz.js has run, so it only affects
   pages that load this file — quiz.js itself, and every other quiz using
   Quiz.abacus, are untouched. Everything else is copied unchanged from
   the original implementation. */
Quiz.abacus = function(stage, names, {counts = null, editable = true, onChange = null} = {}){
  const c = counts ? counts.slice() : names.map(() => 0);
  const wrap = document.createElement('div');
  wrap.className = 'abacus-wrap';

  const board = document.createElement('div');
  board.className = 'abacus';
  wrap.appendChild(board);

  function draw(){
    board.innerHTML = names.map((n, i) => `
      <${editable ? 'button' : 'div'} class="rod${c[i] ? ' on' : ''}" data-i="${i}"
        ${editable ? `aria-label="Remove a bead from the ${n} rod"` : ''}>
        <span class="stick">${'<span class="bead"></span>'.repeat(c[i])}</span>
      </${editable ? 'button' : 'div'}>`).join('');

    const base = wrap.querySelector('.abacus-base');
    if(base){
      base.innerHTML = names.map((n,i) => `<span class="base-label">${n}</span>`).join('');
    }
  }

  const base = document.createElement('div');
  base.className = 'abacus-base';
  base.innerHTML = names.map(n => `<span class="base-label">${n}</span>`).join('');
  wrap.appendChild(base);

  draw();

  if(editable){
    const row = document.createElement('div');
    row.className = 'rodrow';
    row.innerHTML = names.map((n, i) =>
      `<button class="rodbtn plus" data-i="${i}" aria-label="Add a bead to the ${n} rod">&plus;</button>`).join('');
    wrap.appendChild(row);

    const bump = (i, d) => {
      c[i] = Math.max(0, Math.min(9, c[i] + d));
      draw();
      if(onChange) onChange(c.join(''));
    };

    /* swapped: tapping a rod now removes a bead */
    board.addEventListener('click', e => {
      const r = e.target.closest('.rod');
      if(r) bump(+r.dataset.i, -1);
    });
    /* swapped: the small button now adds a bead */
    row.addEventListener('click', e => {
      const b = e.target.closest('.rodbtn');
      if(b) bump(+b.dataset.i, 1);
    });
  }

  stage.appendChild(wrap);
  return { value: () => c.join(''), counts: c };
};

const QUESTIONS = [
  buildAndNameQ('3786', [
    'Three thousand seven hundred eighty six',
    'Three thousand seven hundred sixty eight',
    'Thirty seven thousand eighty six'
  ], 0),
  buildAndNameQ('5092', [
    'Five thousand nine hundred two',
    'Five thousand ninety two',
    'Fifty thousand ninety two'
  ], 1)
];

/* clear each question's lock state whenever the quiz is restarted, since
   Play Again reuses these same question objects instead of recreating
   them — without this, a locked-correct half would wrongly carry over
   into the next attempt */
document.addEventListener('click', e => {
  if(e.target.closest('#q-again') || e.target.closest('#popup-again')){
    QUESTIONS.forEach(q => q.reset && q.reset());
  }
});

Quiz.start({
  kicker: 'Launch Pad · Question 2',
  title: 'Build it on the abacus',
  questions: QUESTIONS
});