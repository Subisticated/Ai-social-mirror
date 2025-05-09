"""Yolo-11 based pose-estimation."""

from ultralytics import YOLO
import torch
import numpy as np
from pathlib import Path


class Pose:
    """Yolo-11 based pose-estimation model."""

    def __init__(self, model_path: Path) -> None:
        """Yolo11 Pose estimation initializer."""
        model_path = Path(model_path)
        if torch.cuda.is_available():
            device = "cuda"
            self.model = YOLO(model_path / "yolo11n-pose.pt")
            self.model = self.model.eval()
            self.model = self.model.to(device)
        else:
            self.model = YOLO(model_path / "yolo11n-pose_int8_openvino_model")
            
    def predict(self, x: np.ndarray) -> torch.Tensor:
        """function to predict pose from yolo11 model."""
        return self.model(x, verbose=False)
