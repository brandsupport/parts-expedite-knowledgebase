#!/usr/bin/env bash
set -euo pipefail

BUCKET="${R2_BUCKET:-parts-expedite-media}"
SOURCE_DIR="${1:-data/article_images}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Image folder not found: $SOURCE_DIR" >&2
  echo "Extract parts-expedite-article-images.zip into backend/seed/source-images first." >&2
  exit 1
fi

shopt -s nullglob
files=("$SOURCE_DIR"/*.avif)
if [[ ${#files[@]} -eq 0 ]]; then
  echo "No AVIF files found in $SOURCE_DIR" >&2
  exit 1
fi

for file in "${files[@]}"; do
  name="$(basename "$file")"
  echo "Uploading $name"
  npx wrangler r2 object put "$BUCKET/source-articles/$name" \
    --file="$file" --content-type="image/avif" \
    --cache-control="private, max-age=0" --remote --force
done

echo "Uploaded ${#files[@]} source screenshots to $BUCKET/source-articles/"
