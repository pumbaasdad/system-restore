#!/bin/sh

WATCH_FOLDER=$1

# Cleanup successful conversions
rev < /config/successful_conversions | cut -d' ' -f2- | rev | xargs -d'\n' -I {} sh -c 'if [ -f "{}" ] ; then echo "{}"; fi' > /config/successful_conversions_that_still_exist
grep -Ff /config/successful_conversions_that_still_exist /config/successful_conversions > /config/successful_conversions.tmp
mv /config/successful_conversions.tmp /config/successful_conversions
rm /config/successful_conversions_that_still_exist

# Cleanup failed conversions
rev < /config/failed_conversions | cut -d' ' -f2- | rev | xargs -d'\n' -I {} sh -c 'if [ -f "{}" ] ; then echo "{}"; fi' > /config/failed_conversions_that_still_exist
grep -Ff /config/failed_conversions_that_still_exist /config/failed_conversions > /config/failed_conversions.tmp
mv /config/failed_conversions.tmp /config/failed_conversions
rm /config/failed_conversions_that_still_exist
