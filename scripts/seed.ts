import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Database seed script.
 * Creates an initial admin user and sample projects.
 *
 * Usage:
 *   Set SEED_ADMIN_PASSWORD and SEED_ADMIN_EMAIL env vars, then run:
 *   npx tsx scripts/seed.ts
 *
 * ⚠️ Never store plaintext passwords in code or version control.
 */

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ─── 1. Create Admin User ───

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@portfolio.dev";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("❌ SEED_ADMIN_PASSWORD environment variable is required.");
    console.error("   Set it before running the seed script:");
    console.error("   SEED_ADMIN_PASSWORD=your-strong-password npx tsx scripts/seed.ts");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isActive: true,
      tfaEnabled: false,
    },
  });

  console.log(`✅ Admin user created: ${admin.email} (role: ${admin.role})`);

  // ─── 2. Create Site Settings ───

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: "Developer Portfolio",
      siteTagline: "Front-End Developer & Creative Technologist",
      heroHeading: "Crafting Digital Experiences",
      heroSubheading:
        "I build interactive, performant, and visually stunning web applications using modern technologies.",
      heroCta: "Explore My Work",
      heroCtaLink: "#projects",
      contactEmail: adminEmail,
      socialGithub: "https://github.com",
      socialLinkedin: "https://linkedin.com",
      socialTwitter: "https://twitter.com",
    },
  });

  console.log("✅ Site settings initialized");

  // ─── 3. Create Sample Projects ───

  const sampleProjects = [
    {
      title: "E-Commerce Platform Redesign",
      slug: "ecommerce-redesign",
      summary:
        "Complete redesign of a major e-commerce platform, improving conversion rates by 34% through data-driven UX decisions.",
      contentMDX: `# E-Commerce Platform Redesign

## The Challenge
The client's existing e-commerce platform suffered from high bounce rates and a 2.1% conversion rate, well below industry average.

## Process
We started with comprehensive user research, including heat mapping, session recordings, and A/B testing over 6 weeks.

### Key Insights
- Mobile users abandoned cart 3x more than desktop
- Product search was underutilized due to poor discoverability
- Checkout flow had 5 steps (reduced to 2)

## Solution
A complete UI overhaul with focus on:
- Mobile-first responsive design
- Streamlined 2-step checkout
- AI-powered product recommendations
- Progressive image loading with blur placeholders

## Results
- **34% increase** in conversion rate
- **52% reduction** in cart abandonment
- **2.3s** average page load (down from 6.8s)
- **4.8/5** user satisfaction score`,
      techTags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe", "PostgreSQL"],
      metrics: {
        conversion: "+34%",
        performance: "2.3s load",
        satisfaction: "4.8/5",
      },
      published: true,
      sortOrder: 1,
      featuredUrl: "samples/ecommerce-hero",
    },
    {
      title: "Real-Time Analytics Dashboard",
      slug: "analytics-dashboard",
      summary:
        "A real-time data visualization dashboard processing 10M+ events daily with sub-second rendering.",
      contentMDX: `# Real-Time Analytics Dashboard

## The Challenge
The client needed a dashboard capable of visualizing millions of data points in real-time without performance degradation.

## Process
- Evaluated D3.js, Chart.js, and custom WebGL solutions
- Built a custom rendering pipeline using Canvas 2D for standard charts and WebGL for large datasets
- Implemented web workers for data processing to keep the main thread free

## Solution
A modular dashboard system with:
- Drag-and-drop widget arrangement
- Real-time WebSocket data streaming
- Custom WebGL scatter plots for 1M+ point datasets
- Exportable PDF reports

## Results
- **Sub-100ms** render times for 100K data points
- **Zero frame drops** during real-time updates
- **60fps** smooth interactions throughout`,
      techTags: ["TypeScript", "WebGL", "D3.js", "WebSockets", "Node.js", "Redis"],
      metrics: {
        render: "<100ms",
        fps: "60fps",
        dataPoints: "10M+/day",
      },
      published: true,
      sortOrder: 2,
      featuredUrl: "samples/dashboard-hero",
    },
    {
      title: "Interactive 3D Product Configurator",
      slug: "3d-configurator",
      summary:
        "WebGL-powered product configurator allowing users to customize and preview products in real-time 3D.",
      contentMDX: `# Interactive 3D Product Configurator

## The Challenge
An automotive accessories company wanted customers to see real-time 3D previews of their customized products before purchasing.

## Process
- Researched Three.js, Babylon.js, and PlayCanvas
- Chose Three.js for its ecosystem and community
- Optimized assets: DRACO compression, KTX2 textures, LOD models
- Built a custom material system for real-time color/texture swapping

## Solution
- Real-time 3D preview with physically-based rendering (PBR)
- Material and color customization controls
- AR preview using WebXR
- Shareable configuration URLs
- Mobile-optimized with progressive quality loading

## Results
- **89% engagement** rate (vs 23% with static images)
- **3.2x** increase in add-to-cart rate
- **< 3 seconds** initial load on 4G`,
      techTags: ["Three.js", "WebGL", "React", "DRACO", "KTX2", "WebXR"],
      metrics: {
        engagement: "89%",
        addToCart: "+3.2x",
        loadTime: "<3s on 4G",
      },
      published: true,
      sortOrder: 3,
      featuredUrl: "samples/configurator-hero",
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log(`✅ ${sampleProjects.length} sample projects created`);

  // ─── 4. Create Sample Audit Log ───

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "seed.complete",
      meta: {
        projectsCreated: sampleProjects.length,
        adminEmail: admin.email,
      },
    },
  });

  console.log("✅ Initial audit log created");
  console.log("\n🎉 Seed complete!");
  console.log(`   Admin login: ${adminEmail}`);
  console.log("   Password: (value of SEED_ADMIN_PASSWORD env var)\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
