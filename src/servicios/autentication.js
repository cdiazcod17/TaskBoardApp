import { auth } from '@/firebase/config.js'
import { ref } from 'vue'

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification

} from 'firebase/auth'

import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/firebase/config.js'

// variable global del usuario
const usuario = ref(null)

//escuchar cambios de la autenticacion
onAuthStateChanged(auth, (userFirebase) => {
    console.log("Auth: usuario detectado - ", userFirebase?.email || "Anonimo")
    usuario.value = userFirebase
})

//registrar usuario

export const registrar = async (email, password) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Usuario creado correctamente ✅', email);
        return {
            ok: true,
            mensaje: 'usuario creado correctamente',
            usuario: userCredentials
        }
    } catch (error) {
        console.log('Error verifique los datos ❌', error);
        return {
            ok: false,
            error: 'usuario no creado'
        }
    }
}
// login
export const login = async (email, password) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log('Sesion iniciada ✅', email);
        console.log(userCredentials);
        return {
            ok: true,
            mensaje: 'Sesion iniciada correctamente',
            usuario: userCredentials
        }

    } catch (error) {
        console.log('Error verifique los datos ❌', error);
        return {
            ok: false,
            error: 'usuario no creado'
        }
    }
}

export const logout = async () => {
    try {
        await signOut(auth)
        console.log('✅Sesion cerrada')
        return {
            ok: true
        }
    } catch (error) {
        console.log('❌', error)
        return {
            ok: false
        }
    }
}

export const estaAutenticado = () => {
    console.log(usuario)
    return usuario.value !== null
}

//Obtener usuario, si existe

export const obtenerUsuario = () => {
    return usuario
}

export const enviarEmailVerificacion = async (usuarioActual = null) => {
    try {
        const usuario = usuarioActual || auth.currentUser
        if (usuario.emailVerified) {
            console.log("✅ email ya verificado")
            return {
                ok: true,
                message: 'Email verificado'
            }
        }
        await sendEmailVerification(usuario, { url: window.location.origin + '/perfil' })
        return {
            ok: true,
            message: 'Email de verificacion enviado'
        }
    } catch (error) {
        console.log("❌ error al enviar email de verificacion", error)
    }
}

// Agregar tarea al usuario (exportar si la necesitas fuera del store)
export const assignTaskToUser = async (usuarioId, taskId) => {
    try {
        const docRef = doc(db, 'usuarios', usuarioId)
        await updateDoc(docRef, {
            tareas: arrayUnion(taskId),
            updatedAt: new Date()
        })
        return { ok: true }
    } catch (error) {
        console.error('Error asignando tarea:', error)
        return { ok: false, error: error.message }
    }
}

// Obtener tareas del usuario
export const getUserTasks = async (usuarioId) => {
    try {
        const docRef = doc(db, 'usuarios', usuarioId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {
                ok: true,
                tareas: docSnap.data().tareas || []
            }
        }
        return { ok: true, tareas: [] }
    } catch (error) {
        console.error('Error obteniendo tareas:', error)
        return { ok: false, error: error.message }
    }
}