import sys
import os
import dotenv
import logging
import requests

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request

from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

if(sys.prefix == sys.base_prefix):
  print("ERROR: Not in venv")
  exit()

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

logger.debug("Online!")

dotenv.load_dotenv()

app = FastAPI(title="root")
api_app = FastAPI(title="api")
api_app.state.limiter = limiter
api_app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@api_app.get("/")
async def getApiRoot():
  return {"message": "Server Online", "status": 200}

@api_app.get("/youtube_data")
@limiter.limit("5/minute")
async def getApiYoutubePlaylist(request: Request):
  video_data_array = []
  nextPageToken = None

  while(True):
    query = f"part=snippet&playlistId={os.getenv('LIST_ID')}&key={os.getenv('API_KEY')}"
    if nextPageToken != None:
      query += f"&pageToken={nextPageToken}"
    
    response = requests.get(f"https://www.googleapis.com/youtube/v3/playlistItems?{query}")
    responseJson = response.json()
    
    if(response.status_code != 200):
      return "Error: " + responseJson["error"]["message"]
    
    video_snippets = [item["snippet"] for item in responseJson["items"]]
    for video_data in video_snippets:
      video_data_array.append([
        video_data["title"],
        video_data["resourceId"]["videoId"]
      ])
    
    nextPageToken = responseJson.get("nextPageToken", None)

    if nextPageToken == None:
      break

  return video_data_array

app.mount("/api", api_app)
app.mount("/", StaticFiles(directory = "static", html = True), name = "static")