# weather_app/services/openweather.py

import requests
from flask import current_app

# importar clases de excepcion personalizadas
from weather_app.exceptions.base import APIError
from weather_app.exceptions.client_errors import NotFoundError, UnauthorizedError, BadRequestError
# corregir la importacion: usar '..' para subir un nivel en la jerarquia de paquetes
from weather_app.exceptions.server_errors import InternalServerError # importar error de servidor

def get_weather_and_forecast(city):
    """
    obtener el clima actual y el pronostico de 5 dias.

    args:
        city (str): nombre de la ciudad.

    returns:
        tuple: datos de clima actual y pronostico.

    raises:
        apierror: si ocurre error en llamadas a api openweathermap.
    """
    api_key = current_app.config["OPENWEATHER_API_KEY"]
    weather_url = current_app.config["WEATHER_URL"]
    forecast_url = current_app.config["FORECAST_URL"]

    params = {
        "q": city,
        "appid": api_key,
        "units": "metric",
        "lang": "es",
    }

    # --- logica para solicitud de clima actual ---
    try:
        weather_res = requests.get(weather_url, params=params, timeout=10)
        weather_res.raise_for_status()
        weather_res.encoding = 'utf-8'
        weather_data = weather_res.json()
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code
        if status_code == 401:
            raise UnauthorizedError("clave de api openweathermap invalida o faltante.")
        elif status_code == 404:
            raise NotFoundError(f"ciudad '{city}' no encontrada por servicio de clima.")
        elif status_code == 400:
            raise BadRequestError("solicitud de clima incorrecta a openweathermap.")
        else:
            raise InternalServerError(f"error de servicio de clima externo: {status_code} - {e.response.text}")
    except requests.exceptions.ConnectionError:
        raise APIError("no poder conectar al servicio de clima. verificar conexion a internet.", status_code=503)
    except requests.exceptions.Timeout:
        raise APIError("servicio de clima tardar demasiado en responder.", status_code=504)
    except requests.exceptions.RequestException as e:
        raise InternalServerError(f"error inesperado al comunicar con servicio de clima: {e}")

    # --- logica para solicitud de pronostico ---
    try:
        forecast_res = requests.get(forecast_url, params=params, timeout=10)
        forecast_res.raise_for_status()
        forecast_res.encoding = 'utf-8'
        forecast_data = forecast_res.json()
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code
        if status_code == 401:
            raise UnauthorizedError("clave de api openweathermap invalida o faltante para pronostico.")
        elif status_code == 404:
            raise NotFoundError(f"pronostico para ciudad '{city}' no encontrado por servicio de clima.")
        elif status_code == 400:
            raise BadRequestError("solicitud de pronostico incorrecta a openweathermap.")
        else:
            raise InternalServerError(f"error de servicio de pronostico externo: {status_code} - {e.response.text}")
    except requests.exceptions.ConnectionError:
        raise APIError("no poder conectar al servicio de pronostico. verificar conexion a internet.", status_code=503)
    except requests.exceptions.Timeout:
        raise APIError("servicio de pronostico tardar demasiado en responder.", status_code=504)
    except requests.exceptions.RequestException as e:
        raise InternalServerError(f"error inesperado al comunicar con servicio de pronostico: {e}")

    return weather_data, forecast_data