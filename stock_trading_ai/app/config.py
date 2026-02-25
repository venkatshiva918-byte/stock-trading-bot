import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY", "")
API_SECRET = os.getenv("API_SECRET", "")
BASE_URL = os.getenv("BASE_URL", "https://paper-api.alpaca.markets")  # Default to paper trading for safety
TRADING_MODE = os.getenv("TRADING_MODE", "mock") # mock or real
