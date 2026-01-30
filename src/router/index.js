import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import VerifyEmailView from '@/views/Verify-emailView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { estaAutenticado } from '@/servicios/autentication.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/verify-email', component: VerifyEmailView },
    { path: '/workspace', component: WorkspaceView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, format, next) => {
  if (to.meta.requiresAuth) {
    if (estaAutenticado()) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
