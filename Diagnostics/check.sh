#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm test
npm run diagnostics
npm run test:adapters
npm run build:standalone
git diff --check
