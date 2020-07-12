This project uses `ansible` to provision a machine running ubuntu to run several useful services, and to keep that
machine up to date with the latest version of those services.

# Prerequisites

## Ansible

`Ansible` must be on the PC that you wish to use to provision the server.  The included playbook runs and produces no
warnings with `ansible` version 2.9.10.  Any local dependencies that are required to provision the server will be
bootstrapped onto the system where the playbook is run.

Instructions for installing `ansible` can be found [here](https://tinyurl.com/yyt73e8b).

The playbook will also install the latest version of `ansible` on the provisioned server.

## AWS

An AWS account will be required to store any server configuration that is not checked in with this repository.  Although
another repository could theoretically be created to safely store this information, using a cloud solution means that
separate copies of the configuration are not required on every machine that you wish to use to provision a machine.
Some of these configuration values are also secrets that should never be checked into source control anyway.

AWS was chosen because it provides secure and durable storage and will cost less than $1.00/month.

Despite the fact that all attempts have been made to limit the costs incurred in your account, you are responsible for
all costs incurred by running this terraform.  Make sure you understand what costs may be incurred prior to deploying
any resources. 

## Terraform Cloud

Terraform cloud is used as an easy way to setup an AWS account, and keep it up to date with this repository.  If you
wish to use the provided terraform directly, that will work, but instructions for this are not provided. 

## Initial Setup

This project is intended to be used in conjuction with [aws-account](https://github.com/pumbaasdad/aws-account).
Before setting up this project, you must set up that project.  When you fork this repository, your `system-restore`
Terraform Cloud workspace should be triggered and the following resources will be configured in your `system-restore`
sub-account.

 * The account alias.
 * IAM Policies
    * `read-parameters` - Allows SSM parameters to be read.
    * `write-parameters` - Allows SSM parameters to be written.
 * IAM Groups
    * `ParameterReaders` - A group providing the `read-parameters` policy.
    * `ParameterWriters` - A group providing the `write-parameters` policy.
 * IAM Users
    * `ansible` - The IAM user that will be used by ansible to read values from the SSM Parameter store.  It is in the
                  `ParameterReaders` group.
    * `secret-manager` - The IAM user that you can use to manage secrets in the SSM Parameter store.  It is in the
                         `ParameterReaders` and `ParameterWriters` groups.

After the account has been deployed, you will need to do the following:

 1. Create credentials for your IAM users.
    1. Log into your root AWS account using the `admin` IAM user [here](https://console.aws.amazon.com/console/home?nc2=h_ct&src=header-signin).
    1. Click on `admin @ <account name>` and choose `Switch Role`.
    1. Click `Switch Role`.
    1. Fill in the fields for your account.
        1. Account will be `<root-account-alias>-system-restore`.
        1. Role is `OrganizationAccountAccessRole`.
    1. Click `Switch Role`.
    1. Create credentials for the `ansible` IAM user.
        1. Navigate to [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/ansible?section=security_credentials).
        1. Click `Security credentials`.
        1. Click `Create access key`.
        1. Add the following content to ~/.aws/credentials on the machine where you will run ansible.
           ```
           [system-restore-ansible]
           aws_access_key_id = AKIAXXXXXXXXXXXXXXXX
           aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
           ```
        1. Add the following to ~/.aws/config on the same machine
           ```
           [profile system-restore-ansible]
           region = us-east-1
           output = json
           ```
        1. Click `Close`.
    1. Create credentials for the `secret-manager` IAM user.
        1. Navigate to [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/secret-manager?section=security_credentials).
        1. Click `Create access key`.
        1. Add the following content to ~/.aws/credentials on the machine where you will manage secrets.
           ```
           [system-restore-admin]
           aws_access_key_id = AKIAXXXXXXXXXXXXXXXX
           aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
           ```
        1. Add the following to ~/.aws/config on the same machine
           ```
           [profile system-restore-admin]
           region = us-east-1
           output = json
           ```
       1. Click `Close`.
       1. Optionally create credentials for the AWS console in the `Sign-in credentials` section by clicking `Manage`
          next to `Console password` and following the instructions.
           
# Running

In it's current state, this project will only run on the server being provision.  This will be addressed by issue #12.

To run the playbook, execute the following command:

```shell script
sudo ansible-playbook /path/to/playbook.yml -i localhost, -c local
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