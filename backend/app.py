import os
import tempfile
import pytesseract
# For Windows, specify the tesseract.exe path if it's not in your PATH
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest, PredictResponse, ExtractedTextResponse
from inference import PIIModel

MODEL_DIR = os.getenv(
    "MODEL_DIR", os.path.join(os.path.dirname(__file__), "distil_date_model")
)

app = FastAPI(title="PII Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = PIIModel(MODEL_DIR)


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    text = req.text
    pii_entities = model.predict(text)
    return PredictResponse(pii=pii_entities)


@app.get("/")
async def root():
    return {"message": "PII Phone Detector API is running"}

@app.post("/ocr", response_model=ExtractedTextResponse)
async def ocr_predict(file: UploadFile = File(...)):
    # Get a safe temp path
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)

    with open(temp_path, "wb") as f:
        f.write(await file.read())

    image = Image.open(temp_path)
    extracted_text = pytesseract.image_to_string(image, lang="eng")
    print("=== OCR OUTPUT START ===")
    print(extracted_text)
    print("=== OCR OUTPUT END ===")

    return ExtractedTextResponse(
        extracted_text=extracted_text)

