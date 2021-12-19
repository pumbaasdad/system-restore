# Description

This role provides a reverse proxy for accessing other services running on the server being configured.

# Variables

| Variable                            | Required | Description                                                                                           | Default                                  |
|:------------------------------------|:---------|:------------------------------------------------------------------------------------------------------|:-----------------------------------------|
| private_reverse_proxy_dir           | No       | Deprecated and will be removed in a future version.                                                   | `{{ docker_compose_dir }}/nginx-private` |
| public_reverse_proxy_dir            | No       | The directory in which nginx configuration will be stored.                                            | `{{ docker_compose_dir }}/nginx-public`  |
| reverse_proxy_private0_ipv4_address | Yes      | The IP address within `docker_private0_subnet` that will be used by the reverse proxy.                |                                          |
| hass_google_assistant_api           | Yes      | The path that the reverse proxy will forward to the /api/google_assistant endpoint of home assistant. |                                          |
| hass_auth_authorize                 | Yes      | The path that the reverse proxy will forward to the /auth/authorize endpoint of home assistant.       |                                          |
| hass_auth_token                     | Yes      | The path that the reverse proxy will forward to the /auth/token endpoint of home assistant.           |                                          |
