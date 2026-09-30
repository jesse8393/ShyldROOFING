#!/bin/bash
# Upload every file in dist/ into public_html with the Hostinger TUS upload URL.
# Usage: URL=... AUTH=... REST=... ./r3-upload.sh /home/user/ShyldROOFING/dist
set -u
DIST=$1; ok=0; fail=0; failed=()
cd "$DIST"
while IFS= read -r -d '' f; do
  rel=${f#./}; size=$(stat -c%s "$f")
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL/$rel?override=true" -H "X-Auth: $AUTH" -H "X-Auth-Rest: $REST" -H "Tus-Resumable: 1.0.0" -H "Upload-Length: $size" -H "Upload-Offset: 0")
  if [ "$code" != "201" ]; then fail=$((fail+1)); failed+=("$rel POST $code"); continue; fi
  off=$(curl -s -o /dev/null -w "%{http_header_json}" -X PATCH "$URL/$rel?override=true" -H "X-Auth: $AUTH" -H "X-Auth-Rest: $REST" -H "Tus-Resumable: 1.0.0" -H "Content-Type: application/offset+octet-stream" -H "Upload-Offset: 0" --data-binary "@$f" | python3 -c 'import sys,json;h=json.load(sys.stdin);print(h.get("upload-offset",["?"])[0])')
  if [ "$off" = "$size" ]; then ok=$((ok+1)); else fail=$((fail+1)); failed+=("$rel PATCH offset=$off size=$size"); fi
done < <(find . -type f -print0 | sort -z)
echo "uploaded=$ok failed=$fail"
printf '%s\n' "${failed[@]}"
