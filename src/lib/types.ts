export interface Profile {
  name: string;
  tagline: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  scheduleUrl: string;
  availability: string;
  availabilityShort: string;
  timezone: string;
  rolesTargeted: string[];
  title: string;
  photo: string;
  education: string;
  languages: string[];
}

export interface Stat {
  value: string;
  unit: string;
  label: string;
}

export interface About {
  intro: string;
  paragraphs: string[];
  quickFacts: { label: string; value: string }[];
  stats: Stat[];
}

export interface HeadlineMetric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  domain: string;
  featured: boolean;
  image?: string;
  headlineMetric: HeadlineMetric;
  summary: string;
  problem: string;
  approach: string[];
  tools: string[];
  insights: string[];
  impact: string;
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  logo?: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  end: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  type?: string;
}

export interface Tool {
  name: string;
  logo: string;
  color: string;
}
