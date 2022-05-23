# Description

This role provides services to back up configuration that is too sensitive to be stored in GitHub.  The following will
be backed up:

 * Home Assistant configuration
 * Let's Encrypt certificates
 * Unifi Controller configuration
 * zwave2mqtt configuration

All backups are encrypted and currently, they can only be stored in Google Drive.  Incremental backups will occur every
Monday at 12:30 AM, with a new full backup being created monthly.  4 full backups will be stored, and incremental
backups will only be stored for the most recent full backup.

# Initial Setup

You must create a Google Cloud Platform project that will provide this service access to your Google Drive following
[these instructions](https://github.com/fekide/volumerize/tree/master/backends/GoogleDrive).

# Variables

| Variable                    | Required | Description                                                                | Default                                  |
|:----------------------------|:---------|:---------------------------------------------------------------------------|:-----------------------------------------|
| volumerize_dir              | No       | The directory in which duplicity configuration will be stored.             | `"{{ docker_compose_dir }}/volumerize"`  |
| volumerize_passphrase       | Yes      | The passphrase that will be used to encrypt/decrypt backups.               |                                          |
| volumerize_email            | Yes      | The e-mail address of the google account to which backups will be written. |                                          |
| volumerize_google_drive_dir | Yes      | The name of the google drive directory where backups will be stored.       |                                          |

# Docker Volumes

 | Volume                 | Description                                                  |
|:-----------------------|:-------------------------------------------------------------|
 | volumerize-cache       | Directory used to created incremental backups.               |
 | volumerize-credentials | Credentials used by volumerize to save backups to the cloud. |
