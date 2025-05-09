import cv2
import numpy as np

from src.grabber.base import BaseGrabber, Source


class CameraGrabber(BaseGrabber):

    def __init__(self, source: Source):
        super().__init__(source, "")
        self.open()

    def open(self):
        assert self.source == Source.Camera

        if self.cap:
            self.cap.release()

        self.cap = cv2.VideoCapture(0)

        assert self.cap.isOpened(), "Camera open faile!!"

    def get(self) -> np.ndarray:
        assert self.cap.isOpened(), "Camera open faile!!"
        
        # Capture frame-by-frame
        ret, frame = self.cap.read()
        assert ret, "Could not get image from source."
        return frame
                
    def close(self):
        self.cap.release()
        self.cap = None
