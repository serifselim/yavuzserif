"""Generate the senior full-stack résumé PDF."""

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

FONT_REG = r"C:\Windows\Fonts\calibri.ttf"
FONT_BOLD = r"C:\Windows\Fonts\calibrib.ttf"
FONT_ITALIC = r"C:\Windows\Fonts\calibrii.ttf"

pdfmetrics.registerFont(TTFont("Body", FONT_REG))
pdfmetrics.registerFont(TTFont("Body-Bold", FONT_BOLD))
pdfmetrics.registerFont(TTFont("Body-Italic", FONT_ITALIC))

DARK = HexColor("#151515")
PRIMARY = HexColor("#2f7d6b")
MUTED = HexColor("#626a73")
LINE = HexColor("#d8ded8")

OUTPUT = r"C:\Users\Serif\Documents\yavuzserif\src\assets\docs\resume.pdf"


def styles():
    return {
        "name": ParagraphStyle(
            "name",
            fontName="Body-Bold",
            fontSize=22,
            leading=26,
            textColor=DARK,
            spaceAfter=2,
        ),
        "title": ParagraphStyle(
            "title",
            fontName="Body-Bold",
            fontSize=12,
            leading=16,
            textColor=PRIMARY,
            spaceAfter=6,
        ),
        "contact": ParagraphStyle(
            "contact",
            fontName="Body",
            fontSize=9,
            leading=13,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "section",
            fontName="Body-Bold",
            fontSize=10.5,
            leading=14,
            textColor=PRIMARY,
            spaceBefore=10,
            spaceAfter=4,
            tracking=0.6,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Body",
            fontSize=9.5,
            leading=13,
            textColor=DARK,
            alignment=TA_LEFT,
        ),
        "job": ParagraphStyle(
            "job",
            fontName="Body-Bold",
            fontSize=11,
            leading=14,
            textColor=DARK,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontName="Body",
            fontSize=9,
            leading=12,
            textColor=MUTED,
        ),
        "meta_right": ParagraphStyle(
            "meta_right",
            fontName="Body",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Body",
            fontSize=9.5,
            leading=13,
            textColor=DARK,
            leftIndent=12,
            bulletIndent=0,
        ),
        "label": ParagraphStyle(
            "label",
            fontName="Body-Bold",
            fontSize=9,
            leading=13,
            textColor=DARK,
        ),
        "project": ParagraphStyle(
            "project",
            fontName="Body",
            fontSize=9.5,
            leading=13,
            textColor=DARK,
        ),
    }


def section_rule():
    return HRFlowable(
        width="100%",
        thickness=1,
        color=LINE,
        spaceBefore=1,
        spaceAfter=6,
    )


def skill_row(label, value, s):
    return [
        Paragraph(label, s["label"]),
        Paragraph(value, s["body"]),
    ]


def build():
    s = styles()
    story = []

    contact = (
        '<link href="mailto:yavuzserifoglu@gmail.com">yavuzserifoglu@gmail.com</link>'
        "  ·  +90 531 947 27 11  ·  Istanbul, Turkey<br/>"
        '<link href="https://www.linkedin.com/in/serifselim/">linkedin.com/in/serifselim</link>'
        "  ·  "
        '<link href="https://github.com/serifselim">github.com/serifselim</link>'
    )

    story.append(Paragraph("Yavuz Selim Şerifoğlu", s["name"]))
    story.append(
        Paragraph(
            "Senior Full Stack Developer  ·  React, Vue, NestJS, .NET Core, PostgreSQL",
            s["title"],
        )
    )
    story.append(Paragraph(contact, s["contact"]))
    story.append(Spacer(1, 8))
    story.append(
        HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=4)
    )

    story.append(Paragraph("SUMMARY", s["section"]))
    story.append(section_rule())
    story.append(
        Paragraph(
            "Communication design background, software since 2022. React and Vue "
            "on the client, NestJS and .NET Core on the API, PostgreSQL for data. "
            "Based in Istanbul.",
            s["body"],
        )
    )

    story.append(Paragraph("EXPERIENCE", s["section"]))
    story.append(section_rule())

    header = Table(
        [
            [
                Paragraph("Senior Full Stack Developer", s["job"]),
                Paragraph("2022 – Present", s["meta_right"]),
            ]
        ],
        colWidths=[125 * mm, 55 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    story.append(header)
    story.append(
        Paragraph("Intime Info Software Solves  ·  Istanbul, Turkey", s["meta"])
    )
    story.append(Spacer(1, 4))

    bullets = [
        "Vue and React UIs in production, with the REST APIs and PostgreSQL under them.",
        "NestJS and .NET Core: authentication, CRUD, wiring screens to real data.",
        "Figma to code, left in a shape another developer can continue.",
        "Responsive layout, keyboard use, and keeping pages reasonably fast.",
    ]
    for item in bullets:
        story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Paragraph("SKILLS", s["section"]))
    story.append(section_rule())
    skills = Table(
        [
            skill_row("Frontend", "React, Vue, TypeScript, JavaScript, HTML, CSS", s),
            skill_row("Backend", "NestJS, .NET Core, Node.js, REST APIs", s),
            skill_row("Data", "PostgreSQL, SQL", s),
            skill_row("Tools", "Git, Postman, Figma", s),
        ],
        colWidths=[28 * mm, 152 * mm],
    )
    skills.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    story.append(skills)

    story.append(Paragraph("PROJECTS", s["section"]))
    story.append(section_rule())
    projects = [
        "<b>Social feed</b>  ·  React, Redux, Context API. Login, a feed, layout that holds up on mobile.",
        "<b>Weather for Turkey</b>  ·  React, Redux. Pick a city on the map, see the forecast.",
        "<b>Typing practice</b>  ·  HTML, CSS, JavaScript. The letter lights up as you type.",
    ]
    for item in projects:
        story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Paragraph("EDUCATION", s["section"]))
    story.append(section_rule())
    edu = Table(
        [
            [
                Paragraph("Yıldız Technical University  ·  Communication Design", s["job"]),
                Paragraph("2018 – 2022", s["meta_right"]),
            ]
        ],
        colWidths=[125 * mm, 55 * mm],
    )
    edu.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(edu)

    story.append(Paragraph("LANGUAGES", s["section"]))
    story.append(section_rule())
    story.append(
        Paragraph("Turkish — Native    ·    English — B2", s["body"])
    )

    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Yavuz Selim Şerifoğlu — Senior Full Stack Developer",
        author="Yavuz Selim Şerifoğlu",
        subject="Résumé",
    )
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
