import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import VerifyEmailView from '@/views/Verify-emailView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { estaAutenticado, obtenerUsuario } from '@/servicios/autentication.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView, meta: { guestOnly: true } },
    { path: '/home', component: HomeView, meta: { requiresAuth: true, requiresEmailVerified: true } },
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', component: RegisterView, meta: { guestOnly: true } },
    { path: '/verify-email', component: VerifyEmailView, meta: { requiresAuth: true } },
    { path: '/workspace', component: WorkspaceView, meta: { requiresAuth: true, requiresEmailVerified: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const usuario = obtenerUsuario()
  const isLoggedIn = usuario.value !== null
  const emailVerified = usuario.value?.emailVerified || false

  console.log('🔍 Navegación:', {
    destino: to.path,
    isLoggedIn,
    emailVerified,
    meta: to.meta
  })

  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log('No autenticado, redirigiendo a login')
    next('/login')
    return
  }

  if (to.meta.requiresEmailVerified && isLoggedIn && !emailVerified) {
    console.log('⚠️ Email no verificado, redirigiendo a verify-email')
    next('/verify-email')
    return
  }

  if (to.meta.guestOnly && isLoggedIn) {

    if (emailVerified) {
      console.log('Ya autenticado con email verificado, redirigiendo a home')
      next('/home')
      return
    } else {

      console.log('Autenticado pero sin verificar email, redirigiendo a verify-email')
      next('/verify-email')
      return
    }
  }
  console.log('Navegación permitida')
  next()
})

export default router