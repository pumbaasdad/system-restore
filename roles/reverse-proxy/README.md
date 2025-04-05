# Description

This role provides reverse proxies for accessing other services running on the server being configured.  One proxy is
configured to be accessible only from within the network.  The other proxy is on a network that can be exposed to
containers that are in turn exposed to the public internet.  The external proxy will forward requests to the internal
proxy.

# Variables

| Variable                                   | Required | Secret | Description                                                                                       | Default                                  |
|:-------------------------------------------|:---------|:-------|:--------------------------------------------------------------------------------------------------|:-----------------------------------------|
| reverse_proxy_dir                          | No       | No     | The directory in which nginx configuration will be stored.                                        | `{{ docker_compose_dir }}/reverse-proxy` |
| reverse_proxy_config_volume                | No       | No     | The name of the volume used to store reverse proxy configuration.                                 | proxy-config                             |
| reverse_proxy_bridge_network               | No       | No     | The name of the internal network used to send traffic from the internal reverse proxy to services | proxy-bridge                             |
| reverse_proxy_external_network             | No       | No     | The name of the internal network used to proxy traffic from the internet.                         | proxy-external-network                   |
| reverse_proxy_internal_log_volume          | No       | No     | The name of the volume used to store internal reverse proxy logs.                                 | internal-proxy-log                       |
| reverse_proxy_internal_service_name        | No       | No     | The name of the docker-compose service that runs the internal reverse proxy.                      | internal-proxy                           |
| reverse_proxy_internal_site_configs_volume | No       | No     | The name of the docker volume used to store site configurations for internal access               | internal-proxy-site-configs              |
| reverse_proxy_external_log_volume          | No       | No     | The name of the volume used to store external reverse proxy logs.                                 | external-proxy-log                       |
| reverse_proxy_external_service_name        | No       | No     | The name of the docker-compose service that runs the external reverse proxy.                      | external-proxy                           |
| reverse_proxy_external_site_configs_volume | No       | No     | The name of the docker volume used to store site configurations for external access               | external-proxy-site-configs              |

# Parameters

| Parameter                        | Member             | Description                                                                      |
|:---------------------------------|:-------------------|:---------------------------------------------------------------------------------|
| reverse_proxy_configs            |                    | Reverse proxy configuration for all internal services.                           |
|                                  | subdomain          | The subdomain for which the proxy is being configured.                           |
|                                  | external.port      | The port on which the proxy should listen for connections from the internet.     |
|                                  | external.locations | A list of paths which should be forwarded from the internet.                     |
|                                  | internal.host      | The name of the host on the internal network to which traffic should be proxied. |
|                                  | internal.port      | The port on the internal network to which traffic should be proxied.             |
| reverse_proxy_ip                 |                    | The IP address of the reverse proxy on `reverse_proxy_bridge_network`.           |
| reverse_proxy_certificate_volume |                    | The name of the volume where SSL certificates are stored.                        |

# Docker Volumes

| Volume                                       | Description                                                                                     |
|:---------------------------------------------|:------------------------------------------------------------------------------------------------|
| `reverse_proxy_config_volume`                | Common configuration for both reverse proxy services.                                           |
| `reverse_proxy_internal_log_volume`          | The direction where logs from the reverse proxy that is only accessible internally are written. |
| `reverse_proxy_internal_site_configs_volume` | The direction where internally accessible site configurations are written.                      |
| `reverse_proxy_external_log_volume`          | The direction where logs from the reverse proxy that is externally accessible are written.      |
| `reverse_proxy_external_site_configs_volume` | The direction where externally accessible site configurations are written.                      |

# Docker Networks

| Network                          | Description                                                                            |
|:---------------------------------|:---------------------------------------------------------------------------------------|
| `reverse_proxy_bridge_network`   | The internal network used to send traffic from the internal reverse proxy to services. |
| `reverse_proxy_external_network` | The internal network used to proxy traffic from the internet.                          |

# Outputs

| Name             | Value                                                                      |
|:-----------------|:---------------------------------------------------------------------------|
| external_network | The name of the network which may be exposed to traffic from the internet. |