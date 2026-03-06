import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroWrapper from "@/components/HeroWrapper";
import SectionReveal from "@/components/SectionReveal";
import ContactClient from "./ContactClient";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for collaborations, inquiries, or just to say hello.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        
        {/* Cinematic Background for Contact */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroWrapper />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "120px", paddingBottom: "var(--space-4xl)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}>
            <SectionReveal direction="up">
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 7vw, 5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: "1rem",
                }}
              >
                Let&apos;s <span className="gradient-text">Connect</span>
              </h1>
            </SectionReveal>
            <SectionReveal delay={0.2} direction="up">
              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
                Whether you have a project in mind or just want to say hello, feel free to reach out.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.4} direction="up">
            <ContactClient />
          </SectionReveal>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
