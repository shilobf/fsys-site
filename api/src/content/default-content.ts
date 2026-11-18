// Initial site content, taken from the landing page spec deck.
// On first run it is written to data/content.json; after that the admin edits that file via the API.

export interface Capability {
  title: string;
  subtitle: string;
  steps: string;
  image: string;
  /** Optional interactive 3D simulation (an HTML page) shown with this capability. */
  simulation?: string;
}

export interface Product {
  title: string;
  description: string;
  bullets: string[];
  image: string;
}

export interface SiteContent {
  company: { name: string; shortName: string; logo: string };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    lines: string[];
    image: string;
    /** Background videos played in sequence; `image` is the poster/fallback. */
    videos: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: { value: string; label: string }[];
  about: { title: string; lead: string; paragraphs: string[]; image: string };
  capabilities: { title: string; intro: string; items: Capability[] };
  process: { title: string; steps: string[] };
  products: { title: string; intro: string; items: Product[]; background: string };
  contact: {
    title: string;
    intro: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  company: {
    name: 'אפסיס הנדסה ואינטגרציה בע״מ',
    shortName: 'F-SYS',
    logo: '/images/logo.png',
  },
  hero: {
    eyebrow: '',
    title: 'One Stop Shop In-House',
    tagline: 'ENGINEERING • INTEGRATION • PRODUCTION',
    lines: [
      'פיתוח, תכנון וייצור של תשתיות חשמל, אנרגיה ובקרה',
      'פתרונות אינטגרטיביים לעולם הבטחוני ולכלי רכב משימתיים',
    ],
    image: '/images/hero-harness.webp',
    videos: ['/videos/harness-assembly.mp4', '/videos/hero-1.mp4', '/videos/hero-2.mp4', '/videos/hero-3.mp4'],
    ctaPrimary: 'תחומי הפעילות',
    ctaSecondary: 'צרו קשר',
  },
  stats: [
    { value: '2007', label: 'שנת תחילת הפעילות' },
    { value: 'BTP', label: 'Build to Print' },
    { value: 'BTS', label: 'Build to Spec' },
    { value: 'ישראל · ארה״ב', label: 'ייצור בארץ ובארה״ב' },
  ],
  about: {
    title: 'אודות',
    lead:
      'אפסיס הנדסה ואינטגרציה היא ספקית מובילה של פתרונות ומערכות מגוונות עבור יישומים צבאיים, בדגש על אינטגרציה בפרויקטי רכב משימתי ועל פלטפורמות ומתקני קבע.',
    paragraphs: [
      'אנו שותפים מלאים בפעילות יחד עם חברות ביטחוניות מובילות ומציעים שירותי אפיון, תכנון, פיתוח, ייצור ותמיכה מקיפים ומשולבים בפרויקטי דגל ברמה לאומית. לחברה התמחות במתן פתרונות מתקדמים ומלאים במודל BTP (Build to Print) ו-BTS (Build to Spec) המותאמים לצרכי הלקוחות.',
      'הפעילות החלה בשנת 2007 ובשנים האחרונות אפסיס הנדסה ואינטגרציה מציגה צמיחה ארגונית, מקצועית ועלייה בהיקף הפעילות שלה מול לקוחותיה.',
      'החברה מספקת מגוון מקיף של פתרונות ומכלולים אינטגרטיביים, כולל רתמות חוטים, זיווד חשמלי ואלקטרוני מגוון, הקשחת רכיבים ומגוון הולך וגדל של תחומי הנדסה כגון הנדסת מערכת, הנדסת כבילה, הנדסה מכנית לזיווד אלקטרוני וחשמלי, תוכנה ובקרה, תאימות אלקטרומגנטית, תנאי סביבה ועוד.',
      'אנו משתלבים בתוכניות ופרויקטים החל משלבי האפיון הראשוני, התכנון והפיתוח, דרך ניהול פרויקטים ותמיכה מותאמת ללקוח ועד לשלבי ההתקנה הסופית ושלבי האימות וההוכחה.',
      'אנו דוגלים בקשרים משמעותיים ואמון הדדי עם ספקים, לקוחות ושותפים עסקיים כבסיס חשוב לעסק משגשג. לאורך שנות פעילותה חרתה אפסיס על דגלה הקפדה על מקצוענות, אמינות ושירות, תוך מתן דגש על זמינות גבוהה ללקוחות וזמני תגובה וביצוע מהירים.',
    ],
    image: '/images/production.jpg',
  },
  capabilities: {
    title: 'תחומי ליבה',
    intro: 'מהנדסה מפורטת ועד ייצור, בדיקות והתקנה, תחת קורת גג אחת.',
    items: [
      {
        title: 'תכנון וייצור כבילה',
        subtitle: 'זרם גבוה, פיקוד, תקשורת',
        steps: 'תכן • רכש • ייצור • בדיקות',
        image: '/images/cabling.jpg',
      },
      {
        title: 'מערכות בקרה',
        subtitle: 'ניהול פלטפורמות והנדסת מערכת',
        steps: 'אפיון • תכן • אינטגרציה',
        image: '/images/control.png',
      },
      {
        title: 'ייצור וניהול אנרגיה',
        subtitle: 'גנרטורים ייחודיים ומערכות מצברים',
        steps: 'פיתוח • ייצור • בדיקות',
        image: '/images/energy.jpg',
        simulation: '/sims/generator-3d.html',
      },
      {
        title: 'זיווד אלקטרוני ומארזים',
        subtitle: 'עמידות בתנאי סביבה קשים',
        steps: 'תכן • רכש • ייצור • בדיקות',
        image: '/images/enclosure.png',
      },
    ],
  },
  process: {
    title: 'מקצה לקצה',
    steps: [
      'ניהול פרויקטים',
      'גיבוש קונספט',
      'הנדסה מפורטת',
      'רכש',
      'ייצור בארץ ובארה״ב',
      'התקנות',
      'שירות ותחזוקה',
    ],
  },
  products: {
    title: 'קווי מוצרים',
    intro: 'מוצרים ומערכות שפותחו לשרידות מבצעית בתנאי שטח.',
    background: '/images/field.jpg',
    items: [
      {
        title: 'מיגון מפני תקיפות אלקטרוניות ונשק אנרגטי',
        description: 'מוצרי מיגון לרכיבים ומערכות',
        bullets: [
          'הגנה אקטיבית – מסננים ומודולים אלקטרוניים',
          'הגנה פסיבית – קפסולות מיגון לרכיבים קריטיים מאוימים',
        ],
        image: '/images/protection.png',
      },
      {
        title: 'מערכות בקרה',
        description: 'מערכת מנהלת לפלטפורמה מרובת מערכות משנה',
        bullets: [],
        image: '/images/vehicle-panel.jpg',
      },
      {
        title: 'מערכות ייצור וניהול אנרגיה',
        description: 'מוצרי Custom Made לאנרגיה זמינה וכשירות מבצעית',
        bullets: [],
        image: '/images/pdu.png',
      },
      {
        title: 'מערכות חשמל לתנאי קיצון',
        description: 'מערכות חשמל מורכבות ברמת עמידות לתנאי קיצון',
        bullets: ['תנאי סביבה, ונדליזם, אורך חיים, שרידות מבצעית'],
        image: '/images/harness.jpg',
      },
    ],
  },
  contact: {
    title: 'בואו נדבר',
    intro: 'יש לכם פרויקט, אפיון או שאלה? נשמח לשמוע.',
    email: 'office@fsysint.com',
    phone: '054-2872155',
    address: 'פארק הייטק יקנעם',
    website: 'www.fsysint.com',
  },
};
