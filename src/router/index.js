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
    { path: '/', redirect: '/login' },
    { path: '/home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/verify-email', component: VerifyEmailView, meta: { requiresAuth: true } },
    { path: '/workspace', component: WorkspaceView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const usuario = obtenerUsuario()
  const isLoggedIn = usuario.value !== null
  const emailVerified = usuario.value?.emailVerified || false

  console.log('🔍 Navegando a:', to.path, { isLoggedIn, emailVerified })

  // 1. Si la ruta requiere autenticación y NO está logueado → Login
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log('❌ Redirigiendo a /login')
    next('/login')
    return
  }

  // 2. Si está logueado, email NO verificado, y NO está yendo a verify-email → Verify
  if (isLoggedIn && !emailVerified && to.path !== '/verify-email') {
    console.log('⚠️ Redirigiendo a /verify-email')
    next('/verify-email')
    return
  }

  // 3. Permitir navegación
  console.log('✅ Navegación permitida')
  next()
})


export default router