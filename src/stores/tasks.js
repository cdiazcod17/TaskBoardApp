import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://dummyjson.com/todos'


export const useTasksApiStore = defineStore('apiTasks', () => {

    const apiTasks = ref([])

    const getTasks = async () => {
        const response = await axios.get(API_URL)
        apiTasks.value = response.data.todos
    }

    const allTasks = computed(() => {
        return apiTasks.value
    }
    )

    return { allTasks, apiTasks, getTasks }
})

