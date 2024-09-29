import sys
import os
import dotenv
import logging
import requests

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request, FastAPI

if(sys.prefix == sys.base_prefix):
  print("ERROR: Not in venv")
  exit()

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

logger.debug("Online!")

dotenv.load_dotenv()

app = FastAPI(title="root")
api_app = FastAPI(title="api")

@api_app.get("/")
async def getApiRoot():
  return {"message": "Server Online", "status": 200}

@api_app.get("/youtube_data")
async def getApiYoutubePlaylist():
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
        video_data["thumbnails"]["default"]["url"],
        "http://youtu.be/" + video_data["resourceId"]["videoId"]
      ])
    
    nextPageToken = responseJson.get("nextPageToken", None)

    if nextPageToken == None:
      break

  return video_data_array

app.mount("/api", api_app)
app.mount("/", StaticFiles(directory = "static", html = True), name = "static")