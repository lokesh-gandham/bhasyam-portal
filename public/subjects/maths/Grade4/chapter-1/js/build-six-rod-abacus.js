/* ============================================================
   1.2 Q2 (page 19) — build 490306 and 85430 in the place value
   tubes, then write their number names.
   ============================================================ */

/* Number names are typed by hand, so compare them loosely: case, commas,
   hyphens, the word "and" and doubled spaces should never fail a child. */
function capName(s) {
  s = String(s || "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function tidyName(s) {
  return s
    .toLowerCase()
    .replace(/[,\-]/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/\blakhs\b/g, "lakh")
    .replace(/\s+/g, " ")
    .trim();
}

const HOW_TO_PLAY =
  'Read "Make this number" from left to right. Each digit tells you how many blocks go in the tube below it. Tap or drag a block into its tube; tap a block inside a tube to take it out. When the tubes match, write the number name in words, then tap Check.';

const HINTS = [HOW_TO_PLAY, HOW_TO_PLAY];

function currentHintIndex() {
  const t = document.getElementById("q-count")?.textContent || "1";
  const m = t.match(/^(\d+)/);
  return m ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
}

function hideHintPopout() {
  const overlay = document.getElementById("b6a-hint-overlay");
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function showHintPopout(msg) {
  const overlay = document.getElementById("b6a-hint-overlay");
  const text = document.getElementById("b6a-hint-text");
  if (!overlay || !text) return;
  text.textContent = msg;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function openHint() {
  const msg = HINTS[currentHintIndex()] || HINTS[0];
  showHintPopout(msg);
}
window.openHint = openHint;

function targetRow(stage, target, built) {
  const row = document.createElement("div");
  row.className = "target-row";
  row.innerHTML = `
    <div class="target"><span class="lbl">Make this number</span><span class="num">${target}</span></div>
    <div class="built"><span class="lbl">You built</span><span class="num">${built}</span></div>`;
  stage.appendChild(row);
  const val = row.querySelector(".built .num");
  return {
    set(v) {
      val.textContent = v;
    },
  };
}

function buildAndNameQ(names, target, name) {
  const zeros = "0".repeat(names.length);
  let widget, out, nameField;

  function nameBox(stage, value, locked) {
    const wrap = document.createElement("div");
    wrap.className = "inline-answer";
    wrap.innerHTML = `
      <label>Number name</label>
      <textarea class="name-input" rows="1"
             placeholder="Write it in words" autocomplete="off" ${locked ? "disabled" : ""}>${value}</textarea>`;
    stage.appendChild(wrap);
    const field = wrap.querySelector(".name-input");
    Quiz.autoGrow(field);
    return field;
  }

  return {
    prompt: "",
    hint: "",
    render(stage, ready, saved) {
      const builtVal = saved ? saved.abacus : zeros;
      out = targetRow(stage, target, builtVal);
      widget = Quiz.tubes(stage, names, {
        counts: saved ? saved.abacus.split("").map(Number) : null,
        onChange: (v) => {
          out.set(v);
          ready();
        },
      });
      nameField = nameBox(stage, saved ? capName(saved.name) : "", !!saved);
      if (saved) return;
      nameField.addEventListener("input", () => {
        // Convert everything to lowercase
        let value = nameField.value.toLowerCase();

        // Capitalize only the first letter of the first word
        if (value.length > 0) {
          value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        nameField.value = value;
        Quiz.autoGrow(nameField);

        if (nameField.value.trim().length > 3) {
          ready();
        }
      });
    },
    renderLocked(stage, saved) {
      const abacusVal = saved
        ? saved.abacus
        : target.padStart(names.length, "0");
      out = targetRow(stage, target, abacusVal);
      Quiz.tubes(stage, names, {
        counts: abacusVal.split("").map(Number),
        editable: false,
      });
      nameBox(stage, capName(saved ? saved.name : name), true);
    },
    check() {
      const got = widget.value();
      if (+got !== +target)
        return { ok: false, msg: `Fill the tubes to make ${target} first.` };

      const nameOk = tidyName(nameField.value) === tidyName(name);
      if (!nameOk)
        return {
          ok: false,
          msg: `The tubes are correct. The number name is "${name}".`,
        };

      const pretty = capName(nameField.value);
      nameField.value = pretty;
      return {
        ok: true,
        answer: { abacus: got, name: pretty },
        msg: `Correct — ${target} is ${name}.`,
      };
    },
  };
}

Quiz.start({
  kicker: "Numbers up to Lakhs · Question 2",
  title: "Fill the place value tubes",
  questions: [
    buildAndNameQ(
      ["L", "TTh", "Th", "H", "T", "O"],
      "490306",
      "Four lakh ninety thousand three hundred six",
    ),
    buildAndNameQ(
      ["TTh", "Th", "H", "T", "O"],
      "85430",
      "Eighty five thousand four hundred thirty",
    ),
  ],
});

document.getElementById("b6a-hint").addEventListener("click", openHint);
document
  .getElementById("b6a-hint-close")
  .addEventListener("click", hideHintPopout);
document.getElementById("b6a-hint-overlay").addEventListener("click", (e) => {
  if (e.target.id === "b6a-hint-overlay") hideHintPopout();
});
