set -g -x fish_greeting ''
set -x GPG_TTY (tty)
set -q SSH_AUTH_SOCK; or set -x SSH_AUTH_SOCK (gpgconf --list-dirs agent-ssh-socket)
gpg-connect-agent updatestartuptty /bye > /dev/null 2>&1