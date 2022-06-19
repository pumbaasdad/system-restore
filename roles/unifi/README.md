# Description

This role configures the unifi controller that will be used to manage all unifi devices on the network.

# Variables

| Variable             | Required | Description                                                                 | Default                            |
|:---------------------|:---------|:----------------------------------------------------------------------------|:-----------------------------------|
| unifi_dir            | No       | The path of the directory in which unifi configuration will be stored.      | "`{{ docker_compose_dir }}`/unifi" |
 | unifi_volume         | No       | The name of the volume containing unifi configuration.                      | unifi                              |
 | unifi_backups_volume | No       | The name of the volume where automated unifi controller backups are stored. | unifi-backup                       |
 | unifi_service_name   | No       | The name of the docker-compose service running the unifi controller.        | unifi                              |
 | unifi_ui_port        | No       | The port on which the unifi controller's web UI will be exposed.            | 8443                               |

# Docker Volumes

 | Volume       | Description                                                                                |
|:-------------|:-------------------------------------------------------------------------------------------|
 | unifi        | Directory that stores unifi controller configuration.                                      |
 | unifi-backup | Directory where the unifi controller stores its montly backups.  This volume is backed up. |
