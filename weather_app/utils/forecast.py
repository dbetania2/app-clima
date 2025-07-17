# weather_app/utils/forecast.py

from weather_app.exceptions.server_errors import InternalServerError # importar error de servidor

def group_forecast_by_day(forecast_data):
    """
    agrupar el pronostico por dia a partir de datos horarios.

    esta funcion procesa una lista de pronosticos horarios y los agrupa
    para obtener los datos diarios, incluyendo la temperatura maxima y minima,
    la descripcion del clima, el icono y el volumen de lluvia acumulada.

    args:
        forecast_data (dict): un diccionario que contiene los datos del pronostico,
                              obtenidos de la api. se espera que contenga la clave "list".

    returns:
        list: una lista de diccionarios, donde cada diccionario representa el pronostico
              de un dia. los diccionarios estan ordenados por fecha y se devuelven
              los primeros 7 dias.

    raises:
        internalservererror: si la estructura de los datos de pronostico no es la esperada.
    """
    daily = {}
    try:
        # iterar sobre cada item de pronostico en la lista
        for item in forecast_data["list"]:
            # extraer la fecha del item de pronostico (solo la parte de la fecha)
            date = item["dt_txt"].split(" ")[0]
            # obtener temperatura maxima
            temp_max = item["main"]["temp_max"]
            # obtener temperatura minima
            temp_min = item["main"]["temp_min"]
            # obtener descripcion del clima
            desc = item["weather"][0]["description"]
            # obtener icono del clima
            icon = item["weather"][0]["icon"]
            # obtener volumen de lluvia (si existe, si no, 0)
            rain_mm = item.get("rain", {}).get("3h", 0)

            # si la fecha no esta en el diccionario diario, inicializarla
            if date not in daily:
                daily[date] = {
                    "temp_max": temp_max,
                    "temp_min": temp_min,
                    "description": desc,
                    "icon": icon,
                    "rain_volume_mm": rain_mm,
                }
            else:
                # actualizar temperatura maxima y minima si se encuentra un valor mas extremo
                daily[date]["temp_max"] = max(daily[date]["temp_max"], temp_max)
                daily[date]["temp_min"] = min(daily[date]["temp_min"], temp_min)
                # acumular volumen de lluvia
                daily[date]["rain_volume_mm"] += rain_mm

    except (KeyError, TypeError) as e:
        # capturar errores si la estructura de los datos de pronostico es inesperada
        raise InternalServerError(f"error al procesar datos de pronostico: estructura de datos inesperada. detalle: {e}")
    except Exception as e:
        # capturar cualquier otra excepcion inesperada
        raise InternalServerError(f"error interno inesperado al agrupar pronostico: {e}")

    # convertir el diccionario diario a una lista ordenada por fecha y limitar a los primeros 7 dias
    forecast_list = [
        {"date": d, **info} for d, info in sorted(daily.items())
    ][:7]
    return forecast_list
