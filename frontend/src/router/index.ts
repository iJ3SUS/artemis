import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.is_logged_in) {
        await auth.check()
    }

    if (to.meta.protected && !auth.is_logged_in) {
        return '/login'
    }

    if (to.path === '/login' && auth.is_logged_in) {
        return '/'
    }
})

export default router
