"""Emotion classification."""

import math
from pathlib import Path
from enum import Enum

import numpy as np
from PIL import Image

import torch
from torchvision import transforms

from src.emotion.repvgg import create_RepVGG_A0


class Emots(Enum):
    """emotion defination."""
    Anger = 0
    Contempt = 1
    Disgust = 2
    Fear = 3
    Happy = 4
    Relax = 5
    Sad = 6
    Surprise = 7


class Emotion:
    """class to predict face expression/emotions."""

    def __init__(self, model_path: Path):
        """emotions class initializer."""
        model_path = Path(model_path)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.emot = create_RepVGG_A0(deploy=True)
        self.emot = self.emot.to(self.device)
        self.emot.load_state_dict(torch.load(model_path / "repvgg.pth"))
        self.emot = self.emot.eval()

        self.trfms = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                        std=[0.229, 0.224, 0.225]),
        ])

    def face_crop(self, img: np.ndarray, kpts: list[tuple[float]]) -> np.ndarray:
        """function to crop face."""
        e1 = kpts[0][3][:2] # right-ear
        e2 = kpts[0][4][:2] # left-ear
        n = kpts[0][0][:2] # nose-point
        w = int(math.dist(e1, e2))
        x = max(0, int(e2[0]))
        y = max(0, int(n[1] - int(w * 0.5)))
        h = int(w * 1.2)
        return img[y:y+h, x:x+w]

    def predict(self, x: np.ndarray, kpts: list[tuple[float]]) -> tuple[Emots, float]:
        """function to crop face and predict emotions."""
        x = self.face_crop(x, kpts)
        x = torch.tensor(self.trfms(Image.fromarray(x)), device=self.device).unsqueeze(dim=0)
        y = self.emot(x.to(self.device)).detach().cpu().numpy()
        p = int(np.argmax(y))
        return Emots(p).name, y[0][p]

    def __call__(self, x: np.ndarray, kpts: list[tuple[float]]) -> Emots:
        """caller function to predict emotions."""
        return self.predict(x, kpts)
