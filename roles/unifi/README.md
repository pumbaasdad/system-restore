# Description

This role configures the unifi controller that will be used to manage all unifi devices on the network.

# Variables

| Variable                   | Required | Secret | Description                                                                            | Default                            |
|:---------------------------|:---------|:-------|:---------------------------------------------------------------------------------------|:-----------------------------------|
| unifi_dir                  | No       | No     | The path of the directory in which unifi configuration will be stored.                 | "`{{ docker_compose_dir }}`/unifi" |
| unifi_volume               | No       | No     | The name of the volume containing unifi configuration.                                 | unifi                              |
| unifi_backups_volume       | No       | No     | The name of the volume where automated unifi controller backups are stored.            | unifi-backup                       |
| unifi_service_name         | No       | No     | The name of the docker-compose service running the unifi controller.                   | unifi                              |
| unifi_ui_port              | No       | No     | The port on which the unifi controller's web UI will be exposed.                       | 8443                               |
| unifi_mongodb_volume       | No       | No     | The name of the volume containing the mongodb database used by the unifi controller.   | unifi-db                           |
| unifi_mongodb_service_name | No       | No     | The name of the docker-compose service running unifi controller's mongodb database.    | unifi-db                           |
| unifi_mongodb_user         | No       | No     | The name of the user the unifi controller will use to access the mongodb database.     | unifi                              |
| unifi_mongodb_password     | Yes      | Yes    | The password of the user the unifi controller will use to access the mongodb database. |                                    |
| unifi_mongodb_dbname       | No       | No     | The name of the mongodb database used by the unifi controller.                         | unifi-db                           |

# Docker Volumes

 | Volume       | Description                                                                                |
|:-------------|:-------------------------------------------------------------------------------------------|
 | unifi        | Directory that stores unifi controller configuration.                                      |
 | unifi-backup | Directory where the unifi controller stores its montly backups.  This volume is backed up. |
