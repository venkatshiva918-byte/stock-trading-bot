from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging
import os

# Adjust path for imports if necessary, but assuming run from root
try:
    from app.broker import MockBroker, AlpacaBroker
    from app.trading_ai import analyze_stock
    from app.config import API_KEY, API_SECRET, BASE_URL, TRADING_MODE
except ImportError:
    # Fallback for relative imports if run differently
    from .broker import MockBroker, AlpacaBroker
    from .trading_ai import analyze_stock
    from .config import API_KEY, API_SECRET, BASE_URL, TRADING_MODE

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Stock Trading AI API")

# Initialize Broker
logging.info(f"Trading Mode: {TRADING_MODE}")
if TRADING_MODE == "real":
    if not API_KEY or not API_SECRET:
        logging.warning("API_KEY or API_SECRET not set. Falling back to MockBroker.")
        broker = MockBroker()
    else:
        try:
            broker = AlpacaBroker(API_KEY, API_SECRET, BASE_URL)
        except Exception as e:
            logging.error(f"Failed to initialize AlpacaBroker: {e}. Falling back to MockBroker.")
            broker = MockBroker()
else:
    broker = MockBroker()

class TradeRequest(BaseModel):
    symbol: str
    quantity: int
    side: Optional[str] = None # "buy" or "sell" (if manual)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Stock Trading AI is running"}

@app.get("/portfolio")
def get_portfolio():
    return broker.get_portfolio()

@app.post("/trade/manual")
def manual_trade(trade: TradeRequest):
    if not trade.side:
        raise HTTPException(status_code=400, detail="Side (buy/sell) is required for manual trades")

    if trade.side.lower() == "buy":
        return broker.buy(trade.symbol, trade.quantity)
    elif trade.side.lower() == "sell":
        return broker.sell(trade.symbol, trade.quantity)
    else:
        raise HTTPException(status_code=400, detail="Invalid side. Use 'buy' or 'sell'")

@app.post("/trade/ai")
def ai_trade(trade: TradeRequest):
    """
    Analyzes the stock and executes a trade based on AI decision.
    """
    symbol = trade.symbol
    quantity = trade.quantity

    # Analyze stock
    # Note: analyze_stock might fail if yfinance has issues or no internet
    try:
        signal, reason = analyze_stock(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

    result = {
        "symbol": symbol,
        "signal": signal,
        "reason": reason,
        "execution": "none"
    }

    if signal == "BUY":
        execution = broker.buy(symbol, quantity)
        result["execution"] = execution
    elif signal == "SELL":
        execution = broker.sell(symbol, quantity)
        result["execution"] = execution

    return result
