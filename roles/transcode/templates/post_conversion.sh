#!/bin/sh

CONVERSION_STATUS=$1
CONVERTED_FILE="$2"
SOURCE_FILE="$3"
PRESET="$4"

# Only run this hook if the file is in the watch directory
case "$CONVERTED_FILE" in
  /watch2/*) : ;;
  *) return ;;
esac

hash="$(stat -c '%n %s %Y' "$CONVERTED_FILE" | md5sum | cut -d' ' -f1)"

if [ "$CONVERSION_STATUS" -eq 0 ]; then
  echo "$CONVERTED_FILE" "$hash" >> /config/successful_conversions
else
  echo "$CONVERTED_FILE" "$hash" >> /config/failed_conversions
fi
