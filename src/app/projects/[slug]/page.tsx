import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroWrapper from "@/components/HeroWrapper";
import SectionReveal from "@/components/SectionReveal";
import GlassCard from "@/components/GlassCard";
import Magnetic from "@/components/Magnetic";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  const settings = await getSiteSettings();
  
  if (!project) return { title: "Project Not Found" };

  const images = project.featuredUrl ? [{ url: project.featuredUrl, alt: project.title }] : [];

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`,
      siteName: `${settings.siteTitle} Portfolio`,
      images,
      type: "article",
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [project, settings] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: {
        gallery: {
          select: { id: true, url: true, alt: true, width: true, height: true },
        },
      },
    }),
    getSiteSettings(),
  ]);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main style={{ position: "relative", minHeight: "100vh", paddingBottom: "var(--space-4xl)", overflow: "hidden" }}>
        
        {/* Project Hero Section */}
        <section style={{ position: "relative", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HeroWrapper />
          
          {/* Background Blurred Image Reveal */}
          {project.featuredUrl && (
            <div 
              style={{ 
                position: "absolute", 
                inset: 0, 
                background: `url(${project.featuredUrl}) center/cover`, 
                filter: "blur(100px) saturate(1.5)", 
                opacity: 0.15,
                zIndex: 1
              }} 
            />
          )}

          <div className="container" style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <SectionReveal direction="up">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                <Link href="/projects" style={{ textDecoration: "none" }}>
                  <Magnetic>
                    <div style={{ color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      ← Back to Library
                    </div>
                  </Magnetic>
                </Link>
              </div>
            </SectionReveal>
            
            <SectionReveal delay={0.1} direction="up">
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  marginBottom: "1.5rem",
                }}
              >
                {project.title}
              </h1>
            </SectionReveal>

            <SectionReveal delay={0.2} direction="up">
              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
                {project.summary}
              </p>
            </SectionReveal>
          </div>
        </section>

        {/* Project Content */}
        <article className="container" style={{ maxWidth: "1000px", position: "relative", zIndex: 20 }}>
          
          {/* Main Showcase Image */}
          <SectionReveal direction="fadeIn">
            <GlassCard style={{ padding: "0", borderRadius: "32px", overflow: "hidden", marginBottom: "var(--space-4xl)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {project.featuredUrl && (
                <div style={{ width: "100%", height: "auto", aspectRatio: "16/9", background: `url(${project.featuredUrl}) center/cover` }} />
              )}
            </GlassCard>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
            
            {/* Left Column: Details & Tech */}
            <div>
               <SectionReveal direction="up">
                <div style={{ marginBottom: "3rem" }}>
                  <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "1rem" }}>Technologies Used</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {project.techTags.map(tag => (
                      <span key={tag} style={{ fontSize: "0.875rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--color-text-secondary)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {((project as any).liveUrl || (project as any).githubUrl) && (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "0.5rem" }}>Links</h3>
                    {(project as any).liveUrl && (
                      <Magnetic>
                        <a href={(project as any).liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: "flex", width: "100%", justifyContent: "center", padding: "1rem" }}>🚀 Launch Live App</a>
                      </Magnetic>
                    )}
                    {(project as any).githubUrl && (
                      <Magnetic>
                        <a href={(project as any).githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: "flex", width: "100%", justifyContent: "center", padding: "1rem" }}>Source Code</a>
                      </Magnetic>
                    )}
                  </div>
                )}
              </SectionReveal>
            </div>

            {/* Right Column: Case Study */}
            <SectionReveal direction="up" delay={0.2}>
              <div
                className="case-study-content"
                style={{
                  lineHeight: 1.8,
                  color: "var(--color-text-secondary)",
                  fontSize: "1.125rem",
                }}
                dangerouslySetInnerHTML={{
                  __html: project.contentMDX
                    .replace(/^### (.*$)/gm, '<h3 style="color: var(--color-text-primary); font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; border-left: 4px solid var(--color-accent); padding-left: 1rem;">$1</h3>')
                    .replace(/^## (.*$)/gm, '<h2 style="color: var(--color-text-primary); font-size: 2rem; font-weight: 800; margin: 3rem 0 1.5rem; letter-spacing: -0.02em;">$1</h2>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary);">$1</strong>')
                    .replace(/^- (.*$)/gm, '<li style="margin: 0.5rem 0; margin-left: 1.5rem;">$1</li>')
                    .replace(/\n\n/g, "<br/><br/>"),
                }}
              />
            </SectionReveal>
          </div>

          {/* Gallery Grid */}
          {project.gallery.length > 0 && (
            <section style={{ marginTop: "var(--space-4xl)" }}>
               <SectionReveal direction="up">
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "2rem" }}>Project <span className="gradient-text">Gallery</span></h2>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
                {project.gallery.map((media, i) => (
                  <SectionReveal key={media.id} direction="up" delay={i * 0.1}>
                    <GlassCard style={{ padding: "0", borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width: "100%", height: "100%", background: `url(${media.url}) center/cover` }} />
                    </GlassCard>
                  </SectionReveal>
                ))}
              </div>
            </section>
          )}

        </article>
      </main>
      <Footer settings={settings} />
    </>
  );
}
