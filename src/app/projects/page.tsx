import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroWrapper from "@/components/HeroWrapper";
import SectionReveal from "@/components/SectionReveal";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of interactive web experiences, creative development projects, and case studies.",
};

export default async function ProjectsPage() {
  const settings = await getSiteSettings();
  let projects: any[] = [];

  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        featuredUrl: true,
        techTags: true,
      },
    });
  } catch (e) {
    console.warn("[ProjectsPage] Database unavailable:", e);
  }

  // Extract unique tags for filtering
  const allTags = [...new Set(projects.flatMap((p) => p.techTags))].sort();

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main style={{ minHeight: "100vh", overflow: "hidden" }}>
        
        {/* Cinematic Header for Projects */}
        <section style={{ position: "relative", height: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HeroWrapper />
          <div className="container" style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
            <SectionReveal direction="up">
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Selected <span className="gradient-text">Works</span>
              </h1>
            </SectionReveal>
            <SectionReveal delay={0.2} direction="up">
              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", maxWidth: "500px", margin: "1rem auto 0" }}>
                A collection of interactive experiences and high-performance digital products.
              </p>
            </SectionReveal>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "var(--space-4xl)" }}>
          <ProjectsClient projects={projects} allTags={allTags} />
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
