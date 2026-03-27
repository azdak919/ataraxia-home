#!/usr/bin/env bash
# bump-version.sh — update the VERSION constant in index.html
# Usage: ./bump-version.sh v1.2.0
#        ./bump-version.sh            (interactive prompt)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX="$SCRIPT_DIR/index.html"

if [[ ! -f "$INDEX" ]]; then
  echo "ERROR: index.html not found at $INDEX" >&2
  exit 1
fi

if [[ $# -ge 1 ]]; then
  NEW_VERSION="$1"
else
  CURRENT=$(grep -oP "(?<=const VERSION = ')[^']+" "$INDEX" || echo "unknown")
  echo "Current version: $CURRENT"
  read -rp "New version (e.g. v1.2.0): " NEW_VERSION
fi

# Validate format
if [[ ! "$NEW_VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "ERROR: version must match vMAJOR.MINOR.PATCH (e.g. v1.2.0)" >&2
  exit 1
fi

# Perform replacement
sed -i "s/const VERSION = 'v[^']*'/const VERSION = '$NEW_VERSION'/" "$INDEX"

# Verify
RESULT=$(grep "const VERSION" "$INDEX")
echo "Updated: $RESULT"

# Optionally tag and push
read -rp "Create git tag '$NEW_VERSION' and push? [y/N] " CONFIRM
if [[ "${CONFIRM,,}" == "y" ]]; then
  git -C "$SCRIPT_DIR" add index.html
  git -C "$SCRIPT_DIR" commit -m "chore: bump version to $NEW_VERSION"
  git -C "$SCRIPT_DIR" tag "$NEW_VERSION"
  git -C "$SCRIPT_DIR" push origin main --tags
  echo "Pushed commit and tag $NEW_VERSION."
else
  echo "Version updated in index.html. Stage and commit manually."
fi
