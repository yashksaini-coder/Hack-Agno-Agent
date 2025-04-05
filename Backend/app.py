from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes.stockRoutes import router as stock_router
from routes.agentRoutes import router as agent_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(stock_router)
app.include_router(agent_router)



