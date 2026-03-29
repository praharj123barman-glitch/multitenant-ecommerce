import type { CollectionConfig, Access, FieldAccess } from "payload";

const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

const isAdminOrOwner: Access = ({ req: { user } }) => {
  if (!user) return false;
  if ((user as Record<string, unknown>).role === "admin") return true;
  return { owner: { equals: user.id } };
};

const isAdminField: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true, // public storefronts
    create: ({ req: { user } }) => !!user, // any authenticated user
    update: isAdminOrOwner,
    delete: isAdmin,
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
      access: {
        read: isAdminField, // hide from public
        update: isAdminField,
      },
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
      access: {
        read: isAdminField,
        update: isAdminField,
      },
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
      access: {
        update: isAdminField, // only admins can verify
      },
      admin: {
        position: "sidebar",
      },
    },
  ],
};
