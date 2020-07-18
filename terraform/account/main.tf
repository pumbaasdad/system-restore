provider aws {
  region = "us-east-1"
  assume_role {
    role_arn = var.role
  }
}

data aws_caller_identity current {}

data aws_organizations_organization current {}

data aws_iam_role terraform {
  name = "terraform"
}

resource aws_iam_account_alias account_alias {
  account_alias = var.account_alias
}
