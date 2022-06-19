# Description

This role provides dynamic DNS functionality to the local network.  It provides the dynamic DNS using
[Duck DNS](www.duckdns.org).

# Initial Setup

 1. Visit [Duck DNS](www.duckdns.org) and sign in using your preferred identity provider (listed at the top of the
    page).
 2. Note your `token` listed at the top of your Duck DNS page.
 3. Add a new `subdomain` in the lower section of your Duck DNS page. 

# Variables

| Variable             | Required | Description                                                               | Default |
|:---------------------|:---------|:--------------------------------------------------------------------------|:--------|
| duckdns_service_name | No       | The name given to the docker-compose service that interacts with DuckDNS. | duckdns |
| duckdns_subdomain    | Yes      | The Duck DNS subdomain that you created during initial setup.             |         |
| duckdns_token        | Yes      | Your Duck DNS token that you noted during initial setup.                  |         |

# Outputs

| Name          | Value                                                  |
|:--------------|:-------------------------------------------------------|
| duckdns_token | A token that can be used to authenticate with DuckDns. |
