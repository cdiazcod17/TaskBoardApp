<template>
    <div>
        <H1>hOLA</H1>
        {{ taskStore.allTasks }}
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTasksApiStore } from '@/stores/tasks';

const taskStore = useTasksApiStore()

onMounted(() => {
    taskStore.getTasks()
})

</script>

<style lang="scss" scoped></style>