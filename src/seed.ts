import { getPayload } from "payload";
import config from "./payload.config";

const categories = [
  { name: "Templates", slug: "templates", icon: "📄", color: "from-blue-500/10 to-blue-600/10", description: "Website templates, landing pages, and starter kits" },
  { name: "Courses", slug: "courses", icon: "🎓", color: "from-purple-500/10 to-purple-600/10", description: "Video courses, tutorials, and educational content" },
  { name: "E-Books", slug: "e-books", icon: "📚", color: "from-amber-500/10 to-amber-600/10", description: "Digital books, guides, and written resources" },
  { name: "Design Assets", slug: "design-assets", icon: "🎨", color: "from-pink-500/10 to-pink-600/10", description: "Icons, illustrations, UI kits, and graphics" },
  { name: "Software", slug: "software", icon: "💻", color: "from-emerald-500/10 to-emerald-600/10", description: "Tools, plugins, extensions, and apps" },
  { name: "Music", slug: "music", icon: "🎵", color: "from-red-500/10 to-red-600/10", description: "Audio tracks, sound effects, and music loops" },
  { name: "Photography", slug: "photography", icon: "📷", color: "from-cyan-500/10 to-cyan-600/10", description: "Stock photos, presets, and photo bundles" },
  { name: "Videos", slug: "videos", icon: "🎬", color: "from-orange-500/10 to-orange-600/10", description: "Stock footage, motion graphics, and video templates" },
];

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding categories...");

  for (const category of categories) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: category.slug } },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "categories",
        data: category,
      });
      console.log(`  Created: ${category.name}`);
    } else {
      console.log(`  Skipped (exists): ${category.name}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
