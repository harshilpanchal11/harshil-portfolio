import profileJson from '@/data/profile.json';
import aboutJson from '@/data/about.json';
import projectsJson from '@/data/projects.json';
import experienceJson from '@/data/experience.json';
import skillsJson from '@/data/skills.json';
import educationJson from '@/data/education.json';
import certificationsJson from '@/data/certifications.json';
import toolsJson from '@/data/tools.json';
import type {
  Profile,
  About,
  Project,
  Experience,
  SkillGroup,
  Education,
  Certification,
  Tool,
} from './types';

export const profile = profileJson as Profile;
export const about = aboutJson as About;
export const projects = projectsJson as Project[];
export const experience = experienceJson as Experience[];
export const skills = skillsJson as SkillGroup[];
export const education = educationJson as Education[];
export const certifications = certificationsJson as Certification[];
export const tools = toolsJson as Tool[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
