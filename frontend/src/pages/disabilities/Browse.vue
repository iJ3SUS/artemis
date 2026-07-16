<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Incapacidades</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona las incapacidades de los empleados</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('disabilities.create')" color="primary" @handle="router.push('/disabilities/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nueva incapacidad
                    </Button>
                </template>
            </Heading>
        </template>

        <Table>
            <template #top>
                <div class="p-4">
                    <SearchInput v-model="inputs.search" @handle="onSearch" placeholder="Número, observación" label="Buscar" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">#</Column>
                    <Column class="text-center">Empleado</Column>
                    <Column class="text-center">Enfermedad</Column>
                    <Column class="text-center">Inicio</Column>
                    <Column class="text-center">Terminación</Column>
                    <Column class="text-center">Días</Column>
                    <Column class="text-center">Monto</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <template v-if="disabilities">
                    <Row v-for="d in disabilities.items" :key="d._id">
                        <Column>
                            <p class="text-sm font-medium text-gray-900">{{ d.number }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ d.employee?.display_name || '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ d.diseases?.map(dz => dz.code).join(', ') || '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.start_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.end_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700 text-center">{{ d.paid_days }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700 text-center">{{ d.amount ? `$${d.amount.toLocaleString()}` : '-' }}</p>
                        </Column>
                        <Column>
                            <div class="flex items-center justify-center gap-2">
                                <Button v-if="$can('disabilities.update')" theme="icon" v-tooltip:left="'Editar'" @handle="router.push(`/disabilities/${d._id}/edit`)">
                                    <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                                </Button>
                            </div>
                        </Column>
                    </Row>
                </template>
            </template>

            <template #pagination>
                <Pagination v-if="disabilities" :pagination="disabilities.pagination" />
            </template>
        </Table>

    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const disabilities = ref(null)

const inputs = reactive({
    search: ''
})

const onSearch = (val) => {
    router.push({ query: { ...route.query, search: val || undefined, page: 1 } })
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/disabilities',
        params: {
            page: route.query?.page || 1,
            limit: 15,
            search: String(route.query?.search || '')
        }
    })

    if(!success) return

    disabilities.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
