variable role {
  type        = string
  description = "The ARN of the role that will be assumed to deploy terraform permissions to the system-restore account."
}

provider aws {
  region = "us-east-1"
  assume_role {
    role_arn = var.role
  }
}

data aws_caller_identity current {}

data aws_organizations_organization current {}

resource aws_iam_role terraform {
  name               = "terraform"
  description        = "Role that will allow resources to be deployed to this account."
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "AWS": "${data.aws_organizations_organization.current.master_account_id}"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource aws_iam_policy terraform_manage_users {
  name        = "terraform-manage-users"
  description = "Permissions required for the terraform IAM role to manage IAM users."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManageUsers",
            "Effect": "Allow",
            "Action": [
                "iam:ListAccessKeys",
                "iam:ListAttachedUserPolicies",
                "iam:ListGroupsForUser",
                "iam:ListMFADevices",
                "iam:ListSigningCertificates",
                "iam:ListSSHPublicKeys",
                "iam:ListUserPolicies",
                "iam:ListVirtualMFADevices",
                "iam:GetUser",
                "iam:CreateUser",
                "iam:DeleteAccessKey",
                "iam:DeleteLoginProfile",
                "iam:DeleteUser"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_manage_groups {
  name        = "terraform-manage-groups"
  description = "Permissions required for the terraform IAM role to manage IAM groups."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManageGroups",
            "Effect": "Allow",
            "Action": [
                "iam:ListAttachedGroupPolicies",
                "iam:ListGroupPolicies",
                "iam:ListGroups",
                "iam:GetGroup",
                "iam:AddUserToGroup",
                "iam:AttachGroupPolicy",
                "iam:CreateGroup",
                "iam:DeleteGroup",
                "iam:DetachGroupPolicy",
                "iam:RemoveUserFromGroup",
                "iam:UpdateGroup"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

locals {
  terraform_manage_policies_name = "terraform-manage-policies"
}

resource aws_iam_policy terraform_manage_policies {
  name        = local.terraform_manage_policies_name
  description = "Permissions required for the terraform IAM role to manage IAM policies."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManagePolicies",
            "Effect": "Allow",
            "Action": [
                "iam:ListPolicyVersions",
                "iam:ListAttachedGroupPolicies",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "iam:CreatePolicy",
                "iam:CreatePolicyVersion",
                "iam:DeletePolicy",
                "iam:DeletePolicyVersion"
            ],
            "NotResource": ${jsonencode(local.terraform_policy_arns)}
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_manage_roles {
  name        = "terraform-manage-roles"
  description = "Permissions required for the terraform IAM role to manage IAM roles."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManageRoles",
            "Effect": "Allow",
            "Action": [
                "iam:ListAttachedRolePolicies",
                "iam:ListInstanceProfilesForRole",
                "iam:AttachRolePolicy",
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:DetachRolePolicy",
                "iam:UpdateAssumeRolePolicy",
                "iam:UpdateRole",
                "iam:UpdateRoleDescription"
            ],
            "NotResource": [
              "${aws_iam_role.terraform.arn}"
            ]
        },
        {
            "Sid": "GetRole",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_manage_account {
  name        = "terraform-manage-account"
  description = "Permissions required for the terraform IAM role to manage the AWS account."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManageAccount",
            "Effect": "Allow",
            "Action": [
                "iam:ListAccountAliases",
                "iam:CreateAccountAlias",
                "iam:DeleteAccountAlias",
                "organizations:DescribeOrganization"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_read_parameters {
  name        = "terraform-read-parameters"
  description = "Permissions required for the terraform IAM role to read SSM parameters."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadParameters",
            "Effect": "Allow",
            "Action": [
                "ssm:DescribeParameters",
                "ssm:GetParameterHistory",
                "ssm:GetParametersByPath",
                "ssm:GetParameters",
                "ssm:GetParameter",
                "kms:Decrypt"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_write_parameters {
  name        = "terraform-write-parameters"
  description = "Permissions required for the terraform IAM role to write SSM parameters."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "WriteParameters",
            "Effect": "Allow",
            "Action": [
                "ssm:PutParameter",
                "ssm:LabelParameterVersion",
                "ssm:DeleteParameter",
                "ssm:RemoveTagsFromResource",
                "ssm:AddTagsToResource",
                "ssm:DeleteParameters",
                "kms:Encrypt"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

locals {
  terraform_policy_arns = [
    aws_iam_policy.terraform_manage_account.arn,
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${local.terraform_manage_policies_name}",
    aws_iam_policy.terraform_manage_roles.arn,
    aws_iam_policy.terraform_manage_users.arn,
    aws_iam_policy.terraform_manage_groups.arn,
    aws_iam_policy.terraform_read_parameters.arn,
    aws_iam_policy.terraform_write_parameters.arn
  ]
}

resource aws_iam_role_policy_attachment terraform {
  count      = length(local.terraform_policy_arns)
  policy_arn = element(local.terraform_policy_arns, count.index)
  role       = aws_iam_role.terraform.name
}