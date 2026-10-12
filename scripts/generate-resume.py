"""Generate the senior frontend résumé PDF."""

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
            "Senior Frontend Developer  ·  Vue, React, React Native, TypeScript, UI Architecture",
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
            "Communication design background, software since 2022. Specializing in frontend "
            "architecture, Vue and React ecosystems, cross-platform mobile apps, and robust "
            "API integrations. Based in Istanbul.",
            s["body"],
        )
    )

    story.append(Paragraph("EXPERIENCE", s["section"]))
    story.append(section_rule())

    # Position 1: Frontend Team Lead
    header1 = Table(
        [
            [
                Paragraph("Frontend Team Lead", s["job"]),
                Paragraph("Jun 2024 – Present", s["meta_right"]),
            ]
        ],
        colWidths=[125 * mm, 55 * mm],
    )
    header1.setStyle(
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
    story.append(header1)
    story.append(
        Paragraph("Intime Info Yazılım Çözümleri A.Ş.  ·  Ataşehir, Istanbul, Turkey (Hybrid)", s["meta"])
    )
    story.append(Spacer(1, 3))

    bullets1 = [
        "Technical leadership for the frontend team, establishing architectural standards, and guiding code reviews.",
        "Design and maintenance of scalable, reusable component libraries across the enterprise Vue ecosystem.",
        "Cross-functional collaboration with product design (Figma) and backend teams to optimize UX and performance.",
        "Enforcing modern frontend best practices, responsive layouts, and accessibility standards in production.",
    ]
    for item in bullets1:
        story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Spacer(1, 6))

    # Position 2: Frontend Developer
    header2 = Table(
        [
            [
                Paragraph("Frontend Developer", s["job"]),
                Paragraph("Jul 2022 – Jun 2024", s["meta_right"]),
            ]
        ],
        colWidths=[125 * mm, 55 * mm],
    )
    header2.setStyle(
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
    story.append(header2)
    story.append(
        Paragraph("Intime Info Yazılım Çözümleri A.Ş.  ·  Üsküdar, Istanbul, Turkey", s["meta"])
    )
    story.append(Spacer(1, 3))

    bullets2 = [
        "Developed user-facing web applications using Vue and modern JavaScript in production.",
        "Translated Figma specifications into pixel-accurate, responsive, and maintainable frontend code.",
        "Integrated RESTful APIs, handled client-side state management, and optimized web performance.",
    ]
    for item in bullets2:
        story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Paragraph("SKILLS", s["section"]))
    story.append(section_rule())
    skills = Table(
        [
            skill_row("Frontend", "React, Vue, Expo, TypeScript, JavaScript, HTML, CSS", s),
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
        "<b>HydraPlant</b>  ·  Expo, NestJS, PostgreSQL. Water tracker: each sip feeds a plant. Auth, goals, streaks, home-screen widget.",
        "<b>Beyaz Nokta</b>  ·  Expo, NestJS, PostgreSQL. Online football manager: rooms, 8 leagues, daily auto matches, transfers, training.",
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
        title="Yavuz Selim Şerifoğlu — Senior Frontend Developer",
        author="Yavuz Selim Şerifoğlu",
        subject="Résumé",
    )
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
