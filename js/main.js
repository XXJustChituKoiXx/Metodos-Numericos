const toggleSwitch = document.querySelector('#checkbox');
const html = document.documentElement;

toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        html.setAttribute('data-theme', 'light'); // Activado -> Modo Claro (Worlds)
    } else {
        html.setAttribute('data-theme', 'dark');  // Desactivado -> Modo Oscuro (SMILE!)
    }
});