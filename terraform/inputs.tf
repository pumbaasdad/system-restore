variable role {
  type = string
  description = "The ARN of the role that will be assumed to deploy resources to the system-restore account."
}

variable account_alias {
  type        = string
  description = "An alias for your AWS system-restore sub-account ID.  It must start with an alphanumeric character and only contain lowercase alphanumeric characters and hyphens."
}
