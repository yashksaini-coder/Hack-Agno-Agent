from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from agno.agent import RunResponse
import os
import json
import datetime
import re

router = APIRouter()
templates = Jinja2Templates(directory="templates")  # Set the templates directory

@router.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("base.html", {"request": request, "text": "Backend AI Agent server!"})
