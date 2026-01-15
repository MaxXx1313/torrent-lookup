#!/bin/sh

set -e

cd ../lib
npm run build

cd ../electron-ui4
npm run build

echo "Copy files"
cp -r dist/** ../electron-core/app
