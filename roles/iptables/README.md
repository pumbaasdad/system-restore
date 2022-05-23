# Description

This role is used to configure IP table rules to control which services can be accessed from outside the network. 

# Parameters

| Parameter      | Member       | Description                                               |
|:---------------|:-------------|:----------------------------------------------------------|
| iptables_rules |              | iptable rules to be created.                              |
 |                | chain        | The chain to which the rule will be added.                |
 |                | in_interface | The input interface to which the rule will apply.         |
 |                | cstate       | A list of connection states to which the rule will apply. |
|                | jump         | What to do if the rule matches.                           |
