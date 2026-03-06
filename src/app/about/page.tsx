import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionReveal from "@/components/SectionReveal";
import GlassCard from "@/components/GlassCard";
import TechStackMarquee from "@/components/TechStackMarquee";
import HeroWrapper from "@/components/HeroWrapper";
import Magnetic from "@/components/Magnetic";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Mana Yahia",
  description: "Learn about my journey as a Full-Stack Web Developer from Oran, Algeria.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main style={{ position: "relative", minHeight: "100vh", paddingBottom: "var(--space-4xl)", overflow: "hidden" }}>
        
        {/* Cinematic Hero Section */}
        <section style={{ position: "relative", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HeroWrapper />
          <div className="container" style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
            <SectionReveal direction="up">
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
                Beyond the <br />
                <span className="gradient-text">Software</span>
              </h1>
            </SectionReveal>
            <SectionReveal delay={0.2} direction="up">
              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
                Full-Stack Developer. Interaction Designer. <br />Digital Craftsman from Oran, Algeria.
              </p>
            </SectionReveal>
          </div>
          
          {/* Scroll Indicator */}
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", opacity: 0.5, fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase" }}>
            Scroll to Story
          </div>
        </section>

        {/* Narrative Section - Staggered Layout */}
        <section className="container" style={{ paddingTop: "var(--space-4xl)" }}>
          
          {/* Row 1: The Identity */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center", marginBottom: "var(--space-4xl)" }}>
            <SectionReveal direction="fadeIn">
              <GlassCard style={{ height: "400px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, var(--color-accent) 0%, transparent 60%)", opacity: 0.1 }} />
                <span style={{ fontSize: "5rem", opacity: 0.1 }}>MY</span>
              </GlassCard>
            </SectionReveal>
            <SectionReveal direction="up" delay={0.1}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "1.5rem" }}>Digital Craftsmanship</h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                I am <strong>Mana Yahia</strong>, a 21-year-old developer based in Oran. I believe the web is not just a place for information, but a canvas for performance and art. My mission is to build digital experiences that are technically flawless and emotionally resonant.
              </p>
            </SectionReveal>
          </div>

          {/* Row 2: The Philosophy */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center", marginBottom: "var(--space-4xl)" }}>
             <SectionReveal direction="up">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "1.5rem" }}>The Human Element</h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                Behind every line of code is a person. I solve the problem of digital mediocrity by crafting premium, high-performance platforms that capture attention and build lasting trust. Every project is a unique piece of digital art tailored to elevate your brand.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Magnetic>
                  <a href="/contact" className="btn btn-primary" style={{ padding: "1rem 2rem", borderRadius: "100px" }}>Start a Project</a>
                </Magnetic>
              </div>
            </SectionReveal>
            <SectionReveal direction="fadeIn">
              <GlassCard style={{ height: "400px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 70%, var(--color-accent-secondary) 0%, transparent 60%)", opacity: 0.1 }} />
                <span style={{ fontSize: "5rem", opacity: 0.1 }}>PH</span>
              </GlassCard>
            </SectionReveal>
          </div>
        </section>

        {/* Technical Skills Marquee */}
        <section style={{ borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.01)", padding: "var(--space-3xl) 0" }}>
          <div className="container" style={{ marginBottom: "var(--space-xl)" }}>
            <SectionReveal direction="up">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", textAlign: "center", marginBottom: "0.5rem" }}>The Arsenal</h2>
              <p style={{ color: "var(--color-text-secondary)", textAlign: "center", marginBottom: "2rem" }}>Technologies I master to build premium experiences.</p>
            </SectionReveal>
          </div>
          <TechStackMarquee />
        </section>

        {/* Arabic Trust Section */}
        <section className="container" style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-4xl)" }}>
           <SectionReveal direction="up">
            <div style={{ padding: "4rem", background: "rgba(16, 185, 129, 0.05)", borderRadius: "24px", border: "1px solid rgba(16, 185, 129, 0.1)", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1.25rem, 3vw, 2rem)", lineHeight: 1.8, color: "var(--color-text-primary)" }} dir="rtl">
                مطور مواقع ويب احترافية وتجارب تفاعلية حديثة. نحن لا نصمم مجرد مواقع إلكترونية، بل نبني تجارب رقمية حية ومتطورة تعكس هوية مشروعك.
              </p>
              <p style={{ marginTop: "2rem", color: "var(--color-accent)", fontWeight: 600 }}>Building the future from Algeria.</p>
            </div>
          </SectionReveal>
        </section>

      </main>
      <Footer settings={settings} />
    </>
  );
}
