import requests
from flask import current_app

def get_weather_and_forecast(city):
    """
    Obtiene el clima actual y el pronóstico de 5 días para una ciudad específica.
    
    Args:
        city (str): Nombre de la ciudad para la que se consulta el clima.

    Returns:
        tuple: Una tupla que contiene los datos del clima actual (dict)
               y los datos del pronóstico (dict).
        
    Raises:
        requests.RequestException: Si ocurre un error al realizar las llamadas a la API.
    """
    api_key      = current_app.config["OPENWEATHER_API_KEY"]
    weather_url  = current_app.config["WEATHER_URL"]
    forecast_url = current_app.config["FORECAST_URL"]

    params = {
        "q": city,
        "appid": api_key,
        "units": "metric",
        "lang": "es",
    }

    # Solicitud para el clima actual
    weather_res = requests.get(weather_url, params=params, timeout=10)
    weather_res.raise_for_status()
    # Forzar la codificación a UTF-8 antes de decodificar el JSON.
    weather_res.encoding = 'utf-8'
    weather_data = weather_res.json()

    # Solicitud para el pronóstico
    forecast_res = requests.get(forecast_url, params=params, timeout=10)
    forecast_res.raise_for_status()
    # Forzar la codificación a UTF-8 para el pronóstico.
    forecast_res.encoding = 'utf-8'
    forecast_data = forecast_res.json()

    return weather_data, forecast_data