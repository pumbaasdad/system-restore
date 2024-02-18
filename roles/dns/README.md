# Description

This role provides DNS services on the network.  `bibd9` is the DNS server that is run.  DNS records are created for all
hosts in [network.yml](../../README.md#network-configuration).

In addition to setting up the DNS server, this role also disables the `systemd-resolved` service, which would otherwise
hijack port 53 and sets up `resolve.conf` to use the new name server.

# Required Variables

| Variable           | Required | Description                                                                         | Default                                                        |
|:-------------------|:---------|:------------------------------------------------------------------------------------|:---------------------------------------------------------------|
| dns_dir            | No       | The path of the directory in which dns configuration files will be stored.          | "`{{ docker_compose_dir }}`/dns"                               |
| dns_config_dir     | No       | The path of the directory in which static dns configuration files will be stored.   | "`{{ dns_dir }}'/config"                                       |
| dns_cache_dir      | No       | The path of the directory that bind9 uses as its cache.                             | "`{{ dns_dir }}'/cache"                                        |
| dns_forwarders     | No       | An ordered list of IP addresses to DNS servers to which requests will be forwarded. | IPv6 and IPv4 addresses for cloudflare and google DNS servers. |
| dns_config_volume  | No       | The name of the volume that stores DNS configuration.                               | dns_config                                                     |
| dns_cache_volume   | No       | The name of the volume that will be used by bind9 for caching.                      | dns_cache                                                      |
| dns_service_name   | No       | The name of the docker-compose service that will provide DNS.                       | dns                                                            |
| dns_container_name | No       | The name of the docker container that will provide DNS.                             | bind9                                                          |
