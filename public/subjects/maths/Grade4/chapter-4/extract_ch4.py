import os
import sys
import subprocess

pdf_path = r"c:\Users\LokeshGandam\Downloads\4-Math TB (Sem-1) 2026-27 1.pdf"
out_dir = r"C:\Users\LokeshGandam\OneDrive - RSHANU\Prem Kumar's files - 01_Development\Lokesh\maths--new--full-\chapter-4\_pdf_pages"
script_copy = r"C:\Users\LokeshGandam\OneDrive - RSHANU\Prem Kumar's files - 01_Development\Lokesh\maths--new--full-\chapter-4\extract_ch4.py"
os.makedirs(out_dir, exist_ok=True)

start_page = 22
end_page = 28
zoom = 2.0

try:
    import fitz
except ImportError:
    print("pymupdf missing, installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf"])
    import fitz

doc = fitz.open(pdf_path)
print("page_count", doc.page_count)
mat = fitz.Matrix(zoom, zoom)

for pno in range(start_page, end_page + 1):
    if pno < 1 or pno > doc.page_count:
        print("SKIP missing page", pno)
        continue
    page = doc[pno - 1]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_path = os.path.join(out_dir, "page_%02d.png" % pno)
    pix.save(img_path)
    text = page.get_text("text")
    txt_path = os.path.join(out_dir, "page_%02d.txt" % pno)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("RENDERED", img_path)
    print("TEXTFILE", txt_path)
    print("----- TEXT PAGE %d -----" % pno)
    print(text)
    print("----- END PAGE %d -----" % pno)

doc.close()

src = open(__file__, "r", encoding="utf-8").read()
with open(script_copy, "w", encoding="utf-8") as f:
    f.write(src)
print("COPIED_SCRIPT", script_copy)
print("DONE")
