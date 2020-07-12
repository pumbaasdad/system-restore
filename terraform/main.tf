provider aws {
  region = "us-east-1"
  assume_role {
    role_arn = var.role
  }
}

resource aws_iam_account_alias account_alias {
  account_alias = var.account_alias
}
