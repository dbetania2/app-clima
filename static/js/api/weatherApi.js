// la url base para la api.
import { handleApiError, handleRequestError } from "../utilsjs/errorHandler.js";
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
export async function fetchWeather(ciudad) {
    try {
        // construir url completa para la solicitud
        // 'encodeuricomponent' asegura manejo correcto de caracteres especiales en url
        const res = await fetch(`${api_base_url}/weather?city=${encodeURIComponent(ciudad)}`);
        
        // manejar respuesta de api, lanzara error si no es ok
        const json = await handleApiError(res, 'error desconocido al obtener datos del clima');
        
        // devolver datos json si la respuesta fue exitosa
        return json;
    } catch (err) {
        // manejar errores de solicitud de red
        handleRequestError(err, 'error al obtener datos del clima');
        // el error es relanzado por handleRequestError, asi que esta funcion no devuelve nada aqui
    }
}