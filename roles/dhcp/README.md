# Description

This role provides services to run DHCP on the local network.

Because DHCP is a multicast protocol, there is no way for an external computer to reach a server running in a container
with bridge networking.  This problem is solved by using a DHCP relay container with host networking that connects to
the DHCP container using an internal docker network.  The DHCP server itself could use host networking, but, the long
term plan is to have a network with multiple VLANs, which will necessitate a DHCP relay.  Because a relay is being used,
subnet and IP information needs to be provided for the DHCP container.

At present, the DHCP relay communicates with the DHCP server using an internal docker IP address.  In the future, it is
desired that the DHCP relay will be implemented on a router.  At this point, the DHCP relay docker container can be
removed and the DHCP server container will need to expose port 67.  The `dhcp0` docker network can also be removed and
the DHCP server can be moved to the `docker1` network.

# Variables

| Variable            | Required | Secret | Description                                                           | Default                           |
|:--------------------|:---------|:-------|:----------------------------------------------------------------------|:----------------------------------|
| dhcp_dir            | No       | No     | The directory where dhcp configuration will be stored.                | "`{{ docker_compose_dir }}`/dhcp" |
| dhcp_docker_network | No       | No     | The name of the docker network that will be used by the DHCP service. | dhcp0                             |
 | dhcp_volume         | No       | No     | The name assigned to the volume storing DCHP configuration.           | dhcp                              |
 | dhcp_service_name   | No       | No     | The name of the docker-compose service providing DHCP services.       | dhcp                              |                 
| dhcp_docker_subnet  | No       | Yes    | The subnet that will be used by the dhcp docker network.              | 172.47.0.0/16                     |
| dhcp_docker_ip      | No       | Yes    | The IP address of the DHCP docker container on the dhcp network.      | 172.47.0.2                        |

# Docker Volumes

 | Volume             | Description                                   |
|:-------------------|:----------------------------------------------|
 | dhcp               | Directory where DHCP configuration is stored. |

# Docker Networks

 | Network | Description                                                                                                                            |
|:--------|:---------------------------------------------------------------------------------------------------------------------------------------|
 | dhcp0   | The network in which `isc-dhcp-server` will run.  This network is required so the subnet can be specified in dhcp configuration files. |

# Outputs

| Name           | Value                                                            |
|:---------------|:-----------------------------------------------------------------|
| dhcp_server_ip | The IP address of the docker container running the DHCP service. |
