# Add these at the top of your settings.py
from os import getenv
from dotenv import load_dotenv

# Replace the DATABASES section of your settings.py with this
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': getenv('PGDATABASE'),
    'USER': getenv('PGUSER'),
    'PASSWORD': getenv('PGPASSWORD'),
    'HOST': getenv('PGHOST'),
    'OPTIONS': {
      'sslmode': 'require',
    },
    'DISABLE_SERVER_SIDE_CURSORS': True,
  }
}