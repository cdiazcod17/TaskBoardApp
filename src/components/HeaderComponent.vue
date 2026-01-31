<template>
    <nav class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">

                <router-link to="/home"
                    class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    Task<span class="text-blue-600">Board</span>App
                </router-link>

                <!-- Movil -->
                <button @click="toggleMenu" v-if="usuario"
                    class="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'">
                    <svg class="w-6 h-6" :class="isMenuOpen ? 'text-blue-600' : 'text-gray-700'" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- DESKTOP -->
                <div class="hidden lg:flex items-center gap-6" v-if="usuario">
                    <div class="text-right flex flex-col gap-1">
                        <h5 class="text-blue-600 font-bold text-sm sm:text-base">
                            Usuario: {{ usuario?.email }}
                        </h5>

                        <router-link to="/workspace"
                            class="text-gray-900 hover:text-blue-600 font-semibold text-sm sm:text-base transition-colors px-3 py-1 rounded hover:bg-gray-50">
                            Mis Tareas
                        </router-link>
                        <button @click="cerrarSesion"
                            class="text-gray-900 hover:text-red-600 font-semibold text-sm sm:text-base transition-colors px-3 py-1 rounded hover:bg-gray-200">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <!-- Menú MÓVIL -->
            <div v-if="isMenuOpen && usuario" class="lg:hidden">
                <div class="pt-4 pb-2 border-t border-gray-200 space-y-3">
                    <h5 class="text-blue-600 font-bold text-base px-2">
                        Usuario: {{ usuario?.email }}
                    </h5>

                    <router-link to="/workspace" @click="toggleMenu"
                        class="block w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-semibold text-base transition-all">
                        Mis Tareas
                    </router-link>
                    <button @click="cerrarSesion"
                        class="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-semibold text-base transition-all">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { obtenerUsuario, logout } from '@/servicios/autentication.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'
import { ref } from 'vue'

const toast = useToast()
const router = useRouter()
const usuario = obtenerUsuario()
const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const cerrarSesion = async () => {
    const resultado = await logout()
    isMenuOpen.value = false
    if (resultado.ok) {
        toast.info('Sesión finalizada')
        router.push('/login')
    }
}


</script>
