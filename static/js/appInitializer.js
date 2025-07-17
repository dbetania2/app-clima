// static/js/appInitializer.js

// importa funciones relacionadas con la inicializacion del mapa y la capa de malvinas.
import { initializeMap } from './map/mapHandler.js';
import { addMalvinasLayer } from './map/malvinasMap.js';
// importa la funcion para cargar los datos iniciales de provincias.
import { initProvinceData } from '../data/provinceUtils.js';

// importa las funciones para configurar los diversos event listeners de la ui.
import {
    setupSearchButton,
    setupResetButton,
    setupThemeToggle,
    createMapInteractionCallback
} from './ui/eventHandlers.js';

// importa las funciones para destruir graficos, necesarias para el boton de reinicio.
import {
    destroyTempChart,
    destroyRainChart,
    destroySummaryChart
} from './charts/charts.js';


// =========================================================
// funcion principal de inicializacion de la aplicacion
// =========================================================

/**
 * funcion principal asincrona para inicializar toda la aplicacion.
 * se encarga de:
 * 1. obtener referencias a los elementos clave del dom.
 * 2. cargar los datos iniciales de las provincias.
 * 3. inicializar el mapa y añadir capas interactivas.
 * 4. configurar todos los event listeners necesarios para la interfaz de usuario.
 */
export async function initApp() {
    // 1. obtener referencias a elementos del dom
    // se obtienen las referencias a los elementos html una sola vez al inicio.
    const city_input        = document.getElementById('cityInput');
    const search_btn        = document.getElementById('getWeatherBtn');
    const toggle_btn        = document.getElementById('toggleDark');
    const welcome_section   = document.getElementById("welcomeSection");
    const dashboard_panel   = document.getElementById("dashboardPanel");
    const weather_result    = document.getElementById("weatherResult");
    const reset_app_btn     = document.getElementById('resetAppBtn');

    // objeto para agrupar elementos de la ui, facilitando su paso a otras funciones.
    const ui_elements = {
        welcomeSection: welcome_section,
        dashboardPanel: dashboard_panel,
        weatherResult: weather_result,
        cityInput: city_input
    };
    // objeto para agrupar las funciones de destruccion de graficos, pasadas al boton de reinicio.
    const chart_destroys = {
        destroyTempChart: destroyTempChart,
        destroyRainChart: destroyRainChart,
        destroySummaryChart: destroySummaryChart
    };

    // 2. cargar datos iniciales
    // espera a que los datos de provincias se carguen antes de inicializar el mapa,
    // ya que el mapa podria depender de estos datos (ej. para obtener ciudades por defecto).
    await initProvinceData();

    // 3. inicializar mapa y capa de malvinas
    // crea el callback que sera invocado por las interacciones del mapa.
    // este callback simula un clic en el boton de busqueda con el nombre de la provincia/malvinas.
    const map_interaction_callback = createMapInteractionCallback(city_input, search_btn);
    // inicializa el mapa de leaflet, pasandole el callback para la interaccion con provincias.
    initializeMap(map_interaction_callback);
    // añade la capa especifica de las islas malvinas, usando el mismo callback.
    addMalvinasLayer(map_interaction_callback);

    // 4. configurar event listeners usando las funciones modulares
    // se delega la configuracion de los eventos a funciones especificas de 'eventHandlers.js'.
    setupSearchButton(city_input, search_btn); // configura el boton de busqueda.
    // configura el boton de reinicio, pasandole las referencias a los elementos de la ui
    // y las funciones para destruir los graficos.
    setupResetButton(reset_app_btn, ui_elements, chart_destroys);
    setupThemeToggle(toggle_btn); // configura el boton de alternar modo oscuro/claro.

}