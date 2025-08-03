import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "~/env";
import * as schema from "./schema";

// Use a global cache for the client in dev (for HMR)
const globalForDb = globalThis as unknown as {
  dbClient?: Client;
};

function getClient() {
  if (env.NODE_ENV !== "production") {
    globalForDb.dbClient ??= createClient({
      url: "file:kent-cook-this.db",
      syncUrl: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      syncInterval: 60,
    });
    return globalForDb.dbClient;
  } else {
    // In production, always create a new client (no global caching)
    return createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });
  }
}

export const db = drizzle(getClient(), { schema });
