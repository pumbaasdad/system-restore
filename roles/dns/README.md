This role creates the configuration files needed to run a DNS server in a docker container.  `bibd9` is the DNS server
that is run.  The most popular `bind9` container doesn't provide any default files, so this role installs a fair number
of static configuration files (in addition to the dynamic files needed to provide meaningful DNS).  DNS entries are
added to the DNS server using DDNS.

In addition to setting up the DNS server, this role also disables the `systemd-resolved` service, which would otherwise
hijack port 53 and sets up `resolve.conf` to use the new name server.

# Required Variables

- network: Details about all systems for which DNS records will be provided.  The format of this variable is likely to
  be changed soon, and it will be further documented at that time.
- isp_dns_forwarder_1: The address of the first DNS server provided by the ISP.
- isp_dns_forwarder_2: The address of the second DNS server provided by the ISP.
- dns_dir: The directory in which persistent DNS files will be stored.  Defaults to `{{ docker_compose_dir }}/dns`.
- dns_config_dir: The directory in which static DNS configuration will be stored.  Defaults to `{{ dns_dir }}/config`.
- dns_cache_dir: The directory into which DDNS entries will be written by the docker container.  Defaults to
  `{{ dns_dir }}/cache`.
- dns_forwarders: A list of DNS servers that the DNS server will fall back to if the requested name cannot be found.
  Defaults to a list containing the IPv6 addresses of google nameservers, followed by the IPv4 addresses of google
  name servers, followed by the values specified in `isp_dns_forwarder_1` and `isp_dns_forwarder_2`.
- dns_server: The name of the host running the DNS server.  This variable must match a hostname in the`network`
  variable.  Defaults to `ns01`.
- dns_zone: The DNS zone in which the DNS server runs.  This must be the zone in the `networks` variable that contains
  `dns_server`.  Defaults to `infrastructure`.
- dns_hostname.  The full name of the DNS server.  Defaults to
 `{{ dns_server }}.{{dns_zone }}.{{ network_domain }}.{{ network_suffix}}`.