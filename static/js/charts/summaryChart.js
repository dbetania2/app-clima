// static/js/charts/chartsummary.js

// variable para almacenar la instancia del grafico de resumen,
// permitiendo su destruccion y actualizacion.
let summary_chart = null;

/**
 * renderiza un grafico de torta que muestra la frecuencia de las descripciones del clima
 * para el pronostico semanal.
 *
 * esta funcion procesa los datos del pronostico semanal para contar cuantos dias
 * tienen cada tipo de descripcion de clima (ej. "lluvia", "cielo claro"). luego
 * dibuja un grafico de torta con esa informacion. si un grafico ya existe,
 * lo destruye antes de crear uno nuevo para evitar superposicion o errores.
 *
 * @param {object} data - objeto con los datos del clima, incluyendo el pronostico semanal.
 * @param {array<object>} data.weekly_forecast - lista de objetos con el pronostico de cada dia.
 * cada objeto del pronostico debe contener una propiedad 'description' (string).
 */

export function renderSummaryChart(data) {
    // 'freq_map' almacenara la cantidad de veces que aparece cada descripcion.
    const freq_map = {};
    data.weekly_forecast.forEach(d => {
        const key = d.description; // la descripcion del clima (ej. "lluvia ligera").
        // incrementa el contador para la descripcion actual.
        freq_map[key] = (freq_map[key] || 0) + 1;
    });

    //genera arrays para chart.js a partir del mapa de frecuencias.
    // 'labels' seran los nombres de las descripciones (ej. "cielo claro", "lluvia").
    const labels = Object.keys(freq_map);
    // 'values' seran las frecuencias de cada descripcion (ej. 3, 2).
    const values = Object.values(freq_map);

    // calcula el total de dias en el pronostico (sumatoria de todas las frecuencias).
    const total_days = values.reduce((sum, current) => sum + current, 0);

    // generar colores de fondo automaticos para las secciones del grafico.
    // 'palette' define una serie de colores predefinidos.
    const palette = [
        '#ff6384', '#36a2eb', '#ffcd56',
        '#4bc0c0', '#9966ff', '#f67019',
        '#8a2be2', '#7fffd4', '#dc143c', 
        '#008080', '#b8860b', '#00ff7f'
    ];
    // 'bg_colors' asigna un color a cada etiqueta, ciclando a traves de la paleta.
    const bg_colors = labels.map((_, i) => palette[i % palette.length]);

    // destruir cualquier instancia de grafico anterior para evitar conflictos y
    // asegurar que solo haya un grafico activo en el canvas.
    if (summary_chart) summary_chart.destroy();

    // obtiene el contexto del elemento canvas donde se dibujara el grafico.
    const ctx = document.getElementById('chartSummary');
    // si el elemento canvas no se encuentra, la funcion termina.
    if (!ctx) return;

    //crear una nueva instancia del grafico de torta (pie chart) con chart.js.
    summary_chart = new Chart(ctx, {
        type: 'pie', // define el tipo de grafico como 'torta'.
        data: {
            labels, // etiquetas para cada seccion del grafico (descripciones del clima).
            datasets: [{
                data: values, // los datos de frecuencia para cada seccion.
                backgroundColor: bg_colors // colores de fondo para cada seccion.
            }]
        },
        options: {
            responsive: true, // el grafico se ajustara al tamaño de su contenedor.
            maintainAspectRatio: false, // no mantiene la relacion de aspecto, permitiendo mayor flexibilidad.
            plugins: {
                legend: {
                    position: 'bottom', // posiciona la leyenda en la parte inferior del grafico.
                    labels: {
                        font: {
                            size: 13, // tamaño de fuente para los elementos de la leyenda.
                            weight: 'bold' // peso de fuente en negrita.
                        }
                    }
                },
                tooltip: { // configuracion para las tooltips (informacion al pasar el mouse sobre una seccion).
                    callbacks: {
                        label: (ctx_tooltip) => {
                            // calcula el porcentaje de la seccion actual: (valor actual / total de valores) * 100.
                            // 'tofixed(1)' formatea el porcentaje con un decimal.
                            const percentage = ((ctx_tooltip.raw / total_days) * 100).toFixed(1);
                            // devuelve el texto de la tooltip: "descripcion: n dia(s) (xx.x%)".
                            return `${ctx_tooltip.label}: ${ctx_tooltip.raw} dia(s) (${percentage}%)`;
                        }
                    },
                    titleFont: {
                        size: 13, // tamaño de fuente para el titulo de la tooltip.
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13 // tamaño de fuente para el cuerpo de la tooltip.
                    }
                }
            }
        }
    });
}

/**
 * destruye la instancia del grafico de resumen si existe.
 * esta funcion es util para liberar recursos del navegador y limpiar el canvas
 * cuando el grafico ya no es necesario (ej. al cambiar de pagina o de ciudad).
 */
export function destroySummaryChart() {
    if (summary_chart) {
        summary_chart.destroy(); // llama al metodo 'destroy' de chart.js para limpiar el grafico.
        summary_chart = null; // resetea la variable para que no apunte a una instancia destruida.
    }
}