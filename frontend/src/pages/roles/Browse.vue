<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Roles</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona los roles del sistema</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push('/roles/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nuevo rol
                    </Button>
                </template>
            </Heading>
        </template>

        <Table v-if="roles">
            <template #top>
                <div class="p-4">
                    <Text v-model="inputs.search" label="Buscar" name="search" placeholder="Nombre, descripción" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Descripción</Column>
                    <Column class="text-center">Creado</Column>
                    <Column class="text-center">Actualizado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <Row v-for="role in roles.items" :key="role._id">
                    <Column>
                        <p class="text-sm font-medium text-gray-900">{{ role.name }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ role.description || '-' }}</p>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(role.created_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(role.created_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(role.updated_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(role.updated_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" title="Editar" @handle="router.push(`/roles/${role._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                            </Button>
                        </div>
                    </Column>
                </Row>
            </template>

            <template #pagination>
                <Pagination :pagination="roles.pagination" />
            </template>
        </Table>

    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const roles = ref(null)

const inputs = reactive({
    search: ''
})

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/roles',
        params: {
            page: route.query?.page || 1,
            limit: 10
        }
    })

    if(!success) return

    roles.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    load()
})
</script>
