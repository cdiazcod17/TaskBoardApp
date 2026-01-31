<template>
    <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
            <router-link to="/home" class="text-4xl font-bold text-gray-900">
                Task<span class="text-blue-600">Board</span>App
            </router-link>
            <div class="flex flex-col" v-if="usuario">
                <h5 class="text-blue-600 font-bold"> <span>Usuario:</span> {{ usuario?.email }}
                </h5>
                <button @click="cerrarSesion" class="text-xl font-bold text-gray-900 cursor-pointer">Cerrar
                    Sesión
                </button>
            </div>
        </div>


    </nav>
</template>

<script setup>
import { obtenerUsuario, logout } from '@/servicios/autentication.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'

const toast = useToast()

const router = useRouter()
const usuario = obtenerUsuario()

const cerrarSesion = async () => {
    const resultado = await logout()

    if (resultado.ok) {
        toast.info('Sesión finalizada')
        router.push('/login')
    }
}


</script>
