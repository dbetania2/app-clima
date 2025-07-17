// static/js/utilsjs/errorHandler.js

export function handleApiError(response, fallbackMessage = 'Error en la respuesta de la API') {
  if (!response.ok) {
    return response.json().then(json => {
      throw new Error(json.error || fallbackMessage);
    });
  }
  return response.json();
}

export function handleRequestError(error, contextMessage = 'Error en solicitud fetch') {
  console.error(`${contextMessage}:`, error);
  throw new Error(`${contextMessage}: ${error.message}`);
}
