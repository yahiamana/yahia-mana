import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionReveal from "@/components/SectionReveal";
import GlassCard from "@/components/GlassCard";
import LightBeamEffect from "@/components/LightBeamEffect";
import { getSiteSettings } from "@/lib/settings";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <LightBeamEffect />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: "600px",
            padding: "0 var(--container-padding)",
          }}
        >
          <SectionReveal direction="fadeIn">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(5rem, 15vw, 10rem)",
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: "1rem",
                opacity: 0.1,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                zIndex: -1,
                userSelect: "none",
              }}
            >
              404
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.2} direction="up">
            <GlassCard className="p-12">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Lost in the <span className="gradient-text">Void</span>
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  marginBottom: "2.5rem",
                }}
              >
                The page you are looking for has ascended to another dimension or never existed in this timeline.
              </p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <Link
                  href="/"
                  className="btn btn-primary px-8 py-3 rounded-full"
                  style={{ textDecoration: "none" }}
                >
                  Return Home
                </Link>
                <Link
                  href="/projects"
                  className="btn px-8 py-3 rounded-full"
                  style={{ 
                    textDecoration: "none",
                    border: "1px solid var(--glass-border)",
                    background: "var(--glass-bg)"
                  }}
                >
                  View Projects
                </Link>
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
