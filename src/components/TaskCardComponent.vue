<template>
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 ">
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
</template>

<script setup>
const userTask = ref([])
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

</script>