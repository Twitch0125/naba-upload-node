import "./env.js";
import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { basicAuth } from "hono/basic-auth";
import { compress } from "hono/compress";
import { serveStatic } from "@hono/node-server/serve-static";
import { UploadPage } from "#templates/upload.js";
import { TestPage } from "#templates/test.js";
import fsExtra from "fs-extra";
import { serve } from "@hono/node-server";
import { Writable } from "node:stream";
import { finished } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { extract } from "tar-stream";
import { createGunzip } from "node:zlib";
import { writeFile } from "node:fs/promises";
const { ensureDir, ensureFile, open } = fsExtra;
const app = new Hono({ router: new RegExpRouter() });
app.get("/html", (ctx) => ctx.html(TestPage()));
app.get(
  "/upload",
  basicAuth({ username: "admin", password: process.env.AUTH_PASSWORD }),
  (ctx) => {
    return ctx.html(UploadPage());
  }
);
app.post(
  "/upload",
  basicAuth({ username: "admin", password: process.env.AUTH_PASSWORD }),
  async (ctx) => {
    console.time("upload");
    const body = await ctx.req.raw.formData();
    /** @type {File} */
    const file = body.get("file");
    if (!file) {
      return ctx.html(UploadPage({ message: "No file uploaded" }), 400);
    }
    await ensureDir("./uploads");
    await ensureFile("./uploads/report.tar.gz");
    const fileWritableStream = Writable.toWeb(
      createWriteStream("./uploads/report.tar.gz", {
        flags: "w",
      })
    );
    await file.stream().pipeTo(fileWritableStream);

    const uploadedFileReadStream = createReadStream("./uploads/report.tar.gz", {
      flags: "r",
    });
    const untar = extract();
    const gunzip = createGunzip();
    untar.on("entry", async function (header, stream, next) {
      stream.on("end", () => next());
      const filePath = header.name;
      await ensureFile("./extracted/" + filePath);
      await writeFile("./extracted/" + filePath, stream);
      stream.end();
    });
    uploadedFileReadStream.pipe(gunzip).pipe(untar);
    await finished(uploadedFileReadStream);
    console.timeEnd("upload");
    return ctx.html(UploadPage({ message: "Upload successful!" }));
  }
);
app.get(
  "/public/*",
  async (ctx, next) => {
    ctx.header(
      "Cache-Control",
      "max-age=86400, stale-while-revalidate=172800, must-revalidate, immutable"
    );
    await next();
  },
  serveStatic({
    root: "./public",
    rewriteRequestPath: (path) => path.replace(/^\/public/, ""),
  })
);
app.get("/*", compress(), async (ctx, next) => {
  if (ctx.req.url.endsWith(".html")) {
    ctx.header("Cache-Control", "no-cache");
  } else {
    ctx.header(
      "Cache-Control",
      "max-age=86400, stale-while-revalidate=172800, must-revalidate, immutable, must-understand",
    );
  }
  await next();
}, serveStatic({ root: "./extracted/news/html" }));

serve({ port: 8000, fetch: app.fetch }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
