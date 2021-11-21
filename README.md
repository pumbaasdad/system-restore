This project uses `ansible` to provision a machine running ubuntu to run several useful services, and to keep that
machine up to date with the latest version of those services.

# Prerequisites

## Target System

The system being configured must have two network interfaces, one of which may be virtual.

## Ansible

`Ansible` must be on the PC that you wish to use to provision the server.  The included playbook runs and produces no
warnings with `ansible core` version 2.11.16.  Any local dependencies that are required to provision the server will be
bootstrapped onto the system where the playbook is run.

Instructions for installing `ansible` can be found [here](https://tinyurl.com/yyt73e8b).

The playbook will also install the latest version of `ansible` on the provisioned server.

Information about variables that must be available to ansible, as well as any manual intial setup steps can be found in
the README files under the `roles` directory.
 
# Running

In its current state, this project will only run on the server being provision.  This will be addressed by issue #12.

To run the playbook, execute the following command:

```shell script
sudo ansible-playbook /path/to/playbook.yml -i localhost, -c local -e 'ansible_python_interpreter=/usr/bin/python3'
```

# Ansible

## Oddities

In order to prevent running `apt` multiple times to install/run packages needed by different modules, this playbook
will look for certain variables defined by each role and use those variables to prevent commands from being run more
than once.

If a role needs to specify values, it should define a variable named `<role name>_role`.  This variable can include any
of the following keys:

 * `apt_ppa`
   * `ppa` - A PPA which is needed for `apt` to install packages required by the role.
   * `codename` - The Ubuntu codename that should be used when accessing the PPA.  If this is not specified, the
                  codename of the Ubuntu distribution running on the machine being provisioned will be used.  This value
                  is only helpful when the PPA is not yet available for the distribution being used.
 * `deb_repos`
   * `url` - The URL of a debian repository that `apt` must use to install packages required by the role.
 * `apt_key`
   * `url` - The URL at which the key required to access a debian repository can be found.
 * `packages` - A list of packages required by the role that `apt` will install.
 * `services` - A list of services that the role will enable on the machine being provisioned.

## Defaults vs Variables

The roles defined in this project define both defaults and variables.  The intention is that anything defined as a
default can be overwritten, and the playbook will still execute as expected.  Anything defined as a variable is meant
to represent constants so magic numbers do not appear through the project.  Overwriting these values will result in
undefined behaviour.  
