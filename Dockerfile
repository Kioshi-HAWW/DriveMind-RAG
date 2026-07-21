FROM python:3.11-slim

WORKDIR /app

# Install system build dependencies for grpcio and other wheels
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential libssl-dev && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, wheel
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy source code
COPY . /app

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Render provides
EXPOSE $PORT

# Run the app using env variable $PORT
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
