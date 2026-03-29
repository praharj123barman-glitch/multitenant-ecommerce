import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"],
    staticOptions: {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    },
  },
  admin: {
    useAsTitle: "filename",
  },
  access: {
    read: () => true, // public media
    create: ({ req: { user } }) => !!user, // authenticated users
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
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
