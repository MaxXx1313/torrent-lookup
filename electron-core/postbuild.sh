#!/bin/sh

set -e

cd ../electron-core

CSIGN="maxxx1313"

function sign() {
  echo "Signing $1"
  codesign --deep --force --verify --verbose \
   --sign "$CSIGN" "$1"

  codesign -vv "$1"
}

for file in out/make/*.dmg; do
  sign  "$file"
done
