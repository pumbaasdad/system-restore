# Description

This role installs docker tools, creates docker users and groups and configures the docker daemon.

# Variables

| Variable                   | Required | Secret | Description                                                                                                        | Default         |
|:---------------------------|:---------|:-------|:-------------------------------------------------------------------------------------------------------------------|:----------------|
| docker_address_pool_size   | No       | No     | The CIDR suffix specifying how many addresses a docker network will be given.                                      | 24              |
| docker_address_pool_subnet | No       | Yes    | The subnet from which docker networks will be allocated.                                                           | 172.32.0.0/12   |
| docker_user_name           | No       | No     | The name of the linux user responsible for running docker.                                                         | docker          |                                                                                         
| docker_group_name          | No       | No     | The name of the linux group whose members can run docker.                                                          | docker          |
| public_port                | Yes      | Yes    | The port that has been setup on your router to forward packets to the interface connected to the`public0` network. |                 |

# Outputs

| Name         | Value                                                  |
|:-------------|:-------------------------------------------------------|
| docker_user  | The name of the user that will be used to run docker.  |
| docker_group | The name of the group that will be used to run docker. |