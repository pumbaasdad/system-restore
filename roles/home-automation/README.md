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
| home_automation_network         | No       | The name of the non-internal docker network that will be used by Home Assistant.                                 | docker2                            |
| home_assistant_wemo_server_port | No       | The port that will be used in the home assistant container to listed for wemo callbacks.                         | 8990                               |
| google_assistant_project_id     | Yes      | The ID of the Google Cloud Platform project that will be used to integrate Home Assistant with Google Assistant. |                                    |
| google_assistant_api_key        | Yes      | The API key used to authorize Home Assistant with your Google Cloud Platform project.                            |                                    |
| hass_google_assistant_api       | Yes      | The path that the reverse proxy will forward to the /api/google_assistant endpoint of home assistant.            |                                    |
| hass_auth_authorize             | Yes      | The path that the reverse proxy will forward to the /auth/authorize endpoint of home assistant.                  |                                    |
| hass_auth_token                 | Yes      | The path that the reverse proxy will forward to the /auth/token endpoint of home assistant.                      |                                    |

# Parameters

| Parameter                       | Member      | Description                                                                   |
|:--------------------------------|:------------|:------------------------------------------------------------------------------|
| home_automation_trusted_proxies |             | IP addresses of proxy servers that will be trusted by home assistant.         |
| home_automation_wemo_hosts      |             | A list of wemo devices to be controlled.                                      |
|                                 | zone        | The name of the DNS zone to which the device belongs.                         |
 |                                 | ipv4_offset | The offset of the devices IP address from the start of the DNS zone's subnet. |

# Docker Volumes

 | Volume      | Description                                                            |
|:------------|:-----------------------------------------------------------------------|
 | hass-config | Used to store home assistant configuration.  This volume is backed up. |
 | hass-db     | Used to store the home assistant database.                             |     

# Docker Networks

| Network | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | docker2 | This network was created because home assistant required access to the local network and the internet to function.  As a result, it really defeats the purpose of isolating the `public0` network defined in the `reverse-proxy` role.  If the public `nginx` container becomes compromised, an attacker could theoretically work their way through the private0 and docker2 networks to get access to the home network and public internet.  The correct solution to this issue is to set up a VLAN used by all smart home devices, and to include the `public0` network on that VLAN. The `iptable` rules preventing home assistant from accessing the network could be removed, and this network could be deleted. |
