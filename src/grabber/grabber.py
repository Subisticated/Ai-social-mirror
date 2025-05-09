"""Grabber Factory Classs."""

from pathlib import Path
from src.grabber.base import Source, BaseGrabber
from src.grabber.camera import CameraGrabber


class Grabber:
    """Grabber Factory Class."""

    def __new__(cls, source: Source, file_path: Path | None = None) -> BaseGrabber:
        if source == Source.Camera:
            return CameraGrabber(source)
        assert False, "Wrong Source Type."
