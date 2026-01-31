import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://dummyjson.com/todos'

export const useTasksApiStore = defineStore('apiTasks', () => {
    const apiTasks = ref([])

    const getTasks = async () => {
        const response = await axios.get(API_URL)
        apiTasks.value = response.data.todos
        console.log('tareas cargadas:', apiTasks.value)
    }

    return { apiTasks, getTasks }
})