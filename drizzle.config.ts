import { type Config } from "drizzle-kit";

import { env } from "~/env";

// export default {
//   schema: "./src/server/db/schema.ts",
//   dialect: "sqlite",
//   dbCredentials: {
//     url: env.DATABASE_URL,
//   },
//   tablesFilter: ["kent-cook-this_*"],
// } satisfies Config;

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["kent-cook-this_*"],
} satisfies Config;
