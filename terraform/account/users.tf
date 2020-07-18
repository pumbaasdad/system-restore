resource aws_iam_user ansible {
  name          = "ansible"
  force_destroy = true
}

resource aws_iam_user secret_manager {
  name          = "secret-manager"
  force_destroy = true
}