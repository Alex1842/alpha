import { createApp } from 'vue'
import App from './App.vue'
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/styles/fonts.css'
import './assets/styles/style.css'

createApp(App).use(store).mount('#app')
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });