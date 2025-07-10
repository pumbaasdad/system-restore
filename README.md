# Ansible Local Network Configuration

This repository contains an Ansible playbook for configuring a local home network. It includes roles for setting up various services like DNS, DHCP, reverse proxy, and more.

## Overview

This playbook is designed to automate the setup and configuration of a home network. It uses Ansible to manage different hosts and services, making it easy to maintain and update the network infrastructure.

## Requirements

- Ansible 2.9 or higher
- LastPass CLI (`lpass`) for secret management (optional)

## Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pumbaasdad/system-restore.git
    ```

2.  **Install dependencies:**
    This project uses `uv` for python dependency management.
    ```bash
    pip install uv
    uv sync
    ```

3.  **Configure Inventory:**
    Update the `inventory.yml` file with your hosts and groups.

4.  **Configure Variables:**
    Set the variables in `group_vars/` and `host_vars/` to match your environment.

5.  **Run the playbook:**
    ```bash
    ansible-playbook playbook.yml
    ```

## Roles

This playbook includes the following roles:

-   `bind9`: Configures BIND9 for DNS services.
-   `certbot`: Manages SSL certificates using Certbot.
-   `cloudflared`: Sets up Cloudflare Tunnel.
-   `container`: Manages LXC containers.
-   `core`: Core system configuration.
-   `docker_host`: Configures a host for running Docker containers.
-   `handbrake`: Sets up HandBrake for video transcoding.
-   `java`: Installs Java.
-   `kea`: Configures Kea for DHCP services.
-   `mongo`: Installs and configures MongoDB.
-   `nginx`: Configures NGINX as a web server or reverse proxy.
-   `package`: Manages system packages.
-   `plex`: Sets up a Plex media server.
-   `proxmox`: Configures Proxmox VE.
-   `proxmox_firewall`: Configures the Proxmox firewall.
-   `ssh_server`: Configures an SSH server.
-   `unifi`: Manages UniFi network devices.
-   `virtual_machine`: Manages virtual machines.
-   `yubikey`: Configures YubiKey for authentication.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

