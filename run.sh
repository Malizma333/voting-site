# !/bin/bash

source .venv\\Scripts\\activate
uvicorn main:app --reload --port 8080