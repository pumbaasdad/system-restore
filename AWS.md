# AWS

An AWS account will be required to store any server configuration that is not checked in with this repository.  Although
another repository could theoretically be created to safely store this information, using a cloud solution means that
separate copies of the configuration are not required on every machine that you wish to use to provision a machine.
Some of these configuration values are also secrets that should never be checked into source control anyway.

AWS was chosen because it provides secure and durable storage and will cost less than $1.00/month.

Despite the fact that all attempts have been made to limit the costs incurred in your account, you are responsible for
all costs incurred by running this terraform.  Make sure you understand what costs may be incurred prior to deploying
any resources. 

# Terraform Cloud

Terraform cloud is used as an easy way to setup an AWS account, and keep it up to date with this repository.  If you
wish to use the provided terraform directly, that will work, but instructions for this are not provided. 

# Resources

## terraform-permissions

The terraform in the `terraform/terraform-permissions` directory will manage the following resources related to the
`terraform` IAM role:

 * IAM Roles
    * `terraform` - A role that can be assumed to deploy resources to the `system-restore` sub-account.
 * IAM Policies
    * `terraform-manage-users` - Allow management of all IAM users.
    * `terraform-manage-groups` - Allow management of all IAM groups.
    * `terraform-manage-policies` - Allow management of all IAM policies except those managed by the terraform in this
                                    directory.
    * `terraform-manage-roles` - Allow the management of all IAM roles except the `terraform` role.
    * `terraform-manage-account` - Allow management of the account alias plus reading the organization.
    * `terraform-read-parameters` - Allow all SSM parameters to be read.
    * `terraform-write-parameters` - Allow all SSM parameters to be written.
 * IAM Role policy attachments
    * All IAM policies defined by the terraform in this directory are attached to the `terraform` IAM role.
    
## account

The terraform in the `terraform/account` directory will manage the following resources:

 * The account alias.
 * IAM Policies
    * `read-parameters` - Allows SSM parameters to be read.
    * `write-parameters` - Allows SSM parameters to be written.
    * `terraform-permissions-manage-policies` - Allow the management of all policies except those attached to the
                                                `terraform-permissions` IAM role.
    * `terraform-permissions-manage-roles` - Allow management of the `terraform` IAM role.
    * `terraform-permissions-interrogate-organization` - Allow any AWS organization to be described.
 * IAM Groups
    * `ParameterReaders` - A group providing the `read-parameters` policy.
    * `ParameterWriters` - A group providing the `write-parameters` policy.
 * IAM Users
    * `ansible` - The IAM user that will be used by ansible to read values from the SSM Parameter store.  It is in the
                  `ParameterReaders` group.
    * `secret-manager` - The IAM user that you can use to manage secrets in the SSM Parameter store.  It is in the
                         `ParameterReaders` and `ParameterWriters` groups.
 * IAM Roles
    * `terraform-permissions` - A role that can be assumed to manage permissions related to the `terraform` IAM role.
 * IAM Role Policy Attachments
    * The following IAM policies are attached to the `terraform-permissions` IAM role:
        * `terraform-permissions-manage-policies`
        * `terraform-permissions-manage-roles`
        * `terraform-permissions-interogate-organization` 

# Initial Setup

