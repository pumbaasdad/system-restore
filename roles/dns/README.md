# Description

This role provides DNS services on the network.  `bibd9` is the DNS server that is run.  DNS records are created for all
hosts in [network.yml](../../README.md#network-configuration).

In addition to setting up the DNS server, this role also disables the `systemd-resolved` service, which would otherwise
hijack port 53 and sets up `resolve.conf` to use the new name server.

# Required Variables

| Variable       | Required | Description                                                                         | Default                                                        |
|:---------------|:---------|:------------------------------------------------------------------------------------|:---------------------------------------------------------------|
| dns_dir        | No       | The path of the directory in which dns configuration files will be stored.          | "`{{ docker_compose_dir }}`/dns"                               |
 | dns_config_dir | No       | The path of the directory i which static dns configuration files will be stored.    | "`{{ dns_dir }}'/config"                                       |
 | dns_forwarders | No       | An ordered list of IP addresses to DNS servers to which requests will be forwarded. | IPv6 and IPv4 addresses for cloudflare and google DNS servers. | 
