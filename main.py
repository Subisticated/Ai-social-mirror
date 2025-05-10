
"""Entry point for Posture & Emotions detection."""

from loguru import logger
import os
import time
import tempfile
import argparse
import requests
import threading

from src import (
    Source,
    Grabber,
    Posture,
    Plotter,
    Emotion,
    download_artifact
)

toggle_emotion_recognition = True


def notify_user():
    """Function to notify the user to sit straight."""
    try:
        requests.post('http://localhost:3000/notify', json={"message": "Please sit straight!"})
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send notification: {e}")


def run(args):
    """runs actual processes."""
    with tempfile.TemporaryDirectory() as tmp_dir:

        if args.path:
            models_path = args.path
        else:
            models_path = download_artifact(path=tmp_dir)

        assert os.path.exists(models_path), "models not found!!"

        grabber = Grabber(Source.Camera, "")
        pose = Posture(models_path)
        emotion = Emotion(models_path)

        if args.display:
            plot = Plotter()

        fc = 0  # frame count
        st = time.time()  # start time
        hunched_start_time = None

        while grabber.is_open():
            if not toggle_emotion_recognition:
                time.sleep(1)  # Pause processing if disabled
                continue

            ct = time.time()
            frame = grabber.get()
            fc += 1
            post, emot, conf = 0, 0, 0
            if pose:
                post, kpts = pose(frame)

            if post == "hunched":
                if hunched_start_time is None:
                    hunched_start_time = time.time()
                elif time.time() - hunched_start_time > 10:  # updated to 10s
                    threading.Thread(target=notify_user).start()
                    hunched_start_time = None  # reset to allow repeated alerts
            else:
                hunched_start_time = None

            if emotion:
                emot, conf = emotion(frame, kpts)
            if args.display and plot:
                k = plot.show(frame, kpts, [post, emot])
                if k == 27:
                    break
            msg = ""
            if post and emot:
                msg = f"Postion: {post}; Emotion: {emot}({conf:.2f}))"
            d = time.time() - st
            if d >= 3:
                fps = fc / d
                st = time.time()
                fc = 0
                msg += f" FPS: {fps:.2f}"
            if msg:
                try:
                    requests.post('http://localhost:3000/logs', json={"log": msg})
                except requests.exceptions.RequestException as e:
                    logger.error(f"Failed to send log: {e}")

            if (time.time() - ct) < 0.066:
                time.sleep(0.066 - (time.time() - ct))

        grabber.close()
        logger.info("application closed successfully.")


def main():
    """main driver function."""
    parser = argparse.ArgumentParser("Posture & Expression detection.")
    parser.add_argument("-d", "--display", action="store_true", help="Flag to diplay output.")
    parser.add_argument("-v", "--version", action="store_true", help="Flag to diplay version.")
    parser.add_argument("-p", "--path", type=str, help="Provide model path.")
    args = parser.parse_args()
    if args.version:
        print("Major Version: 1.0.0")
        print("Posture Version: 0.0.1")
        print("Emotion Version: 0.0.1")
    else:
        run(args)


if __name__ == "__main__":
    main()
