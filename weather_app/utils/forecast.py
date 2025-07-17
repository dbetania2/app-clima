def group_forecast_by_day(forecast_data):
    """
    Agrupa el pronóstico por día a partir de datos horarios.

    Esta función procesa una lista de pronósticos horarios y los agrupa
    para obtener los datos diarios, incluyendo la temperatura máxima y mínima,
    la descripción del clima, el ícono y el volumen de lluvia acumulada.

    Args:
        forecast_data (dict): Un diccionario que contiene los datos del pronóstico,
                              obtenidos de la API. Se espera que contenga la clave "list".

    Returns:
        list: Una lista de diccionarios, donde cada diccionario representa el pronóstico
              de un día. Los diccionarios están ordenados por fecha y se devuelven
              los primeros 7 días.
    """
    daily = {}
    for item in forecast_data["list"]:
        date = item["dt_txt"].split(" ")[0]
        temp_max = item["main"]["temp_max"]
        temp_min = item["main"]["temp_min"]
        desc     = item["weather"][0]["description"]
        icon     = item["weather"][0]["icon"]
        rain_mm  = item.get("rain", {}).get("3h", 0)

        if date not in daily:
            daily[date] = {
                "temp_max": temp_max,
                "temp_min": temp_min,
                "description": desc,
                "icon": icon,
                "rain_volume_mm": rain_mm,
            }
        else:
            daily[date]["temp_max"] = max(daily[date]["temp_max"], temp_max)
            daily[date]["temp_min"] = min(daily[date]["temp_min"], temp_min)
            daily[date]["rain_volume_mm"] += rain_mm

    forecast_list = [
        {"date": d, **info} for d, info in sorted(daily.items())
    ][:7]
    return forecast_list