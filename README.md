This project uses `ansible` to provision a machine running ubuntu to run several useful services, and to keep that
machine up to date with the latest version of those services.

# Prerequisites

## Target System

The system being configured must have two network interfaces, one of which may be virtual.

## Ansible

The included playbook runs and produces no warnings with `python` 3.10.4 and the packages in `poetry.toml`.

`poetry` can be installed by running `pip install poetry`.  After that, dependencies can be installed and updated by
running `poetry install`.

Information about variables that must be available to ansible, as well as any manual setup steps can be found in the
README files under the `roles` directory.

## Required Variables

The following variables must be defined for the playbook to run:

| Variable           | Description                                                                                                 |
|:-------------------|:------------------------------------------------------------------------------------------------------------|
| docker_compose_dir | The root directory that will contain configuration for all services running on the server being configured. |

A `<ansible_username>_password` must also be defined in your secrets that specifies the password the ansible user should
use when using `sudo`.
 
# Running

The host you wish to configure should be setup in `/etc/ansible/hosts`.  The name of the host should be the hostname and
zone as defined in your network configuration.  You should set the `ansible_ssh_host` to the IP address of that host.

To run the playbook, execute the following command:

```shell script
ansible-playbook /path/to/playbook.yml
```

# Ansible

## Oddities

Instead of having tasks spilt between multiple roles, this playbook uses variables defined in different roles to define
the inputs for certain common tasks.

