<template>
    <div class="bg-white w-[45%] p-4 rounded-lg shadow border border-gray-200">
        <div class="flex items-center gap-3">
            <!-- Checkbox AZUL - solo habilitado si NO está completada -->
            <input type="checkbox" :checked="task.completed" :disabled="task.completed"
                class="w-5 h-5 accent-blue-500 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" />

            <span :class="{ 'line-through text-gray-400': task.completed }">
                {{ task.todo }}
            </span>
        </div>
        <button class="w-auto mt-5 bg-black hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">
            Añadir a Mis tareas
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const userTask = ref([])
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})
const addMyTasks = () => {
    emit('add-to-tasks', props.character)
}

</script>