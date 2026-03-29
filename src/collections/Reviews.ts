import type { CollectionConfig, Access } from "payload";

const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

const isAdminOrAuthor: Access = ({ req: { user } }) => {
  if (!user) return false;
  if ((user as Record<string, unknown>).role === "admin") return true;
  return { customer: { equals: user.id } };
};

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "id",
  },
  access: {
    read: () => true, // public reviews
    create: ({ req: { user } }) => !!user, // authenticated users
    update: isAdminOrAuthor,
    delete: isAdminOrAuthor,
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "title",
      type: "text",
      maxLength: 150,
    },
    {
      name: "body",
      type: "textarea",
      maxLength: 2000,
    },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      access: {
        update: ({ req: { user } }) => {
          if (!user) return false;
          return (user as Record<string, unknown>).role === "admin";
        },
      },
      admin: {
        position: "sidebar",
        description: "Customer purchased this product",
      },
    },
  ],
};
