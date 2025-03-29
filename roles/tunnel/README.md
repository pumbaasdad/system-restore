# Description

This role opens a tunnel to the internet to allow external traffic to reach the internal network without opening a port
in the network's firewall.

The tunnel opened by this role will only allow outgoing traffic to cloudflare servers, and will only accept incoming
traffic from existing connections.  The container cannot directly access the local network.  The name of a docker
network can be provided to allow the tunnel to access other docker containers. 

# Initial Setup

 1. Create a [cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/) and connect an application.
    1. Add public hostnames for all of the paths exposed by the home assistant external proxy.
    2. These hostsnames should forward to http://external-proxy:<PORT> where <PORT> is the external port on which home assistant is exposed.
 2. Create a cloudflare rule group for all IP ranges used by Google Assistant (108.177.0.0/17 , 192.178.0.0/15 , 66.102.0.0/20 , 74.125.0.0/16 , 66.249.80.0/20)
 3. Create a cloudflare policy to bypass authentication for the Google Assistant IP ranges.
 4. Create a cloudflare application for Home Assistant.
    1. Use the hostname defined in your tunnel.  A DNS error may be displayed, ignore it.
    2. Apply the Google Assistant bypass policy to the application.

# Variables

| Variable                | Required | Secret | Description                                                                        | Default     |
|:------------------------|:---------|:-------|:-----------------------------------------------------------------------------------|:------------|
| tunnel_service_name     | No       | No     | The name of the docker service that will open the tunnel.                          | cloudflared |
| tunnel_external_network | No       | No     | The name of the docker network that will be used to communicate with the internet. | cloudflare0 |

# Parameters

| Parameter                        | Description                                                                               |
|:---------------------------------|:------------------------------------------------------------------------------------------|
| tunnel_internal_network          | The name of a docker network that this tunnel can connect to to access internal services. |

# Docker Networks

| Network                   | Description                                      |
|:--------------------------|:-------------------------------------------------|
| `tunnel_external_network` | The network used to communicate with cloudflare. |
