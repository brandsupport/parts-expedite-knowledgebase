import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import vm from "node:vm";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const folders = ["css", "js", "assets", "avatars", "data"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "index.html"), resolve(output, "index.html"));
await cp(resolve(root, "site.webmanifest"), resolve(output, "site.webmanifest"));
for (const folder of folders) {
  await cp(resolve(root, folder), resolve(output, folder), { recursive: true });
}

// Match Brand Support: source screenshots live in the repository and are embedded
// as data URIs during the static build. No R2 bucket or media API is required.
const manifestSource = await readFile(resolve(root, "data/article-images.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(manifestSource, sandbox, { timeout: 1000 });
const manifest = JSON.parse(JSON.stringify(sandbox.window.PE_ARTICLE_IMAGE_MANIFEST || {}));
let references = 0;
const uniqueImages = new Set();

for (const [articleId, images] of Object.entries(manifest)) {
  for (const image of images) {
    if (!image.key || !/^article_images\\/[a-z0-9-]+\\.avif(?:\\.b64)?$/i.test(image.key)) {
      throw new Error("Invalid screenshot path for " + articleId);
    }
    const sourcePath = resolve(root, "data", image.key);
    const raw = await readFile(sourcePath);
    const bytes = image.key.endsWith(".b64")
      ? Buffer.from(raw.toString("utf8").trim(), "base64")
      : raw;
    if (bytes.length < 128 || bytes.toString("ascii", 4, 8) !== "avif") {
      throw new Error("Missing, incomplete or invalid AVIF screenshot: " + image.key);
    }
    image.src = "data:image/avif;base64," + bytes.toString("base64");
    delete image.key;
    references++;
    uniqueImages.add(image.id || image.src.slice(-32));
  }
}

if (!references) throw new Error("No article screenshots were embedded");
await writeFile(
  resolve(output, "data/article-images.js"),
  "window.PE_ARTICLE_IMAGE_MANIFEST = " + JSON.stringify(manifest) + ";\\n",
  "utf8"
);
await rm(resolve(output, "data/article_images"), { recursive: true, force: true });
console.log("Built Parts Expedite with " + references + " screenshot references embedded across " + Object.keys(manifest).length + " guides.");
