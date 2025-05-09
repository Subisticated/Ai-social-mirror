"""utility to download artifacts from gdrive."""

import os
import gdown
import zipfile
from loguru import logger


def download_artifact(url:str="https://drive.google.com/uc?id=1gQEBda-H7Ix27zJsJMwojcRg3eCU52TO", path:str=""):
    """function to download artifacts from google-drive."""

    if os.path.exists(f"{path}/models"):
        return f"{path}/models"
    
    output = f"{path}/models.zip"

    logger.debug("downloading artifacts..")
    if not os.path.exists(output):
        gdown.download(url, output, quiet=True)

    # Open the zip file
    with zipfile.ZipFile(output, 'r') as zip_ref:
        # Extract all contents to the specified directory
        zip_ref.extractall(path)
    os.remove(output)
    return path + "/models"