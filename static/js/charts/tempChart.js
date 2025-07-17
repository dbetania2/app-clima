/* grafico temperaturas max / min */

// variable para almacenar la instancia del grafico de temperaturas,
// permitiendo su destruccion y actualizacion.
let temp_chart = null;

/**
 * dibuja un grafico de lineas con las temperaturas maximas y minimas semanales.
 * esta funcion toma una lista de pronosticos semanales y crea un grafico
 * de lineas que muestra la evolucion de las temperaturas maximas y minimas
 * a lo largo de los dias. si ya existe un grafico de temperaturas, lo destruye
 * antes de crear uno nuevo para asegurar una correcta visualizacion.
 *
 * @param {array<object>} weekly - una lista de objetos, donde cada uno representa
 * el pronostico de un dia y debe contener las propiedades 'date', 'temp_max' y 'temp_min'.
 */
export function renderTempChart(weekly){
    // extrae las fechas del pronostico semanal y las formatea
    // a un formato legible y corto para las etiquetas del eje x.
    const labels = weekly.map(d =>
        new Date(d.date).toLocaleDateString('es-es',{ weekday:'short', day:'numeric', month:'short' })
    );
    // extrae las temperaturas maximas para cada dia.
    const max_temps = weekly.map(d => d.temp_max);
    // extrae las temperaturas minimas para cada dia.
    const min_temps = weekly.map(d => d.temp_min);

    // si ya existe una instancia del grafico de temperaturas, la destruye
    // para evitar conflictos y asegurar que se dibuje un nuevo grafico.
    if (temp_chart) temp_chart.destroy();

    // intenta obtener el elemento canvas del dom por su id 'charttemprange'.
    const ctx = document.getElementById('chartTempRange');
    // añade una verificacion por si el canvas no se encuentra, registrando un error.
    if (!ctx) {
        console.error("error: no se encontro el elemento canvas con id 'charttemprange'.");
        return;
    }

    // crea una nueva instancia del grafico de chart.js.
    temp_chart = new Chart(ctx,{
        type:'line', // define el tipo de grafico como 'lineas'.
        data:{
            labels, // etiquetas para el eje x (fechas formateadas).
            datasets:[
                {
                    label:'maxima °c', // etiqueta de la leyenda para la serie de temperaturas maximas.
                    data:max_temps, // los datos de temperaturas maximas.
                    borderColor: 'rgb(255, 99, 132)', // color del borde de la linea.
                    backgroundColor: 'rgba(255, 99, 132, 0.5)', // color de fondo del area bajo la linea.
                    tension:0.3, // suaviza las lineas del grafico.
                    borderWidth:2 // ancho de la linea.
                },
                {
                    label:'minima °c', // etiqueta de la leyenda para la serie de temperaturas minimas.
                    data:min_temps, // los datos de temperaturas minimas.
                    borderColor: 'rgb(54, 162, 235)', // color del borde de la linea.
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // color de fondo del area bajo la linea.
                    tension:0.3, // suaviza las lineas del grafico.
                    borderWidth:2 // ancho de la linea.
                }
            ]
        },
        options:{
            responsive:true, // el grafico se ajustara al tamaño de su contenedor.
            maintainAspectRatio:false, // no mantiene la relacion de aspecto, permite flexibilidad en el tamaño.
            plugins:{
                legend:{
                    position:'bottom', // posiciona la leyenda en la parte inferior del grafico.
                    labels: {
                        font: {
                            size: 13, // tamaño de fuente para los elementos de la leyenda.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    }
                },
                tooltip: { // configuracion para las tooltips .
                    titleFont: {
                        size: 13, // tamaño de fuente para el titulo de la tooltip.
                        weight: 'bold' // peso de fuente en negrita.
                    },
                    bodyFont: {
                        size: 13 // tamaño de fuente para el cuerpo de la tooltip.
                    },
                    callbacks: {
                        // personaliza el texto de la etiqueta de la tooltip.
                        // muestra el nombre de la serie (maxima/minima) y el valor en °c.
                        label: (context) => `${context.dataset.label}: ${context.raw}°c`
                    }
                }
            },
            scales:{
                x: { // configuracion del eje x.
                    ticks: {
                        font: {
                            size: 13, // tamaño de fuente para las etiquetas del eje x.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    }
                },
                y:{ // configuracion del eje y.
                    ticks:{
                        // personaliza el texto de las marcas del eje y, añadiendo '°' al final.
                        callback:v=>v+'°',
                        font: {
                            size: 13, // tamaño de fuente para las etiquetas del eje y.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    }
                }
            }
        }
    });
}

/**
 * destruye la instancia del grafico de temperaturas si existe.
 * esta funcion es util para liberar recursos del navegador y limpiar el canvas
 * cuando el grafico ya no es necesario.
 */
export function destroyTempChart(){
    if (temp_chart){
        temp_chart.destroy(); // destruye el grafico si existe.
        temp_chart = null; // resetea la variable a null para futuras creaciones.
    }
}