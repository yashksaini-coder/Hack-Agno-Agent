FROM python:3.11-slim

ARG GEMINI_API_KEY
ARG GROQ_API_KEY

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    GEMINI_API_KEY=$GEMINI_API_KEY \
    GROQ_API_KEY=$GROQ_API_KEY

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]