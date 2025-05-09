"""Plotter class for visualization."""

import cv2
import numpy as np
import math

from src.posture import Position
from src.emotion import Emots

class Plotter:
    """Plotter class for predction visualization."""

    def __init__(self):
        """Plotter initializer."""
        cv2.namedWindow("pose")

    def plot_rect(self, img: np.ndarray, points: list[tuple[float, ...]]) -> np.ndarray:
        e1 = points[0][3][:2] # right-ear
        e2 = points[0][4][:2] # left-ear
        n = points[0][0][:2] # nose-point
        w = int(math.dist(e1, e2))
        x = int(e2[0])
        y = int(n[1] - int(w * 0.5))
        h = int(w * 1.2)
        img = cv2.rectangle(img, [x, y], [x+w, y+h], (0, 255, 0), 2)
        return img, [x, y, w, h]

    def plot(self, img: np.ndarray, points: list[tuple[float, ...]]) -> np.ndarray:
        """function to plot key-points."""
        for i, (x, y, _) in enumerate(points[0]):
            x = int(x)
            y = int(y)
            if 0 < x < img.shape[1] and 0 < y < img.shape[0]:
                cv2.circle(img, [int(x), int(y)], 4, (0, 255, 0), -1)
        return img

    def show(self, img, points: list[tuple[float, ...]] | None = None, classes: list[int] | None=None) -> int:
        """function to diplay plottings."""
        if points is not None:
            img, crop = self.plot_rect(img, points)
            x, y, w, h = crop
            if classes is not None:
                cv2.putText(img, classes[0], (x, y-5), 1, 1, (0, 0, 255), 1)
                cv2.putText(img, classes[1], (x, y+h+10), 1, 1, (0, 0, 255), 1)

        cv2.imshow("pose", img)
        return int(cv2.waitKey(1))
