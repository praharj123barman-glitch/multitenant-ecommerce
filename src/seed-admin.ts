import { getPayload } from "payload";
import config from "./payload.config";

async function seedAdmin() {
  const payload = await getPayload({ config });

  // Create or find admin user
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: "admin@multimart.com" } },
    limit: 1,
  });

  let adminUser;
  if (existing.docs.length > 0) {
    adminUser = existing.docs[0];
    // Ensure role is admin
    await payload.update({
      collection: "users",
      id: adminUser.id as string,
      data: { role: "admin" },
    });
    console.log("Updated existing user to admin:", adminUser.email);
  } else {
    adminUser = await payload.create({
      collection: "users",
      data: {
        email: "admin@multimart.com",
        password: "admin123",
        name: "Platform Admin",
        role: "admin",
      },
    });
    console.log("Created admin user: admin@multimart.com");
  }

  // Create a couple of test sellers + tenants if none exist
  const tenantCheck = await payload.find({ collection: "tenants", limit: 0 });
  if (tenantCheck.totalDocs === 0) {
    const sellers = [
      { email: "alice@example.com", name: "Alice", store: "Alice's Digital Shop", slug: "alice-shop", description: "Premium digital templates and courses" },
      { email: "bob@example.com", name: "Bob", store: "Bob's Creative Studio", slug: "bob-studio", description: "Design assets and creative resources" },
      { email: "carol@example.com", name: "Carol", store: "Carol's Code Lab", slug: "carol-code", description: "Software tools and developer resources" },
    ];

    for (const s of sellers) {
      const user = await payload.create({
        collection: "users",
        data: { email: s.email, password: "seller123", name: s.name, role: "seller" },
      });

      await payload.create({
        collection: "tenants",
        data: {
          name: s.store,
          slug: s.slug,
          owner: user.id as string,
          description: s.description,
          verified: s.name === "Alice", // Only Alice is verified
        },
      });

      console.log(`  Created seller: ${s.name} → ${s.store}`);
    }
  } else {
    console.log(`  Skipped tenants (${tenantCheck.totalDocs} already exist)`);
  }

  // Seed categories if needed
  const catCheck = await payload.find({ collection: "categories", limit: 0 });
  if (catCheck.totalDocs === 0) {
    const categories = [
      { name: "Templates", slug: "templates", icon: "📄", color: "from-blue-500/10 to-blue-600/10", description: "Website templates and starter kits" },
      { name: "Courses", slug: "courses", icon: "🎓", color: "from-purple-500/10 to-purple-600/10", description: "Video courses and tutorials" },
      { name: "Design Assets", slug: "design-assets", icon: "🎨", color: "from-pink-500/10 to-pink-600/10", description: "Icons, illustrations, and graphics" },
    ];
    for (const c of categories) {
      await payload.create({ collection: "categories", data: c });
      console.log(`  Created category: ${c.name}`);
    }
  }

  console.log("\n✅ Done! Login credentials:");
  console.log("   Admin:  admin@multimart.com / admin123");
  console.log("   Seller: alice@example.com / seller123");
  console.log("\n   Visit: http://localhost:3000/admin-panel");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
