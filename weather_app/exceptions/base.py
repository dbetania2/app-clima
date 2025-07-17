# weather_app/exceptions/base.py

class APIError(Exception):
    """
    clase base para todas las excepciones personalizadas de la api.

    atributos:
        message (str): mensaje descriptivo del error.
        status_code (int): codigo de estado http asociado al error (ej. 400, 500).
        payload (dict, optional): datos adicionales para el error.
    """
    def __init__(self, message, status_code=500, payload=None):
        super().__init__(message) # llamar al constructor de la clase base exception
        self.message = message # asignar mensaje del error
        self.status_code = status_code # asignar codigo de estado http
        self.payload = payload # asignar datos adicionales
