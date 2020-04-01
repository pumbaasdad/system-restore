#!/bin/bash

OLDPID=$(pidof socat)

if [ ! -z "${OLDPID}" ]; then
    exit 0
fi

GPGDIR="${HOME}/.gnupg"
USERNAME=akowpak
# I use the same username for wsl and windows, but feel free to modify the paths below if that isn't the case
WIN_GPGDIR="C:/Users/${USERNAME}/AppData/Roaming/gnupg"
NPIPERELAY="/c/Users/${USERNAME}/wsl/bin/npiperelay.exe"

rm -f ${GPGDIR}/S.gpg-agent
socat UNIX-LISTEN:"${GPGDIR}/S.gpg-agent,fork" EXEC:"${NPIPERELAY} -ep -ei -s -a '${WIN_GPGDIR}/S.gpg-agent'",nofork &
