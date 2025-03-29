# Description

This role provides home automation services via [Home Assistant](https://www.home-assistant.io/).  It uses [zwavejs2mqtt](https://github.com/zwave-js/zwavejs2mqtt) to manage Z-Wave
resources.

# Requirements

You must have a Z-Wave USB stick plugged into the system being configured.

# Initial Setup

A Google Cloud Platform project must be setup by following
[these instructions](https://www.home-assistant.io/integrations/google_assistant/#manual-setup).  Note that when you
specify URLs, they must also be set in the `hass_google_assistant_api`, `hass_auth_authorize` and `hass_auth_token`
variables in the `reverse-proxy` role.

# Variables

| Variable                          | Required | Description                                                                                                      | Default                                    |
|:----------------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------|:-------------------------------------------|
| home_automation_dir               | No       | The root directory used for home automation configuration and storage.                                           | `{{ docker_compose_dir }}/home-automation` |
| hass_dir                          | No       | The directory where Home Assistant configuration will be stored.                                                 | `{{ home_automation_dir }}/hass`           |
| hass_db_dir                       | No       | The directory where the Home Assistant database will be stored.                                                  | `{{ home_automation_dir }}/hass-db`        |
| hass_config_volume                | No       | The name of the volume used to store Home Assistant configuration.                                               | hass-config                                |
| hass_db_volume                    | No       | The name of the volume used to store the Home Assistant database.                                                | hass-db                                    |
| home_automation_service_name      | No       | The name of the docker-compose service running Home Assistant.                                                   | homeassistant                              |
| home_automation_container_name    | No       | The name of the docker container running Home Assistant.                                                         | hass                                       |
| home_automation_internal_web_port | No       | The port on which the Home Assistant web UI will listen for connections.                                         | 8123                                       |
| home_automation_external_port     | No       | The port on which Home Assistant will listen for connections from the public internet                            | `home_automation_internal_web_port`        |
| home_assistant_wemo_server_port   | No       | The port that will be used in the home assistant container to listed for wemo callbacks.                         | 8990                                       |
| home_automation_subdomain         | No       | The subdomain on which Home Assistant will be available.                                                         | home                                       |
| google_assistant_project_id       | Yes      | The ID of the Google Cloud Platform project that will be used to integrate Home Assistant with Google Assistant. |                                            |
| google_assistant_api_key          | Yes      | The API key used to authorize Home Assistant with your Google Cloud Platform project.                            |                                            |
| hass_google_assistant_api         | Yes      | The path that the reverse proxy will forward to the /api/google_assistant endpoint of home assistant.            |                                            |
| hass_auth_authorize               | Yes      | The path that the reverse proxy will forward to the /auth/authorize endpoint of home assistant.                  |                                            |
| hass_auth_token                   | Yes      | The path that the reverse proxy will forward to the /auth/token endpoint of home assistant.                      |                                            |
| zwave_dir                         | No       | The directory in which zwave2mqtt configuration will be stored.                                                  | `"{{ home_automation_dir }}/zwave"`        |
| zwave_usbstick_symlink            | No       | The name of the symlink in /dev that points to the zwave USB stick                                               | zwaveusbstick                              |
| zwave_config_volume               | No       | The name of the volume in which zwave configuration is stored.                                                   | zwave-config                               |
| zwave_service_name                | No       | The name of the docker-compose service providing zwave functionality.                                            | zwavejs2mqtt                               |
| zwave_http_port                   | No       | The port on which the zwave service's web UI will be exposed.                                                    | 8091                                       |
| zwave_websocket_port              | No       | The port on which the zwave service's websocket will be exposed.                                                 | 3000                                       |
| zwave_vendor                      | Yes      | The vendor of your zwave USB stick as reported by `udev`.                                                        |                                            |
| zwave_product                     | Yes      | The product code of your zwave USB stick as reported by `udev`.                                                  |                                            |
| zwave_session_secret              | Yes      | The session secret for you Z-Wave network.                                                                       |                                            |
| zwave_s0_legacy_key               | Yes      | The S0 security key used in your Z-Wave network.                                                                 |                                            |
| zwave_s2_unauthenticated_key      | Yes      | The unauthenticated S2 security key used in your Z-Wave network.                                                 |                                            |
| zwave_s2_authenticated_key        | Yes      | The authenticated S2 security key used in your Z-Wave network.                                                   |                                            |
| zwave_s2_access_control_key       | Yes      | The S2 access control key used in your Z-Wave network.                                                           |                                            |

# Parameters

| Parameter                        | Member      | Description                                                                            |
|:---------------------------------|:------------|:---------------------------------------------------------------------------------------|
| home_automation_wemo_hosts       |             | A list of wemo devices to be controlled.                                               |
|                                  | zone        | The name of the DNS zone to which the device belongs.                                  |
|                                  | ipv4_offset | The offset of the devices IP address from the start of the DNS zone's subnet.          |
| home_automation_reverse_proxy_ip |             | The IP address of the reverse proxy server that will be used to access Home Assistant. |

# Docker Volumes

| Volume       | Description                                                            |
|:-------------|:-----------------------------------------------------------------------|
| hass-config  | Used to store home assistant configuration.  This volume is backed up. |
| hass-db      | Used to store the home assistant database.                             |     
| zwave-config | Configuration for `zwave2mqtt`.  This volume is backed up.             |
