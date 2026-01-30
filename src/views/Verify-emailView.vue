<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div class="mb-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                            </path>
                        </svg>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Verifica tu email
                </h2>

                <p class="text-gray-600 mb-6">
                    Hemos enviado un correo de verificación a
                    <span class="font-semibold">{{ userEmail }}</span>
                </p>

                <p class="text-sm text-gray-500 mb-6">
                    Revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
                </p>

                <div class="space-y-3">
                    <button @click="reenviarEmail" :disabled="enviando"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all">
                        {{ enviando ? 'Enviando...' : 'Reenviar correo' }}
                    </button>

                    <button @click="verificarEstado" :disabled="verificando"
                        class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-all">
                        {{ verificando ? 'Verificando...' : 'Ya verifiqué mi email' }}
                    </button>

                    <button @click="cerrarSesion"
                        class="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-all">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { auth } from '@/firebase/config'
import { obtenerUsuario, enviarEmailVerificacion, logout } from '@/servicios/autentication'

const router = useRouter()
const toast = useToast()

const enviando = ref(false)
const verificando = ref(false)

const usuario = obtenerUsuario()
const userEmail = computed(() => usuario.value?.email || '')

const reenviarEmail = async () => {
    enviando.value = true

    try {
        const resultado = await enviarEmailVerificacion()

        if (resultado.ok) {
            toast.success('Correo de verificación enviado')
        } else {
            toast.error('Error al enviar el correo')
        }
    } catch (error) {
        toast.error('Error al enviar el correo')
    } finally {
        enviando.value = false
    }
}

const verificarEstado = async () => {
    verificando.value = true

    try {
        // Recargar el usuario para obtener el estado actualizado
        await auth.currentUser?.reload()

        if (auth.currentUser?.emailVerified) {
            toast.success('¡Email verificado correctamente!')
            router.push('/home')
        } else {
            toast.warning('Aún no has verificado tu email. Revisa tu bandeja de entrada.')
        }
    } catch (error) {
        toast.error('Error al verificar el estado')
    } finally {
        verificando.value = false
    }
}

const cerrarSesion = async () => {
    const resultado = await logout()

    if (resultado.ok) {
        toast.info('Sesión cerrada')
        router.push('/login')
    }
}
</script>
