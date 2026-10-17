"""Generate Turkish and English résumé PDFs."""

from pathlib import Path

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

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "src" / "assets" / "docs"

MAC_FONTS = Path("/System/Library/Fonts/Supplemental")
WIN_FONTS = Path(r"C:\Windows\Fonts")

if (MAC_FONTS / "Arial.ttf").exists():
    FONT_REG = MAC_FONTS / "Arial.ttf"
    FONT_BOLD = MAC_FONTS / "Arial Bold.ttf"
    FONT_ITALIC = MAC_FONTS / "Arial Italic.ttf"
else:
    FONT_REG = WIN_FONTS / "arial.ttf"
    FONT_BOLD = WIN_FONTS / "arialbd.ttf"
    FONT_ITALIC = WIN_FONTS / "ariali.ttf"

pdfmetrics.registerFont(TTFont("Body", str(FONT_REG)))
pdfmetrics.registerFont(TTFont("Body-Bold", str(FONT_BOLD)))
pdfmetrics.registerFont(TTFont("Body-Italic", str(FONT_ITALIC)))

DARK = HexColor("#0f172a")
PRIMARY = HexColor("#2563eb")
MUTED = HexColor("#64748b")
LINE = HexColor("#e2e8f0")

COPY = {
    "en": {
        "filename": "resume-en.pdf",
        "title": "Yavuz Selim Şerifoğlu — Senior Frontend Developer",
        "subject": "Résumé",
        "role": "Senior Frontend Developer",
        "summary_heading": "SUMMARY",
        "summary": (
            "Senior frontend developer in Istanbul. Communication design at Yıldız Technical "
            "University; production software at Intime Info since 2022. I lead the Vue 3 frontend "
            "for Intime IK, an enterprise HR platform covering attendance, payroll, CRM, helpdesk, "
            "and related modules. I also ship personal full-stack products with React Native, NestJS, "
            "and PostgreSQL."
        ),
        "experience_heading": "EXPERIENCE",
        "jobs": [
            {
                "role": "Frontend Team Lead",
                "dates": "Jun 2024 – Present",
                "meta": "Intime Info Yazılım Çözümleri A.Ş.  ·  Ataşehir, Istanbul, Turkey (Hybrid)",
                "bullets": [
                    "Lead the Vue 3 + TypeScript frontend for Intime IK: PDKS, payroll, CRM, helpdesk, agreements, performance, and related modules.",
                    "Own the shared UI architecture — tables, theming, auth, and the REST client — so new modules ship on the same rails.",
                    "Run code reviews and keep TypeScript, Element Plus, and responsive layout standards in production.",
                    "Work with product (Figma) and backend so screens ship as maintainable slices.",
                ],
            },
            {
                "role": "Frontend Developer",
                "dates": "Jul 2022 – Jun 2024",
                "meta": "Intime Info Yazılım Çözümleri A.Ş.  ·  Üsküdar, Istanbul, Turkey",
                "bullets": [
                    "Built production Vue screens for Intime IK — lists, forms, calendars, dashboards — from Figma.",
                    "Wired REST APIs, client state, and role-based views used daily by HR teams.",
                    "Tightened performance and layout on dense data tables.",
                ],
            },
        ],
        "skills_heading": "SKILLS",
        "skills": [
            ("Frontend", "React, Vue, Expo, TypeScript, JavaScript, HTML, CSS"),
            ("Backend", "NestJS, .NET Core, Node.js, REST APIs"),
            ("Data", "PostgreSQL, SQL"),
            ("Tools", "Git, Postman, Figma"),
        ],
        "projects_heading": "PROJECTS",
        "projects": [
            "<b>Intime IK</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Enterprise HR platform I lead on the frontend: PDKS, payroll, CRM, helpdesk, agreements, performance.",
            "<b>Intime Proje</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Project management: Kanban, tasks, timesheets, reports, roles, Git commits.",
            "<b>Filonika</b>  ·  Vue 3, ASP.NET Core 8, SQL Server. Fleet management: vehicles, drivers, contracts, insurance, financing.",
            "<b>Cumbara</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Loyalty admin: campaigns, dealers, rewards, points, notifications.",
            "<b>Fair Analytics</b>  ·  Nuxt, Vue 3, TypeScript, Tailwind. Bilingual marketing site: products, blog, careers, contact.",
            "<b>VYC Türkiye</b>  ·  Vue 3, TypeScript, Tailwind. Corporate site rebuild, TR/EN. vycturkiye.com.",
            "<b>HydraPlant</b>  ·  Expo, NestJS, PostgreSQL. Water tracker: each sip feeds a plant. Auth, goals, streaks, widget.",
            "<b>Beyaz Nokta</b>  ·  Expo, NestJS, PostgreSQL. Online football manager: rooms, leagues, daily matches, transfers.",
        ],
        "education_heading": "EDUCATION",
        "education": "Yıldız Technical University  ·  Communication Design",
        "education_dates": "2018 – 2022",
        "languages_heading": "LANGUAGES",
        "languages": "Turkish — Native    ·    English — B2",
    },
    "tr": {
        "filename": "resume-tr.pdf",
        "title": "Yavuz Selim Şerifoğlu — Senior Frontend Developer",
        "subject": "CV",
        "role": "Senior Frontend Developer",
        "summary_heading": "ÖZET",
        "summary": (
            "İstanbul'da senior frontend developer. Yıldız Teknik Üniversitesi'nde iletişim tasarımı; "
            "2022'den beri Intime Info'da üretim yazılımı. Intime IK kurumsal İK platformunun Vue 3 "
            "arayüzüne liderlik ediyorum — PDKS, bordro, CRM, yardım masası ve bağlı modüller. Kişisel "
            "tarafta React Native, NestJS ve PostgreSQL ile tam yığın ürünler çıkarıyorum."
        ),
        "experience_heading": "DENEYİM",
        "jobs": [
            {
                "role": "Frontend Team Lead",
                "dates": "Haz 2024 – Günümüz",
                "meta": "Intime Info Yazılım Çözümleri A.Ş.  ·  Ataşehir, İstanbul, Türkiye (Hibrit)",
                "bullets": [
                    "Intime IK'nın Vue 3 + TypeScript frontend'ine liderlik: PDKS, bordro, CRM, yardım masası, sözleşmeler, performans ve bağlı modüller.",
                    "Paylaşılan arayüz mimarisini sahipleniyorum — tablolar, tema, kimlik doğrulama ve REST istemcisi.",
                    "Kod incelemesi yürütüyorum; TypeScript, Element Plus ve duyarlı yerleşim standartlarını üretimde tutuyorum.",
                    "Ürün (Figma) ve backend ile çalışarak ekranları sürdürülebilir dilimler olarak teslim ediyorum.",
                ],
            },
            {
                "role": "Frontend Developer",
                "dates": "Tem 2022 – Haz 2024",
                "meta": "Intime Info Yazılım Çözümleri A.Ş.  ·  Üsküdar, İstanbul, Türkiye",
                "bullets": [
                    "Intime IK için Figma'dan üretim Vue ekranları: listeler, formlar, takvimler, paneller.",
                    "İK ekiplerinin her gün kullandığı REST API, istemci state ve rol bazlı görünümleri bağladım.",
                    "Yoğun veri tablolarında performans ve yerleşimi sıkılaştırdım.",
                ],
            },
        ],
        "skills_heading": "YETENEKLER",
        "skills": [
            ("Frontend", "React, Vue, Expo, TypeScript, JavaScript, HTML, CSS"),
            ("Backend", "NestJS, .NET Core, Node.js, REST API"),
            ("Veri", "PostgreSQL, SQL"),
            ("Araçlar", "Git, Postman, Figma"),
        ],
        "projects_heading": "PROJELER",
        "projects": [
            "<b>Intime IK</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Frontend liderliğini yürüttüğüm kurumsal İK platformu: PDKS, bordro, CRM, yardım masası, performans.",
            "<b>Intime Proje</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Proje yönetimi: Kanban, konular, zaman çizelgesi, raporlar, roller, Git commit.",
            "<b>Filonika</b>  ·  Vue 3, ASP.NET Core 8, SQL Server. Filo yönetimi: araç, sürücü, sözleşme, sigorta, finansman.",
            "<b>Cumbara</b>  ·  Vue 3, TypeScript, Pinia, Element Plus. Sadakat admin paneli: kampanya, bayi, ödül, puan, bildirim.",
            "<b>Fair Analytics</b>  ·  Nuxt, Vue 3, TypeScript, Tailwind. İki dilli pazarlama sitesi: ürünler, blog, kariyer, iletişim.",
            "<b>VYC Türkiye</b>  ·  Vue 3, TypeScript, Tailwind. Kurumsal site yeniden yazımı, TR/EN. vycturkiye.com.",
            "<b>HydraPlant</b>  ·  Expo, NestJS, PostgreSQL. Su takibi: her yudum bitkiyi besler. Auth, hedef, seri, widget.",
            "<b>Beyaz Nokta</b>  ·  Expo, NestJS, PostgreSQL. Online futbol menajerliği: oda, lig, günlük maç, transfer.",
        ],
        "education_heading": "EĞİTİM",
        "education": "Yıldız Teknik Üniversitesi  ·  İletişim Tasarımı",
        "education_dates": "2018 – 2022",
        "languages_heading": "DİLLER",
        "languages": "Türkçe — Ana dil    ·    İngilizce — B2",
    },
}


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
            fontSize=11.5,
            leading=15,
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
            spaceBefore=6,
            spaceAfter=2,
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
    return [Paragraph(label, s["label"]), Paragraph(value, s["body"])]


