import groq
import os
from dotenv import load_dotenv
load_dotenv()

# AI assistant imports
from fastapi.responses import HTMLResponse, JSONResponse
from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.yfinance import YFinanceTools
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.agent import Agent, RunResponse
from agno.tools.wikipedia import WikipediaTools
from agno.tools.calculator import CalculatorTools

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = groq.Client(api_key=GROQ_API_KEY)

if not GROQ_API_KEY:
    raise ValueError("Please provide a GROQ API key")

# Enhanced web search agent with more capabilities
web_agent = Agent(
    name="web_agent",
    role="comprehensive web research and information gathering specialist",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    tools=[
        DuckDuckGoTools(search=True, news=True),
        WikipediaTools(),
    ],
    instructions=[
        "You are an advanced web research specialist capable of handling complex queries",
        "Your primary objectives are to:",
        "1. Break down complex queries into manageable sub-tasks",
        "2. Gather information from multiple sources for comprehensive answers",
        "3. Verify information across different sources",
        "4. Provide well-structured, detailed responses with proper citations",
        "5. Handle ambiguous queries by asking clarifying questions when needed",
        "6. Maintain context throughout multi-step queries",
        "7. Format responses in clear, organized markdown with proper sections",
        "When dealing with complex queries:",
        "- Start by analyzing the query components",
        "- Identify required information sources",
        "- Gather data systematically",
        "- Synthesize information coherently",
        "- Provide clear reasoning for your conclusions"
    ]
)

def fetch_news():
    """Fetch latest news articles related to stocks and financial markets"""
    try:
        response: RunResponse = web_agent.run("Latest news articles related to stocks and financial markets")
        return {
            "question": "Latest news articles related to stocks and financial markets",
            "answer": response.content
        }
    except Exception as e:
        raise RuntimeError(f"Error fetching news: {str(e)}")