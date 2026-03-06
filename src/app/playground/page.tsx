import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaygroundClient from "./PlaygroundClient";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Micro-experiments and creative coding demos showcasing WebGL, animations, and interactive techniques.",
};

export default async function PlaygroundPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteTitle={settings.siteTitle} />
      <main style={{ paddingTop: "100px", minHeight: "100vh" }}>
        <div className="container">
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <span className="gradient-text">Playground</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              textAlign: "center",
              maxWidth: "500px",
              margin: "0 auto var(--space-3xl)",
            }}
          >
            Micro-experiments and creative coding explorations.
          </p>

          <PlaygroundClient />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
