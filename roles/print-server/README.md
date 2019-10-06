# Initial Setup

## CUPS

There's no go way to use ansible to configure the printers used by CUPS.  Therefore, once the container is running, you
must connect to `http://<docker host>:631` and add printers.  These steps must be run every time the container is
started when there is no existing print server configuration.

## Google Cloud Print Connector

`avahi-daemon` is required to use local printing, but, it doesn't play nice with `bridge` networking.  To keep things
simple, cloud printing is used instead.  In order to setup cloud printing, follow these instructions.

1. `docker exec -it cups bash`
1.  `./gcp-connector-util init`
1. Disable local printing
1. Enable cloud printing
1. Follow the directions to link your google account
1. Open `gcp-cups-connector.config.json` and find the following values:
   * XMPP JID
   * Robot Refresh Token
   * ProxyName
1. Configure ansible so these values will be passed as environment variables to the docker container.
1. Rerun ansible.


These steps only need to be run once.  If the system is being restored from scratch, the previous values of the
environment variables may be used. 