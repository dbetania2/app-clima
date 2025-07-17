from flask import Flask, render_template
from dotenv import load_dotenv
from flask_cors import CORS

# Carga las variables de entorno desde el archivo .env.
# Esto permite acceder a configuraciones sensibles como las claves de API
# sin exponerlas directamente en el código fuente.
load_dotenv()

# Importa el Blueprint de las rutas relacionadas con el clima.
# Un Blueprint organiza un conjunto de rutas y otras funcionalidades
# de la aplicación en módulos reutilizables.
from weather_app.routes.weather import weather_bp

# Importa la configuración específica para el entorno de desarrollo.
# Esta clase contiene variables como la clave de la API de OpenWeather y URLs.
from config import DevelopmentConfig  # O la configuración que tengas (e.g., ProductionConfig)

# Inicializa la aplicación Flask.
# El argumento __name__ ayuda a Flask a determinar la raíz de la aplicación
# para localizar recursos como las plantillas y los archivos estáticos.
app = Flask(__name__)

# Carga la configuración de la aplicación desde el objeto DevelopmentConfig.
# Esto establece las variables de configuración (como DEBUG, API_KEY, etc.)
# para la instancia de la aplicación Flask.
app.config.from_object(DevelopmentConfig)

# Habilita Cross-Origin Resource Sharing (CORS) para la aplicación.
# Esto es necesario para permitir que solicitudes desde dominios diferentes
# (ej. tu frontend ejecutándose en un puerto diferente) puedan acceder a tu API.
CORS(app)

# Registra el Blueprint 'weather_bp' con la aplicación principal.
# Todas las rutas definidas dentro de 'weather_bp' ahora estarán disponibles
# en la aplicación Flask.
app.register_blueprint(weather_bp)

@app.route('/')
def index():
    """
    Define la ruta raíz ('/') de la aplicación.

    Cuando un usuario accede a la URL base, esta función renderiza
    la plantilla 'index.html'. Flask buscará esta plantilla
    en el directorio 'templates/' por defecto.

    Returns:
        str: El contenido HTML de la plantilla 'index.html'.
    """
    return render_template('index.html')  # Busca dentro de /templates

if __name__ == "__main__":
    # Este bloque asegura que el servidor de desarrollo de Flask solo se ejecute
    # cuando el script sea ejecutado directamente (no cuando sea importado como un módulo).
    # 'debug=True' habilita el modo de depuración, lo que proporciona recarga automática
    # y un depurador interactivo en el navegador para facilitar el desarrollo.
    app.run(debug=True)