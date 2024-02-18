# Description

This role configured `docker-compose` to run a number of services on the target machine.  All containers will be
configured to restart unless they are explicitly stopped.  Multiple docker networks will be created in an attempt to
isolate the blast radius should any container be compromised.

## Networks

### docker1

This network is supposed to be the general purpose network used by all docker containers that do not need to be accessed
by the public internet.  It fails in that regard as `plex` needs to be publicly accessible but is currently on this
network.  `plex` should be moved to an internal network behind the reverse proxy.

# Initial Setup

You must configure a port on your router that will forward traffic to the server being configured.  The port that
receives that traffic must be set in the `public_port` variable. 

# Variables

| Variable                   | Required | Secret | Description                                                                                                        | Default         |
|:---------------------------|:---------|:-------|:-------------------------------------------------------------------------------------------------------------------|:----------------|
| TZ                         | No       | No     | The timezone in which the docker host is running.                                                                  | America/Toronto |
| docker_address_pool_size   | No       | No     | The CIDR suffix specifying how many addresses a docker network will be given.                                      | 24              |
| docker_group_name          | No       | No     | The name of the unix group whose members can run docker.                                                           | docker          |
| docker_primary_network     | No       | No     | The name of the network that docker containers will use by default.                                                | docker1         |
| docker_address_pool_subnet | No       | Yes    | The subnet from which docker networks will be allocated.                                                           | 172.32.0.0/12   |
| public_port                | Yes      | Yes    | The port that has been setup on your router to forward packets to the interface connected to the`public0` network. |                 |

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
| docker_services             |            | Docker services that will be created.  See details below.                     |
|                             | config_dir | Optional.  The directory where configuration for the service will be created. |
| nas_ip                      |            | The IP address of the NAS from which volumes will be mounted.                 |

## docker_services

| Member         | Child Member | Required | Description                                                                                                                                             | Default                                           |
|:---------------|:-------------|:---------|---------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------|
| image          |              | Yes      | The image that will be used to run the service.                                                                                                         |                                                   |
| name           |              | Yes      | The name that docker-compose will use to identify the service.  There must be a Dockerfile named `<name>.Dockerfile` in `<dockerfile_dir>/dockerfiles`. |                                                   |
| container_name |              | No       | The name that will be assigned to the docker container.                                                                                                 | The value of `name`.                              |
| config_dir     |              | No       | The host directory where configuration for this service is stored.                                                                                      | No value.                                         |
| volumes        |              | No       | A list of mappings of volume name to container mount path.                                                                                              | []                                                |
| environment    |              | No       | A list of environment variables that will be provided to the service.  Default environment variables (see below) will be provided to all services.      | []                                                |
| ports          |              | No       | A list of host to container port mappings.                                                                                                              | []                                                |
| networks       |              | No       | Network configuration that will be used for this service.                                                                                               |                                                   |
|                | host         | No       | If the service runs in host networking mode.                                                                                                            | false                                             |
|                | default      | No       | If the service is connected to the default network.                                                                                                     | true                                              |
|                | internal     | No       | If the service is connected to the internal network.                                                                                                    | false                                             |
|                | extra        | No       | A list of non-standard networks to which the service will connect.  See below for a list of options that may be provided to these networks.             | []                                                |
| capabilities   |              | No       | A list of capabilities that will be provided to the service.                                                                                            | []                                                |
| command        |              | No       | The command that will be run to start the service                                                                                                       | The command specified in the services Dockerfile. |
| devices        |              | No       | A list of mappings of host device paths to container mount points.                                                                                      | []                                                |
| tty            |              | No       | If a pseudo-tty will be allocated for the service.                                                                                                      | false                                             |
| stop_signal    |              | No       | The signal that will be sent to stop the service.                                                                                                       | `SIGTERM`                                         |

### Extra Network Configuration

Extra networks must be a dictionary that maps the network name to a dictionary of configuration options.  The following
options are supported.

| Option       | Required | Description                                                                            | Default                               |
|:-------------|:---------|:---------------------------------------------------------------------------------------|:--------------------------------------|
 | ipv4_address | No       | The IPv4 address that will be assigned to the service on the network being configured. | The address will be provided by dhcp. |

### Default Environment Variables

The following environment variables will be provided to all services:

| Variable | Description                                                                          |
|:---------|:-------------------------------------------------------------------------------------|
| TZ       | The timezone in which the container is running.                                      |
| PUID     | The ID of the user on the host machine that is responsible for running the service.  |
| PGID     | The ID of the group on the host machine that is responsible for running the service. |
