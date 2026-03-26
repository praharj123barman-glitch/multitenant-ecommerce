import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Store display name",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Used for subdomain (e.g. 'sarah' → sarah.multimart.com)",
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
      maxLength: 500,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "banner",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeConnectId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Stripe Connect account ID",
        readOnly: true,
      },
    },
    {
      name: "stripeOnboardingComplete",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "socialLinks",
      type: "group",
      fields: [
        { name: "website", type: "text" },
        { name: "twitter", type: "text" },
        { name: "instagram", type: "text" },
      ],
    },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
