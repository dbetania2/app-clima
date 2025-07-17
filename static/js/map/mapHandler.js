// static/js/map/mapHandler.js

// exporta la instancia del mapa de leaflet para que sea accesible desde otros modulos.
export let argentinaMap;
// exporta la capa geojson de las provincias para que pueda ser manipulada externamente.
export let provincesLayer;
// variable interna para guardar la capa de la provincia que esta actualmente seleccionada
// en el mapa, permitiendo controlar su estilo.
let selected_province_layer = null;

/**
 * inicializa el mapa de argentina utilizando la libreria leaflet.
 * configura los limites, el zoom inicial y las capas base.
 * carga y renderiza las provincias de argentina a partir de un archivo geojson,
 * aplicando estilos interactivos (normal, resaltado y seleccionado).
 *
 * @param {function(string): void} on_province_click - una funcion de callback
 * que se ejecuta cuando se hace clic en una provincia.
 * recibe el nombre 'limpio' de la provincia como argumento.
 */
export function initializeMap(on_province_click) {
    // evita que el mapa se inicialice mas de una vez si ya existe una instancia.
    if (argentinaMap) return;

    /* 1) configuracion general del mapa */
    // define los limites geograficos maximos del mapa (sudoeste / nordeste).
    const bounds = [[-56, -76], [-21, -52]];

    // inicializa el mapa de leaflet en el elemento html con id 'map'.
    argentinaMap = L.map('map', {
        maxBounds: bounds, // establece los limites maximos de vision del mapa.
        maxBoundsViscosity: 1, // hace que el usuario no pueda arrastrar el mapa fuera de los limites.
        minZoom: 5, // zoom minimo permitido.
        maxZoom: 8, // zoom maximo permitido.
        zoomSnap: 0.25 // controla el incremento del zoom al usar la rueda del raton.
    }).setView([-38.4161, -63.6167], 5); // establece la vista inicial del mapa (coordenadas y zoom).

    /* capa base openstreetmap */
    // añade una capa de mosaicos (tiles) de openstreetmap al mapa.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // zoom maximo para esta capa de mosaicos.
        attribution: '&copy; openstreetmap' // atribucion legal requerida.
    }).addTo(argentinaMap);

    /* argar geojson de provincias */
    // realiza una peticion para obtener el archivo geojson que contiene los limites de las provincias.
    fetch('/static/data/argentina_provincias/argentina_provincias.geojson')
        .then(res => {
            // verifica si la respuesta es ok (status 200-299).
            if (!res.ok) {
                throw new Error(`error al cargar el geojson de provincias: ${res.statusText}`);
            }
            // parsea la respuesta como json.
            return res.json();
        })
        .then(data => {
            // crea una nueva capa geojson de leaflet con los datos de las provincias.
            provincesLayer = L.geoJSON(data, {
                style: base_style, // aplica el estilo base a todas las provincias inicialmente.
                onEachFeature(feature, layer) {
                    // obtiene el nombre de la provincia del geojson o usa 'provincia' por defecto.
                    const prov_name = feature.properties?.name || 'provincia';
                    // limpia el nombre de la provincia (ej. elimina acentos) para usarlo en la logica.
                    // corrige: 'nfd' debe ser 'NFD' en mayusculas
                    const clean_prov_name = prov_name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");

                    // vincula un tooltip a cada capa de provincia que muestra su nombre al pasar el raton.
                    layer.bindTooltip(prov_name);

                    // define los eventos de interaccion para cada capa de provincia.
                    layer.on({
                        mouseover(e) {
                            // solo aplica el estilo de resaltado si la capa no esta actualmente seleccionada.
                            if (e.target !== selected_province_layer) {
                                e.target.setStyle(highlight_style);
                            }
                        },
                        mouseout(e) {
                            // solo resetea el estilo si la capa no esta actualmente seleccionada.
                            if (e.target !== selected_province_layer) {
                                // 'provinceslayer.resetstyle' es la forma correcta de volver al estilo base.
                                provincesLayer.resetStyle(e.target);
                            }
                        },
                        click() {
                            //si ya hay una provincia seleccionada, resetea su estilo a 'base_style'.
                            if (selected_province_layer) {
                                provincesLayer.resetStyle(selected_province_layer);
                            }
                            // establece la capa clickeada como la nueva provincia seleccionada.
                            selected_province_layer = layer;
                            // aplica el estilo de seleccion a la nueva capa seleccionada.
                            layer.setStyle(selected_style);

                            // llama al callback 'on_province_click' pasando el nombre limpio de la provincia.
                            on_province_click?.(clean_prov_name);
                        }
                    });
                }
            }).addTo(argentinaMap); // añade la capa de provincias al mapa.
        })
        // captura y registra cualquier error que ocurra durante la carga del geojson.
        .catch(err => console.error('error cargando geojson de provincias:', err));
}

/* --- estilos de provincias --- */
// estilo base para las provincias cuando no estan interactuando.
const base_style = {
    fillColor: '#ffffff', // color de relleno blanco.
    weight: 1.5, // grosor del borde.
    color: '#666', // color del borde.
    fillOpacity: 0.5, // opacidad del relleno.
    outline: 'none' // elimina el contorno por defecto.
};
// estilo de resaltado al pasar el raton por encima de una provincia.
const highlight_style = {
    fillColor: '#4bc0c0', // color de resaltado (azul verdoso).
    weight: 2, // grosor del borde ligeramente mayor.
    color: '#339999', // color del borde mas oscuro.
    fillOpacity: 0.75, // mayor opacidad del relleno.
    outline: 'none' // elimina el contorno por defecto.
};
// nuevo estilo para la provincia que ha sido seleccionada con un click.
const selected_style = {
    fillColor: '#007bff', // un azul distintivo para la seleccion.
    weight: 2.5, // un borde mas grueso.
    color: '#0056b3', // un borde mas oscuro.
    fillOpacity: 0.85, // opacidad de relleno mas alta.
    outline: 'none' // elimina el contorno por defecto.
};

/**
 * destruye el mapa de argentina y libera todos los recursos asociados.
 * esto es util para limpiar el estado de la aplicacion al salir de la vista del mapa
 * o al recargar la pagina, evitando posibles fugas de memoria.
 */
export function destroyMap() {
    if (argentinaMap) {
        argentinaMap.remove(); // remueve el mapa del dom y limpia eventos de leaflet.
        argentinaMap = null; // resetea la instancia del mapa a null.
        provincesLayer = null; // resetea la capa de provincias a null.
        selected_province_layer = null; // tambien resetea la capa seleccionada.
    }
}