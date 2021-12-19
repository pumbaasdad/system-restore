# Description

This role provides support for generating certificates.  It provides this functionality using
[Let's Encrypt](www.letsencrypt.org).

# Initial Setup

Because certificate generation is tied to [Duck DNS](www.duckdns.org), you must follow the initial setup steps for the
[ddns module](../ddns/README.md).

# Variables

| Variable          | Required | Description                                               | Default |
|:------------------|:---------|:----------------------------------------------------------|:--------|
| letsencrypt_email | Yes      | The email address associated with generated certificates. |         |
| letsencrypt_url   | Yes      | The public URL for which certificates will be generated.  |         |
