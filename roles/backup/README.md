# Description

This role provides services to back up configuration that is too sensitive to be stored in GitHub.

All backups are encrypted and currently, they can only be stored in Google Drive.

# Initial Setup

You must create a Google Cloud Platform project that will provide this service access to your Google Drive following
[these instructions](https://github.com/pumbaasdad/volumerize/blob/master/backends/GoogleDrive/README.md).

# Variables

| Variable                                         | Required | Secret  | Description                                                                       | Default                                 |
|:-------------------------------------------------|:---------|:--------|:----------------------------------------------------------------------------------|:----------------------------------------|
| volumerize_dir                                   | No       | No      | The directory in which duplicity configuration will be stored.                    | `"{{ docker_compose_dir }}/volumerize"` |
| volumerize_schedule                              | No       | No      | The jobber schedule that specifies when backups should occur.                     | 0 30 0 * * 1                            |
| volumerize_service_name                          | No       | No      | The name given to the docker-compose service that creates backups.                | volumerize                              | 
| volumerize_cache_volume                          | No       | No      | The name given to the volumerize cache docker volume.                             | volumerize-cache                        |
| volumerize_credentials_volume                    | No       | No      | The name given to the volumerize credentials docker volume.                       | volumerize-credentials                  |
| volumerize_full_if_older_than                    | No       | No      | How often a full backup should be taken.                                          | 1M                                      |
| volumerize_remove_all_but_n_full                 | No       | No      | How many full backups should be saved.                                            | 4                                       |
| volumerize_all_inc_but_n_full                    | No       | No      | The number of full backups that should have incremantal backups saved.            | 1                                       |
| volumerize_passphrase                            | Yes      | Yes     | The passphrase that will be used to encrypt/decrypt backups.                      |                                         |
| volumerize_google_project_id                     | Yes      | Yes     | ID of the google cloud project that owns the service account used by duplicity.   |                                         | 
| volumerize_google_service_account_private_key_id | Yes      | Yes     | ID of the private key used by duplicity to write to google drive.                 |                                         | 
| volumerize_google_service_account_private_key    | Yes      | Yes     | The private key used by duplicity to write to google drive.                       |                                         | 
| volumerize_google_service_account_email          | Yes      | Yes     | E-mail address of the service account used by duplicity to write to google drive. |                                         | 
| volumerize_google_client_id                      | Yes      | Yes     | Client ID used by duplicity to write to google drive.                             |                                         | 
| volumerize_google_drive_folder_id                | Yes      | Yes     | ID of the folder to which duplicity will write backups.                           |                                         | 

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
