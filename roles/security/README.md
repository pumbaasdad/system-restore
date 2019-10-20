This role installs and configures security software specifically, it will:

 1. Enable `gpg-agent` forwarding
 1. Enable `ssh-agent` forwarding
 1. Require YubiKey MFA for local login
 1. Enforce YubiKey MFA or use of an SSH key to login

YubiKey MFA is done using the Yubico cloud.  If the computer being configured cannot communicate with the cloud, the
only way to access the machine will be with a valid ssh key.  A more ideal solution would be to use an HMAC-SHA1
Challenge-Response for local login (as this does not require connectivity), and SSH key only login for SSH access.
These options were not used because:

 1. The YubiKey 5 series only allow 2 of OTP, Static Password, HMAC-SHA1 Challenge-Response or OATH-HOTP.  Because I
 have use cases that require OTP and Static Passwords, and because SSH keys provide a backup method for accessing the
 machine, this solution was acceptable.
 1. There currently appears to be an issue accessing Ed25519 keys stored on a YubiKey when SSHing from a chromebook.
 Since I can't currently access the SSH key from the chromebook, I'm allowing YubiKey MFA as an acceptable alternative
 when using my chromebook.  The side effect of this means that accessing the server when connectivity is down will
 require a Windows or Linux machine that is capable of accessing the SSH key.
 
 I specifically chose not to require the YubiKey for `sudo` access.  It seems like there is enough security in place to
 prevent bad actors from gaining shell access.  If someone makes it that far, they likely have the YubiKey, and, the
 extra layer of security would be pointless.  Also, if any mistake is made in configuring `sudo` access with the
 YubiKey, it would be quite impossible to fix the issue, since elevated privileges would be required to fix the issue.
 
 ### Required Variables ###
 
 * ssh_authorized_key: An SSH key that may be used by the user running ansible to access the machine via SSH.
 * yubikey_token_id: The token ID associated with a YubiKey that the user running ansible may use to access the machine. 
 * yubico_api_client_id: Client ID to authenticate with the [YubiCloud service](https://upgrade.yubico.com/getapikey/). 
 * yubico_api_secret_key: Secrete key to authenticate with the
 [YubiCloud service](https://upgrade.yubico.com/getapikey/).