// static/js/utils/provinceUtils.js

// no importamos el json directamente aqui. lo cargaremos con fetch.

// se inicializara despues de cargar el json. contendra las ciudades agrupadas por provincia.
let cities_by_province = null;
// se inicializara despues de cargar el json. mapea nombres de provincias normalizados a sus nombres originales.
let normalized_provinces = {};
// se inicializara despues de cargar el json. mapea nombres de ciudades normalizados a sus provincias originales.
let city_to_province_map = {};


/**
 * quita tildes y pasa a minusculas para normalizar un string,
 * haciendo las comparaciones de nombres insensibles a mayusculas/minusculas y acentos.
 * @param {string} str - el string a normalizar.
 * @returns {string} el string normalizado.
 */
function normalizeName(str) {
    // asegura que la entrada sea un string para evitar errores.
    if (typeof str !== 'string') return '';
    // corrige: 'nfd' debe ser 'NFD' en mayusculas para la funcion normalize()
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * funcion de inicializacion asincrona para cargar los datos de las ciudades y provincias
 * desde un archivo json externo.
 * debe ser llamada una vez al inicio de la aplicacion (ej. en appinitializer.js).
 */
export async function initProvinceData() {
    try {
        // realiza una peticion http para obtener el archivo json con datos de ciudades por provincia.
        const response = await fetch('/static/data/cities_by_province.json');
        // verifica si la respuesta de la peticion fue exitosa.
        if (!response.ok) {
            // si no fue exitosa, lanza un error.
            throw new Error(`error al cargar datos de ciudades: ${response.statusText}`);
        }
        // parsea la respuesta json y la asigna a 'cities_by_province'.
        cities_by_province = await response.json();

        // construye 'normalized_provinces' y 'city_to_province_map' una vez que los datos esten cargados.
        for (const prov_name in cities_by_province) {
            // mapea el nombre normalizado de la provincia a su nombre original.
            normalized_provinces[normalizeName(prov_name)] = prov_name;

            // llena 'city_to_province_map' iterando sobre las ciudades de cada provincia.
            cities_by_province[prov_name].forEach(city => {
                // mapea el nombre normalizado de la ciudad al nombre original de su provincia.
                city_to_province_map[normalizeName(city.name)] = prov_name;
            });
        }

    } catch (error) {
        // en caso de error durante la carga o procesamiento, registra el error.
        console.error("error al inicializar datos de provincias:", error);
        // considera una estrategia para manejar errores criticos si los datos son indispensables.
    }
}


/**
 * devuelve el nombre original (canonico) de una provincia si el 'input_name'
 * (normalizado o no) coincide con una provincia existente.
 * @param {string} input_name - el nombre de la provincia a buscar (puede estar normalizado).
 * @returns {string|undefined} el nombre original de la provincia o 'undefined' si no se encuentra.
 */
export function getCanonicalProvince(input_name) {
    return normalized_provinces[normalizeName(input_name)];
}

/**
 * devuelve el nombre original de la provincia a la que pertenece una ciudad,
 * basandose en el mapa pre-construido.
 * @param {string} city_name - el nombre de la ciudad a buscar (puede estar normalizado).
 * @returns {string|undefined} el nombre original de la provincia o 'undefined' si la ciudad no se encuentra.
 */
export function getProvinceFromCity(city_name) {
    return city_to_province_map[normalizeName(city_name)];
}

/**
 * verifica si el nombre ingresado corresponde a una provincia valida.
 * @param {string} input_name - el nombre a verificar (provincia o ciudad).
 * @returns {boolean} 'true' si es una provincia valida, 'false' en caso contrario.
 */
export function isValidProvince(input_name) {
    // utiliza 'getCanonicalProvince' para determinar la validez.
    return !!getCanonicalProvince(input_name);
}

/**
 * devuelve la ciudad marcada como "default" dentro de una provincia,
 * o la primera ciudad de la lista si no hay una por defecto.
 * @param {string} province_name - el nombre original (canonico) de la provincia.
 * @returns {string|null} el nombre de la ciudad por defecto o 'null' si la provincia no tiene ciudades.
 */
export function getDefaultCityForProvince(province_name) {
    // verifica que los datos de las ciudades esten cargados.
    if (!cities_by_province) {
        console.error("datos de ciudades no cargados. llama a initProvinceData primero.");
        return null;
    }
    const cities = cities_by_province[province_name];
    // si no hay ciudades para la provincia o la lista esta vacia, devuelve null.
    if (!cities || cities.length === 0) return null;

    // busca una ciudad con la propiedad 'default' en 'true'.
    const def = cities.find(c => c.default);
    // devuelve el nombre de la ciudad por defecto, o el nombre de la primera ciudad si no hay 'default'.
    return def?.name || cities[0].name;
}

/**
 * devuelve la lista completa de ciudades para una provincia especifica.
 * @param {string} province_name - el nombre original (canonico) de la provincia.
 * @returns {array<object>} un array de objetos de ciudad. devuelve un array vacio si la provincia no existe.
 */
export function getCitiesForProvince(province_name) {
    // verifica que los datos de las ciudades esten cargados.
    if (!cities_by_province) {
        console.error("datos de ciudades no cargados. llama a initProvinceData primero.");
        return [];
    }
    // devuelve la lista de ciudades para la provincia o un array vacio si no se encuentra.
    return cities_by_province[province_name] || [];
}