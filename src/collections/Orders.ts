import type { CollectionConfig, Access } from "payload";

const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return (user as Record<string, unknown>).role === "admin";
};

const isAdminOrCustomer: Access = ({ req: { user } }) => {
  if (!user) return false;
  if ((user as Record<string, unknown>).role === "admin") return true;
  // Customers can only see their own orders
  return { customer: { equals: user.id } };
};

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "id",
  },
  access: {
    read: isAdminOrCustomer,
    create: ({ req: { user } }) => !!user, // authenticated users
    update: isAdmin, // only system/admin can update order status
    delete: isAdmin,
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "tenant",
          type: "relationship",
          relationTo: "tenants",
          required: true,
        },
        {
          name: "price",
          type: "number",
          required: true,
          admin: {
            description: "Price in cents at time of purchase",
          },
        },
      ],
    },
    {
      name: "total",
      type: "number",
      required: true,
      admin: {
        description: "Total in cents",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stripePaymentIntentId",
      type: "text",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
};
