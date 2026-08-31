// Toggle modo obscuro
const toggleSwitch = document.querySelector('#checkbox');
const html = document.documentElement;

toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        html.setAttribute('data-theme', 'light'); 
    } else {
        html.setAttribute('data-theme', 'dark');  
    }
});

const parc1Button = document.getElementById('parc1');
const parc2Button = document.getElementById('parc2');
const parc3Button = document.getElementById('parc3');
// me quiero matar
parc1Button.addEventListener("click", () => {
    
});

parc2Button.addEventListener("click", () => {
    
});

parc3Button.addEventListener("click", () => {
    
});