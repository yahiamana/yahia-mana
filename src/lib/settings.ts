import { prisma } from "./prisma";
import { cache } from "react";

/**
 * Fetch the global site settings from the database.
 * Uses React cache() for request-memoization.
 * Defaults to the 'default' id row as defined in Prisma schema.
 */
export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { 
        id: "default",
        siteTitle: "Mana Yahia",
        siteTagline: "Full-Stack Web Developer & Designer",
        heroHeading: "Crafting Digital Excellence",
        heroSubheading: "I build interactive, high-performance web experiences that merge aesthetics with functionality.",
      }
    });
    return settings;
  } catch (error) {
    console.error("[lib/settings] Failed to fetch site settings:", error);
    // Return safe defaults if DB fails
    return {
      siteTitle: "Mana Yahia",
      siteTagline: "Full-Stack Web Developer",
      heroHeading: "Crafting Digital Excellence",
      heroSubheading: "I build interactive, high-performance web experiences.",
      heroCta: "View Projects",
      heroCtaLink: "#projects",
      contactEmail: "",
      socialGithub: "",
      socialLinkedin: "",
      socialTwitter: "",
      metaOgImage: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg", // Professional branded fallback
    };
  }
});
