# Description

This role provides home automation services via [Home Assistant](https://www.home-assistant.io/).

# Initial Setup

A Google Cloud Platform project must be setup by following
[these instructions](https://www.home-assistant.io/integrations/google_assistant/#manual-setup).  Note that when you
specify URLs, they must also be set in the `hass_google_assistant_api`, `hass_auth_authorize` and `hass_auth_token`
variables in the `reverse-proxy` role.

# Variables

| Variable                        | Required | Description                                                                                                      | Default                            |
|:--------------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------|:-----------------------------------|
| hass_dir                        | No       | The directory where Home Assistant configuration will be stored.                                                 | `{{ docker_compose_dir }}/hass`    |
| hass_db_dir                     | No       | The directory where the Home Assistant database will be stored.                                                  | `{{ docker_compose_dir }}/hass-db` |
| hass_config_volume              | No       | The name of the volume used to store Home Assistant configuration.                                               | hass-config                        |
| hass_db_volume                  | No       | The name of the volume used to store the Home Assistant database.                                                | hass-db                            |
| home_automation_service_name    | No       | The name of the docker-compose service running Home Assistant.                                                   | homeassistant                      |
| home_automation_container_name  | No       | The name of the docker container running Home Assistant.                                                         | hass                               |
| home_automation_network         | No       | The name of the non-internal docker network that will be used by Home Assistant.                                 | ha-proxy0                          |
| home_assistant_wemo_server_port | No       | The port that will be used in the home assistant container to listed for wemo callbacks.                         | 8990                               |
| google_assistant_project_id     | Yes      | The ID of the Google Cloud Platform project that will be used to integrate Home Assistant with Google Assistant. |                                    |
| google_assistant_api_key        | Yes      | The API key used to authorize Home Assistant with your Google Cloud Platform project.                            |                                    |
| hass_google_assistant_api       | Yes      | The path that the reverse proxy will forward to the /api/google_assistant endpoint of home assistant.            |                                    |
| hass_auth_authorize             | Yes      | The path that the reverse proxy will forward to the /auth/authorize endpoint of home assistant.                  |                                    |
| hass_auth_token                 | Yes      | The path that the reverse proxy will forward to the /auth/token endpoint of home assistant.                      |                                    |

# Docker Volumes

 | Volume      | Description                                                            |
|:------------|:-----------------------------------------------------------------------|
 | hass-config | Used to store home assistant configuration.  This volume is backed up. |
 | hass-db     | Used to store the home assistant database.                             |     

# Docker Networks

| Network   | Description                                                                                                                                                          |
|:----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | ha-proxy0 | The network used to forward traffic from the reverse proxy to the home automation service.  `iptables` rules limits traffic to port 8123 or established connections. |
