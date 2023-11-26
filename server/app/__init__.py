from flask import Flask
from flask_bcrypt import Bcrypt
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

ORIGINS = [
        os.getenv("APP_URL")
]


db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)


    # Enable CORS for the React development server
    CORS(app, origins=ORIGINS, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints
    from .routes import users_bp, transaction_bp, auth_bp, me_bp
    app.register_blueprint(me_bp, url_prefix='/api/v1/')
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(transaction_bp, url_prefix='/api/v1/transactions')

    return app
