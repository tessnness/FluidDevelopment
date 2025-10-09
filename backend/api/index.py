from pathlib import Path
import sys
# Add /backend to sys.path so "from main import app" works
sys.path.append(str(Path(__file__).resolve().parents[1]))

from main import app