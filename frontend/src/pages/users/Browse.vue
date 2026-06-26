<template>
    <Page>
        <template #heading>
            <Heading>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Usuarios</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona los usuarios del sistema</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push('/users/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nuevo usuario
                    </Button>
                </template>
            </Heading>
        </template>

        <Table v-if="users">
            <template #top>
                <div class="p-4">
                    <SearchInput v-model="inputs.search" @handle="onSearch" placeholder="Nombre, email, identificación" label="Buscar" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Email</Column>
                    <Column class="text-center">Identificación</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Creado</Column>
                    <Column class="text-center">Actualizado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <Row v-for="user in users.items" :key="user._id">
                    <Column>
                        <div class="flex items-center gap-3">
                            <Avatar :name="user.display_name" />
                            <div>
                                <p class="text-sm font-medium text-gray-900 capitalize">{{ user.display_name }}</p>
                                <p class="text-xs text-gray-500">{{ user.identification }}</p>
                            </div>
                        </div>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ user.email }}</p>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <p class="text-sm text-gray-700">{{ user.identification }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                {{ user.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(user.created_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(user.created_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(user.updated_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(user.updated_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" title="Editar" @handle="router.push(`/users/${user._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                            </Button>
                            <Button theme="icon" title="Cambiar contraseña">
                                <Icon icon="Key" width="16" height="16" class="text-inherit" />
                            </Button>
                        </div>
                    </Column>
                </Row>
            </template>

            <template #pagination>
           
                <Pagination :pagination="users.pagination" />
               
            </template>
        </Table>
        
    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const users = ref(null)

const inputs = reactive({
    search: ''
})

const onSearch = (val) => {
    router.push({ query: { ...route.query, search: val || undefined, page: 1 } })
}

const load = async () => {
   
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/users',
        params: {
            page: route.query?.page || 1,
            limit: 10,
            search: String(route.query?.search || '')
        }
    })

    if(!success) return 

    users.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
