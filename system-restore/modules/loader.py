import os
from importlib import import_module
from pathlib import Path
from pkgutil import iter_modules
from .module import Module


class Loader:
    def __init__(self):
        self.__package_directory = os.path.dirname(os.path.abspath(__file__))
        self.__specialized_modules = self.__find_specialized_modules()

    def load(self):
        module_definition_files = list(Path(self.__package_directory).glob("*.yml"))
        return [self.__specialized_modules.get(path.stem.lower(), Module)(path) for path in module_definition_files]

    def __find_specialized_modules(self):
        for (module_loader, name, ispkg) in iter_modules([self.__package_directory]):
            import_module('.' + name, __package__)

        return {cls.__name__.lower(): cls for cls in Module.__subclasses__()}
