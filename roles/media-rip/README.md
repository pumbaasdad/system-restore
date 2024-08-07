# Description

This role creates the directories and device symlinks that are required to run media ripping software in a docker
container.  The software used to rip media will be `MakeMKV`.  It's user interface can be accessed on port 5801.
The container is configured to automatically rip any media inserted into the PC.

# Variables

| Variable                              | Required | Description                                                                                             | Default                                             |
|:--------------------------------------|:---------|:--------------------------------------------------------------------------------------------------------|:----------------------------------------------------|
| media_rip_dir                         | No       | The directory used for media rip operations.                                                            | `{{ docker_compose_dir }}/media-rip`                |
| media_rip_config_dir                  | No       | The directory where the docker container will store any information that it needs to persist.           | `{{ media_rip_dir }}/config`                        |
| media_rip_output_dir                  | No       | The directory to which `MakeMKV` will write output.                                                     | `{{ media_rip_dir }}/output`                        |
| media_rip_output_volume               | No       | The name of the volume that will be used to mount `media_rip_output_dir` to containers                  | media_rip_destination                               |
| media_rip_keep_app_running            | No       | If the `MakeMKV` process should be restarted if it crashes.                                             | 1 (yes)                                             |
| media_rip_block_device_symlink        | No       | The name of the symlink in /dev that points at the block optical device that will be used to rip media. | optical1                                            |
| media_rip_scsi_generic_device_symlink | No       | The name of the symlink in /dev /that points at the scsi optical device that will be used to rip media. | `{{ media_rip_scsi_block_device_symling }}_generic` |
| media_rip_service_name                | No       | The name of the docker-compose service that will be used to rip media.                                  | makemkv                                             |
| media_rip_port                        | No       | The port on which the `MakeMKV` web UI will be available.                                               | 5801                                                |
| media_rip_config_volume               | No       | The name of the volume into which ripped media will be stored.                                          | media_rip_config                                    |

# Docker Volumes

| Volume                | Description                                                            |
|:----------------------|:-----------------------------------------------------------------------|
 | media_rip_destination | Directory that is used to store files created by ripping CDs and DVDs. |

# Outputs

| Name          | Value                                                   |
|:--------------|:--------------------------------------------------------|
| output_volume | The name of the volume in which ripped media is stored. |
