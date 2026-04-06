from loguru import logger
from pathlib import Path
import os
from datetime import datetime
from dotenv import load_dotenv

# ===============================
# 🔹 Load ENV
# ===============================
load_dotenv()
LOGS_PATH = Path(os.getenv("LOGS_PATH", "./storage/logs"))
LOGS_PATH.mkdir(parents=True, exist_ok=True)

# ===============================
# 🔹 Logger Configuration
# ===============================
# ملف لوج رئيسي Backend
backend_log_file = LOGS_PATH / "backend.log"
# ملف لوج النظام العام
system_log_file = LOGS_PATH / "system.log"

logger.add(backend_log_file, rotation="10 MB", retention="30 days", level="INFO", enqueue=True, backtrace=True)
logger.add(system_log_file, rotation="20 MB", retention="60 days", level="DEBUG", enqueue=True, backtrace=True)

# ===============================
# 🔹 Helper Functions
# ===============================

def log_info(message):
    logger.info(message)

def log_debug(message):
    logger.debug(message)

def log_error(message):
    logger.error(message)

def log_warning(message):
    logger.warning(message)

def log_event(event_name, details=None):
    """
    تسجيل حدث مخصص مع طابع زمني
    """
    timestamp = datetime.utcnow().isoformat()
    log_message = f"[{timestamp}] EVENT: {event_name}"
    if details:
        log_message += f" | Details: {details}"
    logger.info(log_message)

# ===============================
# 🔹 Example: Integration with self_heal
# ===============================
def log_self_heal(user_id, old_energy, new_energy):
    log_event(
        "SELF_HEAL",
        details=f"User ID: {user_id} | Energy: {old_energy} -> {new_energy}"
)
