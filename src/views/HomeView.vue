<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Catálogo de Tareas</h1>
                <p class="text-gray-600">Selecciona las tareas pendientes marcando el checkbox</p>
            </div>

            <div class="bg-white rounded-lg shadow p-4 mb-6">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <!-- Filtro -->
                    <div class="flex items-center gap-3">
                        <label for="filter-select" class="text-sm font-medium text-gray-700">
                            Filtrar por:
                        </label>
                        <select id="filter-select" v-model="filter"
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                            <option value="pending">Solo Pendientes</option>
                            <option value="all">Todas las Tareas</option>
                            <option value="completed">Solo Completadas</option>
                            <option value="my-tasks">Mis Tareas</option>
                        </select>
                    </div>

                    <!-- Estadísticas -->
                    <div class="flex items-center gap-6 text-sm">
                        <div>
                            <span class="text-gray-600">Total:</span>
                            <span class="font-bold text-gray-800 ml-1">{{ stats.total }}</span>
                        </div>
                        <div>
                            <span class="text-orange-600">Pendientes:</span>
                            <span class="font-bold text-orange-600 ml-1">{{ stats.pending }}</span>
                        </div>
                        <div>
                            <span class="text-green-600">Completadas:</span>
                            <span class="font-bold text-green-600 ml-1">{{ stats.completed }}</span>
                        </div>
                        <div>
                            <span class="text-blue-600">Tus tareas:</span>
                            <span class="font-bold text-blue-600 ml-1">{{ userTasksStore.userTasks.length }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600">
                </div>
                <p class="text-gray-600 mt-4">Cargando tareas...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">Error al cargar tareas: {{ error }}</p>
            </div>

            <!-- Todas las tareas -->
            <div v-else-if="filteredTasks.length > 0" class="grid gap-4">
                <TaskCardComponent v-for="task in filteredTasks" :key="task.id" :task="task"
                    @task-toggled="handleTaskToggled" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserTasksStore } from '@/stores/userTasks'
import { useTasksApiStore } from '@/stores/tasks'
import TaskCardComponent from '@/components/TaskCardComponent.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userTasksStore = useUserTasksStore()
const tasksStore = useTasksApiStore()

const isLoading = ref(true)
const error = ref(null)
const filter = ref('pending') // 'pending' | 'all' | 'completed' | 'my-tasks'


const filteredTasks = computed(() => {
    const tasks = tasksStore.apiTasks || []

    switch (filter.value) {
        case 'pending':
            return tasks.filter(task => task.completed === false)

        case 'completed':
            return tasks.filter(task => task.completed === true)

        case 'my-tasks':
            return tasks.filter(task =>
                userTasksStore.userTasks.includes(task.id)
            )

        case 'all':
        default:
            return tasks
    }
})

const stats = computed(() => {
    const tasks = tasksStore.apiTasks || []
    return {
        total: tasks.length,
        pending: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
    }
})

const handleTaskToggled = async ({ taskId, isChecked }) => {
    if (isChecked) {
        // Addtask
        const result = await userTasksStore.addTask(taskId)
        if (result.ok) {
            toast.success('✓ Tarea agregada a tu área de trabajo')
        } else {
            toast.error('✗ Error al agregar la tarea')
        }
    } else {
        // DeletTask
        const result = await userTasksStore.removeTask(taskId)
        if (result.ok) {
            toast.info('Tarea eliminada de tu área de trabajo')
        } else {
            toast.error('✗ Error al eliminar la tarea')
        }
    }
}

// Cargar datos al montar
onMounted(async () => {
    isLoading.value = true
    error.value = null

    try {
        // 1. Cargar tareas de la API
        if (!tasksStore.apiTasks.length) {
            await tasksStore.getTasks()
        }

        // 2. Cargar tareas del usuario actual
        await userTasksStore.fetchUserTasks()

        // 3. Cargar TODAS las asignaciones (para validar disponibilidad)
        await userTasksStore.fetchAllAssignments()

        console.log('✅ Datos cargados correctamente')
    } catch (err) {
        console.error('Error cargando datos:', err)
        error.value = err.message
    } finally {
        isLoading.value = false
    }
})
</script>