def job_header(role, dates, s):
    table = Table(
        [[Paragraph(role, s["job"]), Paragraph(dates, s["meta_right"])]],
        colWidths=[125 * mm, 55 * mm],
    )
    table.setStyle(
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
    return table


def build_locale(locale):
    copy = COPY[locale]
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
    story.append(Paragraph(copy["role"], s["title"]))
    story.append(Paragraph(contact, s["contact"]))
    story.append(Spacer(1, 8))
    story.append(
        HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=4)
    )

    story.append(Paragraph(copy["summary_heading"], s["section"]))
    story.append(section_rule())
    story.append(Paragraph(copy["summary"], s["body"]))

    story.append(Paragraph(copy["experience_heading"], s["section"]))
    story.append(section_rule())

    for index, job in enumerate(copy["jobs"]):
        if index:
            story.append(Spacer(1, 6))
        story.append(job_header(job["role"], job["dates"], s))
        story.append(Paragraph(job["meta"], s["meta"]))
        story.append(Spacer(1, 3))
        for item in job["bullets"]:
            story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Paragraph(copy["skills_heading"], s["section"]))
    story.append(section_rule())
    skills = Table(
        [skill_row(label, value, s) for label, value in copy["skills"]],
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

    story.append(Paragraph(copy["projects_heading"], s["section"]))
    story.append(section_rule())
    for item in copy["projects"]:
        story.append(Paragraph(f"•  {item}", s["bullet"]))

    story.append(Paragraph(copy["education_heading"], s["section"]))
    story.append(section_rule())
    edu = Table(
        [
            [
                Paragraph(copy["education"], s["job"]),
                Paragraph(copy["education_dates"], s["meta_right"]),
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

    story.append(Paragraph(copy["languages_heading"], s["section"]))
    story.append(section_rule())
    story.append(Paragraph(copy["languages"], s["body"]))

    output = DOCS / copy["filename"]
    DOCS.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
        title=copy["title"],
        author="Yavuz Selim Şerifoğlu",
        subject=copy["subject"],
    )
    doc.build(story)
    print(output)
    return output


def build():
    en_path = build_locale("en")
    tr_path = build_locale("tr")
    legacy = DOCS / "resume.pdf"
    legacy.write_bytes(en_path.read_bytes())
    print(legacy)
    return en_path, tr_path


if __name__ == "__main__":
    build()
