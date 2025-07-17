# weather_app/exceptions/server_errors.py

from .base import APIError # importar clase base de error

class InternalServerError(APIError):
    """
    manejar errores internos del servidor (codigo 500).
    """
    def __init__(self, message="error interno del servidor", payload=None):
        super().__init__(message, status_code=500, payload=payload) # llamar constructor padre

class ServiceUnavailableError(APIError):
    """
    manejar servicio no disponible (codigo 503).
    """
    def __init__(self, message="servicio no disponible", payload=None):
        super().__init__(message, status_code=503, payload=payload) # llamar constructor padre

class GatewayTimeoutError(APIError):
    """
    manejar tiempo de espera de gateway (codigo 504).
    """
    def __init__(self, message="tiempo de espera de gateway", payload=None):
        super().__init__(message, status_code=504, payload=payload) # llamar constructor padre