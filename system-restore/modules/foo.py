import os
from glob import glob
from .module import Module


class Foo(Module):
    def test(self):
        return glob('*.yml', root_dir=os.path.dirname(os.path.abspath(__file__)))
