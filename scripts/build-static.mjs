import { cp, mkdir, rm } from "node:fs/promises";
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
console.log("Built the Parts Expedite static app into ./dist");
