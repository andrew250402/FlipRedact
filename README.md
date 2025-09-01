# FlipRedact

## About FlipRedact

### 1. What it does

FlipRedact is a web app that helps you safely interact with Large Language Models (LLMs) by detecting Personally Identifiable Information (PII) in your text. It lets users selectively redact sensitive information before sending it to an LLM and then conveniently unredact the results afterward.

### 2. How it works

We built FlipRedact using a hybrid approach:
* **Regex rules** to catch common structured PII (like phone numbers and emails).
* A pretrained **Named Entity Recognition (NER) model** from Hugging Face to detect general entities.
* A finetuned **DistilBERT model** to capture more domain-specific PII with higher accuracy.

Detected PII is returned with its position, type, and confidence score, which the frontend uses to highlight text and provide interactive redaction options for the user.

---

## How to Run FlipRedact

### 1. Prerequisites

Make sure you have the following installed:
* [Git](https://git-scm.com/)
* [Python 3.9+](https://www.python.org/)
* [Node.js and npm](https://nodejs.org/)

### 2. Setup

First, clone the repository and navigate into the project's root directory.

```bash
# Clone the repository from GitHub
git clone https://github.com/andrew250402/FlipRedact

# Navigate into the newly created folder
cd FlipRedact
````

The project has the following structure:

```
FlipRedact/
├── backend/
│   ├── app.py
│   └── ... (other python files)
├── my-app/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ... (other jsx/js files)
│   ├── package.json
│   └── ...
└── requirements.txt
```

### 3\. Run the Backend (Server)

The backend is a FastAPI server. Open a terminal in the project's root directory (`FlipRedact`).

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\Activate.ps1
# On macOS/Linux:
# source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Start the FastAPI server (run from the root directory)
uvicorn backend.app:app --reload --port 3000
```

Your backend should now be running at `http://127.0.0.1:3000`.

### 4\. Run the Frontend (Client)

The frontend is a React application. **Open a new terminal** and navigate into the `frontend` directory.

```bash
# IMPORTANT: Change directory to the frontend folder
cd my-app

# Install the required node modules
npm install

# Start the React development server
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




