import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
//los imports activan la funcion onAuthStateChanged
//Significa que desde el principio se estara escuchando si hay un usuario logeado o no


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

let isAuthReady = false

onAuthStateChanged(auth, (user) => {
    if (!isAuthReady) {
        isAuthReady = true
        app.use(router)
        app.use(Toast, {
            position: 'top-center',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: 'button',
            icon: true,
            rtl: false
        })
        app.mount('#app')
    }
})






