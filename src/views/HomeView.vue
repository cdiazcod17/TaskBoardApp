<template>
    <div class="p-4">
        <div>
            <select v-model="opcion" class="mb-4 border rounded px-2 py-1 text-sm">
                <option value="todas">Todas</option>
                <option value="completed">Completadas</option>
                <option value="pending">Pendientes</option>
            </select>
        </div>
        <div>
            <p>Tareas mostradas: {{ tareasFiltradas.length }}</p>
        </div>
        <div class="flex flex-col gap-3">
            <TaskCardComponent v-for="task in tareasFiltradas" :key="task.id" :task="task"
                class="bg-white p-4 rounded-lg border-gray-200" />
        </div>
        <p v-if="!tasksStore.apiTasks.length" class="mt-4 text-gray-500">
            Cargando tareas...
        </p>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTasksApiStore } from '@/stores/tasks'
import { obtenerUsuario } from '@/servicios/autentication'
import TaskCardComponent from '@/components/TaskCardComponent.vue'


const tasksStore = useTasksApiStore()
const usuario = obtenerUsuario()
const usuarioId = computed(() => usuario.value?.uid || null)
const opcion = ref('todas')

const tareasFiltradas = computed(() => {
    if (opcion.value === 'todas') {
        return tasksStore.apiTasks
    }
    if (opcion.value === 'completed') {
        return tasksStore.apiTasks.filter(task => task.completed === true)
    }
    if (opcion.value === 'pending') {
        return tasksStore.apiTasks.filter(task => task.completed === false)
    }
    // por defecto
    return tasksStore.apiTasks
})

onMounted(() => {
    tasksStore.getTasks()
})
</script>
