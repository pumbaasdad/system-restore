# Description

This role installs and configures security software specifically, it will:

 1. Enable `gpg-agent` forwarding
 1. Enable `ssh-agent` forwarding
 1. Require YubiKey MFA for local login
 1. Require SSH key for remote login

YubiKey MFA is done using the Yubico cloud.  If the computer being configured cannot communicate with the cloud, the
only way to access the machine will be with a valid ssh key.  A more ideal solution would be to use an HMAC-SHA1
Challenge-Response for local login (as this does not require connectivity), and SSH key only login for SSH access.
These options were not used because:

 1. The YubiKey 5 series only allow 2 of OTP, Static Password, HMAC-SHA1 Challenge-Response or OATH-HOTP.  Because I
 have use cases that require OTP and Static Passwords, and because SSH keys provide a backup method for accessing the
 machine, this solution was acceptable.
  
 I specifically chose not to require the YubiKey for `sudo` access.  It seems like there is enough security in place to
 prevent bad actors from gaining shell access.  If someone makes it that far, they likely have the YubiKey, and the
 extra layer of security would be pointless.  Also, if any mistake is made in configuring `sudo` access with the
 YubiKey, it would be quite impossible to fix the issue, since elevated privileges would be required to fix the issue.

# Initial Setup

You must have already an SSH key that you plan to use to authenticate with your server.

You must have signed up a [YubiCloud service](https://upgrade.yubico.com/getapikey/) API key.

# Variables

| Variable              | Required | Description                                                                                         | Default |
|:----------------------|:---------|:----------------------------------------------------------------------------------------------------|:--------|
| ssh_authorized_key    | Yes      | An SSH key that may be used by the user running ansible to access the machine via SSH.              |         |
| yubikey_token_id      | Yes      | The token ID associated with a YubiKey that the user running ansible may use to access the machine. |         |
| yubico_api_client_id  | Yes      | The client ID generated when signing up for the YubiCloud service.                                  |         |
| yubico_api_secret_key | Yes      | The secret key generated with signing up for the YubiCloud service.                                 |         |
