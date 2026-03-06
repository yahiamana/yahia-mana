import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import HomeClient from "./HomeClient";
import HeroWrapper from "@/components/HeroWrapper";
import SectionReveal from "@/components/SectionReveal";
import SignatureReveal from "@/components/SignatureReveal";
import GlassCard from "@/components/GlassCard";
import TechStackMarquee from "@/components/TechStackMarquee";
import HomeAboutSnippet from "@/components/HomeAboutSnippet";
import Magnetic from "@/components/Magnetic";

export default async function HomePage() {
  const settings = await getSiteSettings();
  
  // Fetch published projects server-side
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
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
    console.warn("[HomePage] Database unavailable, using fallback projects:", e);
  }

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      {/* ─── Hero Section ─── */}
      <section
        id="hero"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <HeroWrapper />

        {/* Hero content overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 var(--container-padding)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Hero Badge */}
          <SectionReveal delay={0.1} direction="down">
            <div 
              className="glass"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                borderRadius: "100px",
                marginBottom: "2rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <span style={{ width: "6px", height: "6px", background: "var(--color-accent)", borderRadius: "50%", display: "inline-block" }} />
              Open for 2026 Projects
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2} direction="fadeIn">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              <span className="gradient-text" style={{ filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))" }}>
                {settings?.heroHeading || "Mana Yahia"}
              </span>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.4} direction="up">
            <p
              style={{
                fontSize: "clamp(1.125rem, 2.5vw, 1.625rem)",
                color: "var(--color-text-secondary)",
                maxWidth: "650px",
                margin: "0 auto 3rem",
                lineHeight: 1.5,
                fontWeight: 300,
              }}
            >
              {settings?.heroSubheading ||
                "Full-Stack Web Developer & Interactive Web Designer. Building modern, interactive and high-performance web experiences."}
            </p>
          </SectionReveal>

          <SectionReveal delay={0.6} direction="up">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
              <Magnetic strength={0.2}>
                <a 
                  href={settings.heroCtaLink || "#projects"} 
                  className="btn btn-primary px-10 py-5 text-lg rounded-full" 
                  id="hero-cta-primary"
                  style={{
                    fontSize: "1.0625rem",
                    transition: "transform 0.4s var(--ease-out-expo)",
                  }}
                >
                  {settings.heroCta || "Explore My Work"}
                </a>
              </Magnetic>
              
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  fontSize: "1.1rem",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.02em",
                  maxWidth: "400px",
                  lineHeight: 1.4,
                  fontWeight: 400
                }}
              >
                مطور مواقع ويب احترافية وتجارب تفاعلية حديثة
                <br />
                <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>Crafting Digital Excellence across boundaries.</span>
              </span>
            </div>
          </SectionReveal>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Ascend
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--color-accent), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── Tech Stack Marquee ─── */}
      <TechStackMarquee />

      {/* ─── About Snippet ─── */}
      <HomeAboutSnippet />

      {/* ─── Projects Section ─── */}
      <section
        id="projects"
        className="section"
        style={{ padding: "var(--space-4xl) var(--container-padding)" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              A selection of interactive experiences and performance-driven applications.
            </p>
          </div>

          <HomeClient projects={projects} />
        </div>
      </section>

      {/* ─── What I Create Section ─── */}
      <section
        className="section"
        style={{ padding: "var(--space-4xl) var(--container-padding)" }}
      >
        <div className="container">
          <SectionReveal direction="up">
            <div style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                What I <span className="gradient-text">Create</span>
              </h2>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                en: "Web Applications",
                ar: "تطبيقات ويب احترافية",
                icon: "⚡",
              },
              {
                en: "Interactive Websites",
                ar: "مواقع تفاعلية عصرية",
                icon: "💫",
              },
              {
                en: "E-commerce Systems",
                ar: "متاجر إلكترونية متكاملة",
                icon: "🛍️",
              },
              {
                en: "SaaS Platforms",
                ar: "منصات خدمية سحابية",
                icon: "🚀",
              },
            ].map((skill, i) => (
              <SectionReveal key={skill.en} delay={i * 0.15} direction="up">
                <GlassCard hoverEffect={true} className="p-8 text-center h-full flex flex-col justify-center items-center gap-4">
                  <span style={{ fontSize: "2.5rem" }}>{skill.icon}</span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      margin: 0,
                    }}
                  >
                    {skill.en}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.125rem",
                      fontWeight: 400,
                      color: "var(--color-accent-secondary)", // Emerald accent for Arabic to pop slightly
                      margin: 0,
                    }}
                  >
                    {skill.ar}
                  </p>
                </GlassCard>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <SignatureReveal />
      <Footer />
    </>
  );
}
