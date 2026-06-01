export const ru = {
  meta: {
    locale: "ru" as const,
    langLabel: "Язык",
    comingSoon: "Скоро",
  },
  header: {
    nav: {
      home: "Главная",
      analyze: "Анализ",
    },
    signIn: "Войти",
    cta: "Запустить анализ",
  },
  hero: {
    eyebrow: "Аналитика вакансий HeadHunter",
    titleStart: "Превратите вакансии HH",
    titleHighlight: "в чёткий план",
    titleEnd: "улучшения резюме",
    subtitle:
      "Сервис собирает выборку с HeadHunter, извлекает ключевые навыки и частотные фразы — и отдаёт чистый Excel-отчёт со сводкой того, что реально просит рынок.",
    ctaPrimary: "Начать анализ",
    ctaGhost: "Посмотреть пример отчёта",
    reassurance: [
      "Без копирования описаний вакансий",
      "Excel + быстрая сводка",
      "Первый прогон — за минуты",
    ],
  },
  heroMock: {
    statusLabel: "Сбор данных",
    progressLabel: "Собрано вакансий",
    skillsTitle: "Топ навыков",
    phrasesTitle: "Частотные фразы",
    apiLabel: "HH API · OK",
    previewLabel: "preview",
    liveLabel: "live preview · mock data",
    cycles: [
      {
        queryChip: "Python Developer · Москва · 1–3 года",
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
          "опыт работы в команде",
          "знание SQL обязательно",
          "английский — Intermediate",
          "опыт с Docker / Kubernetes",
        ],
      },
      {
        queryChip: "Frontend Developer · СПб · 3–6 лет",
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
          "опыт с React от 2 лет",
          "понимание принципов UX",
          "code review и менторство",
          "оптимизация bundle / Core Web Vitals",
        ],
      },
      {
        queryChip: "Product Manager · Удалённо · 3–6 лет",
        progressCurrent: 372,
        progressTotal: 400,
        skills: [
          { name: "Roadmap", value: 78 },
          { name: "A/B тесты", value: 71 },
          { name: "SQL", value: 62 },
          { name: "Jira", value: 58 },
          { name: "User research", value: 49 },
        ],
        phrases: [
          "опыт запуска продуктов",
          "работа с метриками retention",
          "Agile / Scrum / Kanban",
          "коммуникация со стейкхолдерами",
        ],
      },
      {
        queryChip: "DevOps · Алматы · от 1 года",
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
          "опыт с Kubernetes в проде",
          "Infrastructure as Code",
          "выстраивание CI/CD pipeline",
          "мониторинг и алертинг",
        ],
      },
    ],
  },
  trust: {
    badge: "На основе открытого HeadHunter API",
    kpis: [
      {
        target: 1000,
        suffix: "+",
        label: "вакансий за прогон",
      },
      {
        target: 30,
        prefix: "< ",
        suffix: " сек",
        label: "до готового Excel",
      },
      {
        target: 0,
        suffix: "",
        label: "копий описаний хранится",
      },
    ],
  },
  logos: {
    title: "Источник данных — публичные вакансии HH",
    items: [
      "Яндекс",
      "Сбер",
      "Тинькофф",
      "VK",
      "Авито",
      "Ozon",
      "Wildberries",
      "X5 Tech",
      "МТС",
      "Альфа-Банк",
      "Kaspi",
      "BTS Digital",
    ],
  },
  stats: {
    eyebrow: "В цифрах",
    title: "Платформа уже знает рынок",
    description:
      "Чем больше прогонов — тем точнее агрегаты. Поэтому каждая ваша выборка сразу опирается на актуальные средние по рынку.",
    items: [
      {
        target: 5230,
        suffix: "+",
        label: "прогонов запущено",
        sparkline: [12, 18, 22, 17, 28, 34, 31, 42, 48, 55, 62, 71],
      },
      {
        target: 47,
        suffix: "",
        label: "регионов покрыто",
        sparkline: [5, 11, 14, 19, 22, 26, 31, 34, 38, 41, 44, 47],
      },
      {
        target: 12400,
        suffix: "+",
        label: "распознаваемых навыков",
        sparkline: [80, 90, 95, 100, 110, 115, 120, 125, 130, 135, 140, 145],
      },
      {
        target: 89,
        suffix: "%",
        label: "медианное покрытие key_skills",
        sparkline: [62, 65, 69, 72, 75, 78, 80, 82, 84, 86, 87, 89],
      },
    ],
  },
  modes: {
    eyebrow: "Два режима",
    title: "Соберите выборку так, как вам удобно",
    subtitle:
      "Если знаете конкретные вакансии — вставьте их ID или ссылки. Если хотите изучить сегмент — задайте поисковый запрос с фильтрами HH.",
    manual: {
      label: "Ручной режим",
      tagline: "Когда вы знаете, какие вакансии анализировать",
      hint: "Просто вставьте ID или ссылки HH — по одному в строке.",
      mockTitle: "Список вакансий",
      mockLines: [
        "https://hh.ru/vacancy/87654321",
        "https://hh.kz/vacancy/12345678",
        "98765432",
        "https://hh.ru/vacancy/55667788",
      ],
    },
    auto: {
      label: "Авто-режим",
      tagline: "Когда нужно собрать выборку по сегменту",
      hint: "Поиск по запросам с фильтрами компания/регион/опыт/период.",
      mockTitle: "Параметры поиска",
      fields: [
        { label: "Запрос", value: "Python Developer" },
        { label: "Регион", value: "Москва" },
        { label: "Опыт", value: "От 1 до 3 лет" },
        { label: "Период", value: "За 30 дней" },
      ],
    },
  },
  how: {
    eyebrow: "Как это работает",
    title: "От запроса до отчёта — 4 шага",
    steps: [
      {
        number: "01",
        title: "Запросы",
        description:
          "Вставьте ID/ссылки или задайте поиск с фильтрами HH — компания, регион, опыт, период.",
      },
      {
        number: "02",
        title: "Сбор",
        description:
          "Сервис обращается к HH API, аккуратно соблюдает лимиты и собирает выборку.",
      },
      {
        number: "03",
        title: "Сигналы",
        description:
          "Извлекаем key_skills и частотные фразы из описаний — без копирования текста.",
      },
      {
        number: "04",
        title: "Результат",
        description:
          "Чистый Excel-отчёт + быстрая сводка топ-навыков и фраз — для решений.",
      },
    ],
  },
  features: {
    eyebrow: "Что внутри",
    title: "Всё, чтобы понять рынок и обновить резюме",
    items: [
      {
        icon: "Sparkles" as const,
        title: "Топ ключевых навыков",
        description:
          "Не угадывайте — увидьте, какие навыки HH-вакансии просят чаще всего в вашем сегменте.",
      },
      {
        icon: "MessageSquare" as const,
        title: "Частотные фразы",
        description:
          "Готовые формулировки рынка — используйте их в резюме и сопроводительных письмах.",
      },
      {
        icon: "FileSpreadsheet" as const,
        title: "Excel-отчёт",
        description:
          "Чистый файл для фильтрации, сортировки и сводных таблиц — без воды и копий.",
      },
      {
        icon: "ShieldCheck" as const,
        title: "Качество данных",
        description:
          "Покрытие key_skills, пустые описания, ошибки — всё прозрачно в одном блоке.",
      },
      {
        icon: "Layers" as const,
        title: "Дедупликация",
        description:
          "Видно как Input → Unique → Removed: ни одна вакансия не задвоится в отчёте.",
      },
      {
        icon: "History" as const,
        title: "История прогонов",
        description:
          "Сохраняем запуски и параметры — повторяйте и сравнивайте сегменты во времени.",
      },
    ],
  },
  audience: {
    eyebrow: "Для кого",
    title: "Платформа для тех, кто принимает решения по вакансиям",
    personas: [
      {
        role: "Соискатель",
        quote: "Хочу понять, чего не хватает в резюме под мою цель.",
        bullets: [
          "Сжатая картина требований выбранного сегмента",
          "Понятный чек-лист улучшений резюме",
        ],
      },
      {
        role: "Карьерный консультант",
        quote: "Готовлю рекомендации на доказательной базе.",
        bullets: [
          "Быстрая выборка по сегменту за минуты",
          "Excel-отчёт для разбора с клиентом",
        ],
      },
      {
        role: "Ресёрчер рынка",
        quote: "Сравниваю требования между сегментами и периодами.",
        bullets: [
          "Параметрические запросы и фильтры",
          "История прогонов и сравнение",
        ],
      },
    ],
  },
  preview: {
    eyebrow: "Пример отчёта",
    title: "Так выглядит результат — без воды",
    description:
      "Запрос «Python Developer · Москва · 1–3 года · за 30 дней». Выборка из 247 уникальных вакансий.",
    chartTitle: "Топ-10 ключевых навыков",
    chartHint: "% упоминаний в выборке",
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
    phrasesTitle: "Топ-10 формулировок",
    phrases: [
      { text: "опыт работы в команде", value: 78 },
      { text: "знание SQL обязательно", value: 64 },
      { text: "английский — Intermediate", value: 51 },
      { text: "опыт с Docker / Kubernetes", value: 44 },
      { text: "работа в Agile / Scrum", value: 39 },
      { text: "понимание REST API", value: 34 },
      { text: "опыт с микросервисами", value: 28 },
      { text: "знание принципов SOLID", value: 21 },
    ],
    qualityTitle: "Качество данных",
    qualityMetrics: [
      { label: "Покрытие key_skills", value: "87%" },
      { label: "Пустых описаний", value: "4%" },
      { label: "Ошибок прогона", value: "0" },
    ],
    dedupTitle: "Дедупликация",
    dedupLine: "Input 312 → Unique 247 → Removed 65",
  },
  testimonials: {
    eyebrow: "Отзывы",
    title: "Что говорят те, кто уже попробовал",
    items: [
      {
        quote:
          "За вечер увидела, что в моём резюме не было слов «коммерческий опыт», «команда 5+» и «менторство». Добавила, переоформила раздел — оффер получила за неделю.",
        author: "Анна К.",
        role: "Frontend Developer",
        accent: "violet" as const,
      },
      {
        quote:
          "Свожу 8 сегментов в одну таблицу за вечер вместо трёх дней. Клиенты получают не «моё мнение», а доказательства из выборки рынка.",
        author: "Игорь М.",
        role: "Карьерный консультант",
        accent: "coral" as const,
      },
      {
        quote:
          "Запускаю прогон раз в квартал по 12 ролям. Тренды видны сразу — где растёт спрос на навык, а где он уже стал базовым.",
        author: "Дарья В.",
        role: "HR-аналитик",
        accent: "aqua" as const,
      },
    ],
  },
  tryIt: {
    eyebrow: "Попробовать сейчас",
    title: "Запустите симуляцию прямо здесь",
    description:
      "Введите запрос и параметры — получите примерный результат за несколько секунд. Это локальная симуляция на основе средних по рынку.",
    placeholder: "Например, Python Developer",
    regionLabel: "Регион",
    expLabel: "Опыт",
    periodLabel: "Период",
    regions: ["Москва", "СПб", "Алматы", "Удалённо"],
    experiences: ["Любой", "Без опыта", "1–3 года", "3–6 лет", "6+ лет"],
    periods: ["За 7 дней", "За 30 дней", "За 90 дней"],
    submit: "Симулировать прогон",
    restart: "Запустить заново",
    runningLabel: "Идёт сбор",
    fullLink: "Открыть в полной версии",
    emptyHint: "Заполните поля и нажмите «Симулировать» — увидите пример сводки.",
    resultLabel: "Результат симуляции",
    note: "Это локальный мок на основе средних — для реального прогона перейдите в /analyze.",
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
          "опыт с микросервисами",
          "работа с PostgreSQL / MySQL",
          "понимание REST API",
          "опыт работы в Agile-команде",
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
          "опыт с React от 2 лет",
          "понимание Core Web Vitals",
          "code review и менторство",
          "опыт с компонентными библиотеками",
        ],
        sample: 312,
      },
      product: {
        title: "Product Manager",
        skills: [
          { name: "Roadmap", value: 81 },
          { name: "A/B тесты", value: 72 },
          { name: "SQL", value: 63 },
          { name: "Jira", value: 58 },
          { name: "User research", value: 51 },
          { name: "Метрики продукта", value: 78 },
        ],
        phrases: [
          "опыт запуска продуктов с нуля",
          "работа с метриками retention",
          "Agile / Scrum / Kanban",
          "коммуникация со стейкхолдерами",
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
          "опыт с Kubernetes в продакшене",
          "Infrastructure as Code",
          "выстраивание CI/CD pipeline",
          "мониторинг и алертинг",
        ],
        sample: 156,
      },
      analyst: {
        title: "Data Analyst",
        skills: [
          { name: "SQL", value: 91 },
          { name: "Python / Pandas", value: 74 },
          { name: "Tableau / BI", value: 62 },
          { name: "A/B тесты", value: 58 },
          { name: "Метрики бизнеса", value: 68 },
          { name: "Excel / Google Sheets", value: 81 },
        ],
        phrases: [
          "опыт с большими данными",
          "построение дашбордов",
          "коммуникация с бизнесом",
          "понимание статистики",
        ],
        sample: 198,
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Частые вопросы",
    items: [
      {
        q: "Это вообще легально?",
        a: "Да. Мы работаем только с публичными вакансиями через официальный HH API. Полные тексты не копируем и не публикуем — собираем только агрегированные сигналы.",
      },
      {
        q: "Откуда берутся данные?",
        a: "Из публичного HH API (hh.ru, hh.kz, hh.uz и др.). Никаких приватных источников или скрейпинга страниц.",
      },
      {
        q: "Хранятся ли полные описания вакансий?",
        a: "Нет. Сохраняем только метаданные прогона и агрегаты. Сырые тексты не остаются в системе после извлечения сигналов.",
      },
      {
        q: "Сколько занимает прогон?",
        a: "От нескольких секунд до пары минут — в зависимости от размера выборки и фильтров. Excel готов сразу после завершения.",
      },
      {
        q: "Что делать, если HH вернул rate-limit?",
        a: "Сервис автоматически замедляется и продолжает с того же места. На вашей стороне делать ничего не нужно.",
      },
      {
        q: "Можно ли сравнивать два прогона?",
        a: "Да. История прогонов хранит параметры и результаты — открывайте рядом и сравнивайте сегменты или периоды.",
      },
      {
        q: "Что внутри Excel-отчёта?",
        a: "Лист со списком вакансий, лист с агрегатами key_skills и фраз, лист «качество данных». Чистая структура — фильтруйте и стройте сводные.",
      },
    ],
  },
  analyze: {
    pageTitle: "Результаты прогона",
    pageDescription:
      "Сводка по выборке: топ навыков, частотные фразы, качество данных и дедупликация.",
    badge: "Результаты прогона",
    backHome: "На главную",
    mockNote: "Демо-отчёт на mock-данных — API подключим позже",
    runLabel: "Прогон",
    statusReady: "Готов",
    statusRunning: "В процессе",
    statusFailed: "Ошибка",
    excel: "Excel",
    excelSoon: "Скачивание Excel — скоро",
    kpi: {
      requested: "Запрошено",
      processed: "Обработано",
      errors: "Ошибок",
      uniqueSkills: "Уник. навыков",
    },
    skillsTitle: "Топ ключевых навыков",
    skillsHint: "% упоминаний в выборке",
    phrasesTitle: "Топ формулировок",
    phrasesHint: "% упоминаний",
    coverageTitle: "Качество данных",
    coverageCenter: "key_skills",
    coverageLegend: {
      withKeySkills: "С key_skills",
      noKeySkills: "Без key_skills",
      emptyDescription: "Пустое описание",
      errors: "Ошибки",
    },
    dedupTitle: "Дедупликация",
    dedupInput: "Input",
    dedupUnique: "Unique",
    dedupRemoved: "Removed",
    cloudTitle: "Облако навыков",
    cloudHint: "Размер — частота упоминаний",
    errorsTitle: "Ошибки по причинам",
    table: {
      skillsTitle: "Таблица навыков",
      keywordsTitle: "Таблица фраз",
      rank: "#",
      name: "Название",
      count: "Кол-во",
      share: "Доля",
      csv: "CSV",
      csvSoon: "Экспорт CSV — скоро",
    },
  },
  finalCta: {
    eyebrow: "Готовы начать",
    title: "Поймите рынок за 5 минут",
    description:
      "Запустите первый прогон бесплатно — без регистрации, прямо сейчас.",
    ctaPrimary: "Запустить анализ",
    ctaGhost: "Документация",
  },
  footer: {
    tagline:
      "Превращаем вакансии HeadHunter в понятный план улучшения резюме.",
    columns: [
      {
        title: "Продукт",
        links: [
          { label: "Возможности", href: "#features" },
          { label: "Как работает", href: "#how" },
          { label: "Пример отчёта", href: "#preview" },
          { label: "Документация", href: "/docs" },
        ],
      },
      {
        title: "Ресурсы",
        links: [
          { label: "Блог", href: "/blog" },
          { label: "Roadmap", href: "/roadmap" },
          { label: "Changelog", href: "/changelog" },
        ],
      },
      {
        title: "Юридическое",
        links: [
          { label: "Условия", href: "/legal/terms" },
          { label: "Конфиденциальность", href: "/legal/privacy" },
          { label: "Контакты", href: "/contact" },
        ],
      },
    ],
    copyright:
      "© 2026 hhResearch. Сервис не аффилирован с HeadHunter и работает только с публичным API.",
  },
} as const;

export type Dictionary = typeof ru;
