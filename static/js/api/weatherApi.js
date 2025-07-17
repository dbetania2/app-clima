// la url base para la api.

const api_base_url = 'http://127.0.0.1:5000';//se ajusta en prod

/**
 * obtiene el clima actual y el pronostico de 7 dias para una ciudad especifica
 * desde la api.
 * @param {string} ciudad - el nombre de la ciudad para la cual obtener los datos del clima.
 * @returns {promise<object>} - una promesa que se resuelve a un objeto que contiene los datos del clima.
 * el objeto resultante tipicamente tendra las propiedades:
 * { ciudad, clima_actual, pronostico_semanal }.
 * @throws {error} - lanza un error si la solicitud a la api falla o si la respuesta
 * del servidor no es exitosa (status http no 'ok').
 */
export async function fetchWeather(ciudad){
  // construye la url completa para la solicitud, incluyendo la ciudad codificada para la url.
  // 'encodeuricomponent' asegura que caracteres especiales en el nombre de la ciudad
  // sean correctamente manejados en la url.
  const res = await fetch(`${api_base_url}/weather?city=${encodeURIComponent(ciudad)}`);
  
  // parsea la respuesta de la api como json.
  const json = await res.json();
  
  // si 'res.ok' es falso, significa que hubo un error en la peticion 
  if (!res.ok) {
    // lanza un error con el mensaje proporcionado por la api (si existe) o un mensaje generico.
    throw new Error(json.error || 'error desconocido al obtener datos del clima');
  }

  // si la respuesta fue exitosa, devuelve los datos json obtenidos.
  // estos datos contendran la informacion del clima solicitada.
  return json; 
}