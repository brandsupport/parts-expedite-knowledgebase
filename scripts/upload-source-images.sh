#!/usr/bin/env bash
set -euo pipefail

BUCKET="${R2_BUCKET:-parts-expedite-media}"
SOURCE_DIR="${1:-backend/seed/source-images}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Image folder not found: $SOURCE_DIR" >&2
  echo "Extract parts-expedite-source-images.zip into backend/seed/source-images first." >&2
  exit 1
fi

shopt -s nullglob
files=("$SOURCE_DIR"/*.webp)
if [[ ${#files[@]} -eq 0 ]]; then
  echo "No WebP files found in $SOURCE_DIR" >&2
  exit 1
fi

for file in "${files[@]}"; do
  name="$(basename "$file")"
  echo "Uploading $name"
  npx wrangler r2 object put "$BUCKET/source-articles/$name" \
    --file="$file" --content-type="image/webp" \
    --cache-control="private, max-age=0" --remote --force
done

echo "Uploaded ${#files[@]} source screenshots to $BUCKET/source-articles/"
