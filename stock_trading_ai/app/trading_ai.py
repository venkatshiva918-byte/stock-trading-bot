import yfinance as yf
import pandas as pd
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def analyze_stock(symbol):
    """
    Analyzes a stock symbol and returns a trading signal.
    Strategy: Simple Moving Average Crossover (SMA 50 vs SMA 200).
    """
    logging.info(f"Analyzing {symbol}...")
    try:
        # Get historical data (1 year)
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1y")

        if hist.empty:
            logging.warning(f"No data found for {symbol}")
            return "HOLD", "No data"

        # Calculate SMA
        hist['SMA50'] = hist['Close'].rolling(window=50).mean()
        hist['SMA200'] = hist['Close'].rolling(window=200).mean()

        # Get latest data point
        latest = hist.iloc[-1]

        # Check if enough data for SMA calculation
        if pd.isna(latest['SMA50']) or pd.isna(latest['SMA200']):
             return "HOLD", "Not enough data for SMA"

        price = latest['Close']
        sma50 = latest['SMA50']
        sma200 = latest['SMA200']

        logging.info(f"{symbol} Price: {price}, SMA50: {sma50}, SMA200: {sma200}")

        # Strategy Logic
        if sma50 > sma200:
            return "BUY", f"SMA50 ({sma50:.2f}) > SMA200 ({sma200:.2f})"
        elif sma50 < sma200:
            return "SELL", f"SMA50 ({sma50:.2f}) < SMA200 ({sma200:.2f})"
        else:
            return "HOLD", "Neutral"

    except Exception as e:
        logging.error(f"Error analyzing {symbol}: {e}")
        return "HOLD", str(e)
