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

# Parameters

| Parameter                          | Member | Description                                                                 |
|:-----------------------------------|:-------|:----------------------------------------------------------------------------|
| reverse_proxy_public_site_configs  |        | Reverse proxy configurations that can be accessed from outside the network. |
 |                                    | name   | The name of the reverse proxy.                                              |
 |                                    | src    | The template that will be used to create the reverse proxy configuration.   |
 | reverse_proxy_private_site_configs |        | Reverse proxy configurations that can be accessed from inside the network.  |
|                                    | name   | The name of the reverse proxy.                                              |
 |                                    | src    | The template that will be used to create the reverse proxy configuration.   |

# Docker Volumes

 | Volume              | Description                                                                                                                                                                    |
|:--------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | public-nginx-config | Configuration for the `nginx` service that is exposed to the public internet.  It contains configurations required to access sites from the public internet and local network. |
 | public-nginx-log    | The directory where logs from the `nginx` server that is exposed to the public internet are written.                                                                           |

# Docker Networks

| Network | Description                                                                                                                                                                                                                 |
|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | public0 | This network is only accessible to the host interface that is exposed to the internet.  Its purpose is to make the reverse proxy the only service accessible from the internet.  This is accomplished with `iptable` rules. |

# iptable Rules

This module defines `iptable` rules to ensure that no external connections can be initiated from the `public0` docker
network to any other system on this network, or the public internet.  The rules will allow responses to requests and
connections that are associated with existing connections.
