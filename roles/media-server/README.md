# Initial Setup

There does not appear to be any way to configure Plex using ansible, therefore, initial manual setup is required.
Furthermore, for some reason, when using bridge networking, the Plex web server is unable to detect the Plex media
server until it has been initially setup, therefore, initial setup must be done using an SSH tunnel.

1. Setup port forwarding on the router for TCP from `<external port>` to `<docker host>:32400`
1. Create an ssh tunnel to the docker host:

    `ssh -L <local port>:localhost:32400 <user>@<docker host>`

1. Access the media server at `http://localhost:<local port>/web`
1. Follow the steps in the wizard, but, don't add any libraries at this point.
1. After completing the wizard, open Settings > Network and set "Custom server access URLs" to 
   `https://<docker host ip>:<external port>`
1. Go to Settings > Remote Access, select "Manually specify public port" and set it to `<external port>`, click Apply.
1. Close the ssh tunnel.
1. Access `<docker host>:32400`, if the Plex media server cannot be found, then, restart the docker container.
1. Open the settings menu and configure as desired.
1. Add media libraries.