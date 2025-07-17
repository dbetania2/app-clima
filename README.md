# Aplicación del clima 🌦️

una aplicación web interactiva para consultar el clima actual y el pronóstico semanal de ciudades en argentina, complementada con un mapa interactivo y visualizaciones de datos.

## ✨ Características

* **clima actual y pronóstico semanal**: Obtén información detallada del tiempo para los próximos 7 días.
* **búsqueda flexible**: Busca el clima por nombre de ciudad o provincia.
* **mapa interactivo de argentina**:
    * Visualiza las provincias y las Islas Malvinas.
    * Haz clic en una provincia para ver el clima de su ciudad por defecto y explorar otras ciudades de esa provincia.
* **desplegable de ciudades**: Selecciona fácilmente otras ciudades dentro de una provincia.
* **visualizaciones de datos**:
    * Gráfico de líneas para temperaturas máximas y mínimas semanales.
    * Gráfico de barras para el volumen de lluvia pronosticado.
    * Gráfico de torta con el resumen de las condiciones climáticas (ej. "cielo claro", "lluvia").
* **modo oscuro/claro**: Alterna el tema de la interfaz para una mejor experiencia visual.

## 💻 tecnologías utilizadas

esta aplicación se construye con una arquitectura cliente-servidor:

### backend (servidor)

* **python**: Lenguaje de programación principal.
* **flask**: Microframework web para construir la API y servir los archivos frontend.
* **flask-cors**: Gestiona las políticas de seguridad para permitir la comunicación entre frontend y backend.
* **python-dotenv**: Para cargar variables de entorno (ej. claves de API) de forma segura.
* **geopandas**: Utilizado para el preprocesamiento de los datos geográficos (conversión de Shapefiles a GeoJSON).

### frontend (cliente)

* **html**: Estructura de la interfaz de usuario.
* **css**: Estilos visuales de la aplicación.
* **javascript**: Lógica interactiva del lado del cliente.
* **leaflet.js**: Librería para crear el mapa interactivo.
* **chart.js**: Librería para generar los gráficos de datos.

## 🚀 Instalación y uso

sigue estos pasos para poner en marcha la aplicación en tu entorno local:

1.  **clonar el repositorio**:
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    cd tu-repositorio
    ```

2.  **configurar el entorno python (backend)**:
    * Crea un entorno virtual (recomendado):
        ```bash
        python -m venv venv
        ```
    * Activa el entorno virtual:
        * Windows: `.\venv\Scripts\activate`
        * Para otros sistemas operativos, consulta la documentación de Python para activar entornos virtuales.

    * Instala las dependencias de Python:
        ```bash
        pip install -r requirements.txt
        ```

3.  **configurar variables de entorno**:
    * Crea un archivo llamado `.env` en la raíz de tu proyecto.
    * Dentro de `.env`, añade tu clave de API de OpenWeatherMap:
        ```
        OPENWEATHER_API_KEY=tu_clave_de_api_aqui
        ```
        (Reemplaza `tu_clave_de_api_aqui` con tu clave real).

4.  **ejecutar el backend**:
    * Desde la raíz del proyecto y con el entorno virtual activado, ejecuta la aplicación Flask:
        ```bash
        py run.py
        ```
    * El servidor se iniciará típicamente en `http://127.0.0.1:5000`.

5.  **acceder a la aplicación (frontend)**:
    * Abre tu navegador web y visita `http://127.0.0.1:5000`.
    * La aplicación cargará y estará lista para usar.

## 🗺️ Datos geográficos

los archivos GeoJSON (`argentina_provincias.geojson` e `islas_malvinas.geojson`) utilizados para renderizar el mapa ya están incluidos en el repositorio (`static/data/`). estos archivos fueron preprocesados a partir de Shapefiles originales utilizando scripts Python dedicados para asegurar la correcta codificación y formato.

## 📁 estructura del proyecto (principales)

* `run.py`: Archivo principal de la aplicación Flask que inicia el servidor.
* `config.py`: Gestiona la configuración de la aplicación para diferentes entornos.
* `weather_app/`: Contiene la lógica del backend (ej. rutas de la API).
* `static/`:
    * `css/`: Hojas de estilo.
    * `js/`: Código JavaScript del frontend (organizado en subcarpetas como `api`, `charts`, `core`, `map`, `ui`, `utils`).
    * `data/`: Archivos GeoJSON y otros datos estáticos consumidos por el frontend.
* `templates/`: Plantillas HTML (ej. `index.html`).
* `.env`: (No incluido en Git) Archivo para variables de entorno sensibles.

---