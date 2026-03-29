import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Tenants } from "./collections/Tenants";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Categories, Media, Products, Tenants, Orders, Reviews],
  editor: lexicalEditor(),
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET;
    if (!secret || secret === "default-secret-change-me") {
      if (process.env.NODE_ENV === "production") {
        throw new Error("PAYLOAD_SECRET must be set in production");
      }
      return "dev-only-secret-change-in-production";
    }
    return secret;
  })(),
  db: mongooseAdapter({
    url: (() => {
      const uri = process.env.DATABASE_URI;
      if (!uri && process.env.NODE_ENV === "production") {
        throw new Error("DATABASE_URI must be set in production");
      }
      return uri || "mongodb://localhost:27017/multitenant-ecommerce";
    })(),
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
