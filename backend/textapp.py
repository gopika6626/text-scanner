from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import easyocr
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
from PIL import Image

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

reader = easyocr.Reader(['en'], gpu=True)

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Invalid image"}

    # Convert image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Perform OCR
    result = reader.readtext(image)

    extracted_text = "\n".join([item[1] for item in result])

    # Draw bounding boxes
    for (bbox, text, prob) in result:
        (top_left, top_right, bottom_right, bottom_left) = bbox
        top_left = tuple(map(int, top_left))
        bottom_right = tuple(map(int, bottom_right))

        cv2.rectangle(image, top_left, bottom_right, (255, 0, 0), 2)
        cv2.putText(image, text, (top_left[0], top_left[1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Convert processed image to base64 to send to frontend
    _, buffer = cv2.imencode('.jpg', image)
    processed_image_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "text": extracted_text,
        "image": processed_image_base64
    }
