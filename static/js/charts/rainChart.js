// static/js/charts/rainchart.js

// variable para almacenar la instancia del grafico de lluvia, permitiendo su destruccion posterior.
let rain_chart = null;

/**
 * dibuja o actualiza un grafico de barras que muestra el volumen de lluvia
 * pronosticado para los proximos 7 dias.
 * @param {object} data - el objeto de datos que contiene el pronostico semanal.
 * se espera que tenga la estructura:
 * { weekly_forecast: [{ date: '...', rain_volume_mm: number }] }
 */
export function drawRainChart(data) {
    // extrae las fechas del pronostico semanal y las formatea
    // a un formato legible y corto para las etiquetas del eje x.
    const labels = data.weekly_forecast.map(d =>
        new Date(d.date).toLocaleDateString('es-es', {
            weekday: 'short', day: 'numeric', month: 'short'
        })
    );

    // calcula el volumen de lluvia en mm para cada dia del pronostico.
    // si 'rain_volume_mm' no existe o es nulo/indefinido, se usa 0.
    const rain_volume = data.weekly_forecast.map(d => {
        const volume = d.rain_volume_mm || 0;
        return volume;
    });

    // si ya existe una instancia del grafico de lluvia, la destruye
    // para evitar conflictos y asegurar que se dibuje un nuevo grafico.
    if (rain_chart) rain_chart.destroy();

    // intenta obtener el elemento canvas del dom por su id 'chartrain'.
    const ctx = document.getElementById('chartRain');
    if (!ctx) {
        // si el canvas no se encuentra, registra un error en la consola y detiene la funcion.
        console.error("error: no se encontro el elemento canvas con id 'chartrain'. asegurate de que existe en tu html.");
        return;
    }

    // crea una nueva instancia del grafico de chart.js.
    rain_chart = new Chart(ctx, {
        type: 'bar', // define el tipo de grafico como 'barras'.
        data: {
            labels, // etiquetas para el eje x (fechas formateadas).
            datasets: [{
                label: 'volumen de lluvia (mm)', // etiqueta de la leyenda para esta serie de datos.
                data: rain_volume, // los datos del volumen de lluvia a graficar.
                backgroundColor: 'rgba(54, 162, 235, 0.7)', // color de fondo de las barras.
                borderWidth: 1 // ancho del borde de las barras.
            }]
        },
        options: {
            responsive: true, // el grafico se ajustara al tamaño de su contenedor.
            maintainAspectRatio: false, // no mantiene la relacion de aspecto, permite flexibilidad en el tamaño.
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 13, // tamaño de fuente para las etiquetas del eje x.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    },
                },
                y: {
                    beginAtZero: true, // el eje y siempre comenzara en cero.
                    // 'max' fue eliminado, chart.js ajustara automaticamente el maximo
                    // del eje y basandose en los datos de 'rain_volume'.
                    ticks: {
                        stepSize: 2, // el incremento entre las marcas del eje y (en mm).
                        callback: v => v + 'mm', // añade 'mm' a cada etiqueta del eje y.
                        font: {
                            size: 13, // tamaño de fuente para las etiquetas del eje y.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    },
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 13, // tamaño de fuente para el texto de la leyenda.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    }
                },
                tooltip: { // configuracion para las tooltips (informacion al pasar el mouse).
                    titleFont: {
                        size: 13, // tamaño de fuente para el titulo de la tooltip.
                        weight: 'bold' // peso de fuente en negrita.
                    },
                    bodyFont: {
                        size: 13 // tamaño de fuente para el cuerpo de la tooltip.
                    },
                }
            }
        }
    });
}

/**
 * destruye la instancia actual del grafico de lluvia para liberar recursos
 * y limpiar el canvas.
 */
export function destroyRainChart() {
    if (rain_chart) {
        rain_chart.destroy(); // destruye el grafico si existe.
        rain_chart = null; // resetea la variable a null.
    }
}