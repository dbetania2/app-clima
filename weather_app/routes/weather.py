import requests
from flask import Blueprint, request, jsonify, current_app
import json  # Importar el módulo json
import os    # Importar el módulo os

from weather_app.services.openweather import get_weather_and_forecast
from weather_app.utils.forecast import group_forecast_by_day

# Crea un Blueprint llamado "weather" para agrupar las rutas relacionadas.
weather_bp = Blueprint("weather", __name__)

def load_cities_data():
    """
    Carga los datos de las ciudades por provincia desde un archivo JSON estático.
    """
    # Construye la ruta al archivo JSON de ciudades.
    # Asume que el archivo está en 'static/data/cities_by_province.json'
    # La ruta se calcula desde la ubicación de este archivo weather.py
    base_dir = os.path.abspath(os.path.dirname(__file__))
    json_path = os.path.join(base_dir, '..', '..', 'static', 'data', 'cities_by_province.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo de ciudades en {json_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: El archivo de ciudades {json_path} no es un JSON válido.")
        return {}

# Carga los datos de las ciudades una vez al iniciar la aplicación.
CITIES_DATA = load_cities_data()


@weather_bp.route("/weather")
def get_weather():
    """
    Endpoint para obtener el clima actual y el pronóstico semanal de una ciudad.
    """
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "Parámetro 'city' es requerido"}), 400

    try:
        weather_data, forecast_data = get_weather_and_forecast(city)
        forecast_list = group_forecast_by_day(forecast_data)

        return jsonify({
            "city": weather_data["name"],
            "current_weather": {
                "temp": weather_data["main"]["temp"],
                "description": weather_data["weather"][0]["description"],
                "icon": weather_data["weather"][0]["icon"],
            },
            "weekly_forecast": forecast_list,
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error al llamar a OpenWeather: {e}"}), 502
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {e}"}), 500


@weather_bp.route("/cities_by_province")
def get_cities_by_province():
    """
    Endpoint para obtener una lista de ciudades de una provincia específica.
    """
    province_name = request.args.get("province")
    if not province_name:
        return jsonify({"error": "Parámetro 'province' es requerido"}), 400

    cities = CITIES_DATA.get(province_name)

    if cities:
        return jsonify(cities)
    else:
        return jsonify({"error": f"No se encontraron ciudades para la provincia: {province_name}"}), 404


@weather_bp.route("/is_province")
def is_province():
    """
    Endpoint auxiliar para determinar si un nombre corresponde a una provincia válida.

    Query Params:
        name (str): Nombre a verificar.

    Returns:
        JSON: { "is_province": true/false }
    """
    name = request.args.get("name")
    if not name:
        return jsonify({"is_province": False})
    
    return jsonify({"is_province": name in CITIES_DATA})
