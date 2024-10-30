Getting the Yubikey set up to work with WSL was more than a pain than it needed to be.  This describes the required
steps.

### Forwarding GPG from Windows to WSL

1. Install [npiperelay](https://github.com/jstarks/npiperelay) somewhere that it can be accessed in WSL.
1. Install the gpg-agrent-relay.sh script.
1. Add the following to ~/.config/fish/config.fish: `set -x GPG_TTY (tty)`

### Forwarding SSH from Windows to WSL

1. Install [wsl-ssh-pageant](https://github.com/benpye/wsl-ssh-pageant) (and putty if it is not already installed).
1. Install the wsl-ssh-pageant-helper scripts (and nodejs if it is not already installed).
1. Add the following to ~/.config/fish/config.fish: 
`set -x SSH_AUTH_SOCK /c/Users/pumbaasdad/wsl/wsl-ssh-pageant/ssh-agent.sock`
1. Add the following to gpg-agent.conf (located in the windows gnupg config directory), or set them in putty:
   * `enable-putty-support`
   * `enable-ssh-support`

### Forwarding GPG agent to remote servers

Add the following to any servers to which you want to forward GPG in ~/.ssh/config:

```
     ForwardAgent yes
     SendEnv LANG LC_*
     RemoteForward <remote gpg-agent socket> ~/.gnupg/S.gpg-agent
```

The remote gpg-agent socket can be found by running `gpgconf --list-dirs agent-socket` on the remote host.

### Setup pinentry

To make `pinentry` as user friendly as possible, add the following to the gpg-agent.conf (located in the windows gnupg
config directory): `pinentry-program C:\Program Files (x86)\Gpg4win\bin\pinentry-w32.exe`

### Running it all automatically

Despite my best efforts to get this to run when WSL opened, the most reliable solution I could find was running a
scheduled task on login to do the following:

 * `node <path to wsl-ssh-pageant.js/run-in-background.js>`

Then run bin/gpg-agent-relay.sh at the end of fish.config.
 
Because I didn't want the wsl-ssh-pageant terminal to be open in the foreground, I needed to find some way to run it in
the background.  Every solution I found required using the Windows scripting agent, which was blocked by my anti-virus
software.  I improvised and used node.
 
### Useful Links

 * https://justyn.io/blog/using-a-yubikey-for-gpg-in-wsl-windows-subsystem-for-linux-on-windows-10/
 * https://github.com/drduh/YubiKey-Guide
 * https://codingnest.com/how-to-use-gpg-with-yubikey-wsl/
