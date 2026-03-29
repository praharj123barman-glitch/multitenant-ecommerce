import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true, // public categories
    create: ({ req: { user } }) => {
      if (!user) return false;
      return (user as Record<string, unknown>).role === "admin";
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      return (user as Record<string, unknown>).role === "admin";
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return (user as Record<string, unknown>).role === "admin";
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Emoji icon for the category (e.g. 📄)",
      },
    },
    {
      name: "color",
      type: "text",
      admin: {
        description: "Tailwind gradient classes (e.g. from-blue-500/10 to-blue-600/10)",
      },
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: {
        description: "Parent category for subcategories",
      },
    },
  ],
};
