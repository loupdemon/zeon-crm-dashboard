from celery import Celery
from shared.models.opencopilot_db import create_database_schema
from dotenv import load_dotenv

import os
load_dotenv()

create_database_schema()
app = Celery(
    'opencopilot_celery',
    broker=os.getenv("CELERY_BROKER", 'redis://redis:6379/0'),
    backend=os.getenv("CELERY_BACKEND",'redis://redis:6379/1')
)

app.conf.imports = ('workers.tasks',)