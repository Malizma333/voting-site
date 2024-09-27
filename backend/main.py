import sys
import os
import dotenv

from fastapi import FastAPI
import logging

from bs4 import BeautifulSoup
import requests

if(sys.prefix == sys.base_prefix):
  print("Not in venv")
  exit()

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

logger.debug("Online!")

dotenv.load_dotenv()

app = FastAPI()

@app.get("/")
async def getRoot():
  playlist_url = f"https://youtube.com/playlist?list={os.getenv('LIST_ID')}&si={os.getenv('SI')}&key={os.getenv('API_KEY')}"
  response = requests.get(playlist_url)
  logger.debug(response.status_code, response.headers)
  soup = BeautifulSoup(response.content, "html.parser")

  for child in soup.descendants:
      if child.name:
          print(child.name)

  return {"A": "B"}

# playlist_url = 
# requests.get(playlist_url)