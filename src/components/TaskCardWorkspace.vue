<template>
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-4">
            <!-- Contenido de la tarea -->
            <div class="flex items-start gap-3 flex-1">
                <!-- Checkbox visual -->
                <input type="checkbox" :checked="task.completed" disabled
                    class="w-5 h-5 accent-blue-500 rounded border-gray-300 mt-1" />

                <div class="flex-1">
                    <p :class="{ 'line-through text-gray-400': task.completed }" class="text-gray-800 font-medium">
                        {{ task.todo }}
                    </p>

                    <!-- Info adicional -->
                    <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>ID: {{ task.id }}</span>
                        <span :class="task.completed ? 'text-green-600' : 'text-orange-600'" class="font-medium">
                            {{ task.completed ? 'Tarea Completada' : 'Tarea Pendiente' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Botón eliminar -->
            <button @click="handleRemove" :disabled="isRemoving"
                class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition text-sm flex shrink-0"
                title="Eliminar de mis tareas">
                {{ isRemoving ? 'Eliminando...' : 'Eliminar' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['remove-task'])

const isRemoving = ref(false)

const handleRemove = async () => {
    isRemoving.value = true
    emit('remove-task', props.task.id)
    // El componente padre manejará el estado de loading
    setTimeout(() => {
        isRemoving.value = false
    }, 500)
}
</script>