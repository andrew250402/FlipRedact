FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1


WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ./api /code/api

# Run FastAPI (module path: folder.file:app_object)
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]