import sys
import whisper

audio_path = sys.argv[1]
model = whisper.load_model("base")  # You can also use "small", "medium", "large"
result = model.transcribe(audio_path)
if not result or 'text' not in result:
    print("Transcription failed", file=sys.stderr)
    sys.exit(1)
else:
    print(result['text'])
