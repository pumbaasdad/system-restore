#! /bin/bash

find group_vars -name \*.yml -exec ansible-vault encrypt --vault-id "${1}" {} \;
find host_vars -name \*.yml -exec ansible-vault encrypt --vault-id "${1}" {} \;