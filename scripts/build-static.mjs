import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
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

// Same approach as Brand Support: article screenshots are repository assets
// and are embedded as data URIs in the generated static site.
const manifestPath = resolve(root, "data/article-images.js");
const manifestSource = await readFile(manifestPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(manifestSource, sandbox, { timeout: 1000 });
const sourceManifest = JSON.parse(JSON.stringify(sandbox.window.PE_ARTICLE_IMAGE_MANIFEST || {}));
const outputManifest = {};
let embeddedReferences = 0;
let missingReferences = 0;
const uniqueAssets = new Set();

for (const [articleId, images] of Object.entries(sourceManifest)) {
  const ready = [];
  for (const image of images) {
    const key = String(image.key || "");
    if (!key.startsWith("article_images/") || !key.endsWith(".avif")) {
      throw new Error("Invalid screenshot path for " + articleId + ": " + key);
    }

    const sourcePath = resolve(root, "data", key);
    if (!existsSync(sourcePath)) {
      missingReferences++;
      continue;
    }

    const bytes = await readFile(sourcePath);
    if (bytes.length < 128 || bytes.toString("ascii", 4, 8) !== "ftyp" || bytes.toString("ascii", 8, 12) !== "avif") {
      throw new Error("Invalid or incomplete AVIF screenshot: " + key);
    }

    const { key: _key, ...metadata } = image;
    ready.push({
      ...metadata,
      src: "data:image/avif;base64," + bytes.toString("base64")
    });
    embeddedReferences++;
    uniqueAssets.add(key);
  }
  if (ready.length) outputManifest[articleId] = ready;
}

await writeFile(
  resolve(output, "data/article-images.js"),
  "window.PE_ARTICLE_IMAGE_MANIFEST = " + JSON.stringify(outputManifest) + ";\n",
  "utf8"
);

// Screenshots are embedded above. Do not ship the originals or the source zip
// a second time in the public static payload.
await rm(resolve(output, "data/article_images"), { recursive: true, force: true });
await rm(resolve(output, "data/parts-expedite-article-images.zip"), { force: true });

console.log(
  "Embedded " + embeddedReferences + " screenshot references across " +
  Object.keys(outputManifest).length + " guides (" + uniqueAssets.size +
  " unique images)."
);
if (missingReferences) {
  console.warn(
    "Skipped " + missingReferences + " screenshot references: upload " +
    "data/parts-expedite-article-images.zip to the repository to enable all guides."
  );
}
