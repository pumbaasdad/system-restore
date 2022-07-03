from getpass import getpass
from modules import Loader

import ansible_runner


def run():
    loader = Loader()
    modules = loader. load()
    print("")

    # become_pass = getpass("sudo password: ")
    #
    # root_tasks = {
    #     'become': True,
    #     'block': [
    #         {
    #             'name': 'Create docker group',
    #             'group': {
    #                 'name': 'docker',
    #                 'state': 'present'
    #             }
    #         }
    #     ]
    # }
    #
    # playbook = {
    #     'hosts': 'all',
    #     'tasks': [
    #         root_tasks
    #     ],
    #     'vars': {
    #         'ansible_become_pass': become_pass
    #     }
    # }
    #
    # kwargs = {
    #     'playbook': [playbook],
    # }
    #
    # result = ansible_runner.run(**kwargs)


run()
