// static/js/main.js

// importa la funcion principal de inicializacion de la aplicacion.
// la ruta se mantiene exactamente como se proporciono.
import { initApp } from './appInitializer.js';

document.addEventListener('DOMContentLoaded', async () => {
    // llama a la funcion asincrona que inicializa toda la logica y componentes de la aplicacion.
    await initApp();
});