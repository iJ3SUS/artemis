import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'
import Settings from '@/pages/Settings.vue'
import Users from '@/pages/users/Browse.vue'
import UserEdit from '@/pages/users/Edit.vue'
import UserCreate from '@/pages/users/Create.vue'

export const routes = [
    { path: '/login', label: 'Login', component: Login },
    { path: '/', label: 'Dashboard', icon: 'Home', component: Home, meta: { protected: true, section: 'main' } },
    { path: '/settings', label: 'Configuración', icon: 'Cog', component: Settings, meta: { protected: true, section: 'management' } },
    { path: '/users', label: 'Usuarios', icon: 'Account', component: Users, meta: { protected: true, section: 'management' } },
    { path: '/users/create', label: 'Crear usuario', component: UserCreate, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/users/:id/edit', label: 'Editar usuario', component: UserEdit, meta: { protected: true, section: 'management', sidebar: false } },
]

export const icons = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
}
