<template>
    <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-around items-center gap-4">
            <router-link to="/home" class="text-4xl font-bold text-gray-900">
                Task<span class="text-blue-600">Board</span>App
            </router-link>
        </div>

    </nav>
</template>

<script setup>
import { login, enviarEmailVerificacion } from '@/servicios/autentication.js';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'

const toast = useToast()

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const exito = ref('')
const cargando = ref(false)

const iniciarSesion = async () => {
    error.value = ''
    exito.value = ''

    cargando.value = true
    const resultado = await login(email.value, password.value)
    const usuario = resultado?.usuario?.user
    const respuestaEmail = await enviarEmailVerificacion(usuario)


    if (respuestaEmail.ok) {
        exito.value = `yes ${email.value} verificado`
    }
    cargando.value = false
    if (resultado.ok) {
        exito.value = `yes sesion iniciada exitosamente ${email.value}`
        toast.success(`yes sesion iniciada exitosamente ${email.value}`)
        setTimeout(() => [
            router.push('/perfil')
        ], 500)
    } else {
        error.value = 'oh no se ha podido iniciar sesion'
    }
}

</script>
