import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth'

function get_label(path: string): string {
    for (const r of routes) {
        if (r.path === path) return (r as any).label
    }
    return ''
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes as unknown as RouteRecordRaw[],
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

router.afterEach((to) => {
    const company = import.meta.env.VITE_COMPANY_NAME
    const label = get_label(to.matched[0]?.path)
    document.title = label ? `${label} | ${company}` : company
})

export default router
