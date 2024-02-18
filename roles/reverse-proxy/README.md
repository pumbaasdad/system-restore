# Description

This role provides a reverse proxy for accessing other services running on the server being configured.  The service is
assigned a specific IPv4 address so that other services can trust it as an allowed proxy.

# Variables

| Variable                            | Required | Secret | Description                                                                            | Default                                  |
|:------------------------------------|:---------|:-------|:---------------------------------------------------------------------------------------|:-----------------------------------------|
| public_reverse_proxy_dir            | No       | No     | The directory in which nginx configuration will be stored.                             | `{{ docker_compose_dir }}/nginx-public`  |
| reverse_proxy_config_volume         | No       | No     | The name of the volume used to store reverse proxy configuration.                      | public-nginx-config                      |
| reverse_proxy_log_volume            | No       | No     | The name of the volume used to store reverse proxy logs.                               | public-nginx-log                         |
| reverse_proxy_service_name          | No       | No     | The name of the docker-compose service that runs the reverse proxy.                    | public-nginx                             |
| reverse_proxy_public_network        | No       | No     | The name of the docker network that is exposed to the public internet.                 | public0                                  |
| reverse_proxy_public_domain         | Yes      | Yes    | The public domain that the reverse proxy is serving.                                   |                                          |

# Parameters

| Parameter                         | Member       | Description                                                                                                                   |
|:----------------------------------|:-------------|:------------------------------------------------------------------------------------------------------------------------------|
| reverse_proxy_public_site_configs |              | Reverse proxy configurations that can be accessed from outside the network.                                                   |
|                                   | name         | The name of the reverse proxy.                                                                                                |
|                                   | src          | The template that will be used to create the reverse proxy configuration.                                                     |
| reverse_proxy_certificate_volume  |              | The name of the volume where SSL certificates are stored.                                                                     |
| reverse_proxy_networks            |              | A list of dictionaries that maps networks to which the reverse proxy container will connect to the properties of the network. |
|                                   | ipv4_address | The IPv4 address of the reverse proxy container on the network.                                                               |

# Docker Volumes

 | Volume              | Description                                                                                                                                                                    |
|:--------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | public-nginx-config | Configuration for the `nginx` service that is exposed to the public internet.  It contains configurations required to access sites from the public internet and local network. |
 | public-nginx-log    | The directory where logs from the `nginx` server that is exposed to the public internet are written.                                                                           |

# Docker Networks

| Network | Description                                                                                                                                                                                                                                       |
|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | public0 | This network is only accessible to the host interface that is exposed to the internet.  Its purpose is to prevent any requests to the local network or internet originating from the nginx container.  This is accomplished with `iptable` rules. |

# iptable Rules

This module defines `iptable` rules to ensure that no external connections can be initiated from the `public0` docker
network to any other system on this network, or the public internet.  The rules will allow responses to requests and
connections that are associated with existing connections.
