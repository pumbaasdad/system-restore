resource aws_iam_role terraform_permissions {
  name               = "terraform-permissions"
  description        = "Role that will allow the terraform-permissions IAM role to be managed."
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

locals {
  terraform_permissions_manage_policies_name = "terraform-permissions-manage-policies"
}

resource aws_iam_policy terraform_permissions_manage_policies {
  name        = local.terraform_permissions_manage_policies_name
  description = "Permissions required for the terraform-permissions IAM role to manage IAM policies."
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
            "NotResource": ${jsonencode(local.terraform_permissions_policy_arns)}
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_permissions_manage_roles {
  name        = "terraform-permissions-manage-roles"
  description = "Permissions required for the terraform-permissions IAM role to manage IAM roles."
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
                "iam:GetRole",
                "iam:AttachRolePolicy",
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:DetachRolePolicy",
                "iam:UpdateAssumeRolePolicy",
                "iam:UpdateRole",
                "iam:UpdateRoleDescription"
            ],
            "Resource": [
              "${data.aws_iam_role.terraform.arn}"
            ]
        }
    ]
}
EOF
}

resource aws_iam_policy terraform_permissions_interrogate_organization {
  name        = "terraform-permissions-interrogate-organization"
  description = "Permissions required for the terraform-permissions IAM role to access information about the organization."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "InterrogateOrganization",
            "Effect": "Allow",
            "Action": [
                "organizations:DescribeOrganization"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

locals {
  terraform_permissions_policy_arns = [
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${local.terraform_permissions_manage_policies_name}",
    aws_iam_policy.terraform_permissions_manage_roles.arn,
    aws_iam_policy.terraform_permissions_interrogate_organization.arn
  ]
}

resource aws_iam_role_policy_attachment terraform_permissions {
  count      = length(local.terraform_permissions_policy_arns)
  policy_arn = element(local.terraform_permissions_policy_arns, count.index)
  role       = aws_iam_role.terraform_permissions.name
}