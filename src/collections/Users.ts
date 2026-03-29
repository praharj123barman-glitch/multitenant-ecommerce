import type { CollectionConfig, Access, FieldAccess } from "payload";

const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if ((user as Record<string, unknown>).role === "admin") return true;
  return { id: { equals: user.id } };
};

const isAdminField: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAdminOrSelf,
    create: () => true, // anyone can register
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Seller", value: "seller" },
        { label: "Customer", value: "customer" },
      ],
      defaultValue: "customer",
      required: true,
      access: {
        update: isAdminField, // only admins can change roles
      },
    },
  ],
};
