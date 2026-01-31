<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-6xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Mi Área de Trabajo</h1>
                <p class="text-gray-600">Aquí están las tareas que has agregado a tu espacio personal</p>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600">
                </div>
                <p class="text-gray-600 mt-4">Cargando tus tareas...</p>
            </div>

            <div v-else-if="myTasks.length === 0" class="text-center py-16">
                <div class="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
                    <svg class="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 class="text-2xl text-gray-700 font-bold mb-2">No tienes tareas asignadas</h2>
                    <p class="text-gray-500 mb-6">
                        Ve al catálogo de tareas y agrega las que quieras trabajar
                    </p>
                    <router-link to="/home"
                        class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                        Ir al Catálogo
                    </router-link>
                </div>
            </div>

            <!-- Lista de tareas -->
            <div v-else>
                <!-- Estadísticas -->
                <div class="bg-white rounded-lg shadow p-4 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-6 text-sm">
                            <div>
                                <span class="text-gray-600">Total de tareas:</span>
                                <span class="font-bold text-gray-800 ml-1">{{ myTasks.length }}</span>
                            </div>
                            <div>
                                <span class="text-orange-600">Pendientes:</span>
                                <span class="font-bold text-orange-600 ml-1">{{ pendingCount }}</span>
                            </div>
                            <div>
                                <span class="text-green-600">Completadas:</span>
                                <span class="font-bold text-green-600 ml-1">{{ completedCount }}</span>
                            </div>
                        </div>
                        <router-link to="/home" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            + Agregar más tareas
                        </router-link>
                    </div>
                </div>

                <!-- Grid de tareas -->
                <div class="grid gap-4">
                    <TaskCardWorkspace v-for="task in myTasks" :key="task.id" :task="task"
                        @remove-task="handleRemoveTask" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserTasksStore } from '@/stores/userTasks'
import { useTasksApiStore } from '@/stores/tasks'
import TaskCardWorkspace from '@/components/TaskCardWorkspace.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userTasksStore = useUserTasksStore()
const tasksStore = useTasksApiStore()
const isLoading = ref(true)

// Computed: filtrar tareas de la API que están asignadas al usuario
const myTasks = computed(() => {
    if (!tasksStore.apiTasks.length || !userTasksStore.userTasks.length) {
        return []
    }

    // Filtrar solo las tareas que el usuario tiene asignadas
    return tasksStore.apiTasks.filter(task =>
        userTasksStore.userTasks.includes(task.id)
    )
})

// Estadísticas de tareas del usuario
const pendingCount = computed(() => {
    return myTasks.value.filter(t => !t.completed).length
})

const completedCount = computed(() => {
    return myTasks.value.filter(t => t.completed).length
})

// Manejar eliminación de tarea
const handleRemoveTask = async (taskId) => {
    const result = await userTasksStore.removeTask(taskId)

    if (result.ok) {
        toast.success('✓ Tarea eliminada de tu área de trabajo')
    } else {
        toast.error('✗ Error al eliminar la tarea')
    }
}

// Cargar datos al montar el componente
onMounted(async () => {
    isLoading.value = true

    try {
        // 1. Cargar tareas de la API si no están cargadas
        if (!tasksStore.apiTasks.length) {
            await tasksStore.getTasks()
        }

        // 2. Cargar tareas del usuario desde Firebase
        await userTasksStore.fetchUserTasks()

        console.log('✅ Workspace cargado:', {
            totalAPI: tasksStore.apiTasks.length,
            misAsignadas: userTasksStore.userTasks.length,
            misTareas: myTasks.value.length
        })
    } catch (err) {
        console.error('Error cargando workspace:', err)
        toast.error('Error al cargar tu área de trabajo')
    } finally {
        isLoading.value = false
    }
})
</script>