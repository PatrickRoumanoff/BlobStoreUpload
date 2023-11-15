import { Hono } from "hono";
import { env } from "hono/adapter";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { generateSASUrl } from "./sasUrl";

type Bindings = {
  STORAGE: string;
  BLOB: string;
  ACCESS_KEY: string;
};

const app = new Hono();
app.use("*", logger());

app.get("/", (c) => c.redirect("/index.html"));
app.get("/*", serveStatic({ root: "./static/" }));

app.post("/sas", async (c) => {
  const name = c.req.query("name") ?? "";
  const { STORAGE, BLOB, ACCESS_KEY } = env<Bindings>(c);
  const sasUrl = await generateSASUrl(STORAGE, ACCESS_KEY, BLOB, name);
  console.log(`${name} => ${sasUrl}`);
  return c.json({ sasUrl });
});

console.log("starting server on http://localhost:8080");
serve({ fetch: app.fetch, port: 8080 });
