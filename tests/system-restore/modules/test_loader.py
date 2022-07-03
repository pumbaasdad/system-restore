from unittest import TestCase
from modules import Loader
from modules.module import Module
from modules.foo import Foo


class TestLoader(TestCase):
    def setUp(self) -> None:
        loader = Loader()
        self.modules = loader.load()

    def test_loads_all_modules(self):
        expected = ['foo', 'bar'].sort()
        self.assertEqual(expected, list(map(lambda module: module.name, self.modules)).sort())

    def test_modules_is_correct_type(self):
        test_cases = [
            ('foo', Foo),
            ('bar', Module)
        ]
        for (name, expected) in test_cases:
            with self.subTest(msg=f'Verifying {name} is the correct type of module', name=name, expected=expected):
                module = next(module for module in self.modules if module.name == name)
                self.assertEqual(expected, module.__class__)
