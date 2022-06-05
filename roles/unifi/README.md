# Description

This role configures the unifi controller that will be used to manage all unifi devices on the network.

# Variables

| Variable  | Required | Description                                                            | Default                            |
|:----------|:---------|:-----------------------------------------------------------------------|:-----------------------------------|
| unifi_dir | No       | The path of the directory in which unifi configuration will be stored. | "`{{ docker_compose_dir }}`/unifi" | 

# Docker Volumes

 | Volume       | Description                                                                                |
|:-------------|:-------------------------------------------------------------------------------------------|
 | unifi        | Directory that stores unifi controller configuration.                                      |
 | unifi-backup | Directory where the unifi controller stores its montly backups.  This volume is backed up. |