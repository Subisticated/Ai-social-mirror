"""Posture estimation class."""

from enum import Enum
from pathlib import Path
from typing import Any
import math

from loguru import logger
from numpy import ndarray

from src.posture.pose import Pose


class Position(Enum):
    """sitting postion defination."""
    Upright = 0
    Hunched = 1


class Posture(Pose):
    """Posture detection. Yolo11 pose estimation model prediction:
    0 = nose
    3 = right-ear
    4 = left-ear
    5 = right-shoulder   
    6 = left-shoulder
        
    posture estimation is done by:
    1. calculate distace between shoulder-mid and nose
    2. calulate distance between left and right ears.
    3. above two ratio should tell about up-right posture.
    """
    def ___init__(self, model_path: Path,) -> None:
        """posture detection initializer."""
        super().__init__(model_path)

    def get_posture(self, points: list[type[float]], thresh=1.15) -> Position:
        """function to get position from key-points."""
        e1 = points[0][3][:2] # right-ear
        e2 = points[0][4][:2] # left-ear
        ears_width = math.dist(e1, e2)
        s1 = points[0][5] # left-shoulder
        s2 = points[0][6] # right-shoulder
        ms = (s1[0] + s2[0])/2, (s1[1] + s2[1])/2
        np = points[0][0][:2] # nose-point
        neck_height =  math.dist(ms, np)

        if neck_height / ears_width > thresh:
            return Position.Upright.name
        return Position.Hunched.name

    def predict(self, x: ndarray) -> tuple[Position, ndarray]:
        """function to predict posture using pose."""
        pred = super().predict(x)[0]
        kpts =  pred.keypoints.data.cpu().numpy()
        return self.get_posture(kpts), kpts

    def __call__(self, x, *args: Any, **kwds: Any) -> Any:
        """caller function to predict."""
        return self.predict(x)
