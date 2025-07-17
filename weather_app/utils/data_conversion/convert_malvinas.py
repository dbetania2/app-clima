import geopandas as gpd # importar libreria geopandas
import os # importar modulo os

# definir ruta de carpeta de entrada para shapefile
input_folder_path = 'static/data/islas_malvinas/islas_malvinas/'
# definir nombre de archivo shapefile principal
shapefile_name = 'fk.shp'
# construir ruta completa a shapefile
shapefile_path = os.path.join(input_folder_path, shapefile_name)

# definir ruta de guardado para geojson de salida
output_geojson_path = 'static/data/islas_malvinas/islas_malvinas.geojson'

# mostrar mensaje de busqueda de shapefile
print(f"buscando shapefile en: {shapefile_path}")

# verificar si shapefile existe
if not os.path.exists(shapefile_path):
    # mostrar error si no se encuentra shapefile
    print(f"error: no se encontro el shapefile en la ruta especificada: {shapefile_path}")
    print("asegurar descargar y descomprimir el archivo .shp en la carpeta 'static/data/islas_malvinas/'.")
else:
    try:
        # leer shapefile con codificacion 'latin1'
        gdf_malvinas = gpd.read_file(shapefile_path, encoding='latin1')

        # inspeccionar columnas de geodataframe
        print("\ncolumnas del shapefile de malvinas:")
        print(gdf_malvinas.columns)
        # inspeccionar primeras filas de geodataframe
        print("\nprimeras filas del geodataframe de malvinas:")
        print(gdf_malvinas.head())

        # añadir o sobrescribir columna 'name'
        gdf_malvinas['name'] = 'islas malvinas'

        # exportar a geojson en utf-8
        gdf_malvinas.to_file(output_geojson_path, driver='GeoJSON', encoding='utf-8')

        # mostrar confirmacion de generacion de geojson
        print(f'\narchivo geojson de islas malvinas generado en: {output_geojson_path}')

    except Exception as e:
        # manejar errores durante el procesamiento
        print(f"ocurrio un error al procesar el shapefile: {e}")