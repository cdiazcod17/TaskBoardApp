<template>
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-4">

            <div class="flex items-start gap-3 flex-1">
                <input type="checkbox" :checked="isChecked" @change="handleCheckboxChange" :disabled="isDisabled"
                    :class="checkboxClasses"
                    class="w-5 h-5 rounded border-gray-300 mt-1 cursor-pointer disabled:cursor-not-allowed" />

                <div class="flex-1">
                    <p :class="{ 'line-through text-gray-400': task.completed }" class="text-gray-800 font-medium">
                        {{ task.todo }}
                    </p>

                    <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>ID: {{ task.id }}</span>
                        <span :class="task.completed ? 'text-green-600' : 'text-orange-600'" class="font-medium">
                            {{ task.completed ? ' Completada' : 'Estado: Pendiente' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex shrink-0">
                <div v-if="task.completed" class="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded">
                    Completada
                </div>

                <!-- Asignada al usuario -->
                <div v-else-if="isAssignedToMe" class="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded font-medium">
                    Tuya
                </div>

                <!-- Asignada a OTRO usuario -->
                <div v-else-if="isAssignedToOther" class="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
                    Asignada
                </div>

                <!-- Disponible -->
                <div v-else class="text-xs text-green-600 bg-green-50 px-3 py-2 rounded">
                    Disponible
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserTasksStore } from '@/stores/userTasks'

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['task-toggled'])
const userTasksStore = useUserTasksStore()
// Verificar si está asignada al usuario actual
const isAssignedToMe = computed(() => {
    return userTasksStore.isTaskAssignedToCurrentUser(props.task.id)
})

// Verificar si está asignada a otro usuario
const isAssignedToOther = computed(() => {
    return userTasksStore.isTaskAssignedToOther(props.task.id)
})

const isDisabled = computed(() => {
    if (props.task.completed) {
        return true
    }
    if (isAssignedToOther.value) {
        return true
    }
    return false
})

// Manejar cambio del checkbox
const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked
    emit('task-toggled', {
        taskId: props.task.id,
        isChecked: isChecked
    })
}
</script>