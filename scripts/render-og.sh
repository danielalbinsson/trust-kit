#!/usr/bin/env bash
# Regenerate public/og-image.png from scripts/og-render.html (site-faithful hero).
# Requires Brave Browser + Archivo / IBM Plex Mono at /tmp/og-fonts (see comments).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/og-image.png"
HTML="$ROOT/scripts/og-render.html"
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"

if [[ ! -f /tmp/og-fonts/Archivo.ttf ]]; then
  mkdir -p /tmp/og-fonts
  curl -sL "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf" \
    -o /tmp/og-fonts/Archivo.ttf
  curl -sL "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf" \
    -o /tmp/og-fonts/IBMPlexMono-Medium.ttf
  curl -sL "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf" \
    -o /tmp/og-fonts/IBMPlexMono-Regular.ttf
fi

"$BRAVE" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --screenshot="$OUT" \
  "file://$HTML"

echo "Wrote $OUT"
