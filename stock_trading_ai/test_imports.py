import sys
import os

# Add the directory containing 'app' to sys.path
# This assumes the script is inside 'stock_trading_ai/'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports...")
    from app.main import app
    from app.broker import MockBroker
    from app.trading_ai import analyze_stock
    print("Imports successful!")
except ImportError as e:
    print(f"Import failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)
