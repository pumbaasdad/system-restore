resource aws_iam_policy read_parameters {
  name        = "read-parameters"
  description = "Permissions required to read SSM parameters."
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

resource aws_iam_policy write_parameters {
  name        = "write-parameters"
  description = "Permissions required to write SSM parameters."
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