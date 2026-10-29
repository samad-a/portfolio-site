import { existsSync } from "node:fs";
import path from "node:path";
import { ContactSection } from "@/components/contact/contact-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { Hero } from "@/components/home/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import { SkillsSection } from "@/components/skills/skills-section";
import { experience, projects, skills } from "@/lib/content";

// Vercel names downloads after the file itself, so this is the name visitors get.
const cvFile = "Samad-Ali-CV.pdf";

// Checked when the page is built, so the button appears once the CV is in public/.
const cvHref = existsSync(path.join(process.cwd(), "public", cvFile))
  ? `/${cvFile}`
  : undefined;

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero cvHref={cvHref} />
      <ExperienceSection roles={experience} />
      <SkillsSection skills={skills} projects={projects} />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  );
}
