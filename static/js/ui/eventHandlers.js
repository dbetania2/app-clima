// static/js/ui/eventHandlers.js

// importa las funciones de utilidad de datos para manejar provincias y ciudades.
// las rutas se mantienen exactamente como se proporcionaron.
import {
    getCanonicalProvince, getDefaultCityForProvince, getProvinceFromCity
} from '../../data/provinceUtils.js';

// importa la funcion principal 'searchAndRender' del core de la aplicacion.
import { searchAndRender } from '../core/weatherCore.js';
// importa la funcion 'showError' para mostrar mensajes de error en la ui.
import { showError } from './domRenderer.js';

/**
 * configura el event listener para el boton de busqueda manual.
 * al hacer clic, valida la entrada y dispara la busqueda del clima.
 *
 * @param {htmlelement} city_input - el elemento input donde el usuario ingresa la ciudad o provincia.
 * @param {htmlelement} search_btn - el boton que activa la busqueda.
 */
export function setupSearchButton(city_input, search_btn) {
    search_btn.addEventListener('click', async () => {
        const input = city_input.value.trim(); // obtiene el valor del input y elimina espacios.
        if (!input) {
            // si el input esta vacio, muestra un error y detiene la ejecucion.
            showError('por favor, ingresa una ciudad o provincia');
            return;
        }

        let province_to_pass = null; // variable para almacenar el nombre de la provincia a pasar.
        let city_to_search = input;   // variable para almacenar la ciudad a buscar por la api.

        // intenta obtener el nombre canonico de una provincia si el input coincide.
        const canonical_province_from_input = getCanonicalProvince(input);
        if (canonical_province_from_input) {
            // si el input es una provincia, se usa esa provincia y se obtiene su ciudad por defecto.
            province_to_pass = canonical_province_from_input;
            city_to_search = getDefaultCityForProvince(province_to_pass);
        } else {
            // si el input no es una provincia, intenta ver si es una ciudad y a que provincia pertenece.
            const province_from_city = getProvinceFromCity(input);
            if (province_from_city) {
                // si la ciudad pertenece a una provincia, se asocia la provincia.
                province_to_pass = province_from_city;
            }
        }
        // llama a la funcion principal para buscar y renderizar el clima.
        await searchAndRender(city_to_search, province_to_pass);
    });
}

/**
 * configura el event listener para el boton de reinicio de la aplicacion.
 * al hacer clic, resetea la interfaz de usuario a su estado inicial.
 *
 * @param {htmlelement} reset_app_btn - el boton de reinicio.
 * @param {object} ui_elements - objeto con referencias a elementos clave de la ui
 * (welcomeSection, dashboardPanel, weatherResult, cityInput).
 * @param {object} destroy_chart_functions - objeto con funciones para destruir los graficos
 * (ej. destroyTempChart, destroyRainChart, destroySummaryChart).
 */
export function setupResetButton(reset_app_btn, ui_elements, destroy_chart_functions) {
    if (reset_app_btn) {
        reset_app_btn.addEventListener('click', () => {
            // oculta/muestra secciones de la ui para volver al estado de bienvenida.
            ui_elements.welcomeSection.classList.remove("hidden");
            ui_elements.dashboardPanel.classList.add("hidden");
            ui_elements.weatherResult.classList.add("hidden");
            ui_elements.cityInput.value = ''; // limpia el campo de busqueda.

            // llama a las funciones de destruccion de graficos pasadas por parametro
            // para limpiar recursos y evitar renderizados duplicados.
            destroy_chart_functions.destroyTempChart();
            destroy_chart_functions.destroyRainChart();
            destroy_chart_functions.destroySummaryChart();
            // logica opcional para resetear el mapa (si fuera necesario, aqui la invocarias)
        });
    }
}

/**
 * configura el event listener para el boton de alternar modo oscuro/claro (tema).
 * cambia la clase 'dark' en el elemento html y actualiza el texto del boton.
 *
 * @param {htmlelement} toggle_btn - el boton de alternar tema (ej. con un sol/luna).
 */
export function setupThemeToggle(toggle_btn) {
    if (toggle_btn) {
        // establece el texto inicial del boton segun el tema actual del documento.
        toggle_btn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
        toggle_btn.addEventListener('click', () => {
            // alterna la clase 'dark' en el elemento <html>.
            const is_dark = document.documentElement.classList.toggle('dark');
            // actualiza el texto del boton al emoji correspondiente al tema.
            toggle_btn.textContent = is_dark ? '☀️' : '🌙';
            // guarda la preferencia del tema en el almacenamiento local del navegador.
            localStorage.setItem('theme', is_dark ? 'dark' : 'light');
        });
    }
}

/**
 * crea y devuelve un callback para la interaccion con el mapa.
 * este callback rellena el input de la ciudad y simula un clic en el boton de busqueda
 * con el nombre de la provincia seleccionada en el mapa.
 *
 * @param {htmlelement} city_input - el elemento input de la ciudad.
 * @param {htmlelement} search_btn - el boton de busqueda.
 * @returns {function(string): Promise<void>} el callback que sera usado por
 * `initializeMap` y `addMalvinasLayer`.
 */
export function createMapInteractionCallback(city_input, search_btn) {
    return async (province_name) => {
        city_input.value = province_name; // rellena el input del buscador con el nombre de la provincia.
        search_btn.click(); // simula un clic en el boton de busqueda para iniciar la accion.
    };
}