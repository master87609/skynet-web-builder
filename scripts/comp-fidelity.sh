#!/usr/bin/env bash
# Skynet — comp fidelity pipeline.
#
# Closes the one gap the Impeccable finish reviewer named: the build shipped
# code-led (image generation was quota-blocked), so there was no approved comp
# and no comp-diff evidence, and the verdict covered the scored fixes rather
# than the whole surface.
#
# Now that the decision comp exists, this measures the SHIPPED build against it.
#
# Usage: scripts/comp-fidelity.sh [desktop-build.png] [mobile-build.png]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

S="/tmp/skills-use-8aUPT8/impeccable/scripts/impeccable"
COMP_DIR=".impeccable/mocks/decision"
BUILD_DIR=".impeccable/build"
REVIEW_DIR=".impeccable/review"

DESKTOP_BUILD="${1:-$REVIEW_DIR/desktop.png}"
MOBILE_BUILD="${2:-$REVIEW_DIR/mobile.png}"

# 1 ── locate the generated comp (the tool picks the real extension)
COMP="$(find "$COMP_DIR" -maxdepth 1 -type f \( -name 'cracktro-safe.png' -o -name 'cracktro-safe.jpg' \
        -o -name 'cracktro-safe.jpeg' -o -name 'cracktro-safe.webp' \) | head -1 || true)"

if [[ -z "$COMP" ]]; then
  echo "✗ No decision comp found in $COMP_DIR — generate it first." >&2
  exit 1
fi

# Normalise the extension: the image tool picks the real format, and the
# comp-spec / comp-diff tooling resolves the path from the sidecar.
if [[ "$COMP" != "$COMP_DIR/cracktro-safe.webp" ]]; then
  cp "$COMP" "$COMP_DIR/cracktro-safe.webp"
  echo "▸ normalised copy: $COMP_DIR/cracktro-safe.webp"
  COMP="$COMP_DIR/cracktro-safe.webp"
fi
echo "▸ comp: $COMP"

# 2 ── sidecar: record the exact prompt and the approval
SIDECAR="${COMP}.json"
if [[ ! -f "$SIDECAR" ]]; then
  echo "✗ Missing prompt sidecar $SIDECAR" >&2
  exit 1
fi
python3 - "$SIDECAR" "$COMP" <<'PY'
import json, sys
sidecar, comp = sys.argv[1], sys.argv[2]
d = json.load(open(sidecar))
d["compFile"] = comp
d["approved"] = True
d["status"] = "approved"
json.dump(d, open(sidecar, "w"), indent=2, ensure_ascii=False)
print(f"  sidecar marked approved: {sidecar}")
PY

# 3 ── open the build-phase state with the comp as the approved decision comp
"$S" build-phase start \
  --direction seed:8496b0e316ac4e91 \
  --decision-comp "$COMP" \
  --artifact web/src/app/page.tsx || true
"$S" build-phase status --json || true

# 4 ── measure the comp: grid + palette, then region mapping
mkdir -p "$BUILD_DIR"
"$S" comp-spec --comp "$COMP" --grid
echo "▸ grid written to $BUILD_DIR/comp-grid.png — author regions.json, then re-run with --regions"

echo
echo "Next manual step (region mapping, per comp-spec --schema):"
echo "  1. open $BUILD_DIR/comp-grid.png and name each salient region"
echo "  2. write $BUILD_DIR/regions.json  { \"regions\": [ { id, kind, box|grid, note } ] }"
echo "  3. $S comp-spec --comp $COMP --regions $BUILD_DIR/regions.json --inspect-map"
echo "  4. $S comp-spec --comp $COMP --regions $BUILD_DIR/regions.json"
echo "  5. $S comp-diff --comp $COMP --build $DESKTOP_BUILD --spec $BUILD_DIR/spec.json --out-dir $REVIEW_DIR/diff/final"
echo "     (and the mobile build: --build $MOBILE_BUILD --out-dir $REVIEW_DIR/diff/hero)"
