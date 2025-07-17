# weather_app/exceptions/client_errors.py

from .base import APIError # importar clase base de error

class BadRequestError(APIError):
    """
    manejar solicitudes mal formadas o invalidas (codigo 400).
    """
    def __init__(self, message="solicitud incorrecta", payload=None):
        super().__init__(message, status_code=400, payload=payload) # llamar constructor padre

class UnauthorizedError(APIError):
    """
    manejar errores de autenticacion (codigo 401).
    """
    def __init__(self, message="no autorizado", payload=None):
        super().__init__(message, status_code=401, payload=payload) # llamar constructor padre

class ForbiddenError(APIError):
    """
    manejar acceso prohibido (codigo 403).
    """
    def __init__(self, message="acceso prohibido", payload=None):
        super().__init__(message, status_code=403, payload=payload) # llamar constructor padre

class NotFoundError(APIError):
    """
    manejar recursos no encontrados (codigo 404).
    """
    def __init__(self, message="recurso no encontrado", payload=None):
        super().__init__(message, status_code=404, payload=payload) # llamar constructor padre

class ConflictError(APIError):
    """
    manejar conflictos de recursos (codigo 409).
    """
    def __init__(self, message="conflicto de recurso", payload=None):
        super().__init__(message, status_code=409, payload=payload) # llamar constructor padre

class ValidationError(BadRequestError):
    """
    manejar errores de validacion de datos de entrada (codigo 400).
    heredar de badrequesterror ya que es un tipo especifico de solicitud incorrecta.
    """
    def __init__(self, message="error de validacion", errors=None):
        # 'errors' puede ser un diccionario con detalles de validacion por campo
        super().__init__(message, payload={"errors": errors} if errors else None) # llamar constructor padre