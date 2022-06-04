# Description

This role uses `docker-compose` to run a number of services on the target machine.  It creates several docker networks
in an attempt to isolate the blast radius should any container be compromised.

## Networks

### private0

This is an internal docker network that the host system cannot access.  Its purpose is to allow nginx to proxy requests
to other services.  `private0` is a bad name and this will likely be renamed `internal0` in the future.

### docker1

This network is supposed to be the general purpose network used by all docker containers that do not need to be accessed
by the public internet.  It fails in that regard as `plex` needs to be publicly accessible but is currently on this
network.  Also, having `letsencrypt` on this network provides a bridge from the `private0` network to `docker1`.  It
should be trivial to remove `letsencrypt` from this network.  `plex` can definitely be moved to the `docker2` network,
but an ideal situation would be to put it on the `private0` network behind the `nginx` proxy.

### HOST

All efforts have been made to avoid using host networking, however in order for a dhcp relay to listen to multicast
traffic, host networking is a requirement.

## Volumes

The following directories are mounted, but are not named volumes.  They will be converted to volumes in the future:

### media_rip_config_dir

This directory stores the configuration for `makemkv`.

### transcode_dir

This directory stores the configuration for `handbrake`.

### dns_config_dir

This directory stores the configuration for the `bind9` DNS server.

### dns_cache_dir

This directory stores files cached by the `bind9` DNS server.

## Containers

The docker containers created by this role are documented in their own roles.  All containers will restart unless
explicitly stopped.  The following containers have interesting docker configuration that is worth noting:

### letsencrypt

This container is given the `NET_ADMIN` capacity to allow `fail2ban` to add `iptable` rules when it identifies malicious
IP addresses.

### public-nginx

This container is assigned a specific IPv4 address as home assistant needs to know this address when it is behind a
reverse proxy.

### dhcp

This container is given an explicit IP address because the DHCP server and the relay both need to know this IP address.

### dhcp-relay

This container is given the `NET_ADMIN` capacity to allow it to listen to multicast traffic.

# Initial Setup

You must configure a port on your router that will forward traffic to the server being configured.  The port that
receives that traffic must be set in the `public_port` variable. 

# Variables

| Variable                   | Required | Description                                                                                                        | Default          |
|:---------------------------|:---------|:-------------------------------------------------------------------------------------------------------------------|:-----------------|
| TZ                         | No       | The timezone in which the docker host is running.                                                                  | America/Toronto  |
| docker_address_pool_size   | No       | The CIDR suffix specifying how many addresses a docker network will be given.                                      | 24               |
| docker_address_pool_subnet | Yes      | The subnet from which docker networks will be allocated.                                                           |                  |
| docker_private0_subnet     | Yes      | The subnet that will be used for the `private0` network.                                                           |                  |
| public_port                | Yes      | The port that has been setup on your router to forward packets to the interface connected to the`public0` network. |                  |
| nas_address                | Yes      | The IP of the NAS used by docker.                                                                                  |                  |

# Parameters

| Parameter                   | Member     | Description                                                                   |
|:----------------------------|:-----------|:------------------------------------------------------------------------------|
| docker_local_volumes        |            | Local directories which will be available to docker containers as volumes.    |
 |                             | path       | The path to the directory.                                                    |
 |                             | volume     | The name of the volume.                                                       |
 | docker_nas_volumes          |            | NAS directories which will be available to docker containers as volumes.      |
 |                             | path       | The path to the directory on the NAS.                                         |
 |                             | volume     | The name of the volume.                                                       |
 | docker_extra_networks       |            | Non-default networks that roles require.                                      |
 |                             | name       | The name of the network.                                                      |
 |                             | subnet     | Optional. The subnet that will be used by the network.                        | 
 | docker_services             |            | Docker services that will be created.                                         |
 |                             | config_dir | Optional.  The directory where configuration for the service will be created. |
 | docker_services_with_config |            | Names of docker services that have configuration directories                  |
