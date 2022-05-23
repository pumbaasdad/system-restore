# Description

This role configures the default shell for the user running ansible.

# Variables

| Variable  | Required | Description                                                            | Default                            |
|:----------|:---------|:-----------------------------------------------------------------------|:-----------------------------------|
| unifi_dir | Yes      | The path of the directory in which unifi configuration will be stored. | "`{{ docker_compose_dir }}`/unifi" | 
