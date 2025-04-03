from fastapi import APIRouter, Depends, Request
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from utils.redisCache import get_cache
from controllers.topStocks import get_top_stocks, get_stock
from controllers.stockAgent import stock_analyzer_agent, extract_json_from_response, create_default_stock_data, merge_stock_data
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi import FastAPI, Query, HTTPException
import os
import re
import json
from fastapi.templating import Jinja2Templates
import datetime

templates = Jinja2Templates(directory="templates")
router = APIRouter()

@router.get("/")
@router.head("/")
async def read_root(request: Request):
    text = "Backend AI Agent server"
    return templates.TemplateResponse("base.html",{"request":request, "text": text})


@router.get("/top-stocks")
async def read_top_stocks(request: Request, cache: RedisBackend = Depends(get_cache)):
    cache_key = "top_stocks"
    cached_result = await cache.get(cache_key)
    
    if cached_result:
        result = json.loads(cached_result)
    else:
        top_stocks = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'META', 'NVDA']
        stocks = " ".join(top_stocks)
        result = get_top_stocks(stocks)
        await cache.set(cache_key, json.dumps(result), 10)
    
    # Check if request is from a browser
    accept_header = request.headers.get("accept", "")
    if "text/html" in accept_header:
        return templates.TemplateResponse("route.html", {
            "request": request,
            "route_path": "/top-stocks",
            "method": "GET",
            "full_path": request.url.scheme + "://" + request.url.netloc + "/top-stocks",
            "description": "Returns information about top stocks in the market",
            "parameters": [],
            "example_response": json.dumps(result, indent=2),
            "current_year": datetime.datetime.now().year
        })
    
    return result

@router.get("/stock/{name}")
async def read_stock(request: Request, name: str, cache: RedisBackend = Depends(get_cache)):
    # Use f-string to properly interpolate the name variable
    cache_key = f"stock_{name}"
    cached_result = await cache.get(cache_key)
    
    if cached_result:
        result = json.loads(cached_result)
    else:
        result = get_stock(name)
        await cache.set(cache_key, json.dumps(result), 10)
    
    # Check if request is from a browser
    accept_header = request.headers.get("accept", "")
    if "text/html" in accept_header:
        return templates.TemplateResponse("route.html", {
            "request": request,
            "route_path": f"/stock/{{{name}}}",
            "method": "GET",
            "full_path": request.url.scheme + "://" + request.url.netloc + f"/stock/{name}",
            "description": "Returns detailed information about a specific stock",
            "parameters": [
                {"name": "name", "type": "string", "description": "Stock symbol (e.g., AAPL, MSFT)"}
            ],
            "example_response": json.dumps(result, indent=2),
            "current_year": datetime.datetime.now().year
        })
    
    return result

@router.get("/stock-analysis/{symbol}")
async def get_stock_analysis(request: Request, symbol: str, cache: RedisBackend = Depends(get_cache)):
    cache_key = f"stock_analysis_{symbol}"
    """
    Get detailed stock analysis for a given stock symbol.
    Returns a JSON response with financial metrics.
    """
    try:
        # Get or compute result
        cached_result = await cache.get(cache_key)
        if cached_result:
            result = json.loads(cached_result)
        else:
            # Construct a clear prompt for the model
            prompt = f"Analyze the stock {symbol} and provide detailed financial information following the specified JSON format."
            response = stock_analyzer_agent.run(prompt)
            
            # Extract JSON from the response
            if hasattr(response, 'content'):
                # Try to extract JSON from the content
                json_data = extract_json_from_response(response.content)
                
                if json_data:                
                    # Create default data and merge with extracted data
                    default_data = create_default_stock_data(symbol)
                    result = merge_stock_data(default_data, json_data)
                else:
                    result = create_default_stock_data(symbol)
            else:
                result = create_default_stock_data(symbol)
                
            await cache.set(cache_key, json.dumps(result), 300)
        
        # Check if request is from a browser
        accept_header = request.headers.get("accept", "")
        if "text/html" in accept_header:
            return templates.TemplateResponse("route.html", {
                "request": request,
                "route_path": f"/stock-analysis/{{{symbol}}}",
                "method": "GET",
                "full_path": request.url.scheme + "://" + request.url.netloc + f"/stock-analysis/{symbol}",
                "description": "Provides detailed AI-powered analysis of a stock, including financial metrics and predictions",
                "parameters": [
                    {"name": "symbol", "type": "string", "description": "Stock symbol to analyze (e.g., AAPL, MSFT)"}
                ],
                "example_response": json.dumps(result, indent=2),
                "current_year": datetime.datetime.now().year
            })
        
        return JSONResponse(content=result)
        
    except Exception as e:
        error_response = {"error": f"Failed to retrieve stock data: {str(e)}"}
        
        # Check if request is from a browser for error case
        accept_header = request.headers.get("accept", "")
        if "text/html" in accept_header:
            return templates.TemplateResponse("route.html", {
                "request": request,
                "route_path": f"/stock-analysis/{{{symbol}}}",
                "method": "GET",
                "full_path": request.url.scheme + "://" + request.url.netloc + f"/stock-analysis/{symbol}",
                "description": "Provides detailed AI-powered analysis of a stock, including financial metrics and predictions",
                "parameters": [
                    {"name": "symbol", "type": "string", "description": "Stock symbol to analyze (e.g., AAPL, MSFT)"}
                ],
                "example_response": json.dumps(error_response, indent=2),
                "current_year": datetime.datetime.now().year
            })
            
        return JSONResponse(status_code=500, content=error_response)

