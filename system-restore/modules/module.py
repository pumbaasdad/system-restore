class Module:
    def __init__(self, config_file):
        self.__name = config_file.stem

    @property
    def name(self):
        return self.__name

    @property
    def groups(self):
        return []
