import { existsSync } from "node:fs";
import path from "node:path";
import { DevLogSection } from "@/components/blog/dev-log-section";
import { ContactSection } from "@/components/contact/contact-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { Hero } from "@/components/home/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import { SkillsSection } from "@/components/skills/skills-section";
import { getPosts } from "@/lib/blog/posts";
import { experience, projects, skills } from "@/lib/content";
import { pageMetadata, siteDescription } from "@/lib/site";

// Vercel names downloads after the file itself, so this is the name visitors get.
const cvFile = "Samad-Ali-CV.pdf";

// Checked when the page is built, so the button appears once the CV is in public/.
const cvHref = existsSync(path.join(process.cwd(), "public", cvFile))
  ? `/${cvFile}`
  : undefined;

export const metadata = pageMetadata({
  description: siteDescription,
  path: "/",
});

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero cvHref={cvHref} />
      <ExperienceSection roles={experience} />
      <SkillsSection skills={skills} projects={projects} />
      <ProjectsSection projects={projects} />
      <DevLogSection posts={getPosts()} />
      <ContactSection />
    </main>
  );
}
