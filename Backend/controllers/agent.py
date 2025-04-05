import os
from dotenv import load_dotenv
from textwrap import dedent

# AI assistant imports
from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.yfinance import YFinanceTools
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.agent import Agent

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("Please provide a GROQ API key")

# Initialize the web search agent
web_search_agent = Agent(
    name="Web Search Agent",
    role="Search the web for real-time information based on user queries.",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Use DuckDuckGo to search for the most relevant and recent information.",
        "Gather data from multiple sources and ensure accuracy.",
        "Present findings in a clear and concise manner."
    ],
    markdown=True,
)

# Initialize the financial analysis agent
financial_agent = Agent(
    name="Financial Analysis Agent",
    role="Analyze financial metrics and provide insights.",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    tools=[YFinanceTools(enable_all=True)],
    instructions=dedent("""\
        You are a financial analyst. Your task is to retrieve and analyze financial data about stocks.
        Present the data in a structured format, including key metrics and insights.
    """),
    markdown=True,
)

# Combine both agents into a multi-agent system
multi_agent = Agent(
    team=[web_search_agent, financial_agent],
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions="Coordinate between web search and financial analysis to provide comprehensive insights.",
    markdown=True,
)
