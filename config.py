import os
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env
load_dotenv()

class Config:
    """
    Clase de configuración base para la aplicación.

    Esta clase define los ajustes comunes para todos los entornos
    y carga la clave de la API desde las variables de entorno para
    mantenerla segura.
    """
    DEBUG = False
    TESTING = False

    # Configuración para la API de OpenWeatherMap.
    # La clave de la API se obtiene de la variable de entorno 'OPENWEATHER_API_KEY'.
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    WEATHER_URL   = "http://api.openweathermap.org/data/2.5/weather"
    FORECAST_URL  = "http://api.openweathermap.org/data/2.5/forecast"

class DevelopmentConfig(Config):
    """
    Clase de configuración para el entorno de desarrollo.

    Hereda de la clase `Config` y sobrescribe el ajuste `DEBUG`
    para habilitar el modo de depuración.
    """
    DEBUG = True