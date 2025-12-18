/**
 * Main Site Configuration
 *
 * This file combines all configuration modules into a single export.
 * Each section is organized in its own file for better maintainability.
 */

import { personal } from "./personal";
import { about } from "./about";
import { projects } from "./projects";
import { experience } from "./experience";
import { caseStudies } from "./caseStudies";
import { blogs } from "./blogs";

export const siteConfig = {
  // Personal information & site metadata
  name: personal.name,
  title: personal.title,
  tagline: personal.tagline,
  description: personal.description,
  accentColor: personal.accentColor,
  social: personal.social,

  // About section
  aboutMe: about.aboutMe,
  skills: about.skills,

  // Projects
  projects,

  // Work experience
  experience,

  // Case studies (detailed production system deep-dives)
  caseStudies,

  // Blogs (for future use)
  blogs,
};
