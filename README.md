This project uses `ansible` to provision a machine running ubuntu to run several useful services, and to keep that
machine up to date with the latest version of those services.

# Prerequisites

## Target System

The system being configured must have two network interfaces, one of which may be virtual.

## Ansible

`Ansible` must be on the PC that you wish to use to provision the server.  The included playbook runs and produces no
warnings with `ansible core` version 2.12.5 and `python` 3.10.4.  Any local dependencies that are required to provision
the server will be bootstrapped onto the system where the playbook is run.  If ansible is installed in a virtual
environment, the prerequisites will be installed in that environment.

Instructions for installing `ansible` can be found [here](https://tinyurl.com/yyt73e8b).

Information about variables that must be available to ansible, as well as any manual setup steps can be found in the
README files under the `roles` directory.

## Required Variables

The following variables must be defined for the playbook to run:

| Variable           | Description                                                                                                 |
|:-------------------|:------------------------------------------------------------------------------------------------------------|
| docker_compose_dir | The root directory that will contain configuration for all services running on the server being configured. |

A `become_password` must also be defined in your network configuration for the host being configured.
 
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
 * `root_directories`
   * `path` - The path of a directory that will be created by `ansible_become_user`.
   * `owner` - The owner of the directory.  Defaults to `ansible_become_user`.
   * `group` - The group that owns the directory.  Defaults to the group of `ansible_become_user`.
 * `root_files`
   * `dest` - A file that will be created by `ansible_become_user`.
   * `src` - The source template to use to create the file.
   * `force` - If the file should be replaced if it already exists.  Defaults to `true`.
   * `owner` - The owner of the file.  Defaults to `ansible_become_user`.
   * `group` - The group that owns the file.  Defaults to the group of `ansible_become_user`.
   * `mode` - The permissions that the file will have.  Defaults to the default `umask` on the machine being
              provisioned.
   * `notify` - Optional.  The name of an ansible handler to be run when this file is modified.
 * `directories`
   * `path` - The path of a directory that will be created by the user that ansible uses to connect to the machine being
              provisioned.
   * `owner` - The owner of the directory.  Defaults to the user that ansible uses to connect to the machine being
               provisioned.
   * `group` - The group that owns the directory.  Defaults to the group of the user that ansible uses to connect to the
               machine being provisioned.
 * `files`
   * `dest` - A file that will be created by the user that ansible uses to connect to the machine being provisioned.
   * `src` - The source template to use to create the file.
   * `force` - If the file should be replaced if it already exists.  Defaults to `true`.
   * `owner` - The owner of the file.  Defaults to the user that ansible uses to connect to the machine being
               provisioned.
   * `group` - The group that owns the file.  Defaults to the group of the user that ansible uses to connect to the
               machine being provisioned.
   * `mode` - The permissions that the file will have.  Defaults to the default `umask` on the machine being configured.
   * `notify` - Optional.  The name of an ansible handler to be run when this file is modified.
 * `udev_devices`
   * `subsystem` - The subsystem to which an udev device belongs.
   * `attrs` - A dictionary of key value pairs that can be used to uniquely identify an udev device. 
   * `symlink` - A symlink that will be created to provide access to the udev device.
 * `iptable_rules`
   * `chain` - The chain to which the rule will be added.
   * `in_interface` - The input interface to which the rule will apply.
   * `cstate` - A list of connection states to which the rule will apply.
   * `jump` - What to do if the rule matches.
 * `intrusion_detection`
   * `jails`
     * `jail_name`: The name of an intrusion detection jail to create.
     * `file`: The template that will be used to create the jail.
   * `filters`
     * `dest`: The name of an intrusion detection filter file to create. 
     * `src`: The template that will be used to create the filter.
 * `reverse_proxy`
   * `public_site_configs`
     * `name` - The name of an external reverse proxy configuration to create.
     * `src` - The template that will be used to create the configuration.
   * `private_site_configs`
     * `name` - The name of an internal reverse proxy configuration to create.
     * `src` - The template that will be used to create the configuration.
   * `trusted_ips` - A list of reverse proxy IP addresses that should be trusted by internal services.
 * `docker`
   * `service`
     * `name` - The name of the docker service to create.
     * `config_dir` - The directory where configuration for the service will be created.
 * `files_changed_by_tasks` - A list of files that have been updated by tasks associated with the role.  This should
                              default to an empty list and use lazy evaluation to return a value if files are modified.

Roles can also define a variable named `local_<role name>_role` to configure the bootstrap of the machine on which
ansible is being run.  This variable can include any of the following keys:

 * `pip_modules` - A list of python modules to be installed in the environment being used to run ansible.

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

You network configuration is stored as yaml with your secrets.  If your secrets are stored in LastPass, the yaml must
be attached as a file to the `network.yml` secret (the name of the attachment is not important), and it must be the only
file attached to that secret.  The file must have the following format:

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
external: An optional boolean that should only be set to true on the host being configured by ansible.  It indicates
          that this is the interface of the host that is exposed to the public internet.  If unspecified, false is
          assumed.
internal: An optional boolean that should only be set to true on the host being configured by ansible.  It indicates
          that this is the interface of the host that is not exposed to the public internet.  If unspecified, false is
          assumed (i.e. this is not the internal interface of the host being configured).
become_password: The password used by ansible to elevate privileges while provisioning this host.
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
