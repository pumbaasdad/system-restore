# Description

This role provides home automation services via [Home Assistant](https://www.home-assistant.io/).

# Initial Setup

A Google Cloud Platform project must be setup by following
[these instructions](https://www.home-assistant.io/integrations/google_assistant/#manual-setup).  Note that when you
specify URLs, they must also be set in the `hass_google_assistant_api`, `hass_auth_authorize` and `hass_auth_token`
variables in the `reverse-proxy` role.

# Variables

| Variable                    | Required | Description                                                                                                      | Default                            |
|:----------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------|:-----------------------------------|
| hass_dir                    | No       | The directory where Home Assistant configuration will be stored.                                                 | `{{ docker_compose_dir }}/hass`    |
| hass_db_dir                 | No       | The directory where the Home Assistant database will be stored.                                                  | `{{ docker_compose_dir }}/hass-db` |
| google_assistant_project_id | Yes      | The ID of the Google Cloud Platform project that will be used to integrate Home Assistant with Google Assistant. |                                    |
| google_assistant_api_key    | Yes      | The API key used to authorize Home Assistant with your Google Cloud Platform project.                            |                                    |

# Parameters

| Parameter                       | Member | Description                                                           |
|:--------------------------------|:-------|:----------------------------------------------------------------------|
| home_automation_trusted_proxies |        | IP addresses of proxy servers that will be trusted by home assistant. |

# Docker Volumes

 | Volume      | Description                                                            |
|:------------|:-----------------------------------------------------------------------|
 | hass-config | Used to store home assistant configuration.  This volume is backed up. |
 | hass-db     | Used to store the home assistant database.                             |     

# Docker Networks

| Network | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | docker2 | This network was created because home assistant required access to the local network and the internet to function.  As a result, it really defeats the purpose of isolating the `public0` network defined in the `reverse-proxy` role.  If the public `nginx` container becomes compromised, an attacker could theoretically work their way through the private0 and docker2 networks to get access to the home network and public internet.  The correct solution to this issue is to set up a VLAN used by all smart home devices, and to include the `public0` network on that VLAN. The `iptable` rules preventing home assistant from accessing the network could be removed, and this network could be deleted. |
