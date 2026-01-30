<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        Registro
                    </h2>
                    <p class="text-sm text-gray-500">
                        Completa los campos para crear tu cuenta
                    </p>
                </div>

                <form @submit.prevent="registrarUsuario" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input type="email" id="email" v-model="email" placeholder="tu@email.com" required
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                    </div>

                    <div>
                        <label for="pass" class="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input type="password" id="pass" v-model="password" placeholder="Mínimo 6 caracteres" required
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar contraseña
                        </label>
                        <input type="password" id="confirmPassword" v-model="confirmPassword"
                            placeholder="Repite tu contraseña" required
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                    </div>

                    <!-- error -->
                    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {{ error }}
                    </div>

                    <!--exito -->
                    <div v-if="exito"
                        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {{ exito }}
                    </div>


                    <button type="submit" :disabled="cargando"
                        class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md">
                        {{ cargando ? "Creando cuenta..." : "Crear cuenta" }}
                    </button>
                </form>

                <div class="text-center mt-6 pt-6 border-t border-gray-200">
                    <p class="text-sm text-gray-600">
                        ¿Ya tienes cuenta?
                        <router-link to="/login"
                            class="text-gray-900 font-semibold hover:text-gray-700 transition-colors ml-1">
                            Inicia sesión
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { registrar, estaAutenticado } from '@/servicios/autentication.js'
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'

const toast = useToast()

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const exito = ref('')
const cargando = ref(false)

onMounted(() => {
    if (estaAutenticado) {
        router.push('/home')
    }
})

const coinciden = computed(() => {
    return password.value === confirmPassword.value
})

const registrarUsuario = async () => {
    error.value = ''
    exito.value = ''


    if (!coinciden.value) {
        error.value = "Las contraseñas no coinciden"
        return //
    }

    cargando.value = true
    const resultado = await registrar(email.value, password.value)
    const usuario = resultado.usuario.user
    console.log(usuario)
    cargando.value = false

    //ultimas comprobaciones

    if (resultado.ok) {
        toast.success(`✅yes ${email.value} creado exitosamente`)
        router.push('/home')
    } else {
        error.value = `❌oh no! error en los datos ingresados`
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
    }
}
</script>
<style lang="scss" scoped></style>