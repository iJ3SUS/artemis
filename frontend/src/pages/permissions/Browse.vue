<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Permisos</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona los permisos del sistema</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push('/permissions/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nuevo permiso
                    </Button>
                </template>
            </Heading>
        </template>

        <Table>
            <template #top>
                <div class="p-4">
                    <SearchInput v-model="inputs.search" @handle="onSearch" placeholder="Nombre, clave, módulo" label="Buscar" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Clave</Column>
                    <Column class="text-center">Módulo</Column>
                    <Column class="text-center">Descripción</Column>
                    <Column class="text-center">Creado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <template v-if="permissions">
                    <Row v-for="perm in permissions.items" :key="perm._id">
                    <Column>
                        <p class="text-sm font-medium text-gray-900">{{ perm.name }}</p>
                    </Column>
                    <Column>
                        <code class="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{{ perm.key }}</code>
                    </Column>
                    <Column>
                        <span class="text-sm text-gray-700">{{ perm.module }}</span>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-500 truncate max-w-[200px]">{{ perm.description || '-' }}</p>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(perm.created_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(perm.created_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" v-tooltip:left="'Editar'" @handle="router.push(`/permissions/${perm._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                            </Button>
                        </div>
                    </Column>
                </Row>
                </template>
            </template>

            <template #pagination>
                <Pagination v-if="permissions" :pagination="permissions.pagination" />
            </template>
        </Table>

    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const permissions = ref(null)

const inputs = reactive({
    search: ''
})

const onSearch = (val) => {
    router.push({ query: { ...route.query, search: val || undefined, page: 1 } })
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/permissions',
        params: {
            page: route.query?.page || 1,
            limit: 10,
            search: String(route.query?.search || '')
        }
    })

    if(!success) return

    permissions.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
