// Mirrors api/src/content/default-content.ts (SiteContent). Keep the two in sync.

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
