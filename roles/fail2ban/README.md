# Description

This role provides intrusion prevention services using [Fail2ban](fail2ban.org).

# Variables

| Variable        | Required | Description                                                                           | Default                                |
|:----------------|:---------|:--------------------------------------------------------------------------------------|:---------------------------------------|
| fail2ban_dir    | Yes      | The directory where `fail2ban` configuration is stored.                               | `{{ letsencrypt_dir }}/fail2ban`       |
| fail2ban_email  | No       | The email address that will be notified if `fail2ban` detects an attempted intrusion. |                                        |

# Parameters

| Parameter        | Member    | Description                                          |
|:-----------------|:----------|:-----------------------------------------------------|
| fail2ban_jails   |           | `fail2ban` jails to create.                          |
 |                  | jail_name | The name of the jail to create.                      |
 |                  | file      | The template that will be used to create the jail.   |
 | fail2ban_filters |           | `fail2ban` filters to create.                        |
|                  | dest      | The name of the filter file to create.               |
 |                  | src       | The template that will be just to create the filter. |

# Docker Volumes

 | Volume             | Description                                                                                                               |
|:-------------------|:--------------------------------------------------------------------------------------------------------------------------|
 | fail2ban-jails     | Contains `fail2ban` jails used to block malicious IPs.                                                                    |
