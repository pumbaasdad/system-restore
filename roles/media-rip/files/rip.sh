#! /bin/bash

mkdir /tmp/$1
makemkvcon -r --minlength=$2 --decrypt --directio=true mkv disc:0 all /tmp/$1
mv /tmp/$1 /mnt/nas01/raw
