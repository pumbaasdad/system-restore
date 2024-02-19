# Description

This role uses `docker-compose` to run configured containers on the target machine.

# Variables

| Variable                   | Required | Secret | Description                                                              | Default                                  |
|:---------------------------|:---------|:-------|:-------------------------------------------------------------------------|:-----------------------------------------|
| docker_compose_virtual_env | No       | No     | The location of the virtual environment used for running docker-compose. | `"{{ docker_compose_dir }}/.venv/docker` |

# Parameters

| Parameter                   | Member     | Description                                                                   |
|:----------------------------|:-----------|:------------------------------------------------------------------------------|
| docker_services             |            | Docker services that will be created.  See details below.                     |
|                             | config_dir | Optional.  The directory where configuration for the service will be created. |
| docker_services_with_config |            | Names of docker services that have configuration directories                  |
