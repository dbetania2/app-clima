// static/js/map/malvinasmap.js

// importa la instancia del mapa de argentina desde el modulo principal del mapa (maphandler.js).

import { argentinaMap } from './mapHandler.js';

/**
 * añade la capa geojson de las islas malvinas al mapa principal de argentina.
 * esta funcion se encarga de cargar los datos geojson de las islas malvinas
 * y añadirlos como una capa separada en el mapa de leaflet.
 * define un estilo especifico para las malvinas y maneja la interaccion al hacer clic
 * y pasar el raton.
 *
 * @param {function(string): void} on_province_click - callback que se ejecuta
 * cuando se hace clic en las malvinas. recibe el nombre de la "provincia"
 * (en este caso, 'islas malvinas') como argumento.
 */
export function addMalvinasLayer(on_province_click) {
    // asegura que la instancia del mapa de argentina este inicializada antes de proceder.
    if (!argentinaMap) {
        console.error("el mapa de argentina no esta inicializado. no se pueden añadir las malvinas.");
        return;
    }

    // realiza una peticion para obtener el archivo geojson de las islas malvinas.
    fetch('/static/data/islas_malvinas/islas_malvinas.geojson')
        .then(res => {
            // verifica si la respuesta de la peticion fue exitosa.
            if (!res.ok) {
                // si no es exitosa, lanza un error con un mensaje descriptivo.
                throw new Error(`error al cargar el geojson de malvinas: ${res.statusText}`);
            }
            // si la respuesta es exitosa, parsea el cuerpo de la respuesta como json.
            return res.json();
        })
        .then(data => {
            // define el estilo visual por defecto para la capa de las islas malvinas.
            const malvinas_style = {
                fillColor: '#b3d9ff', // un azul claro o un color distintivo para el relleno.
                weight: 1.5, // el grosor del borde de la forma.
                color: '#6699ff', // el color del borde de la forma.
                fillOpacity: 0.7 // la opacidad del relleno.
            };

            // define el estilo que se aplicara cuando el raton pase por encima de las islas.
            const malvinas_highlight_style = {
                fillColor: '#80c0ff', // un color ligeramente mas oscuro para resaltar.
                weight: 2, // un borde un poco mas grueso al resaltar.
                color: '#3366cc', // un color de borde mas oscuro.
                fillOpacity: 0.9 // una opacidad de relleno mayor al resaltar.
            };

            // crea una nueva capa geojson de leaflet usando los datos cargados.
            L.geoJSON(data, {
                style: malvinas_style, // aplica el estilo por defecto a la capa.
                onEachFeature(feature, layer) {
                    // el nombre 'islas malvinas' ya deberia estar en los datos geojson
                    // o se usa un valor por defecto.
                    const malvinas_name = feature.properties?.name || 'islas malvinas';
                    // vincula un tooltip a la capa que se muestra al pasar el raton.
                    layer.bindTooltip("islas malvinas. siempre argentinas");

                    // define los eventos de interaccion para la capa.
                    layer.on({
                        mouseover(e) {
                            // al pasar el raton, aplica el estilo de resaltado.
                            e.target.setStyle(malvinas_highlight_style);
                        },
                        mouseout(e) {
                            // al quitar el raton, resetea el estilo al original.
                            // se usa 'layer.setStyle' para asegurar que el estilo se aplica correctamente a la capa.
                            layer.setStyle(malvinas_style);
                        },
                        click() {
                            // puedes llamar al mismo callback general para provincias
                            on_province_click?.(malvinas_name);
                        }
                    });
                }
            }).addTo(argentinaMap); // añade la capa geojson al mapa principal de argentina.
        })
        // captura y registra cualquier error que ocurra durante la carga o procesamiento del geojson.
        .catch(err => console.error('error cargando geojson de islas malvinas:', err));
}