If a role needs to specify values, it should define a variable named `<role name>_role`.  This variable can include any
of the following keys:

 * `apt_ppa`
   * `ppa` - A PPA which is needed for `apt` to install packages required by the role.
   * `codename` - The Ubuntu codename that should be used when accessing the PPA.  If this is not specified, the
                  codename of the Ubuntu distribution running on the machine being provisioned will be used.  This value
                  is only helpful when the PPA is not yet available for the distribution being used.
 * `deb_repos`
   * `url` - The URL of a debian repository that `apt` must use to install packages required by the role.
   * `codename` - The Ubuntu codename that should be used when accessing the repository.  If this is not specified, the
                  codename of the Ubuntu distribution running on the machine being provisioned will be used.  This value
                  is only helpful when the repository is not yet available for the distribution being used.
   * `channel` - The channel within the repository that will be used.  Defaults to `stable`.
 * `apt_key`
   * `url` - The URL at which the key required to access a debian repository can be found.
 * `packages` - A list of packages required by the role that `apt` will install.
 * `services` - A list of services that the role will enable on the machine being provisioned.
 * `disabled_services` - A list of services that will be disabled on the machine being provisioned.
 * `pip_modules`
   * `modules` - A list of python modules to be installed on the machine being provisioned.
   * `environment` - The virtual environment into which the modules will be installed.
 * `groups`
   * `name` - The name of a group to create on the machine being provisioned.
   * `users` - A list of users to be added to the group.
 * `directories`
   * `path` - The path of a directory that will be created.
   * `owner` - The owner of the directory.  Defaults to the root user.
   * `group` - The group that owns the directory.  Defaults to the root user group.
   * `mode` - The permissions that the directory will have.  For directories in `docker_compose_dir` defaults to 0755.
              For other directories defaults to the default `umask` on the machine being configured.
   * `volume` - Optional.  Describes how the directory will be mounted to containers.  If no
     * `name` - Required.  The name that should be assigned to this directory if it is to be used as a docker volume.
     * `backup` - Optional.  If this directory needs to be backed up.
 * `files`
   * `dest` - A file that will be created.
   * `src` - The source template to use to create the file.
   * `force` - If the file should be replaced if it already exists.  Defaults to `true`.
   * `owner` - The owner of the file.  For files in `docker_compose_dir` defaults to `docker_user`.  For other files,
               defaults to the root user.
   * `group` - The group that owns the file.  For directories in `docker_compose_dir` defaults to `docker_group`.  For
               other directories, defaults to the root user group.
   * `mode` - The permissions that the file will have.  For files in `docker_compose_dir` defaults to 644.  For other
              files defaults to the default `umask` on the machine being configured.
   * `backup` - Optional.  If this file should be backed up before it is changed.  Defaults to `false`.
   * `notify` - Optional.  The name of an ansible handler to be run when this file is modified.
   * `vars` - Optional.  A dictionary of variables that should be passed to the template task used to create the file.
              If provided, the variables wile be available in a variable named `file_vars`
 * `nas_directories`
   * `path` - The path to the directory on the NAS.
   * `volume` - Optional.  The name that should be assigned to this directory when being used as a docker volume.
 * `udev_devices`
   * `subsystem` - The subsystem to which an udev device belongs.
   * `attrs` - A dictionary of key value pairs that can be used to uniquely identify an udev device. 
   * `symlink` - A symlink that will be created to provide access to the udev device.
 * `iptable_rules`
   * `chain` - The chain to which the rule will be added.
   * `in_interface` - The input interface to which the rule will apply.
   * `jump` - What to do if the rule matches.
   * `cstate` - Optional.  A list of connection states to which the rule will apply.  Defaults to all states.
   * `protocl` - Optional.  The protocol to which the rule will apply.  Defaults to all states.
   * `destination_port` - Optional.  The destination port to which the rule will apply.  Defaults to all states.
 * `intrusion_detection`
   * `jails`
     * `jail_name`: The name of an intrusion detection jail to create.
     * `file`: The template that will be used to create the jail.
   * `filters`
     * `dest`: The name of an intrusion detection filter file to create. 
     * `src`: The template that will be used to create the filter.
 * `reverse_proxy`
 * `docker`
   * `services`
     * `name` - The name of the docker service to create.  The role must create a dockerfile located in
                `<dockerfile_dir>` named `<name>.Dockerfile`.  This file will be built to run the
                service
     * `container_name` - Optional.  The name of the container used to run the service.  Defaults to the value of
                          `name`.
     * `config_dir` - The directory where configuration for the service will be created.
     * `volumes` - A list of mappings of volume names to container paths
     * `environment` - A list of environment variables that will be set in the container.
     * `ports` - A mapping of host ports to container ports.
     * `networks`
       * `host` - Optional.  If the network runs in host mode.  If this value is true, all other options in the
                  `networks` object are ignored.  Defaults to `false`.
       * `default` - Optional.  If this service runs on the default docker network.  Defaults to true.
       * `default_ipv4_address` - Optional.  The IPv4 address that will be assigned to the service on the default docker
                                  network.  Will be assigned randomly if not specified.
       * `internal` - Optional.  If this service runs on the internal docker network.  Defaults to false.
       * `extra` - Optional.  A list of non-standard docker networks that the service will run on.  Defaults to an empty
                   list.
         * `ipv4_address` - Optional.  The IPv4 address that will be assigned to the service.  Will be assigned randomly
                            if not specified.
     * `capabilities` - Optional.  A list of capabilities that will be given to the container.
     * `command` - Optional.  The command that will be executed to start the container.  The command specified in the
                   container's dockerfile.
     * `devices` - Optional.  A list of mappings of host device paths to the container path where the device will be
                   made available.  Defaults to an empty list.
     * `tty` - Optional.  Whether a pseudo-tty will be allocated for this service.  Defaults to false.
     * `stop_signal` - Optional.  A signal that will be used to stop the container.  Defaults to `SIGTERM`.
     * `backup` - Optional.  Whether this service needs to be stopped to perform a backup.  Defaults to `false`.
   * `networks`
     * `name` - The name of the docker network to create.
     * `subnet` - Optional.  The subnet that should be used by the network.
 * `provides` - Optional.  A dictionary of custom values owned by the role that should be available to other roles.

## Defaults vs Variables

The roles defined in this project define both defaults and variables.  The intention is that anything defined as a
default can be overwritten, and the playbook will still execute as expected.  Anything defined as a variable is meant
to represent constants so magic numbers do not appear through the project.  Overwriting these values will result in
undefined behaviour.  

# Secrets

