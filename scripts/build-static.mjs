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

// Same pattern as Brand Support: screenshots are source assets in the repo,
// embedded as data URIs during the static build. No R2/media endpoint needed.
const manifestSource = await readFile(resolve(root, "data/article-images.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(manifestSource, sandbox, { timeout: 1000 });
const manifest = JSON.parse(JSON.stringify(sandbox.window.PE_ARTICLE_IMAGE_MANIFEST || {}));
let references = 0;
const uniqueSourceImages = new Set();

for (const [articleId, images] of Object.entries(manifest)) {
  for (const image of images) {
    const key = String(image.key || "");
    const fileName = key.startsWith("article_images/") ? key.slice("article_images/".length) : "";
    if (!fileName.endsWith(".avif") && !fileName.endsWith(".avif.b64")) {
      throw new Error("Invalid screenshot path for " + articleId + ": " + key);
    }

    const raw = await readFile(resolve(root, "data", key));
    const bytes = fileName.endsWith(".b64")
      ? Buffer.from(raw.toString("utf8").trim(), "base64")
      : raw;

    if (bytes.length < 128 || bytes.toString("ascii", 8, 12) !== "avif") {
      throw new Error("Missing, incomplete or invalid AVIF screenshot: " + key);
    }

    image.src = "data:image/avif;base64," + bytes.toString("base64");
    delete image.key;
    references++;
    uniqueSourceImages.add(fileName.replace(/\.b64$/i, ""));
  }
}

if (!references) throw new Error("No article screenshots were embedded");
await writeFile(
  resolve(output, "data/article-images.js"),
  "window.PE_ARTICLE_IMAGE_MANIFEST = " + JSON.stringify(manifest) + ";\n",
  "utf8"
);

// Source .b64/image files are not copied into the public bundle: the
// generated manifest already contains the compressed screenshots inline.
await rm(resolve(output, "data/article_images"), { recursive: true, force: true });
console.log(
  "Built Parts Expedite with " + references + " screenshot references and " +
  uniqueSourceImages.size + " unique source screenshots embedded across " +
  Object.keys(manifest).length + " guides."
);
