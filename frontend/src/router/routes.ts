const Login = () => import('@/pages/Login.vue')
const Home = () => import('@/pages/home/Index.vue')
const Users = () => import('@/pages/users/Browse.vue')
const UserEdit = () => import('@/pages/users/Edit.vue')
const UserCreate = () => import('@/pages/users/Create.vue')
const Roles = () => import('@/pages/roles/Browse.vue')
const RoleEdit = () => import('@/pages/roles/Edit.vue')
const RoleCreate = () => import('@/pages/roles/Create.vue')
const JobTitles = () => import('@/pages/job-titles/Browse.vue')
const JobTitleEdit = () => import('@/pages/job-titles/Edit.vue')
const JobTitleCreate = () => import('@/pages/job-titles/Create.vue')
const JobTitleOrganizationalChart = () => import('@/pages/job-titles/OrganizationalChart.vue')
const Employees = () => import('@/pages/employees/Browse.vue')
const EmployeeEdit = () => import('@/pages/employees/Edit.vue')
const EmployeeCreate = () => import('@/pages/employees/Create.vue')
const EmployeeShow = () => import('@/pages/employees/Show.vue')

export const routes = [
    { path: '/login', label: 'Login', component: Login },
    { path: '/', label: 'Dashboard', icon: 'Home', component: Home, meta: { protected: true, section: 'main', order: 1 } },
    { path: '/organizational-chart', label: 'Organigrama', icon: 'UserCog', component: JobTitleOrganizationalChart, meta: { protected: true, section: 'main', order: 2 } },
    { path: '/employees', label: 'Empleados', icon: 'Account', component: Employees, meta: { protected: true, section: 'management', order: 1 } },
    { path: '/employees/create', label: 'Crear empleado', component: EmployeeCreate, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/employees/:id', label: 'Detalle empleado', component: EmployeeShow, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/employees/:id/edit', label: 'Editar empleado', component: EmployeeEdit, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/job-titles', label: 'Cargos laborales', icon: 'Briefcase', component: JobTitles, meta: { protected: true, section: 'management', order: 2 } },
    { path: '/job-titles/create', label: 'Crear cargo', component: JobTitleCreate, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/job-titles/:id/edit', label: 'Editar cargo', component: JobTitleEdit, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/users', label: 'Usuarios', icon: 'UserShare', component: Users, meta: { protected: true, section: 'management', order: 3 } },
    { path: '/users/create', label: 'Crear usuario', component: UserCreate, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/users/:id/edit', label: 'Editar usuario', component: UserEdit, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/roles', label: 'Roles', icon: 'ID', component: Roles, meta: { protected: true, section: 'management', order: 4 } },
    { path: '/roles/create', label: 'Crear rol', component: RoleCreate, meta: { protected: true, section: 'management', sidebar: false } },
    { path: '/roles/:id/edit', label: 'Editar rol', component: RoleEdit, meta: { protected: true, section: 'management', sidebar: false } },
]

export const icons = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
}
