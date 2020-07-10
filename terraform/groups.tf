resource aws_iam_group parameter_readers {
  name = "parameter-readers"
}

resource aws_iam_group_policy_attachment parameter_readers {
  group      = aws_iam_group.parameter_readers.name
  policy_arn = aws_iam_policy.read_parameters.arn
}

resource aws_iam_group_membership parameter_readers {
  name  = aws_iam_group.parameter_readers.name
  group = aws_iam_group.parameter_readers.name
  users = [
    aws_iam_user.ansible.name,
    aws_iam_user.secret_manager.name
  ]
}

resource aws_iam_group parameter_writers {
  name = "parameter-writers"
}

resource aws_iam_group_policy_attachment parameter_writers {
  group      = aws_iam_group.parameter_writers.name
  policy_arn = aws_iam_policy.write_parameters.arn
}

resource aws_iam_group_membership parameter_writers {
  name  = aws_iam_group.parameter_writers.name
  group = aws_iam_group.parameter_writers.name
  users = [
    aws_iam_user.secret_manager.name
  ]
}