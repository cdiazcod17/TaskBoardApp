// stores/userTasks.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/servicios/autentication'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    getDocs
} from 'firebase/firestore'
import { db } from '@/firebase/config.js'

export const useUserTasksStore = defineStore('userTasks', () => {

    const userTasks = ref([])
    const allAssignedTasks = ref({})
    const loading = ref(false)
    const error = ref(null)

    const usuario = obtenerUsuario()

    // Cargar tareas del usuario actual desde Firebase
    const fetchUserTasks = async () => {
        if (!usuario.value) return

        loading.value = true
        error.value = null

        try {
            const docRef = doc(db, 'usuarios', usuario.value.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                userTasks.value = data.tareas || []
            } else {
                // Si no existe el documento, crearlo
                await setDoc(docRef, {
                    tareas: [],
                    email: usuario.value.email,
                    createdAt: new Date()
                })
                userTasks.value = []
            }
        } catch (err) {
            console.error('Error cargando tareas del usuario:', err)
            error.value = err.message
            userTasks.value = []
        } finally {
            loading.value = false
        }
    }

    // Cargar TODAS las asignaciones de tareas
    const fetchAllAssignments = async () => {
        try {
            const usuariosRef = collection(db, 'usuarios')
            const snapshot = await getDocs(usuariosRef)

            const assignments = {}

            snapshot.forEach((doc) => {
                const data = doc.data()
                const userId = doc.id
                const tareas = data.tareas || []

                // Por cada tarea asignada a este usuario
                tareas.forEach(taskId => {
                    assignments[taskId] = userId
                })
            })

            allAssignedTasks.value = assignments
            console.log('📋 Asignaciones cargadas:', assignments)
        } catch (err) {
            console.error('Error cargando asignaciones:', err)
        }
    }

    // Verificar si una tarea está asignada a ALGUIEN
    const isTaskAssigned = (taskId) => {
        return taskId in allAssignedTasks.value
    }

    // Verificar si una tarea está asignada al usuario ACTUAL
    const isTaskAssignedToCurrentUser = (taskId) => {
        return userTasks.value.includes(taskId)
    }

    // Verificar si una tarea está asignada a OTRO usuario
    const isTaskAssignedToOther = (taskId) => {
        if (!currentUser.value) return false
        const assignedTo = allAssignedTasks.value[taskId]
        return assignedTo && assignedTo !== currentUser.value.uid
    }

    // Verificar si una tarea puede ser asignada
    const canAssignTask = (task) => {
        // Regla 1: No se pueden asignar tareas completadas
        if (task.completed === true) {
            return { canAssign: false, reason: 'completada' }
        }

        // Regla 2: No se pueden asignar tareas ya asignadas a otro usuario
        if (isTaskAssignedToOther(task.id)) {
            return { canAssign: false, reason: 'asignada-a-otro' }
        }

        // Regla 3: No se pueden asignar tareas ya asignadas al usuario actual
        if (isTaskAssignedToCurrentUser(task.id)) {
            return { canAssign: false, reason: 'ya-asignada' }
        }

        return { canAssign: true, reason: null }
    }

    // Agregar tarea al usuario
    const addTask = async (taskId) => {
        if (!currentUser.value) return { ok: false, error: 'No hay usuario autenticado' }

        try {
            const docRef = doc(db, 'usuarios', currentUser.value.uid)

            // Verificar que el documento existe
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                // Crear documento si no existe
                await setDoc(docRef, {
                    tareas: [taskId],
                    email: currentUser.value.email,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            } else {
                // Actualizar documento existente
                await updateDoc(docRef, {
                    tareas: arrayUnion(taskId),
                    updatedAt: new Date()
                })
            }

            // Actualizar estado local
            if (!userTasks.value.includes(taskId)) {
                userTasks.value.push(taskId)
            }

            // Actualizar asignaciones globales
            allAssignedTasks.value[taskId] = currentUser.value.uid

            return { ok: true }
        } catch (err) {
            console.error('Error agregando tarea:', err)
            error.value = err.message
            return { ok: false, error: err.message }
        }
    }

    // Remover tarea del usuario
    const removeTask = async (taskId) => {
        if (!currentUser.value) return { ok: false, error: 'No hay usuario autenticado' }

        try {
            const docRef = doc(db, 'usuarios', currentUser.value.uid)

            // Remover taskId del array de tareas
            await updateDoc(docRef, {
                tareas: arrayRemove(taskId),
                updatedAt: new Date()
            })

            // Actualizar estado local
            const index = userTasks.value.indexOf(taskId)
            if (index > -1) {
                userTasks.value.splice(index, 1)
            }

            // Actualizar asignaciones globales
            delete allAssignedTasks.value[taskId]

            return { ok: true }
        } catch (err) {
            console.error('Error removiendo tarea:', err)
            error.value = err.message
            return { ok: false, error: err.message }
        }
    }

    // Retornar estado y acciones
    return {
        userTasks,
        allAssignedTasks,
        loading,
        error,
        fetchUserTasks,
        fetchAllAssignments,
        addTask,
        removeTask,
        isTaskAssigned,
        isTaskAssignedToCurrentUser,
        isTaskAssignedToOther,
        canAssignTask
    }
})