This project is intended to be used in conjunction with [aws-account](https://github.com/pumbaasdad/aws-account).
Before setting up this project, you must set up that project.

When you fork this repository, your `system-restore` Terraform Cloud workspace should be triggered and the following
resources will be configured in your `system-restore` sub-account.

After the account has been deployed, you will need to do the following:

 1. Setup `system-restore` in Terraform Cloud
    1. In Terraform Cloud, select your `terraform-cloud` workspace.
    1. Click `Variables`.
    1. Add a new terraform variable named `use_system_restore`, set it to `true`.
    1. Click the `Queue plan button`.
    1. When the plan completes, click the `Confirm & Apply` button.
 1. Deploy `system-restore` resources to your root AWS account.
    1. In Terraform Cloud, select your `root` workspace.
    1. Click `Variables`.
    1. Set `system_restore_email` to the e-mail address of the owner of the `system-restore` sub-account.  This must be
       different from the e-mail address associated with your AWS root credentials.
    1. Click the `Queue plan button`.
    1. When the plan completes, click the `Confirm & Apply` button.
 1. Disable the default Service Control Policy on the `system-restore-account`.
    1. Login the your AWS root account as the `admin` IAM user.
    1. Navigate to [here](https://console.aws.amazon.com/organizations/home?region=us-east-1#/accounts)
    1. Click `system-restore`.
    1. On the right, expand `Service control policies`.
    1. Click `Detach` beside `FullAWSAccess`.
 1. Create access keys for the `admin` IAM user.
    1. Login the your AWS root account as the `admin` IAM user.
    1. Navigate to
       [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/admin?section=security_credentials)
    1. Click `Create New Access Key`.
    1. Click `Show Access Key` and take note of the new access key ID and secret access key.
1. Create access keys for the `system-restore-terraform-permissions` IAM user.
    1. Login the your AWS root account as the `admin` IAM user.
    1. Navigate to
       [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/system-restore-terraform-permissions?section=security_credentials)
    1. Click `Create New Access Key`.
    1. Click `Show Access Key` and take note of the new access key ID and secret access key.
1. Create access keys for the `system-restore-terraform` IAM user.
    1. Login the your AWS root account as the `admin` IAM user.
    1. Navigate to
       [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/system-restore-terraform?section=security_credentials)
    1. Click `Create New Access Key`.
    1. Click `Show Access Key` and take note of the new access key ID and secret access key. 
 1. Deploy permissions for the `terraform` role to the `system-restore` sub-account.
    1. In terraform cloud, click on your `system-restore-permissions` workspace.
    1. Click on `Variables`.
    1. Configure variables
        1. Terraform Variables
            1. `role` = `arn:aws:iam::<account-id>:role/OrganizationAccountAccessRole`.  `account-id` can be found by
               navigating [here](https://console.aws.amazon.com/organizations/home?region=us-east-1#/accounts) and
               clicking on `system-restore`.
        1. Environment Variables 
            1. `AWS_ACCESS_KEY_ID` - The ID of the `admin` user's AWS access key created earlier.
            1. `AWS_SECRET_ACCESS_KEY` - The AWS secret access key of the `admin` user.
    1. Click the `Queue plan button`.
    1. When the plan completes, click the `Confirm & Apply` button.
 1. Deploy resources to the `system-restore` sub-account.
    1. In terraform cloud, click on your `system-restore` workspace.
    1. Click on `Variables`.
    1. Configure variables
        1. Terraform Variables
            1. `role` = `arn:aws:iam::<account-id>:role/terraform`.  `account-id` can be found by navigating
               [here](https://console.aws.amazon.com/organizations/home?region=us-east-1#/accounts) and
               clicking on `system-restore`.
        1. Environment Variables 
            1. `AWS_ACCESS_KEY_ID` - The ID of the `system-restore-terraform` user's AWS access key created earlier.
            1. `AWS_SECRET_ACCESS_KEY` - The AWS secret access key of the `system-restore-terraform` user.
    1. Click the `Queue plan button`.
    1. When the plan completes, click the `Confirm & Apply` button.    
 1. Update the `system-restore-terraform-permissions` workspace.
    1. In terraform cloud, click on your `system-restore-terraform-permissions` workspace.
    1. Click on `Variables`.
    1. Configure variables
        1. Terraform Variables
            1. `role` = `arn:aws:iam:<account-id>:role/terraform-permissions`.  `account-id` can be found by navigating
               [here](https://console.aws.amazon.com/organizations/home?region=us-east-1#/accounts) and
               clicking on `system-restore`.
        1. Environment Variables 
            1. `AWS_ACCESS_KEY_ID` - The ID of the `system-restore-terraform-permissions` user's AWS access key created
               earlier.
            1. `AWS_SECRET_ACCESS_KEY` - The AWS secret access key of the `system-restore-terraform-permissions` user.
 1. Delete access keys for your `admin` IAM user.
    1. Login the your AWS root account as the `admin` IAM user.
    1. Navigate to
       [here](https://console.aws.amazon.com/iam/home?region=us-east-1#/users/admin?section=security_credentials)
    1. Click `Delete` next to your access key.
    1. Confirm by clicking `Yes`.
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