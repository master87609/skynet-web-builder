#!/usr/bin/env bash
# Skynet — Skynet comp watcher.
#
# The Impeccable build shipped CODE-LED: image generation was quota-blocked, so
# the decision comp (.impeccable/mocks/decision/cracktro-safe.*) was never
# generated and the finish reviewer's verdict covered the scored fixes rather
# than the whole surface ("no comp-diff evidence").
#
# All three Google free-tier image models report limit 0 for this account, with
# no local credential to call the API directly. So this watcher cannot generate
# the comp; it waits for the quota window to open, then watches for the comp to
# land and drives the whole measurement pipeline automatically the moment it
# does.
#
# Launch:  nohup scripts/comp-watcher.sh > /tmp/skynet-comp-watcher.log 2>&1 &
# Stop:    pkill -f comp-watcher.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

S="/tmp/skills-use-8aUPT8/impeccable/scripts/impeccable"
COMP_DIR=".impeccable/mocks/decision"
BUILD_DIR=".impeccable/build"
REVIEW_DIR=".impeccable/review"
LOG="/tmp/skynet-comp-watcher.log"

log() { echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG"; }

# ── 1. wait for the quota window ────────────────────────────────────────────
# The quota error reported "Please retry in 19h36m" at ~2026-11-12 12:30 UTC.
RESET_AT="2026-11-13 08:10:00"
RESET_EPOCH="$(date -u -d "$RESET_AT" +%s 2>/dev/null || date -u -j -f '%Y-%m-%d %H:%M:%S' "$RESET_AT" +%s)"

log "watcher started; quota window expected to open at ${RESET_AT} UTC"
log "project: $ROOT"

while (( $(date -u +%s) < RESET_EPOCH )); do
  sleep 300
done
log "quota window reached — entering watch loop"

# ── 2. watch for the comp to land, then measure ─────────────────────────────
DEADLINE=$(( $(date -u +%s) + 43200 ))   # keep watching for 12h
POLL=0

while (( $(date -u +%s) < DEADLINE )); do
  COMP="$(find "$COMP_DIR" -maxdepth 1 -type f \( -name 'cracktro-safe.png' -o -name 'cracktro-safe.jpg' \
          -o -name 'cracktro-safe.jpeg' -o -name 'cracktro-safe.webp' \) 2>/dev/null | head -1)"

  if [[ -n "$COMP" ]]; then
    log "comp detected: $COMP"
    bash "$ROOT/scripts/comp-fidelity.sh" 2>&1 | tee -a "$LOG"
    log "fidelity pipeline finished"
    exit 0
  fi

  POLL=$(( POLL + 1 ))
  if (( POLL % 12 == 0 )); then
    log "still waiting for the comp (poll $POLL) — generate it with the image tool, then this runs itself"
  fi
  sleep 300
done

log "watch window closed without a comp landing"
exit 0
