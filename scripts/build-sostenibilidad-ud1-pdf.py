"""Generate the UD1 handout from the same Markdown used by the lesson.

Optional authoring dependency: python -m pip install reportlab
Run from any directory: python scripts/build-sostenibilidad-ud1-pdf.py
The generated PDF is committed; the website build does not require Python.
"""

from html import escape
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/content/sessions/sostenibilidad/ud1-que-significa-que-una-empresa-sea-sostenible.md"
OUTPUT = ROOT / "public/teaching/sostenibilidad/pixelstore-ud1.pdf"
TEXT = SOURCE.read_text(encoding="utf-8")
INK = colors.HexColor("#243744")
ACCENT = colors.HexColor("#9c432e")
PALE = colors.HexColor("#f4f1eb")
WIDTH = A4[0] - 36 * mm
STYLES = getSampleStyleSheet()
STYLES.add(ParagraphStyle(
    "Body", fontName="Helvetica", fontSize=10, leading=14,
    textColor=INK, spaceAfter=9,
))
STYLES.add(ParagraphStyle(
    "Heading", parent=STYLES["Body"], fontName="Helvetica-Bold",
    fontSize=21, leading=25, spaceAfter=16,
))
STYLES.add(ParagraphStyle(
    "Kicker", parent=STYLES["Body"], fontName="Helvetica-Bold",
    fontSize=9, textColor=ACCENT, spaceAfter=10,
))
STYLES.add(ParagraphStyle(
    "Cell", parent=STYLES["Body"], fontSize=9, leading=12, spaceAfter=0,
))


def inline(text):
    text = escape(text)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


def section(title):
    """Read one named level-four section, stopping before any next heading."""
    marker = f"#### {title}\n"
    if TEXT.count(marker) != 1:
        raise ValueError(f"Expected exactly one section: {title}")
    body = TEXT.split(marker, 1)[1]
    return re.split(r"\n(?:#{2,4} |</details>)", body, maxsplit=1)[0].strip()


def markdown(body, worksheet=False):
    result = []
    for block in body.split("\n\n"):
        lines = block.splitlines()
        if block.startswith("|"):
            rows = [
                [Paragraph(inline(cell.strip()), STYLES["Cell"])
                 for cell in line.strip().strip("|").split("|")]
                for line in lines
                if not re.fullmatch(r"[| :\-]+", line)
            ]
            widths = ([0.23, 0.14, 0.63] if len(rows[0]) == 3
                      else [0.16, 0.37, 0.25, 0.22])
            table = Table(
                rows, colWidths=[WIDTH * w for w in widths],
                rowHeights=([None] + [24 * mm] * (len(rows) - 1)) if worksheet else None,
                repeatRows=1, hAlign="LEFT",
            )
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), PALE),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#c8c5bf")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]))
            result.extend([table, Spacer(1, 10)])
        elif block.startswith("- ") or re.match(r"\d+\. ", block):
            for line in lines:
                paragraph = Paragraph(inline(line.removeprefix("- ")), STYLES["Body"])
                result.append(KeepTogether([paragraph, Spacer(1, 24)]) if worksheet else paragraph)
        else:
            result.append(Paragraph(inline(" ".join(lines)), STYLES["Body"]))
    return result


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#c8c5bf"))
    canvas.line(18 * mm, 17 * mm, A4[0] - 18 * mm, 17 * mm)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(18 * mm, 12 * mm, "Marc Semper Lloret · Sostenibilidad · UD1 · Datos ficticios")
    canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, str(doc.page))
    canvas.restoreState()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=18 * mm, bottomMargin=23 * mm,
        title="PixelStore · Sostenibilidad · UD1 · Caso y hoja de decisión",
        author="Marc Semper Lloret", lang="es", pageCompression=1,
    )
    story = []
    pages = [
        ("SESIÓN 1 · DOSSIER", "Dossier · los datos de PixelStore", False),
        ("SESIÓN 1 · DECISIÓN", "Las propuestas · presupuesto de 3.000 €", False),
        ("SESIÓN 1 · ENTREGA", "Plantilla · hoja de decisión", True),
        ("SESIONES 3 Y 4 · MATERIAL DE CONTINUIDAD", "Afirmaciones de dirección", False),
    ]
    for index, (label, title, worksheet) in enumerate(pages):
        if index:
            story.append(PageBreak())
        story.append(Paragraph(label, STYLES["Kicker"]))
        story.append(Paragraph(inline(title), STYLES["Heading"]))
        story.extend(markdown(section(title), worksheet))
        if index == 1:
            story.append(Spacer(1, 10))
            story.append(Paragraph("Secuencia de trabajo · 45 minutos", STYLES["Kicker"]))
            for step in [
                "10 min · Relaciona tres hechos con sus impactos, personas afectadas y dimensiones ASG.",
                "8 min · Comprueba el 75 % de F1. En F3 calcula kg de embalaje y porcentaje de envíos dañados antes y después. Explica el límite de la comparación.",
                "12 min · Elige la inversión, compárala con otra combinación viable y revisa el mensaje de F6.",
                "10 min · Formula una objeción desde la perspectiva de una persona afectada y revisa tu decisión.",
                "5 min · Guarda la hoja. Después, en el cierre individual, explica tu decisión, el hecho que la respalda y qué información te haría cambiarla.",
            ]:
                story.append(Paragraph(step, STYLES["Body"]))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    if doc.page != len(pages):
        raise ValueError("The handout must have four pages: later lessons refer to page 4.")
    print(OUTPUT)


if __name__ == "__main__":
    main()
