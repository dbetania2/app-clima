// static/js/ui/domrenderer.js

// referencias a elementos del dom para la seccion principal de resultados del clima.
const weather_result          = document.getElementById('weatherResult');
const city_name_span          = document.getElementById('cityName');
const current_temp            = document.getElementById('currentTemp');
const current_desc            = document.getElementById('currentDescription');
const current_icon            = document.getElementById('currentIcon');
const weekly_box              = document.getElementById('weeklyForecast');
const error_div               = document.getElementById('errorMessage');

// referencias a elementos del dom para el desplegable de seleccion de ciudades.
const city_dropdown_container = document.getElementById('cityDropdownContainer');
const city_selector           = document.getElementById('citySelector');
const selected_province_name  = document.getElementById('selectedProvinceName');


/**
 * muestra un mensaje de error en la interfaz de usuario.
 * @param {string} msg - el mensaje de error a mostrar.
 */
export function showError(msg){
    error_div.textContent = msg;
    error_div.classList.remove('hidden'); // hace visible el mensaje de error.
}

/**
 * oculta el contenedor del mensaje de error.
 */
export function hideError(){
    error_div.classList.add('hidden'); // oculta el mensaje de error.
}

/**
 * oculta el contenedor principal de resultados del clima y el desplegable de ciudades.
 * tambien limpia las opciones del selector de ciudades.
 */
export function hideResult(){
    weather_result.classList.add('hidden'); // oculta el contenedor principal de resultados.
    city_dropdown_container.classList.add('hidden'); // oculta el contenedor del desplegable.
    city_selector.innerHTML = ''; // limpia las opciones del desplegable para la proxima vez.
}

/**
 * rellena los elementos del dom con los datos del clima actual.
 * @param {object} data - objeto con los datos del clima actual.
 * @param {string} data.city - el nombre de la ciudad.
 * @param {object} data.current_weather - objeto con los datos del clima actual.
 * @param {number} data.current_weather.temp - la temperatura actual.
 * @param {string} data.current_weather.description - la descripcion del clima.
 * @param {string} data.current_weather.icon - el codigo del icono del clima.
 */
export function fillCurrent(data){
    city_name_span.textContent  = data.city;
    current_temp.textContent    = data.current_weather.temp;
    current_desc.textContent    = data.current_weather.description;
    // construye la url del icono del clima usando el codigo proporcionado.
    current_icon.src            = `http://openweathermap.org/img/wn/${data.current_weather.icon}@2x.png`;
}

/**
 * rellena el contenedor del pronostico semanal con los datos de cada dia.
 *
 * itera sobre la lista de pronosticos, crea un elemento html para cada dia
 * y lo añade al contenedor del pronostico semanal. al finalizar, muestra el
 * contenedor de resultados.
 *
 * @param {array<object>} list - lista de objetos con el pronostico de cada dia.
 * cada objeto debe contener: date, icon, description, temp_min, temp_max.
 */
export function fillWeekly(list){
    weekly_box.innerHTML = ''; // limpia cualquier pronostico semanal anterior.
    list.forEach(day => {
        const div = document.createElement('div');
        div.className = 'day-forecast'; // asigna una clase para estilos.
        // construye el html para cada dia del pronostico.
        div.innerHTML = `
            <p>${new Date(day.date).toLocaleDateString('es-es',
                { weekday:'short', day:'numeric', month:'short' })}</p>
            <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
            <p>${day.description}</p>
            <p>min: ${day.temp_min.toFixed(1)}°c</p>
            <p>max: ${day.temp_max.toFixed(1)}°c</p>`;
        weekly_box.appendChild(div); // añade el elemento del dia al contenedor semanal.
    });
    // weather_result.classList.remove('hidden'); // esta linea se repite, ya se muestra en 'search_and_render'.
}

/**
 * rellena el desplegable de ciudades con las opciones proporcionadas.
 * permite seleccionar una ciudad por defecto.
 *
 * @param {array<object>} cities - un array de objetos de ciudad, cada uno con una propiedad 'name'.
 * @param {string} current_province - el nombre de la provincia actual.
 * @param {function(string): void} on_city_select - callback a ejecutar cuando se selecciona una ciudad.
 * @param {string} [default_city_name] - nombre de la ciudad que debe estar seleccionada por defecto.
 */
export function populateCityDropdown(cities, current_province, on_city_select, default_city_name) {
    city_selector.innerHTML = ''; // limpia opciones anteriores del desplegable.
    selected_province_name.textContent = current_province; // muestra el nombre de la provincia en el label.

    // añade la opcion por defecto (placeholder) al inicio del desplegable.
    const default_option = document.createElement('option');
    default_option.value = '';
    default_option.textContent = `selecciona otra ciudad de ${current_province}`;
    default_option.disabled = true; // no se puede seleccionar.
    default_option.selected = true; // aparece seleccionada por defecto.
    city_selector.appendChild(default_option);

    // ordena las ciudades alfabeticamente por nombre para una mejor experiencia de usuario.
    const sorted_cities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

    sorted_cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        // selecciona la ciudad que esta actualmente en el panel o la marcada como 'default' en los datos.
        if (city.name === default_city_name || (city.default && !default_city_name)) {
            option.selected = true;
        }
        city_selector.appendChild(option);
    });

    // adjunta el evento 'change' al select para manejar la seleccion de ciudades.
    // es importante que sea 'onchange' directamente y no un addEventListener en un bucle
    // para evitar multiples listeners adjuntados.
    city_selector.onchange = (event) => {
        on_city_select(event.target.value);
    };

    city_dropdown_container.classList.remove('hidden'); // hace visible el contenedor del desplegable.
}

/**
 * oculta el desplegable de ciudades y limpia sus opciones.
 */
export function hideCityDropdown() {
    city_dropdown_container.classList.add('hidden'); // oculta el contenedor.
    city_selector.innerHTML = ''; // limpia las opciones del desplegable.
}