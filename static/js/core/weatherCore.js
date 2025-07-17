// static/js/core/weathercore.js

// =========================================================
// importaciones de modulos (rutas desde `static/js/core/`)
// =========================================================

// importa la funcion 'fetchWeather' para realizar llamadas a la api del clima.
import { fetchWeather } from '../api/weatherApi.js'; // sube un nivel a `js`, luego entra a `api`

// importa funciones de 'domRenderer' para manipular la interfaz de usuario.
// estas incluyen mostrar/ocultar errores y resultados, y rellenar informacion.
import {
    showError, hideError, hideResult,
    fillCurrent, fillWeekly,
    populateCityDropdown, hideCityDropdown
} from '../ui/domRenderer.js'; // sube un nivel a `js`, luego entra a `ui`

// importa las funciones para renderizar y destruir los graficos de chart.js.
import {
    renderTempChart, destroyTempChart,
    drawRainChart, destroyRainChart,
    renderSummaryChart, destroySummaryChart
} from '../charts/charts.js'; // sube un nivel a `js`, luego entra a `charts`

// importa la funcion 'getCitiesForProvince' para obtener ciudades asociadas a una provincia.
import { getCitiesForProvince } from '../../data/provinceUtils.js'; // sube un nivel a `js`, luego a `data`

// importa la instancia del mapa de argentina para interacciones relacionadas con el mapa.
import { argentinaMap } from '../map/mapHandler.js'; // sube un nivel a `js`, luego entra a `map`

// variable para guardar la provincia actualmente seleccionada.
// esta variable es interna del modulo y es utilizada por 'search_and_render'
// y 'handle_city_selection'.
let current_selected_province = null;

// =========================================================
// funciones de logica principal del clima
// =========================================================

/**
 * maneja el evento de seleccion de una ciudad en el desplegable.
 * inicia una nueva busqueda del clima para la ciudad seleccionada,
 * usando la provincia que estaba previamente en el contexto.
 * @param {string} selected_city - el nombre de la ciudad seleccionada en el desplegable.
 */
function handle_city_selection(selected_city) {
    // procede con la busqueda solo si se ha seleccionado una ciudad.
    if (selected_city) {
        // 'search_and_render' es una funcion exportada de este mismo modulo,
        // se llama para iniciar el proceso de busqueda y renderizado.
        search_and_render(selected_city, current_selected_province);
    }
}

/**
 * realiza la busqueda del clima para una ciudad y renderiza los resultados en la interfaz.
 * tambien gestiona la carga y visualizacion de ciudades adicionales si la busqueda
 * esta relacionada con una provincia especifica.
 *
 * @param {string} ciudad - el nombre de la ciudad a buscar.
 * @param {string|null} [nombre_provincia=null] - el nombre de la provincia asociada.
 * puede ser nulo si la busqueda no proviene
 * de una seleccion de provincia o deteccion.
 */
export async function searchAndRender(ciudad, nombre_provincia = null) {
    // oculta cualquier mensaje de error previo.
    hideError();
    // oculta la seccion de resultados actual antes de cargar nuevos datos.
    hideResult();

    try {
        // realiza la llamada a la api para obtener los datos del clima de la ciudad.
        const data = await fetchWeather(ciudad);

        /* panel izquierdo: rellena la informacion del clima actual y el pronostico semanal */
        // actualiza la interfaz con la informacion del clima actual.
        fillCurrent(data);
        // actualiza la interfaz con el pronostico semanal.
        fillWeekly(data.weekly_forecast);

        /* mostrar paneles: hace visibles las secciones de resultados y el dashboard */
        // estas manipulaciones directas del dom son especificas de la logica de mostrar resultados
        // y por lo tanto, se quedan aqui.
        document.getElementById('welcomeSection').classList.add('hidden'); // oculta la seccion de bienvenida.
        document.getElementById('dashboardPanel').classList.remove('hidden'); // muestra el panel del dashboard.
        document.getElementById('weatherResult').classList.remove('hidden'); // muestra el panel de resultados del clima.

        // recalcular el tamaño del mapa despues de que el dashboard se haga visible.
        // esto es necesario si el mapa leaflet esta dentro de un contenedor inicialmente oculto,
        // ya que su tamaño podria no calcularse correctamente hasta que el contenedor sea visible.
        if (argentinaMap) {
            setTimeout(() => {
                argentinaMap.invalidateSize();
            }, 0);
        }

        /* graficos: destruye los graficos anteriores y renderiza los nuevos con los datos actualizados */
        // destruye las instancias de graficos previos para evitar fugas de memoria o superposicion.
        destroyTempChart();
        destroyRainChart();
        destroySummaryChart();
        // renderiza los nuevos graficos con los datos del pronostico.
        renderTempChart(data.weekly_forecast);
        drawRainChart(data); // 'drawRainChart' espera el objeto 'data' completo.
        renderSummaryChart(data);

        // logica para el desplegable de ciudades basada en la seleccion de provincia o deteccion.
        if (nombre_provincia) {
            // actualiza la variable de la provincia seleccionada actualmente.
            current_selected_province = nombre_provincia;
            // obtiene la lista de ciudades para la provincia.
            const cities = getCitiesForProvince(nombre_provincia);
            // llena el desplegable de ciudades y le asigna el manejador de seleccion.
            populateCityDropdown(cities, nombre_provincia, handle_city_selection, ciudad);
        } else {
            // si no hay provincia especifica, oculta el desplegable de ciudades.
            hideCityDropdown();
        }

    } catch (err) {
        // en caso de error durante la busqueda o renderizado, muestra un mensaje de error.
        showError(err.message || 'error al obtener el clima.');
        // tambien oculta el desplegable de ciudades si hubo un error.
        hideCityDropdown();
    }
}
