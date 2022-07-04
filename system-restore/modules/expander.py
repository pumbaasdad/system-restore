from ast import literal_eval

from jinja2schema import infer
from jinja2 import Template


# TODO: Detect recursion
# TODO: How to make this handle more nesting
class Expander:
    def __init__(self):
        self.vars = {
            'test': '{{ vars.foo + 1.5 }}',
            'foo': '{{ secrets.fud + 1.5 }}'
        }
        self.final_vars = {}

        self.secrets = {'fud': 1}
        self.final_secrets = {}

        for (key, template) in self.vars.items():
            self.__expand_value(key, template, self.final_vars)

        for (key, template) in self.secrets.items():
            self.__expand_value(key, template, self.final_secrets)

        print(self.final_vars)
        print(self.final_secrets)

    def __expand_value(self, key, template, final_values):
        if key in final_values:
            if final_values[key] is None:
                raise Exception(f'`{key}` is used recursively.')

            return

        required = infer(template)

        if not required.items():
            final_values[key] = template
            return

        final_values[key] = None

        self.__expand_value_recursively('vars', required, self.vars, self.final_vars)
        self.__expand_value_recursively('secrets', required, self.secrets, self.final_secrets)

        final_values[key] = Template(template).render(vars=self.final_vars, secrets=self.final_secrets)
        if final_values[key].replace('.', '', 1).isnumeric():
            val = literal_eval(final_values[key])
            if isinstance(val, int):
                final_values[key] = int(val)
            else:
                final_values[key] = val

    def __expand_value_recursively(self, type, required, templates, final_values):
        if type in required:
            for key in required[type].keys():
                self.__expand_value(key, templates[key], final_values)


Expander()
