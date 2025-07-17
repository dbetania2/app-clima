import requests
from flask import Blueprint, request, jsonify, current_app
import json  # Importar el módulo json
import os    # Importar el módulo os
from ..exceptions.base import APIError # importar clase base de error

# importar servicios y utilidades
from weather_app.services.openweather import get_weather_and_forecast
from weather_app.utils.forecast import group_forecast_by_day

# importar clases de excepcion personalizadas
from weather_app.exceptions.client_errors import BadRequestError, NotFoundError
from weather_app.exceptions.server_errors import InternalServerError # importar error de servidor

# crear un blueprint llamado "weather" para agrupar las rutas relacionadas
weather_bp = Blueprint("weather", __name__)

def load_cities_data():
    """
    cargar los datos de las ciudades por provincia desde un archivo json estatico.
    """
    # construir la ruta al archivo json de ciudades
    # asume que el archivo esta en 'static/data/cities_by_province.json'
    base_dir = os.path.abspath(os.path.dirname(__file__))
    json_path = os.path.join(base_dir, '..', '..', 'static', 'data', 'cities_by_province.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # registrar error si el archivo no se encuentra
        print(f"error: no se encontro el archivo de ciudades en {json_path}")
        # lanzar un error interno del servidor si los datos criticos no estan
        raise InternalServerError("datos de ciudades no disponibles en el servidor.")
    except json.JSONDecodeError:
        # registrar error si el json no es valido
        print(f"error: el archivo de ciudades {json_path} no es un json valido.")
        # lanzar un error interno del servidor si los datos estan corruptos
        raise InternalServerError("datos de ciudades corruptos en el servidor.")

# cargar los datos de las ciudades una vez al iniciar la aplicacion.
# si hay un error al cargar, la excepcion se propagara y sera manejada por flask.
CITIES_DATA = load_cities_data()


@weather_bp.route("/weather")
def get_weather():
    """
    endpoint para obtener el clima actual y el pronostico semanal de una ciudad.
    """
    city = request.args.get("city")
    if not city:
        # lanzar badrequesterror si el parametro 'city' falta
        raise BadRequestError("parametro 'city' es requerido.")

    try:
        # obtener datos de clima y pronostico del servicio openweather
        weather_data, forecast_data = get_weather_and_forecast(city)
        # agrupar y transformar los datos del pronostico
        forecast_list = group_forecast_by_day(forecast_data)

        # devolver respuesta json exitosa
        return jsonify({
            "city": weather_data["name"],
            "current_weather": {
                "temp": weather_data["main"]["temp"],
                "description": weather_data["weather"][0]["description"],
                "icon": weather_data["weather"][0]["icon"],
            },
            "weekly_forecast": forecast_list,
        })

    except APIError as e:
        # capturar cualquier apierror lanzado por get_weather_and_forecast
        # flask lo manejara globalmente con el manejador registrado en __init__.py
        raise e
    except Exception as e:
        # capturar cualquier otra excepcion inesperada y lanzarla como internalservererror
        # para que el manejador global la capture
        raise InternalServerError(f"error interno inesperado: {str(e)}")


@weather_bp.route("/cities_by_province")
def get_cities_by_province():
    """
    endpoint para obtener una lista de ciudades de una provincia especifica.
    """
    province_name = request.args.get("province")
    if not province_name:
        # lanzar badrequesterror si el parametro 'province' falta
        raise BadRequestError("parametro 'province' es requerido.")

    cities = CITIES_DATA.get(province_name)

    if cities:
        # devolver respuesta json con las ciudades
        return jsonify(cities)
    else:
        # lanzar notfounderror si no se encuentran ciudades para la provincia
        raise NotFoundError(f"no se encontraron ciudades para la provincia: '{province_name}'.")


@weather_bp.route("/is_province")
def is_province():
    """
    endpoint auxiliar para determinar si un nombre corresponde a una provincia valida.

    query params:
        name (str): nombre a verificar.

    returns:
        json: { "is_province": true/false }
    """
    name = request.args.get("name")
    if not name:
        # si el nombre falta, no es una provincia valida
        return jsonify({"is_province": False})
    
    # verificar si el nombre (de provincia) existe en los datos cargados
    return jsonify({"is_province": name in CITIES_DATA})
