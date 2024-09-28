# !/bin/bash

python -m venv .venv
source .venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
deactivate