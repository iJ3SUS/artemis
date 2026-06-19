<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Cargos laborales</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Gestiona los cargos de la empresa</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push('/job-titles/create')">
                        <Icon icon="Plus" width="16" height="16" />
                        Nuevo cargo
                    </Button>
                    <Button color="gray" @handle="router.push('/job-titles/organizational-chart')">
                        <Icon icon="Sitemap" width="16" height="16" />
                        Organigrama
                    </Button>
                </template>
            </Heading>
        </template>

        <Table v-if="jobTitles">
            <template #top>
                <div class="p-4">
                    <Text v-model="inputs.search" label="Buscar" name="search" placeholder="Nombre, descripción" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Descripción</Column>
                    <Column class="text-center">Nivel</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Creado</Column>
                    <Column class="text-center">Actualizado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <Row v-for="jt in jobTitles.items" :key="jt._id">
                    <Column>
                        <p class="text-sm font-medium text-gray-900">{{ jt.name }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ jt.description || '-' }}</p>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Nivel {{ jt.level }}
                            </span>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="jt.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                {{ jt.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(jt.created_at).toFormat('dd/MM/yyyy') }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(jt.created_at).toFormat('hh:mm a') }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(jt.updated_at).toFormat('dd/MM/yyyy') }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(jt.updated_at).toFormat('hh:mm a') }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" title="Editar" @handle="router.push(`/job-titles/${jt._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" />
                            </Button>
                        </div>
                    </Column>
                </Row>
            </template>

            <template #pagination>
                <Pagination :pagination="jobTitles.pagination" />
            </template>
        </Table>

    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const jobTitles = ref(null)

const inputs = reactive({
    search: ''
})

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/job-titles',
        params: {
            page: route.query?.page || 1,
            limit: 15
        }
    })

    if(!success) return

    jobTitles.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    load()
})
</script>