Secrets are stored in the cloud.  These are loaded in files stored in the `secrets` directory at the root of this
repository.  One file from this directory will be loaded based upon where the secrets are stored.  Currently, the only
supported storage location is [LastPass](http://www.lastpass.com).

Secrets defined in these files can be overridden by extra vars provided on the command line (i.e. `-e var=value`).


## LastPass

Before running the playbook, you must have the LastPass CLI installed on the ansible controller.  It can be installed by
running: `apt install lastpass-cli`.  To log into LastPass, run the command `lpass login <your email address>`.  When
the playbook completes, you should lo gout with the command `lpass logout`.

Entries in LastPass should have the same name as the variable that they are being loaded into.  Entries must also be
prefixed with a path to maintain LastPass hygiene.  The path is specified by the variable `lastpass_secrets_path` which
defaults to `Infrastructure/Secrets`.

Note that the playbook uses the `pipe` lookup instead of the official `lastpass` lookup.  This is done because the
official lookup doesn't support bulk loading of variables.

## Network Configuration

Your network configuration is stored as yaml with your secrets.  If your secrets are stored in LastPass, the yaml must
be attached as a file to the `network.yml` secure note (the name of the attachment is not important), and it must be the
only file attached to that note.  The file must have the following format:

```yaml
network:
  domain: The name of the domain that will be used to access hosts on your network with the TLD
  suffix: The TLD that will be used to access hosts on your network
  nameservers: A list of hostnames and IP addresses that will be used as nameservers in your network
  routers: A list of routers in your network.  Typically there will only be a single entry, byt DHCP allows multiple
  ipv4_subnet: The IPv4 subnet of your network in CIDR notation.
  ipv6_subnet: The IPv6 subnet of your network in CIDR notation.
  dhcpv4_subnet: The IPv4 subnet in which DHCP addresses will be allocated.  Must be a subset of ipv4_subnet.
  zones: A list of zones in your network.
```

Zones are defined as follows:

```yaml
name: The name of the zone.  This will be prepended to your domain name for all hosts in this zone.
ipv4_subnet: The IPv4 subnet to which hosts in this zone will belong, in CIDR notation.
ipv6_prefix: The IPv6 prefix that will be used by hosts in this zone, in CIDR notation.
hosts: A list of hosts in this zone.
```

Hosts are defined as follows:

```yaml
name: The name of the host.  The zone name and network domain and suffix will be added to create a FQDN.
ipv4_offset: The offset of this host's wired IP address from the start of the zone's IPv4 subnet.  256 will be added to
             this value for the host's wireless IP address.
ethernet: Optional details about this hosts wired connection to the network.  Must be specified if wifi is not.
wifi: Optional details about this hosts wifi connection to the network.  Must be specified if ethernet is not.
alias: A list of strings that will be used to create aliases for this host.  Aliases will not have the zone name in
       their FQDN.
connected: An optional boolean that specifies if the host is currently connected to the internet.  If not present, it is
           assumed that the host is connected.  At present, this value is not used, but it may be in the future.
internal: An optional boolean that should only be set to true on the host being configured by ansible.  It indicates
          that this is the interface of the host that is not exposed to the public internet.  If unspecified, false is
          assumed (i.e. this is not the internal interface of the host being configured).
nas: Optional details about a NAS host.  Only one device may have this configuration.
```

If both `ethernet` and `wifi` are specified, two FQDNs will be generated one prefixed with `ethernet` and the other with
`wifi`.

`ethernet` and `wifi` details are defined as follows:

```yaml
mac: The MAC address of the interface used to connect to the network.
static: Optional boolean that indicates if this interface's IP address is configured statically.  If not specified, it
        is assumed that this device uses DHCP to obtain it's address.  Currently this value is not used by may be in the
        future.
ipv6_interface: Optional value that can be used to specify the interface portion of this devices IPv6 address.  The
                special value `none` can be used to indicate that the interface does not support IPv6.  The special
                value `unknown` can be used to indicate that the interface supports IPv6, but it's unknown how the
                interface portion is assigned.  If this value is not specified, the it's assumed that the interface
                uses a link local IPv6 address.
```

`nas` details are defined as follows:

```yaml
mountpoints: A dictionary of mountpoints provided by this NAS device.  The key is the name of the mountpoint and the
             value is the path that can be mounted.  Currently the only supported key is `media`, which is the mount
             point used to store media files.
```

## Users

Users that are not defined by roles are stored as yaml with your secrets.  If your secrets are stored in LastPass, the
yaml must be attached as a file to the `users.yml` secure note (the name of the attachment is not important), and it
must be the only file attached to that note.  Lastpass requires attachments to be at least 1Kb, so you may need to add
additional content to the file.  Any valid yaml may be used for this purpose and if it is not expected, will be ignored.
The file must have the following format:

```yaml
users:
  - name: The name of the user.
    uses_docker: A boolean indicating whether the user can run docker without sudo.
    salt: Salt to be used when hashing the users password.
```

For each user defined in `users.yml`, the following secrets must also be defined:

 * `<username>_password` - The password for username.
 * `<username>_ssh_authorized_key` - The SSH key that the user can use to connect to the system being provisioned.