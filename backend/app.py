import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest, PredictResponse
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
