// static/js/bootTheme.js

// importa la funcion 'applySavedTheme' desde el modulo encargado de la gestion del tema.
// la ruta se mantiene exactamente como se proporciono.
import { applySavedTheme } from './ui/themeManager.js';

// al cargar la aplicacion, aplica inmediatamente el tema guardado en el almacenamiento local.
applySavedTheme();