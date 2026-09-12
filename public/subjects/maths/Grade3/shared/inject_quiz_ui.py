# Inject shared quiz UI assets into Grade 3 exercise HTML files.
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
EXERCISE_DIRS = list(ROOT.glob("Grade3_Lesson*/exercises"))

CSS_HREF = "../../shared/quiz-ui.css"
JS_SRC = "../../shared/quiz-ui.js"

LIVVIC = '<link href="https://fonts.googleapis.com/css2?family=Livvic:wght@400;500;600;700;900&display=swap" rel="stylesheet">'
FA = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">'
CONFETTI = '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>'
PRECONNECT = '<link rel="preconnect" href="https://fonts.googleapis.com">'

CSS_TAG = f'<link rel="stylesheet" href="{CSS_HREF}">'
JS_TAG = f'<script src="{JS_SRC}"></script>'


def ensure_head_asset(text: str, needle: str, tag: str) -> str:
    if needle in text:
        return text
    if re.search(r"</head>", text, re.I):
        return re.sub(r"</head>", tag + "\n</head>", text, count=1, flags=re.I)
    return tag + "\n" + text


def inject(text: str) -> str:
    if "shared/quiz-ui.css" not in text:
        text = ensure_head_asset(text, "shared/quiz-ui.css", CSS_TAG)
    if "shared/quiz-ui.js" not in text:
        if re.search(r"</body>", text, re.I):
            text = re.sub(r"</body>", JS_TAG + "\n</body>", text, count=1, flags=re.I)
        else:
            text += "\n" + JS_TAG

    if "fonts.googleapis.com" not in text or "Livvic" not in text:
        text = ensure_head_asset(text, "family=Livvic", LIVVIC)
    if "fonts.googleapis.com" in text and "preconnect" not in text:
        text = ensure_head_asset(text, "fonts.googleapis.com", PRECONNECT)

    if "font-awesome" not in text and "fontawesome" not in text.lower():
        text = ensure_head_asset(text, "font-awesome", FA)

    if "canvas-confetti" not in text:
        text = ensure_head_asset(text, "canvas-confetti", CONFETTI)

    # Standardize beep gain to the master 0.14 value
    text = re.sub(r"setValueAtTime\(\s*\.15\s*,", "setValueAtTime(0.14,", text)
    text = re.sub(r"setValueAtTime\(\s*0\.15\s*,", "setValueAtTime(0.14,", text)
    text = re.sub(r"setValueAtTime\(\s*0\.055\s*,", "setValueAtTime(0.14,", text)
    text = re.sub(r"setValueAtTime\(\s*0\.045\s*,", "setValueAtTime(0.14,", text)
    text = re.sub(r"setValueAtTime\(\s*0\.035\s*,", "setValueAtTime(0.14,", text)

    # Nav label/icon consistency (markup only)
    text = text.replace("← Previous", '<i class="fa-solid fa-chevron-left nav-icon"></i> Prev')
    text = text.replace("Next →", 'Next <i class="fa-solid fa-chevron-right nav-icon"></i>')
    text = text.replace("← Prev", '<i class="fa-solid fa-chevron-left nav-icon"></i> Prev')

    # predecessor/build-number text-only nav buttons
    text = re.sub(
        r'(<button class="nav-btn" id="prevBtn"[^>]*>)Prev(</button>)',
        r'\1<i class="fa-solid fa-chevron-left nav-icon"></i> Prev\2',
        text,
        count=1,
    )
    text = re.sub(
        r'(<button class="nav-btn" id="nextBtn"[^>]*>)Next(</button>)',
        r'\1Next <i class="fa-solid fa-chevron-right nav-icon"></i>\2',
        text,
        count=1,
    )

    return text


def patch_pattern_celebrate(text: str, path: Path) -> str:
    if path.name != "pattern.html":
        return text
    old = (
        "function celebrate() { const burst = $(\"burst\"); burst.innerHTML = \"\"; "
        "burst.classList.add(\"show\"); for (let i = 0; i < 25; i++) { const p = document.createElement(\"span\"); "
        "p.className = \"confetti\"; p.style.left = (45 + Math.random() * 10) + \"%\"; "
        "p.style.top = (35 + Math.random() * 10) + \"%\"; p.style.background = `hsl(${Math.random() * 360},80%,60%)`; "
        "p.style.setProperty(\"--x\", ((Math.random() - .5) * 600) + \"px\"); "
        "p.style.setProperty(\"--y\", (180 + Math.random() * 450) + \"px\"); burst.appendChild(p) } "
        "setTimeout(() => { burst.classList.remove(\"show\"); burst.innerHTML = \"\" }, 950) }"
    )
    new = (
        "function celebrate() { if (window.quizUiSfx) window.quizUiSfx.correct(); "
        "if (window.showCorrectEmoji) window.showCorrectEmoji(); "
        "if (window.burstConfetti) window.burstConfetti(document.querySelector(\".instruction\"), \"#7ed957\"); }"
    )
    if old in text:
        text = text.replace(old, new)
    # Play-again completion sound
    text = text.replace(
        "function showFinalPopup() {",
        "function showFinalPopup() { if (window.quizUiSfx) window.quizUiSfx.finish(); if (window.burstConfetti) { const m = document.querySelector(\"#finalOverlay .modal\"); window.burstConfetti(m, \"#ffd54f\"); setTimeout(() => window.burstConfetti(m, \"#4ecdc4\"), 400); setTimeout(() => window.burstConfetti(m, \"#ff9f45\"), 800); } ",
        1,
    )
    return text


def main():
    files = []
    for d in EXERCISE_DIRS:
        files.extend(sorted(d.glob("*.html")))
    files = [f for f in files if "deepseek" not in f.name.lower()]
    print(f"Found {len(files)} exercise files")
    for f in files:
        original = f.read_text(encoding="utf-8")
        updated = inject(original)
        updated = patch_pattern_celebrate(updated, f)
        if updated != original:
            f.write_text(updated, encoding="utf-8")
            print("updated", f.relative_to(ROOT))
        else:
            print("unchanged", f.relative_to(ROOT))


if __name__ == "__main__":
    main()
