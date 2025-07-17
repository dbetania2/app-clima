// static/js/ui/themetoggle.js (nombre de archivo sugerido)

// constantes para las claves de almacenamiento y clases css, mejorando la legibilidad
// y evitando 'magic strings'.
const theme_key = 'theme';
const dark_class = 'dark';

/**
 * aplica el tema guardado en el almacenamiento local del navegador al cargar la pagina.
 * si no hay un tema guardado o el tema es 'light', no hace nada (el html por defecto es claro).
 * si el tema guardado es 'dark', añade la clase 'dark' al elemento <html>.
 */
export function applySavedTheme() {
    // intenta recuperar el valor de la clave 'theme' del localstorage.
    const saved_theme = localStorage.getItem(theme_key);
    // si el tema guardado es 'dark', aplica la clase 'dark' al elemento raiz del documento (<html>).
    if (saved_theme === 'dark') {
        document.documentElement.classList.add(dark_class);
    }
}

/**
 * configura el event listener para el boton que alterna entre el modo oscuro y claro.
 * tambien inicializa el icono del boton segun el tema actual.
 *
 * @param {string} [button_id='toggleDark'] - el id del elemento boton en el html
 * que actuara como interruptor de tema. por defecto es 'toggleDark'.
 */
export function setupThemeToggle(button_id = 'toggleDark') {
    // obtiene la referencia al boton por su id.
    const btn = document.getElementById(button_id);
    // si el boton no existe en el dom, la funcion termina para evitar errores.
    if (!btn) return;

    // inicializa el texto/icono del boton segun si el tema oscuro esta activo o no.
    btn.textContent = document.documentElement.classList.contains(dark_class) ? '☀️' : '🌙';

    // añade un event listener para el evento 'click' al boton.
    btn.addEventListener('click', () => {
        // alterna la clase 'dark' en el elemento <html> y guarda si el tema actual es oscuro.
        const is_dark = document.documentElement.classList.toggle(dark_class);
        // guarda la preferencia del tema en el localstorage.
        // 'is_dark' (booleano) se convierte a 'dark' o 'light' (string).
        localStorage.setItem(theme_key, is_dark ? 'dark' : 'light');
        // actualiza el texto/icono del boton para reflejar el nuevo tema.
        btn.textContent = is_dark ? '☀️' : '🌙';
    });
}