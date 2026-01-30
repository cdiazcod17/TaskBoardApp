import { db } from '@/firebase/config.js'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from 'firebase/firestore'

// Crear o actualizar perfil de usuario
export const guardarPerfilUsuario = async (usuarioId, datosPerfil) => {
    try {
        const docRef = doc(db, 'usuarios', usuarioId)

        // ✅ CORRECTO: merge: true para no borrar campos existentes
        await setDoc(docRef, {
            nombre_completo: datosPerfil.nombre_completo,
            edad: datosPerfil.edad,
            genero: datosPerfil.genero,
            descripcion: datosPerfil.descripcion,
            updatedAt: new Date()
        }, { merge: true })

        return {
            ok: true
        }
    } catch (error) {
        console.error('Error guardando perfil:', error)
        return {
            ok: false,
            error: error.message
        }
    }
}

// Obtener perfil de usuario
export const obtenerPerfilUsuario = async (usuarioId) => {
    try {
        const docRef = doc(db, 'usuarios', usuarioId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {
                ok: true,
                perfil: { id: docSnap.id, ...docSnap.data() }
            }
        } else {
            // ✅ CORRECTO: Retorna ok: false si no existe el documento
            return {
                ok: false,
                perfil: null,
                error: 'Perfil no encontrado'
            }
        }
    } catch (error) {
        console.error('Error obteniendo perfil:', error)
        return {
            ok: false,
            perfil: null,
            error: error.message
        }
    }
}
