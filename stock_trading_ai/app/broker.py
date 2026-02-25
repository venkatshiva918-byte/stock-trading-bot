from abc import ABC, abstractmethod
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

class Broker(ABC):
    @abstractmethod
    def get_portfolio(self):
        pass

    @abstractmethod
    def buy(self, symbol, quantity):
        pass

    @abstractmethod
    def sell(self, symbol, quantity):
        pass

class MockBroker(Broker):
    def __init__(self):
        self.portfolio = {"USD": 100000}
        logging.info("Initialized MockBroker with $100,000")

    def get_portfolio(self):
        # Convert simple dict to match Alpaca structure
        cash = self.portfolio.get("USD", 0)
        positions = []
        # Value is cash + sum of (qty * 0) since we don't have prices
        portfolio_value = cash

        for symbol, qty in self.portfolio.items():
            if symbol != "USD":
                positions.append({
                    "symbol": symbol,
                    "qty": qty,
                    "market_value": 0, # Mock value
                    "current_price": 0 # Mock value
                })

        return {
            "cash": float(cash),
            "portfolio_value": float(portfolio_value),
            "positions": positions
        }

    def buy(self, symbol, quantity):
        logging.info(f"Mock Buy: {quantity} shares of {symbol}")
        if symbol not in self.portfolio:
            self.portfolio[symbol] = 0
        self.portfolio[symbol] += quantity
        # Simplified: doesn't deduct cash in mock
        return {"status": "filled", "symbol": symbol, "qty": quantity, "side": "buy"}

    def sell(self, symbol, quantity):
        logging.info(f"Mock Sell: {quantity} shares of {symbol}")
        if symbol in self.portfolio and self.portfolio[symbol] >= quantity:
            self.portfolio[symbol] -= quantity
            return {"status": "filled", "symbol": symbol, "qty": quantity, "side": "sell"}
        return {"status": "rejected", "reason": "insufficient shares"}

class AlpacaBroker(Broker):
    def __init__(self, api_key, api_secret, base_url):
        is_paper = "paper" in base_url if base_url else True
        self.client = TradingClient(api_key, api_secret, paper=is_paper)
        logging.info(f"Initialized AlpacaBroker (Paper: {is_paper})")

    def get_portfolio(self):
        try:
            account = self.client.get_account()
            positions = self.client.get_all_positions()
            # Convert to dict for JSON serialization
            # Using model_dump() for Pydantic v2 compatibility, falling back to dict() if needed
            return {
                "cash": float(account.cash),
                "portfolio_value": float(account.portfolio_value),
                "positions": [self._to_dict(p) for p in positions]
            }
        except Exception as e:
            logging.error(f"Error getting portfolio: {e}")
            return {"status": "error", "message": str(e)}

    def buy(self, symbol, quantity):
        try:
            req = MarketOrderRequest(
                symbol=symbol,
                qty=quantity,
                side=OrderSide.BUY,
                time_in_force=TimeInForce.DAY
            )
            order = self.client.submit_order(order_data=req)
            return self._to_dict(order)
        except Exception as e:
            logging.error(f"Error buying {symbol}: {e}")
            return {"status": "error", "message": str(e)}

    def sell(self, symbol, quantity):
        try:
            req = MarketOrderRequest(
                symbol=symbol,
                qty=quantity,
                side=OrderSide.SELL,
                time_in_force=TimeInForce.DAY
            )
            order = self.client.submit_order(order_data=req)
            return self._to_dict(order)
        except Exception as e:
            logging.error(f"Error selling {symbol}: {e}")
            return {"status": "error", "message": str(e)}

    def _to_dict(self, obj):
        if hasattr(obj, 'model_dump'):
            return obj.model_dump()
        elif hasattr(obj, 'dict'):
            return obj.dict()
        else:
            return str(obj)
