import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/styles/fonts.css'
import './assets/styles/style.css'

createApp(App).mount('#app')
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });