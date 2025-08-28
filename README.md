To run for window

1. Create virtual environment
```
python -m venv venv
```

2. Enter virtual environment
```
venv\Scripts\Activate.ps1
```

3. Install required packages
```
pip install -r requirements.txt
```

4. Run finetuning to get model
```
python backend/train_phone_model.py
```

5. Run FastAPI
```
uvicorn backend.app:app --reload --port 3000
```

6. Open powershell
```
Invoke-RestMethod -Uri "http://127.0.0.1:3000/predict" `
>>                   -Method POST `
>>                   -Headers @{ "Content-Type" = "application/json" } `
>>                   -Body '{"text":"Enter your input here"}'
>>
```
