from pathlib import Path
from enum import Enum

class Source(Enum):
    Camera = 0
    Video = 1
    Image = 2

class BaseGrabber:

    def __init__(self, source: Source, file_path: Path | None = None) -> None:
        self.source = source
        self.fpath = file_path
        self.cap = None

    def is_open(self):
        return self.cap.isOpened()

    def open(self):
        ...

    def get(self):
        ...

    def close(self):
        ...
