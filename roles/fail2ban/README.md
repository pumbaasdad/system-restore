# Description

This role provides intrusion prevention services using [Fail2ban](fail2ban.org).

# Variables

| Variable        | Required | Description                                                                           | Default                                |
|:----------------|:---------|:--------------------------------------------------------------------------------------|:---------------------------------------|
| letsencrypt_dir | Yes      | The directory where `letsencrypt` configuration is stored.                            | `{{ docker_compose_dir }}/letsencrypt` |
| fail2ban_dir    | Yes      | The directory where `fail2ban` configuration is stored.                               | `{{ letsencrypt_dir }}/fail2ban`       |
| fail2ban_email  | No       | The email address that will be notified if `fail2ban` detects an attempted intrusion. |                                        |
