import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { obtenerUsuario } from '@/servicios/autentication'

const API_URL = 'https://dummyjson.com/todos'

export const useTasksApiStore = defineStore('apiTasks', () => {
    const apiTasks = ref([])
    const userTasks = ref([])
    const loading = ref(false)
    const error = ref(null)
    const usuario = obtenerUsuario()

    const getTasks = async () => {
        const response = await axios.get(API_URL)
        apiTasks.value = response.data.todos
        console.log('tareas cargadas:', apiTasks.value)
    }

    return { apiTasks, getTasks }
})