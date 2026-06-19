<template>
    <div class="p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p class="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>

        
            <Table>
                <template #top>
                    <div class="p-4 flex justify-between items-center">
                        <div class="w-72">
                            <Text v-model="search" label="Buscar" name="search" placeholder="Nombre, email, identificación" @enter="onSearch" />
                        </div>
                        <Button color="primary" @handle="openCreate">
                            <Icon icon="Account" width="16" height="16" class="mr-1" />
                            Agregar
                        </Button>
                    </div>
                </template>

                <template #head>
                    <tr>
                        <th class="p-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                        <th class="p-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th class="p-3 text-left text-sm font-semibold text-gray-700">Identificación</th>
                        <th class="p-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                        <th class="p-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </template>

                <template #body>
                    <Row v-for="user in users" :key="user._id">
                        <Column>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span class="text-sm font-semibold text-primary-600">{{ getInitials(user) }}</span>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ user.display_name || user.names }}</p>
                                    <p class="text-xs text-gray-500">{{ user.names }} {{ user.surnames }}</p>
                                </div>
                            </div>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ user.email }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ user.identification }}</p>
                        </Column>
                        <Column>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                {{ user.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </Column>
                        <Column>
                            <div class="flex items-center justify-center gap-2">
                                <Button theme="icon" color="gray" @handle="openEdit(user)" title="Editar">
                                    <Icon icon="Pencil" width="16" height="16" />
                                </Button>
                                <Button theme="icon" color="gray" @handle="openPasswordModal(user._id)" title="Cambiar contraseña">
                                    <Icon icon="Key" width="16" height="16" />
                                </Button>
                                <Button theme="icon" color="danger" @handle="deleteUser(user._id)" title="Eliminar">
                                    <Icon icon="Trash" width="16" height="16" />
                                </Button>
                            </div>
                        </Column>
                    </Row>
                </template>

                <template #pagination>
                    <div class="p-4">
                        <Pagination :pagination="pagination" />
                    </div>
                </template>
            </Table>
        

        <Modal v-if="show_modal" :title="editing_user ? 'Editar usuario' : 'Nuevo usuario'" @close="show_modal = false">
            <Grid :columns="12">
                <Col :size="6">
                    <Text v-model="form.names" label="Nombres" name="names" :errors="form.errors" />
                </Col>
                <Col :size="6">
                    <Text v-model="form.surnames" label="Apellidos" name="surnames" :errors="form.errors" />
                </Col>
                <Col :size="12">
                    <Text v-model="form.display_name" label="Nombre para mostrar" name="display_name" :errors="form.errors" />
                </Col>
                <Col :size="6">
                    <Text v-model="form.email" label="Email" name="email" :errors="form.errors" />
                </Col>
                <Col :size="6">
                    <Text v-model="form.identification" label="Identificación" name="identification" :errors="form.errors" />
                </Col>
                <Col :size="4" v-if="form.phone">
                    <Text v-model="form.phone.indicative" label="Indicativo" name="phone_indicative" :errors="form.errors" />
                </Col>
                <Col :size="8" v-if="form.phone">
                    <Text v-model="form.phone.number" label="Teléfono" name="phone_number" :errors="form.errors" />
                </Col>
                <Col :size="12">
                    <Multiselect v-model="form.roles" label="Roles" :options="roles_options" option_label="name" option_value="_id" />
                </Col>
                <Col :size="12" v-if="!editing_user">
                    <Text v-model="form.password" label="Contraseña" name="password" type="password" :errors="form.errors" />
                </Col>
                <Col :size="12">
                    <Switch v-model="form.active" label="Activo" />
                </Col>
            </Grid>

            <template #footer>
                <Button color="primary" @handle="saveUser" :disabled="form.loading">
                    {{ form.loading ? 'Guardando...' : 'Guardar' }}
                </Button>
                <Button color="gray" @handle="show_modal = false">Cancelar</Button>
            </template>
        </Modal>

        <Modal v-if="show_password_modal" title="Cambiar contraseña" @close="show_password_modal = false">
            <Text v-model="form_password.password" label="Nueva contraseña" name="password" type="password" :errors="form_password.errors" />

            <template #footer>
                <Button color="primary" @handle="savePassword" :disabled="form_password.loading">
                    {{ form_password.loading ? 'Actualizando...' : 'Actualizar' }}
                </Button>
                <Button color="gray" @handle="show_password_modal = false">Cancelar</Button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
const http = useHttp()
const route = useRoute()
const router = useRouter()

const users = ref([])
const loading_table = ref(false)
const search = ref('')
const show_modal = ref(false)
const show_password_modal = ref(false)
const editing_user = ref(null)
const selected_user_id = ref(null)
const roles_options = ref([])
const pagination = ref({
    page: 1,
    total: 0,
    pages: 1,
    from: 0,
    to: 0
})

const form = useForm({
    names: '',
    surnames: '',
    display_name: '',
    email: '',
    identification: '',
    phone: {
        indicative: '',
        number: ''
    },
    active: true,
    roles: [],
    password: ''
})

const form_password = useForm({
    password: ''
})

const loadUsers = async () => {
    loading_table.value = true

    const page = route.query.page || 1
    const searchQuery = route.query.search || ''

    const { response, success } = await http.request({
        method: 'GET',
        url: '/dashboard/users',
        params: {
            page,
            limit: 10,
            search: searchQuery
        }
    })

    if (success) {
        users.value = response.docs || response
        pagination.value = response.pagination || {
            page: parseInt(page),
            total: users.value.length,
            pages: 1,
            from: 1,
            to: users.value.length
        }
    }

    loading_table.value = false
}

const loadRoles = async () => {
    const { response, success } = await http.request({
        method: 'GET',
        url: '/dashboard/roles'
    })

    if (success) {
        roles_options.value = response
    }
}

const onSearch = () => {
    router.push({
        query: {
            ...route.query,
            search: search.value,
            page: 1
        }
    })
}

const openCreate = () => {
    form.reset()
    form.phone = { indicative: '', number: '' }
    editing_user.value = null
    show_modal.value = true
}

const openEdit = (user) => {
    const normalized = {
        ...user,
        phone: {
            indicative: user.phone?.indicative || '',
            number: user.phone?.number || ''
        }
    }
    form.fill(normalized)
    editing_user.value = user
    show_modal.value = true
}

const saveUser = async () => {
    let result

    if (editing_user.value) {
        result = await form.submit({
            method: 'PUT',
            url: `/dashboard/users/${editing_user.value._id}`
        })
    } else {
        result = await form.submit({
            method: 'POST',
            url: '/dashboard/users'
        })
    }

    if (result.success) {
        show_modal.value = false
        loadUsers()
    }
}

const deleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

    const { success } = await http.request({
        method: 'DELETE',
        url: `/dashboard/users/${id}`
    })

    if (success) {
        loadUsers()
    }
}

const openPasswordModal = (id) => {
    selected_user_id.value = id
    form_password.reset()
    show_password_modal.value = true
}

const savePassword = async () => {
    const result = await form_password.submit({
        method: 'PUT',
        url: `/dashboard/users/${selected_user_id.value}/password`
    })

    if (result.success) {
        show_password_modal.value = false
    }
}

const getInitials = (user) => {
    const names = user.names || ''
    const surnames = user.surnames || ''
    return (names.charAt(0) + surnames.charAt(0)).toUpperCase()
}

watch(() => route.query.page, () => {
    loadUsers()
})

watch(() => route.query.search, (newVal) => {
    search.value = newVal || ''
})

onMounted(() => {
    search.value = route.query.search || ''
    loadUsers()
    loadRoles()
})
</script>
