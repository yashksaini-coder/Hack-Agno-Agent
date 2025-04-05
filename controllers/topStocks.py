import yfinance as yf
import requests 
import time
session = requests.Session()
session.headers.update({
    "User-Agent": "Chrome/122.0.0.0"
})

def get_top_stocks(symbols):
    stock_data = []
    try:
        top_stocks = symbols.split()
        tickers = yf.Tickers(symbols)
        while top_stocks:
            stock = top_stocks.pop()
            info = tickers.tickers[stock].info
            stock_info = {
                    'symbol': stock,
                    'name': info.get('shortName', 'N/A'),
                    'currentPrice': info.get('currentPrice', 'N/A'),
                    'previousClose': info.get('previousClose', 'N/A'),
                    'sector': info.get('sector', 'N/A')
                    }
            
            stock_data.append(stock_info)
        print("✅ Data fetching done successfully!")
        return stock_data
    except Exception as e:
            print(f"❌ Error fetching {symbols}: {e}")
            time.sleep(5)
    

def get_stock(symbol):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        stock_info = {
                'symbol': symbol,
                'name': info.get('shortName', 'N/A'),
                'currentPrice': info.get('currentPrice', 'N/A'),
                'previousClose': info.get('previousClose', 'N/A'),
                'sector': info.get('sector', 'N/A')
            }
        print("✅ Data fetching done successfully!")
        return stock_info
    except Exception as e:
        print(f"❌ Error fetching {symbol}: {e}")
        time.sleep(5)
