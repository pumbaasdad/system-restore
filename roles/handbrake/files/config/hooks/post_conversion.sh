#!/bin/sh

CONVERSION_STATUS=$1
CONVERTED_FILE="$2"
SOURCE_FILE="$3"
PRESET="$4"

if [ "$CONVERSION_STATUS" -ne 0 ]; then
  return
fi

if [ "$PRESET" != "Custom/DVR" ]; then
  return
fi

ORIGINAL_FILE_NAME="$(basename "$SOURCE_FILE")"
ORIGINAL_FILE_PATH="$(dirname "$CONVERTED_FILE")"

rm "${ORIGINAL_FILE_PATH}/${ORIGINAL_FILE_NAME}"
