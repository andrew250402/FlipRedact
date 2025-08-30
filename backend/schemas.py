from pydantic import BaseModel
from typing import List, Dict, Any

PIIEntity = Dict[str, Any]

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    pii: List[PIIEntity]

class ExtractedTextResponse(BaseModel):
    extracted_text: str
    