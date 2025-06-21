from fastapi import FastAPI, UploadFile, File
import tempfile
import cv2
import mediapipe as mp
from predictor import predict_landmarks

app = FastAPI()


@app.post("/predict_video")
async def predict_video(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    cap = cv2.VideoCapture(tmp_path)
    mp_hands = mp.solutions.hands.Hands(static_image_mode=False)
    prediction = None

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = mp_hands.process(frame_rgb)
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
            if len(landmarks) == 63:
                prediction = predict_landmarks(landmarks)
                break

    cap.release()
    return {"prediction": prediction or "No hand detected"}
