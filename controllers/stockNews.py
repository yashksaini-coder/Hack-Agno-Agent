import finnhub
import time
import requests
import dotenv 
import os

dotenv.load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

if not NEWS_API_KEY:
    raise ValueError("Please provide a NEWS API key")

session = requests.Session()
session.headers.update({
    "User-Agent": "Chrome/122.0.0.0"
})
def fetch_news():
    try:

        finnhub_client = finnhub.Client(api_key=NEWS_API_KEY)

        news_list =finnhub_client.general_news('general', min_id=4)
        news_stack=[]
        for news in news_list[:10]:
            news_stack.append([news['headline'],news['url']])
        print("✅ Data fetching done successfully!")   
        return news_stack
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
    time.sleep(5)