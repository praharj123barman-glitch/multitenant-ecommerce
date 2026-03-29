import type { CollectionConfig, Access } from "payload";

const isAdminOrTenantOwner: Access = ({ req: { user } }) => {
  if (!user) return false;
  if ((user as Record<string, unknown>).role === "admin") return true;
  // Sellers can only manage their own tenant's products
  // This is enforced at the tRPC layer for granularity;
  // at the Payload level we allow any seller to create but verify ownership in routers
  return (user as Record<string, unknown>).role === "seller";
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true, // public product listings
    create: isAdminOrTenantOwner,
    update: isAdminOrTenantOwner,
    delete: isAdminOrTenantOwner,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "shortDescription",
      type: "textarea",
      maxLength: 300,
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "Price in cents (e.g. 999 = $9.99)",
      },
    },
    {
      name: "compareAtPrice",
      type: "number",
      min: 0,
      admin: {
        description: "Original price for showing discounts (in cents)",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "images",
      type: "array",
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "The digital file customers will download after purchase",
      },
    },
    {
      name: "tenant",
      type: "relationship",
      relationTo: "tenants",
      required: true,
      admin: {
        description: "The store/tenant this product belongs to",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "averageRating",
      type: "number",
      min: 0,
      max: 5,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "reviewCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "salesCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
};
