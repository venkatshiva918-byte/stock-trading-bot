# Stock Trading AI API

A stock trading AI API built with FastAPI, pandas, and yfinance.
It includes a mock broker for testing and can be configured to use Alpaca for real money trading.

## Prerequisites

- Python 3.8+
- Alpaca API Keys (for real trading)

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Edit `app/config.py` or set environment variables:

- `API_KEY`: Your Alpaca API Key ID
- `API_SECRET`: Your Alpaca Secret Key
- `BASE_URL`: Alpaca API Base URL (e.g., https://paper-api.alpaca.markets)
- `TRADING_MODE`: Set to `real` to use Alpaca, or `mock` for simulation.

## Running the API

Run the server with uvicorn:

```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `GET /`: Health check.
- `GET /portfolio`: Get current portfolio holdings.
- `POST /trade/manual`: Execute a manual trade.
  - Body: `{"symbol": "AAPL", "quantity": 10, "side": "buy"}`
- `POST /trade/ai`: Execute an AI-driven trade.
  - Body: `{"symbol": "AAPL", "quantity": 10}`

## Disclaimer

This software is for educational purposes only. Use at your own risk. The authors are not responsible for any financial losses.
