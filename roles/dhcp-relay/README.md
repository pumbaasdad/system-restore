# Description

This role provides services to run DHCP relay.  In order to accept multicast DHCP traffic, it runs in host networking
mode and has the `NET_ADMIN` capability.

# Variables

| Variable                | Required | Description                                                           | Default    |
|:------------------------|:---------|:----------------------------------------------------------------------|:-----------|
 | dhcp_relay_service_name | No       | The name of the docker-compose service providing DHCP relay services. | dhcp-relay |    
