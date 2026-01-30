<template>

    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">

        <div class="w-full max-w-md">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        Iniciar Sesión
                    </h2>
                    <p class="text-sm text-gray-500">
                        Accede a tu cuenta
                    </p>
                </div>

                <form @submit.prevent="iniciarSesion" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            Correo
                        </label>
                        <input type="email" id="email" v-model="email" placeholder="tu@email.com" required
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                    </div>

                    <div>
                        <label for="pass" class="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input type="password" id="pass" v-model="password" placeholder="Tu contraseña" required
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                    </div>
                    <button type="submit" :disabled="cargando"
                        class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md">
                        {{ cargando ? "Iniciando sesión..." : "Acceder" }}
                    </button>
                </form>

                <!-- registro -->
                <div class="text-center mt-6 pt-6 border-t border-gray-200">
                    <p class="text-sm text-gray-600">
                        ¿No tienes cuenta?
                        <router-link to="/register"
                            class="text-gray-900 font-semibold hover:text-gray-700 transition-colors ml-1">
                            Regístrate
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { login, enviarEmailVerificacion, estaAutenticado } from '@/servicios/autentication.js';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)


// onMounted(() => {
//     if (estaAutenticado()) {
//         router.push('/home')
//     }
// })

const iniciarSesion = async () => {
    cargando.value = true

    try {
        const resultado = await login(email.value, password.value)
        const usuario = resultado?.usuario?.user
        const respuestaEmail = await enviarEmailVerificacion(usuario)

        cargando.value = false

        if (resultado.ok) {
            toast.success(`Bienvenido ${email.value}`)

            if (!usuario.emailVerified) {
                toast.warning('Tu email aún no está verificado. Revisa tu bandeja de entrada.')
            } else {
                toast.success('¡Bienvenido de vuelta!')
            }

            setTimeout(() => {
                router.push('/home')
            }, 500)
        }

    } catch (error) {
        toast.error('Error al iniciar sesión. Intenta nuevamente')
        cargando.value = false
    }
}
</script>
