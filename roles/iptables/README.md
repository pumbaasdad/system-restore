# Description

This role is used to configure IP table rules to control which services can be accessed from outside the network. 

# Parameters

| Parameter      | Member           | Description                                               | Default        |
|:---------------|:-----------------|:----------------------------------------------------------|----------------|
| iptables_rules |                  | iptable rules to be created.                              |                |
|                | chain            | The chain to which the rule will be added.                |                |
|                | in_interface     | The input interface to which the rule will apply.         | None           |
|                | out_interface    | The output interface to which the rule will apply.        | None           |
|                | jump             | What to do if the rule matches.                           |                |
|                | cstate           | A list of connection states to which the rule will apply. | All states.    |
|                | protocol         | The protocol to which the rule applies.                   | All protocols. |
|                | destination_port | The destination port to which the rule applies.           | All ports.     |
|                | destination_ip   | The destination IP to which the rule applies.             | All IPs.       |
|                | ip_version       | The version of the IP protocol to which the rule apples.  | `ipv4`         |
