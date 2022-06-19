# Description

This role provides services to back up configuration that is too sensitive to be stored in GitHub.

All backups are encrypted and currently, they can only be stored in Google Drive.

# Initial Setup

You must create a Google Cloud Platform project that will provide this service access to your Google Drive following
[these instructions](https://github.com/fekide/volumerize/tree/master/backends/GoogleDrive).

# Variables

| Variable                         | Required | Description                                                                | Default                                 |
|:---------------------------------|:---------|:---------------------------------------------------------------------------|:----------------------------------------|
| volumerize_dir                   | No       | The directory in which duplicity configuration will be stored.             | `"{{ docker_compose_dir }}/volumerize"` |
| volumerize_schedule              | No       | The jobber schedule that specifies when backups should occur.              | 0 30 0 * * 1                            |
| volumerize_service_name          | No       | The name given to the docker-compose service that creates backups.         | volumerize                              | 
| volumerize_cache_volume          | No       | The name given to the volumerize cache docker volume.                      | volumerize-cache                        |
| volumerize_credentials_volume    | No       | The name given to the volumerize credentials docker volume.                | volumerize-credentials                  |
| volumerize_full_if_older_than    | No       | How often a full backup should be taken.                                   | 1M                                      |
| volumerize_remove_all_but_n_full | No       | How many full backups should be saved.                                     | 4                                       |
| volumerize_all_inc_but_n_full    | No       | The number of full backups that should have incremantal backups saved.     | 1                                       |
| volumerize_passphrase            | Yes      | The passphrase that will be used to encrypt/decrypt backups.               |                                         |
| volumerize_email                 | Yes      | The e-mail address of the google account to which backups will be written. |                                         |
| volumerize_google_drive_dir      | Yes      | The name of the google drive directory where backups will be stored.       |                                         |

# Parameters

| Parameter       | Member         | Description                                                                                         |
|:----------------|:---------------|:----------------------------------------------------------------------------------------------------|
| backup_services |                | A list of service that need to be backed up.                                                        |
 |                 | name           | The name of the service.                                                                            |
|                 | container_name | The name of the container in which the service runs.  Only required if it is different than `name`. | 
| backup_volumes  |                | A list of volume names that need to be backed up.                                                   |

# Docker Volumes

 | Volume                 | Description                                                  |
|:-----------------------|:-------------------------------------------------------------|
 | volumerize-cache       | Directory used to created incremental backups.               |
 | volumerize-credentials | Credentials used by volumerize to save backups to the cloud. |
