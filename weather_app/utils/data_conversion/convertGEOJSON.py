import geopandas as gpd # importar libreria geopandas

# definir ruta a archivo shapefile
shapefile_path = 'static/data/argentina_provincias/ar.shp'

# leer shapefile sin especificar codificacion
# cargar con caracteres "garbled" para correccion posterior
gdf = gpd.read_file(shapefile_path)

# --- aplicar correccion manual de datos ---

# crear diccionario con nombres incorrectos y sus correcciones
# incluir provincias con tildes o 'ñ' que causan problemas de codificacion
replacements = {
    'CÃ³rdoba': 'Córdoba',      
    'Entre RÃ­os': 'Entre Ríos',    
    'NeuquÃ©n': 'Neuquén',     
    'RÃ­o Negro': 'Río Negro',    
    'TucumÃ¡n': 'Tucumán',      
    'Corrientes': 'Corrientes',     
    # 'otro nombre mal escrito': 'nombre correcto'
}

# usar metodo .replace() para corregir nombres de columnas
# .str.strip() para quitar espacios en blanco extra
gdf['name'] = gdf['name'].str.strip().replace(replacements, regex=False)

# (opcional) mostrar columnas y primeras filas despues de correccion
print("nombres despues de la correccion:")
print(gdf.head())

# exportar geodataframe limpio a geojson
geojson_path = 'static/data/argentina_provincias/argentina_provincias.geojson'
gdf.to_file(geojson_path, driver='GeoJSON', encoding='utf-8')

# mostrar confirmacion de generacion de archivo geojson
print(f'archivo geojson limpio generado en: {geojson_path}')
