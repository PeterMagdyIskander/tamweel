import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/sass/style.scss'
createApp(App).use(store).use(router).use(PrimeVue).mount('#app')
