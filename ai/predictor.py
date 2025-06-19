import joblib
import numpy as np

# Load model once
model = joblib.load("sign_model.pkl")

def predict_landmarks(landmark_list):
    """
    Predicts the sign label from a list of 21 hand landmarks.
    
    Args:
        landmark_list (list): A list of 63 values (21 x [x, y, z])
    
    Returns:
        str: Predicted sign label (e.g., 'A', 'B', ...)
    """
    if len(landmark_list) != 63:
        raise ValueError("Expected 21 landmarks (63 values), got: " + str(len(landmark_list)))

    prediction = model.predict([landmark_list])
    return prediction[0]
