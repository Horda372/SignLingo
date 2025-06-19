from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict_landmarks

app = FastAPI()

class LandmarkInput(BaseModel):
    landmarks: list[float]  # 63 landmark points

@app.post("/predict")
def predict(input_data: LandmarkInput):
    try:
        prediction = predict_landmarks(input_data.landmarks)
        return {"prediction": prediction}
    except Exception as e:
        return {"error": str(e)}
