# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

SHARED_CSS = """
/* LESSON1-SHARED-FEEDBACK-POPUP — match exercise/numeral.html */
.feedback{
    position:absolute;
    top:50%;
    left:50%;
    z-index:100;
    width:min(440px,88vw) !important;
    min-height:215px !important;
    padding:26px 30px 28px !important;
    border-radius:30px !important;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:10px !important;
    text-align:center;
    opacity:0;
    pointer-events:none;
    transform:translate(-50%,-50%) scale(.7) rotate(-4deg);
    transition:.28s cubic-bezier(.2,.9,.25,1.25);
    box-shadow:0 20px 50px rgba(32,57,57,.22);
}
.feedback.show{
    opacity:1;
    transform:translate(-50%,-50%) scale(1) rotate(0);
}
.feedback.correct-popup,
.correct-popup{
    background:linear-gradient(135deg,#e2f6e9,#f4fcf6) !important;
    border:5px solid #16834f !important;
}
.feedback.wrong-popup,
.wrong-popup{
    background:linear-gradient(135deg,#fde6e2,#fff7f5) !important;
    border:5px solid #c94740 !important;
}
.feedback-icon{
    width:68px !important;
    height:68px !important;
    flex:0 0 68px !important;
    border-radius:24px 24px 24px 8px !important;
    display:grid;
    place-items:center;
    color:#fff !important;
    font-size:36px !important;
    margin-bottom:0 !important;
    box-shadow:0 5px 0 rgba(0,0,0,.08);
}
.correct-popup .feedback-icon{background:#16834f !important}
.wrong-popup .feedback-icon{background:#c94740 !important}
.feedback-copy{text-align:center}
.feedback h3,
.feedback-copy h3{
    font-size:28px !important;
    font-weight:600 !important;
    margin-bottom:3px !important;
    color:#2f4f4f;
}
.feedback p,
.feedback-copy p{
    font-size:17px !important;
    color:#607878 !important;
}
@media(max-width:560px){
    .feedback{
        width:min(380px,90vw) !important;
        min-height:190px !important;
        padding:22px 18px !important;
        gap:15px !important;
    }
    .feedback-icon{
        width:62px !important;
        height:62px !important;
        flex-basis:62px !important;
        font-size:31px !important;
    }
    .feedback h3,
    .feedback-copy h3{font-size:23px !important}
    .feedback p,
    .feedback-copy p{font-size:15px !important}
}
"""

CONFETTI_SCRIPT = (
    '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>'
)

FUNCS = """
function smallConfetti() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
    }
}
function bigConfetti() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
    }
}
"""

SHOW_RE = re.compile(
    r"(?P<full>(?P<var>correctPopup|\bcorrect|wrongPopup|\bwrong)\.classList\.add\(\s*[\"']show[\"']\s*\)"
    r"|(?P<var2>correctPopup|\bcorrect|wrongPopup|\bwrong)\.classList\.add\(\s*\n[ \t]*[\"']show[\"']\s*\n[ \t]*\))"
)


def inject_css(text: str) -> str:
    if "LESSON1-SHARED-FEEDBACK-POPUP" in text:
        return text
    idx = text.lower().rfind("</style>")
    if idx == -1:
        return text
    return text[:idx] + SHARED_CSS + text[idx:]


def inject_confetti_tag(text: str) -> str:
    if "canvas-confetti" in text:
        return text
    idx = text.lower().rfind("</body>")
    if idx == -1:
        return text
    return text[:idx] + CONFETTI_SCRIPT + "\n" + text[idx:]


def inject_funcs(text: str) -> str:
    if "function smallConfetti" in text:
        return text
    m = re.search(r"<script(?![^>]*\bsrc\b)[^>]*>", text, re.I)
    if not m:
        return text
    return text[: m.end()] + FUNCS + text[m.end() :]


def inject_calls(text: str) -> str:
    matches = list(SHOW_RE.finditer(text))
    for m in reversed(matches):
        var = m.group("var") or m.group("var2")
        fn = "smallConfetti" if var in ("correctPopup", "correct") else "bigConfetti"
        after = text[m.end() : m.end() + 80]
        if fn in after[:60]:
            continue
        j = m.end()
        k = j
        while k < len(text) and text[k] in " \t":
            k += 1
        if k < len(text) and text[k] == ";":
            text = text[: k + 1] + f" {fn}();" + text[k + 1 :]
        else:
            text = text[:j] + f"; {fn}();" + text[j:]
    return text


def process(path: Path) -> None:
    original = path.read_text(encoding="utf-8")
    text = original
    text = inject_css(text)
    text = inject_funcs(text)
    text = inject_calls(text)
    text = inject_confetti_tag(text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"updated: {path.name}")
    else:
        print(f"unchanged: {path.name}")


def main():
    for path in sorted(ROOT.glob("*.html")):
        process(path)


if __name__ == "__main__":
    main()
