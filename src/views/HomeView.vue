<template>
    <div class="p-4">
        <div v-for="task in tasksStore.apiTasks" :key="task.id"
            class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div class="flex items-center gap-3">
                <input type="checkbox" :checked="task.completed" class="w-5 h-5" />
                <span :class="{ 'line-through text-gray-400': task.completed }">
                    {{ task.todo }}
                </span>
            </div>
            <p class="text-xs text-gray-500 mt-2">
                User ID: {{ task.userId }}
            </p>
        </div>

        <p v-if="!tasksStore.apiTasks.length" class="mt-4 text-gray-500">
            No hay tareas todavía.
        </p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTasksApiStore } from '@/stores/tasks'

const tasksStore = useTasksApiStore()

onMounted(() => {
    tasksStore.getTasks()
})
</script>
