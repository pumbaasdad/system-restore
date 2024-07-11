# Description

This role installs and configures security software specifically, it will:

 1. Enable `gpg-agent` forwarding
 1. Enable `ssh-agent` forwarding
 1. Require YubiKey MFA for local login
 1. Require SSH key for remote login

YubiKey MFA is done using U2F. 
  
The YubiKey is not required for `sudo` access as U2F does not work over SSH.  It seems like there is enough security in
place to prevent bad actors from gaining shell access.  If someone makes it that far, they likely have the YubiKey, and
the extra layer of security would be pointless.  Also, if any mistake is made in configuring `sudo` access with the
YubiKey, it would be quite impossible to fix the issue, since elevated privileges would be required to fix the issue.

# Initial Setup

You must have already an SSH key that you plan to use to authenticate with your server.

After running the playbook for the first time, ssh to the remote system and comment the out following line in
/etc/pam.d/login:

```text
auth required pam_u2f.so
```

Next, physically login to the system.  Plug in your YubiKey and run the following command:

```commandline
pamu2fcfg >> ~/.config/Yubico/u2f_keys
```

Repeat this step for each YubiKey you want to configure to provide physical access to the system.

Now, re-run the ansible playbook to re-enable U2F for physical logins.

# Variables

| Variable              | Required | Description                                         | Default |
|:----------------------|:---------|:----------------------------------------------------|:--------|
| security_users        | Yes      | Usernames for which security should be configured.  |         |
| security_user_details | Yes      | The output produced by ansible when creating users. |         |
