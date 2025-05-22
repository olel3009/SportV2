import logging
from logging.handlers import TimedRotatingFileHandler
from flask import app
import sys, os
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

LOG_WHEN = os.getenv('LOG_WHEN', 'midnight')
LOG_INTERVAL = int(os.getenv('LOG_INTERVAL', '1'))
LOG_BACKUP = int(os.getenv('LOG_BACKUP', '2'))

formatter= logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')

handler = TimedRotatingFileHandler(r'api\logs\system.log', when = LOG_WHEN, backupCount = LOG_BACKUP, interval = LOG_INTERVAL)
handler.setFormatter(formatter)

logger = logging.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

if __name__ == "__main__":
    while True:
        logger.debug("TEST")