import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SESSION_TYPE = "filesystem"
    SECRET_KEY = os.getenv("SECRET_KEY")
    CORS_HEADERS = 'Content-Type'

