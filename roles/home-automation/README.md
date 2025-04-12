# Description

This role provides home automation services via [Home Assistant](https://www.home-assistant.io/).  It uses [zwavejs2mqtt](https://github.com/zwave-js/zwavejs2mqtt) to manage Z-Wave
resources.

# Requirements

You must have a Z-Wave USB stick plugged into the system being configured.

# Initial Setup

A Google Cloud Platform project must be setup by following
[these instructions](https://www.home-assistant.io/integrations/google_assistant/#manual-setup).

# Variables

| Variable                                        | Required | Description                                                                                                      | Default                                    |
|:------------------------------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------|:-------------------------------------------|
| home_automation_dir                             | No       | The root directory used for home automation configuration and storage.                                           | `{{ docker_compose_dir }}/home-automation` |
| hass_dir                                        | No       | The directory where Home Assistant configuration will be stored.                                                 | `{{ home_automation_dir }}/hass`           |
| hass_db_dir                                     | No       | The directory where the Home Assistant database will be stored.                                                  | `{{ home_automation_dir }}/hass-db`        |
| hass_config_volume                              | No       | The name of the volume used to store Home Assistant configuration.                                               | hass-config                                |
| hass_db_volume                                  | No       | The name of the volume used to store the Home Assistant database.                                                | hass-db                                    |
| home_automation_service_name                    | No       | The name of the docker-compose service running Home Assistant.                                                   | homeassistant                              |
| home_automation_container_name                  | No       | The name of the docker container running Home Assistant.                                                         | hass                                       |
| home_automation_internal_web_port               | No       | The port on which the Home Assistant web UI will listen for connections.                                         | 8123                                       |
| home_automation_external_port                   | No       | The port on which Home Assistant will listen for connections from the public internet                            | `home_automation_internal_web_port`        |
| home_automation_subdomain                       | No       | The subdomain on which Home Assistant will be available.                                                         | home                                       |
| google_assistant_project_id                     | Yes      | The ID of the Google Cloud Platform project that will be used to integrate Home Assistant with Google Assistant. |                                            |
| google_assistant_secure_device_pin              | Yes      | A PIN that can be provided to Google Assistant to control secure devices in Home Assistant.                      |                                            |
| google_assistant_service_account_private_key_id | Yes      | The private key ID of the service account used to integrate Home Assistant with Google Assistant.                |                                            |
| google_assistant_service_account_private_key    | Yes      | The private key of the service account used to integrate Home Assistant with Google Assistant.                   |                                            |
| google_assistant_service_account_name           | Yes      | The name of the service account used to integrate Home Assistant with Google Assistant.                          |                                            |
| google_assistant_service_account_client_id      | Yes      | The client ID of the service account used to integrate Home Assistant with Google Assistant.                     |                                            |
| zwave_dir                                       | No       | The directory in which zwave2mqtt configuration will be stored.                                                  | `"{{ home_automation_dir }}/zwave"`        |
| zwave_usbstick_symlink                          | No       | The name of the symlink in /dev that points to the zwave USB stick                                               | zwaveusbstick                              |
| zwave_config_volume                             | No       | The name of the volume in which zwave configuration is stored.                                                   | zwave-config                               |
| zwave_service_name                              | No       | The name of the docker-compose service providing zwave functionality.                                            | zwavejs2mqtt                               |
| zwave_http_port                                 | No       | The port on which the zwave service's web UI will be exposed.                                                    | 8091                                       |
| zwave_websocket_port                            | No       | The port on which the zwave service's websocket will be exposed.                                                 | 3000                                       |
| zwave_vendor                                    | Yes      | The vendor of your zwave USB stick as reported by `udev`.                                                        |                                            |
| zwave_product                                   | Yes      | The product code of your zwave USB stick as reported by `udev`.                                                  |                                            |
| zwave_session_secret                            | Yes      | The session secret for you Z-Wave network.                                                                       |                                            |
| zwave_s0_legacy_key                             | Yes      | The S0 security key used in your Z-Wave network.                                                                 |                                            |
| zwave_s2_unauthenticated_key                    | Yes      | The unauthenticated S2 security key used in your Z-Wave network.                                                 |                                            |
| zwave_s2_authenticated_key                      | Yes      | The authenticated S2 security key used in your Z-Wave network.                                                   |                                            |
| zwave_s2_access_control_key                     | Yes      | The S2 access control key used in your Z-Wave network.                                                           |                                            |

# Parameters

| Parameter                        | Member      | Description                                                                            |
|:---------------------------------|:------------|:---------------------------------------------------------------------------------------|
| home_automation_reverse_proxy_ip |             | The IP address of the reverse proxy server that will be used to access Home Assistant. |

# Docker Volumes

| Volume       | Description                                                            |
|:-------------|:-----------------------------------------------------------------------|
| hass-config  | Used to store home assistant configuration.  This volume is backed up. |
| hass-db      | Used to store the home assistant database.                             |     
| zwave-config | Configuration for `zwave2mqtt`.  This volume is backed up.             |
