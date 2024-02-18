# Description

This role provides intrusion prevention services using [Fail2ban](fail2ban.org).

# Variables

| Variable              | Required | Description                                                                           | Default                          |
|:----------------------|:---------|:--------------------------------------------------------------------------------------|:---------------------------------|
| fail2ban_dir          | No       | The directory where `fail2ban` configuration is stored.                               | `{{ letsencrypt_dir }}/fail2ban` |
 | fail2ban_jails_volume | No       | The name of the volume where jail configuration is stored.                            | fail2ban-jails                   |
| fail2ban_email        | Yes      | The email address that will be notified if `fail2ban` detects an attempted intrusion. |                                  |

# Docker Volumes

 | Volume             | Description                                                                                                               |
|:-------------------|:--------------------------------------------------------------------------------------------------------------------------|
 | fail2ban-jails     | Contains `fail2ban` jails used to block malicious IPs.                                                                    |
