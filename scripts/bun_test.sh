#!/bin/sh

set -e
# due to multiple issues:
# https://github.com/oven-sh/bun/issues/11660
# https://github.com/oven-sh/bun/issues/3965

npx bun test "myglob.spec"
npx bun test "Analyzer.spec"
npx bun test "PushManager.spec"
npx bun test "TorrentScanner.spec"
npx bun test "TorrentScanner.e2e"
