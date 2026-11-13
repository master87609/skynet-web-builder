#!/usr/bin/env bash
# Tracked wait for the image-quota window. Runs in the parent session so the
# completion notice lands in a live session, not a closed sub-agent turn.
set -uo pipefail
cd "/home/Ujjwal/Projects/Website-builder(Skynet)"

RESET_AT="2026-11-13 08:15:00"
NOW=$(date -u +%s)
RESET=$(date -u -d "$RESET_AT" +%s)
WAIT=$(( RESET - NOW ))
if (( WAIT < 60 )); then WAIT=60; fi

echo "waiting ${WAIT}s for the quota window (${RESET_AT} UTC) ..."
sleep "$WAIT"

echo "=== QUOTA WINDOW OPEN ==="
date -u
echo "reset was 2026-11-13 08:10:00 UTC (+5min margin)"
echo "--- comp dir ---"
ls -la .impeccable/mocks/decision/
echo "--- watcher log ---"
tail -20 /tmp/skynet-comp-watcher.log
echo "=== READY TO GENERATE ==="
