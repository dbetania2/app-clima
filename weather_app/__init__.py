from flask import Flask
from flask_cors import CORS
from config import DevelopmentConfig

def create_app(config_object=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)

    CORS(app)

    # Registro de blueprints
    register_blueprints(app)

    return app

def register_blueprints(app):
    from weather_app.routes.weather import weather_bp
    app.register_blueprint(weather_bp)
