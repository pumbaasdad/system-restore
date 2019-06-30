#! /bin/bash
sed 's|\\\\|/|g' /mnt/nas01/raw/queue.json | sed 's|M:|/mnt/nas01|g' > /tmp/queue.json
HandBrakeCLI --queue-import-file /tmp/queue.json 
