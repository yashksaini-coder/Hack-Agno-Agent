from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException
import datetime
from routes.stockRoutes import router as stock_router
from routes.agentRoutes import router as agent_router

app = FastAPI()
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:  # Method Not Allowed
        # Extract the path from the request
        path = request.url.path
        # Get the current year for the template
        current_year = datetime.datetime.now().year
        
        return templates.TemplateResponse(
            "post.html",
            {
                "request": request,
                "route_path": path,
                "full_path": str(request.url),
                "description": "This endpoint requires a different HTTP method than the one used.",
                "current_year": current_year,
                "example_query": "{}"  # Default empty JSON object
            },
            status_code=405
        )
    raise exc  # Re-raise other HTTP exceptions

app.include_router(stock_router)
app.include_router(agent_router)



