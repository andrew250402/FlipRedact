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
