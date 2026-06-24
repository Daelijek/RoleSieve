import type { Dictionary } from "./ru";
import { ru } from "./ru";

export const en = {
  meta: {
    locale: "en",
    langLabel: "Language",
    comingSoon: "Coming soon",
  },
  header: {
    nav: {
      home: "Home",
      analyze: "Analyze",
      docs: "Documentation",
    },
    menuOpen: "Open menu",
    menuClose: "Close menu",
    cta: "Run analysis",
  },
  hero: {
    eyebrow: "HeadHunter vacancy analytics",
    titleStart: "Turn HH job posts",
    titleHighlight: "into a clear plan",
    titleEnd: "to improve your resume",
    subtitle:
      "RoleSieve pulls a sample from HeadHunter, extracts key skills and recurring phrases, and delivers a clean Excel report summarizing what the market actually asks for.",
    ctaPrimary: "Start analysis",
    ctaGhost: "View sample report",
    reassurance: [
      "No copying of full job descriptions",
      "Excel plus a quick summary",
      "First run in minutes",
    ],
  },
  heroMock: {
    statusLabel: "Collecting data",
    progressLabel: "Vacancies collected",
    skillsTitle: "Top skills",
    phrasesTitle: "Common phrases",
    apiLabel: "HH API · OK",
    previewLabel: "preview",
    liveLabel: "live preview · mock data",
    cycles: [
      {
        queryChip: "Python Developer · Moscow · 1–3 years",
        progressCurrent: 462,
        progressTotal: 500,
        skills: [
          { name: "Python", value: 84 },
          { name: "SQL", value: 71 },
          { name: "Docker", value: 58 },
          { name: "Django", value: 52 },
          { name: "PostgreSQL", value: 47 },
        ],
        phrases: [
          "team collaboration experience",
          "SQL knowledge required",
          "English — Intermediate",
          "experience with Docker / Kubernetes",
        ],
      },
      {
        queryChip: "Frontend Developer · St. Petersburg · 3–6 years",
        progressCurrent: 478,
        progressTotal: 500,
        skills: [
          { name: "React", value: 91 },
          { name: "TypeScript", value: 87 },
          { name: "Next.js", value: 64 },
          { name: "Redux", value: 49 },
          { name: "GraphQL", value: 38 },
        ],
        phrases: [
          "2+ years of React experience",
          "solid understanding of UX principles",
          "code review and mentoring",
          "bundle optimization / Core Web Vitals",
        ],
      },
      {
        queryChip: "Product Manager · Remote · 3–6 years",
        progressCurrent: 372,
        progressTotal: 400,
        skills: [
          { name: "Roadmap", value: 78 },
          { name: "A/B testing", value: 71 },
          { name: "SQL", value: 62 },
          { name: "Jira", value: 58 },
          { name: "User research", value: 49 },
        ],
        phrases: [
          "product launch experience",
          "working with retention metrics",
          "Agile / Scrum / Kanban",
          "stakeholder communication",
        ],
      },
      {
        queryChip: "DevOps · Almaty · 1+ years",
        progressCurrent: 281,
        progressTotal: 300,
        skills: [
          { name: "Kubernetes", value: 88 },
          { name: "Terraform", value: 74 },
          { name: "AWS", value: 67 },
          { name: "CI/CD", value: 81 },
          { name: "Prometheus", value: 53 },
        ],
        phrases: [
          "production Kubernetes experience",
          "Infrastructure as Code",
          "building CI/CD pipelines",
          "monitoring and alerting",
        ],
      },
    ],
  },
  trust: {
    badge: "Powered by the public HeadHunter API",
    kpis: [
      {
        target: 1000,
        suffix: "+",
        label: "vacancies per run",
      },
      {
        target: 30,
        prefix: "< ",
        suffix: " sec",
        label: "to a ready Excel file",
      },
      {
        target: 0,
        suffix: "",
        label: "full descriptions stored",
      },
    ],
  },
  logos: {
    title: "Data source — public HH vacancies",
    items: [
      "Yandex",
      "Sber",
      "T-Bank",
      "VK",
      "Avito",
      "Ozon",
      "Wildberries",
      "X5 Tech",
      "MTS",
      "Alfa-Bank",
      "Kaspi",
      "BTS Digital",
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    title: "The platform already knows the market",
    description:
      "More runs mean sharper aggregates. Every sample you pull is grounded in up-to-date market averages.",
    items: [
      {
        target: 5230,
        suffix: "+",
        label: "runs completed",
        sparkline: [12, 18, 22, 17, 28, 34, 31, 42, 48, 55, 62, 71],
      },
      {
        target: 47,
        suffix: "",
        label: "regions covered",
        sparkline: [5, 11, 14, 19, 22, 26, 31, 34, 38, 41, 44, 47],
      },
      {
        target: 12400,
        suffix: "+",
        label: "skills recognized",
        sparkline: [80, 90, 95, 100, 110, 115, 120, 125, 130, 135, 140, 145],
      },
      {
        target: 89,
        suffix: "%",
        label: "median key_skills coverage",
        sparkline: [62, 65, 69, 72, 75, 78, 80, 82, 84, 86, 87, 89],
      },
    ],
  },
  modes: {
    eyebrow: "Two modes",
    title: "Build your sample the way you work",
    subtitle:
      "Know specific vacancies? Paste their IDs or links. Exploring a segment? Run a search with standard HH filters.",
    manual: {
      label: "Manual mode",
      tagline: "When you already know which jobs to analyze",
      hint: "Paste HH IDs or links — one per line.",
      mockTitle: "Vacancy list",
      vacanciesLabel: "vacancies",
      mockLines: [
        "https://hh.ru/vacancy/87654321",
        "https://hh.kz/vacancy/12345678",
        "98765432",
        "https://hh.ru/vacancy/55667788",
      ],
    },
    auto: {
      label: "Auto mode",
      tagline: "When you need a segment from search",
      hint: "Search by role with company, region, experience, and date filters.",
      mockTitle: "Search parameters",
      fields: [
        { label: "Query", value: "Python Developer" },
        { label: "Region", value: "Moscow" },
        { label: "Experience", value: "1 to 3 years" },
        { label: "Period", value: "Last 30 days" },
      ],
    },
  },
  how: {
    eyebrow: "How it works",
    title: "From query to report in 4 steps",
    stepLabel: "Step {number}",
    steps: [
      {
        number: "01",
        title: "Query",
        description:
          "Paste IDs/links or set up a search with HH filters — company, region, experience, period.",
      },
      {
        number: "02",
        title: "Collect",
        description:
          "We call the HH API, respect rate limits, and assemble your sample.",
      },
      {
        number: "03",
        title: "Signals",
        description:
          "We extract key_skills and frequent phrases from descriptions — without storing full text.",
      },
      {
        number: "04",
        title: "Output",
        description:
          "A clean Excel report plus a quick view of top skills and phrases — ready to act on.",
      },
    ],
  },
  features: {
    eyebrow: "What you get",
    title: "Everything to read the market and refresh your resume",
    items: [
      {
        icon: "Sparkles",
        title: "Top key skills",
        description:
          "Stop guessing — see which skills HH postings ask for most in your segment.",
      },
      {
        icon: "MessageSquare",
        title: "Common phrases",
        description:
          "Market-ready wording you can reuse in your resume and cover letters.",
      },
      {
        icon: "FileSpreadsheet",
        title: "Excel report",
        description:
          "A clean file for filters, pivots, and summaries — no fluff, no copied postings.",
      },
      {
        icon: "ShieldCheck",
        title: "Data quality",
        description:
          "key_skills coverage, empty descriptions, errors — all visible in one place.",
      },
      {
        icon: "Layers",
        title: "Deduplication",
        description:
          "See Input → Unique → Removed so no vacancy is counted twice.",
      },
      {
        icon: "History",
        title: "Run history",
        description:
          "Saved runs and parameters — repeat and compare segments over time.",
      },
    ],
  },
  audience: {
    eyebrow: "Who it's for",
    title: "Built for people who decide from vacancy data",
    personas: [
      {
        role: "Job seeker",
        quote: "I want to see what's missing in my resume for the role I'm targeting.",
        bullets: [
          "A compact view of requirements in your segment",
          "A clear checklist to improve your resume",
        ],
      },
      {
        role: "Career coach",
        quote: "I give advice backed by evidence, not gut feel.",
        bullets: [
          "A segment sample in minutes",
          "An Excel report to review with clients",
        ],
      },
      {
        role: "Market researcher",
        quote: "I compare requirements across segments and time periods.",
        bullets: [
          "Parameterized searches and filters",
          "Run history and comparison",
        ],
      },
    ],
  },
  preview: {
    eyebrow: "Sample report",
    title: "What the output looks like — no filler",
    mockRunBadge: "Run #1247",
    mockQueryChip: "Python Developer · Moscow · 1–3 years",
    statusReady: "Ready",
    description:
      "Query: «Python Developer · Moscow · 1–3 years · last 30 days». Sample of 247 unique vacancies.",
    chartTitle: "Top 10 key skills",
    chartHint: "% of mentions in sample",
    skills: [
      { name: "Python", value: 84 },
      { name: "SQL", value: 71 },
      { name: "Docker", value: 58 },
      { name: "Django", value: 52 },
      { name: "PostgreSQL", value: 47 },
      { name: "Git", value: 41 },
      { name: "Linux", value: 36 },
      { name: "FastAPI", value: 29 },
      { name: "Kubernetes", value: 24 },
      { name: "Redis", value: 22 },
    ],
    phrasesTitle: "Top 10 phrases",
    phrases: [
      { text: "team collaboration experience", value: 78 },
      { text: "SQL knowledge required", value: 64 },
      { text: "English — Intermediate", value: 51 },
      { text: "experience with Docker / Kubernetes", value: 44 },
      { text: "Agile / Scrum work", value: 39 },
      { text: "understanding of REST APIs", value: 34 },
      { text: "microservices experience", value: 28 },
      { text: "SOLID principles", value: 21 },
    ],
    qualityTitle: "Data quality",
    qualityMetrics: [
      { label: "key_skills coverage", value: "87%" },
      { label: "Empty descriptions", value: "4%" },
      { label: "Run errors", value: "0" },
    ],
    dedupTitle: "Deduplication",
    dedupLine: "Input 312 → Unique 247 → Removed 65",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What early users are saying",
    items: [
      {
        quote:
          "In one evening I saw my resume was missing «commercial experience», «team of 5+», and «mentoring». I added them and reframed a section — got an offer within a week.",
        author: "Anna K.",
        role: "Frontend Developer",
        accent: "violet",
      },
      {
        quote:
          "I consolidate eight segments into one table in an evening instead of three days. Clients get evidence from the market, not my opinion.",
        author: "Igor M.",
        role: "Career coach",
        accent: "coral",
      },
      {
        quote:
          "I run a quarterly pass across twelve roles. Trends are obvious — where demand for a skill is rising and where it's already baseline.",
        author: "Daria V.",
        role: "HR analyst",
        accent: "aqua",
      },
    ],
  },
  tryIt: {
    eyebrow: "Try it now",
    title: "Run a simulation right here",
    description:
      "Enter a role and filters — see an approximate result in seconds. This is a local simulation based on market averages.",
    placeholder: "e.g. Python Developer",
    regionLabel: "Region",
    expLabel: "Experience",
    periodLabel: "Period",
    regions: ["Moscow", "St. Petersburg", "Almaty", "Remote"],
    experiences: ["Any", "No experience", "1–3 years", "3–6 years", "6+ years"],
    periods: ["Last 7 days", "Last 30 days", "Last 90 days"],
    submit: "Simulate run",
    restart: "Run again",
    runningLabel: "Collecting",
    fullLink: "Open full version",
    emptyHint: "Fill in the fields and click Simulate — you'll see a sample summary.",
    resultLabel: "Simulation result",
    formEyebrow: "query parameters",
    queryLabel: "query",
    sampleSummary: "sample · {count} vacancies",
    skillsTitle: "Top skills",
    skillsHint: "% of mentions",
    phrasesTitle: "Top phrases",
    phrasesHint: "top 4",
    fullRunCta: "Run full analysis",
    progressSteps: {
      sent: "request sent",
      collecting: "collecting vacancies",
      extracting: "extracting signals",
    },
    note: "Local mock based on averages — for a real run go to /analyze.",
    presets: {
      python: {
        title: "Python Developer",
        skills: [
          { name: "Python", value: 86 },
          { name: "SQL", value: 73 },
          { name: "Docker", value: 61 },
          { name: "Django", value: 54 },
          { name: "PostgreSQL", value: 48 },
          { name: "FastAPI", value: 32 },
        ],
        phrases: [
          "microservices experience",
          "PostgreSQL / MySQL",
          "REST API design",
          "Agile team experience",
        ],
        sample: 247,
      },
      frontend: {
        title: "Frontend Developer",
        skills: [
          { name: "React", value: 92 },
          { name: "TypeScript", value: 88 },
          { name: "Next.js", value: 64 },
          { name: "Redux", value: 49 },
          { name: "CSS / Tailwind", value: 71 },
          { name: "GraphQL", value: 38 },
        ],
        phrases: [
          "2+ years with React",
          "Core Web Vitals awareness",
          "code review and mentoring",
          "component library experience",
        ],
        sample: 312,
      },
      product: {
        title: "Product Manager",
        skills: [
          { name: "Roadmap", value: 81 },
          { name: "A/B testing", value: 72 },
          { name: "SQL", value: 63 },
          { name: "Jira", value: 58 },
          { name: "User research", value: 51 },
          { name: "Product metrics", value: 78 },
        ],
        phrases: [
          "zero-to-one product launches",
          "retention metrics",
          "Agile / Scrum / Kanban",
          "stakeholder management",
        ],
        sample: 184,
      },
      devops: {
        title: "DevOps Engineer",
        skills: [
          { name: "Kubernetes", value: 89 },
          { name: "Terraform", value: 74 },
          { name: "AWS / GCP", value: 67 },
          { name: "CI/CD", value: 82 },
          { name: "Prometheus", value: 54 },
          { name: "Linux", value: 76 },
        ],
        phrases: [
          "production Kubernetes",
          "Infrastructure as Code",
          "CI/CD pipeline design",
          "monitoring and alerting",
        ],
        sample: 156,
      },
      analyst: {
        title: "Data Analyst",
        skills: [
          { name: "SQL", value: 91 },
          { name: "Python / Pandas", value: 74 },
          { name: "Tableau / BI", value: 62 },
          { name: "A/B testing", value: 58 },
          { name: "Business metrics", value: 68 },
          { name: "Excel / Google Sheets", value: 81 },
        ],
        phrases: [
          "large dataset experience",
          "dashboard building",
          "business stakeholder communication",
          "statistics fundamentals",
        ],
        sample: 198,
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    items: [
      {
        q: "Is this legal?",
        a: "Yes. We only use public vacancies via the official HH API. We don't copy or publish full postings — only aggregated signals.",
      },
      {
        q: "Where does the data come from?",
        a: "From the public HH API (hh.ru, hh.kz, hh.uz, etc.). No private sources or page scraping.",
      },
      {
        q: "Do you store full job descriptions?",
        a: "No. We keep run metadata and aggregates. Raw text isn't retained after signals are extracted.",
      },
      {
        q: "How long does a run take?",
        a: "From a few seconds to a couple of minutes depending on sample size and filters. Excel is ready when the run finishes.",
      },
      {
        q: "What if HH returns a rate limit?",
        a: "The service slows down and resumes automatically. You don't need to do anything.",
      },
      {
        q: "Can I compare two runs?",
        a: "Yes. Run history stores parameters and results — open them side by side to compare segments or periods.",
      },
      {
        q: "What's in the Excel report?",
        a: "A vacancy list sheet, aggregates for skills and phrases, and a data quality sheet. Clean structure for filters and pivots.",
      },
    ],
  },
  analyze: ru.analyze,
  finalCta: {
    eyebrow: "Ready to start",
    title: "Understand the market in 5 minutes",
    description: "Run your first analysis free — no signup required.",
    ctaPrimary: "Run analysis",
    ctaGhost: "Documentation",
  },
  footer: {
    tagline: "Turn HeadHunter vacancies into a clear plan to improve your resume.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#how" },
          { label: "Sample report", href: "#preview" },
          { label: "Documentation", href: "/docs" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Roadmap", href: "/roadmap" },
          { label: "Changelog", href: "/changelog" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms", href: "/legal/terms" },
          { label: "Privacy", href: "/legal/privacy" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    copyright:
      "© 2026 RoleSieve. Not affiliated with HeadHunter. Uses only the public API.",
  },
  docs: {
    meta: {
      eyebrow: "Documentation",
      title: "RoleSieve documentation",
      description:
        "How to collect a set of HeadHunter vacancies, run the analysis, and turn the result into a plan to improve your resume.",
    },
    nav: {
      label: "Sections",
      items: [
        { slug: "", label: "Overview" },
        { slug: "quickstart", label: "Quick start" },
        { slug: "modes", label: "Modes & parameters" },
        { slug: "report", label: "Reading the report" },
        { slug: "faq", label: "Questions & issues" },
      ],
    },
    prevNext: { prevLabel: "Previous", nextLabel: "Next" },
    overview: {
      title: "Overview",
      lead: "RoleSieve collects a set of vacancies from HeadHunter, extracts key skills and frequent phrases, and returns a clean Excel report summarizing what the market actually asks for.",
      whatTitle: "What it is",
      what: "Instead of re-reading dozens of vacancies by hand, you get an aggregated picture of requirements for a chosen role: which skills appear most often and how employers phrase them.",
      outputTitle: "What you get",
      output: [
        "An Excel report with the vacancy list, skills, and key phrases.",
        "A quick visual summary right on the analysis page.",
        "Ranked lists of skills and phrases by frequency.",
      ],
      audienceTitle: "Who it is for",
      audience: "For job seekers preparing to move into a new role who want to tailor their resume to real market requirements rather than guesses.",
      cardsTitle: "Where to start",
      cards: [
        {
          slug: "quickstart",
          title: "Quick start",
          description: "Run your first analysis in a couple of minutes.",
        },
        {
          slug: "modes",
          title: "Modes & parameters",
          description: "Manual and auto modes, fine-tuning the sample.",
        },
        {
          slug: "report",
          title: "Reading the report",
          description: "Excel and the dashboard, step by step.",
        },
      ],
    },
    quickstart: {
      title: "Quick start",
      lead: "Your first run needs no signup — just open the analysis page and tell it which vacancies to process.",
      stepsTitle: "First analysis in 4 steps",
      steps: [
        {
          title: "Open Analyze",
          description: "Go to the analysis page via the button below or from the site header.",
        },
        {
          title: "Pick a mode",
          description: "Manual if you already selected the best vacancies. Auto if you want to collect a sample by a search query.",
        },
        {
          title: "Add vacancies or a query",
          description: "In manual mode paste vacancy IDs or links (one per line). In auto mode set search queries and depth.",
        },
        {
          title: "Run and download Excel",
          description: "Click Run. When it finishes you get a summary and a link to the ready Excel file.",
        },
      ],
      cta: "Run analysis",
      tipTitle: "Tip",
      tip: "Start with manual mode and 10–20 carefully selected vacancies — the report will have less noise than a broad auto search.",
    },
    modes: {
      title: "Modes & parameters",
      lead: "There are two ways to collect a sample of vacancies. The choice depends on how precisely you already know which vacancies you care about.",
      manualTitle: "Manual mode",
      manual: "You select vacancies yourself and pass them by ID or link. Best when you already have a list of interesting positions.",
      manualPoints: [
        "One vacancy per line: an ID (e.g. 131474430) or a link like https://hh.ru/vacancy/131474430.",
        "Less noise: only the vacancies you chose are analyzed.",
      ],
      autoTitle: "Auto mode",
      auto: "The service finds vacancies by your search queries via the HH API. Best for a broad market overview of a role.",
      autoPoints: [
        "Provide one or more search queries (e.g. \"Python developer\").",
        "Search depth sets how many result pages to collect per query.",
      ],
      whenTitle: "When to use which",
      when: [
        {
          mode: "Manual",
          use: "You already have a short list of vacancies you want to analyze precisely.",
        },
        {
          mode: "Auto",
          use: "You want the overall picture of requirements for a role and are not tied to specific vacancies.",
        },
      ],
      paramsTitle: "Parameters",
      params: [
        {
          name: "Number of key phrases",
          description: "How many frequent phrases to extract from each vacancy description. More means more detail but more noise.",
        },
        {
          name: "Phrase size",
          description: "Maximum phrase length in words (1–3). Helps capture stable combinations like \"experience with Docker\".",
        },
        {
          name: "Search depth (auto)",
          description: "How many result pages to collect per query in auto mode.",
        },
      ],
      limitTitle: "Limit",
      limit: "Up to 100 vacancies are processed per run. For more, split the sample into several runs.",
    },
    report: {
      title: "Reading the report",
      lead: "The result has two parts: a visual summary on the analysis page and an Excel file for further work with filters and pivot tables.",
      excelTitle: "Excel structure",
      excelIntro: "Each vacancy is a block of rows: key phrases and skills sit side by side, while ID and link are filled only on the first row of the block.",
      columnsHead: ["Column", "What's inside"],
      columns: [
        { col: "Vacancy Title", desc: "The vacancy title." },
        { col: "Key Words", desc: "Key phrases extracted from the vacancy text." },
        { col: "Key Skills", desc: "Skills from HH's official key_skills field." },
        { col: "ID", desc: "The vacancy ID on HH." },
        { col: "Link", desc: "A direct link to the vacancy." },
      ],
      dashboardTitle: "Summary on the analysis page",
      dashboard: [
        { title: "Top skills", description: "The most frequent skills in the sample — the basis for your resume's Skills section." },
        { title: "Frequent phrases", description: "Stable wordings from descriptions — they hint at how to phrase your experience." },
        { title: "Skills cloud", description: "Word size reflects mention frequency — a quick visual overview." },
        { title: "Coverage", description: "Shows what share of vacancies actually fill the key_skills field." },
        { title: "Deduplication", description: "How many duplicate skills and phrases were removed when counting frequencies." },
        { title: "Errors", description: "Vacancies that could not be processed, broken down by reason." },
      ],
      resumeTitle: "How to apply it to your resume",
      resume: [
        "Take the top skills from the summary and make sure they are clearly reflected in your resume.",
        "Reuse frequent phrases as wordings in your experience descriptions.",
        "Compare your strengths with market requirements and close the visible gaps.",
      ],
    },
    faq: {
      title: "Questions & issues",
      lead: "Short answers to common questions and fixes for typical situations.",
      items: [
        {
          q: "Is this legal and safe?",
          a: "Yes. The service works only with public vacancies via the official HH API, is not affiliated with HeadHunter, and does not copy full vacancy texts.",
        },
        {
          q: "Do I need to sign up or get a token?",
          a: "No signup is needed for the first run. An HH token may be required only for large volumes or when the API rate-limits.",
        },
        {
          q: "The Skills field is empty — why?",
          a: "Some employers don't fill the key_skills field on HH. That's normal: rely on the key phrases from the description instead.",
        },
        {
          q: "There's a lot of noise in key phrases",
          a: "Phrase extraction is based on a frequency heuristic, so noise is possible. Reduce the number of phrases and the phrase size, or filter the result in Excel.",
        },
        {
          q: "How many vacancies can I process at once?",
          a: "Up to 100 per run. For more, split the sample into several runs.",
        },
        {
          q: "How long does a run take?",
          a: "From a few seconds to a couple of minutes depending on sample size. The Excel file is ready right after it finishes.",
        },
      ],
    },
  },
} as unknown as Dictionary;
