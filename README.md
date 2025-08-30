## How to run FlipRedact
### Set up
1. Open powershell and run
```
git clone
```
2. Change directory to the cloned folder
```
cd FlipRedact
```

### Run Backend
1. Open a powershell and create virtual environment
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

4. Run FastAPI
```
uvicorn backend.app:app --reload --port 3000
```

### Run Fronend
NodeJs is required to run Frontend

1. Open another powershell
```
npm install
```
2. Run app
```
npm run start
```

## How to use FlipRedact
1. Enter your text full of personal information
<img width="1071" height="435" alt="image" src="https://github.com/user-attachments/assets/24530136-58d6-4789-aa5b-ab95d39327dd" />

2. Press "Run PII Detection". A list of identified PIIs will appear on the right.
<img width="1280" height="661" alt="image" src="https://github.com/user-attachments/assets/b2636a4e-7ee3-4457-87d2-4ef4b6f5640b" />

3. Select PIIs to be redacted and press "Apply Redaction"
<img width="1280" height="664" alt="image" src="https://github.com/user-attachments/assets/19fc7d95-dc95-4988-99bb-728b743d28eb" />

4. Use redacted text for your favourite LLM
<img width="815" height="367" alt="image" src="https://github.com/user-attachments/assets/3f8a3c0a-50de-4cd6-9ef3-905e18a34659" />

5. Paste the LLM's output to the decoder
<img width="749" height="389" alt="image" src="https://github.com/user-attachments/assets/e694efe1-f0d6-47ff-87b2-e42534cf4d46" />

6. Press "Decode PIIs" to reverse redaction
<img width="1280" height="343" alt="image" src="https://github.com/user-attachments/assets/f14f1ef0-10dc-4978-b11a-cd596011297b" />




