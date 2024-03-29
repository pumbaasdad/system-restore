# Description

This module provides a Z-Wave controller to manage Z-Wave resources in your smart home.  The controller uses is
[zwavejs2mqtt](https://github.com/zwave-js/zwavejs2mqtt).

# Requirements

You must have a Z-Wave USB stick plugged into the system being configured.

# Variables

| Variable                     | Required  | Description                                                           | Default                            |
|:-----------------------------|:----------|:----------------------------------------------------------------------|:-----------------------------------|
| zwave_dir                    | No        | The directory in which zwave2mqtt configuration will be stored.       | `"{{ docker_compose_dir }}/zwave"` |
| zwave_usbstick_symlink       | No        | The name of the symlink in /dev that points to the zwave USB stick    | zwaveusbstick                      |
| zwave_config_volume          | No        | The name of the volume in which zwave configuration is stored.        | zwave-config                       |
| zwave_service_name           | No        | The name of the docker-compose service providing zwave functionality. | zwavejs2mqtt                       |
| zwave_http_port              | No        | The port on which the zwave service's web UI will be exposed.         | 8091                               |
| zwave_websocket_port         | No        | The port on which the zwave service's websocket will be exposed.      | 3000                               |
| zwave_vendor                 | Yes       | The vendor of your zwave USB stick as reported by `udev`.             |                                    |
| zwave_product                | Yes       | The product code of your zwave USB stick as reported by `udev`.       |                                    |
| zwave_session_secret         | Yes       | The session secret for you Z-Wave network.                            |                                    |
| zwave_s0_legacy_key          | Yes       | The S0 security key used in your Z-Wave network.                      |                                    |
| zwave_s2_unauthenticated_key | Yes       | The unauthenticated S2 security key used in your Z-Wave network.      |                                    |
| zwave_s2_authenticated_key   | Yes       | The authenticated S2 security key used in your Z-Wave network.        |                                    |
| zwave_s2_access_control_key  | Yes       | The S2 access control key used in your Z-Wave network.                |                                    |

# Docker Volumes

| Volume       | Description                                                |
|:-------------|:-----------------------------------------------------------|
 | zwave-config | Configuration for `zwave2mqtt`.  This volume is backed up. |
