<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Cargos laborales</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona los cargos de la empresa</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('job-titles.create')" color="primary" @handle="() => router.push('/job-titles/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nuevo cargo
                    </Button>
                </template>
            </Heading>
        </template>

        <Table>
            <template #top>
                <div class="p-4">
                    <SearchInput v-model="inputs.search" @handle="(val) => onSearch(val)" placeholder="Nombre, descripción, dependencia" label="Buscar" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Descripción</Column>
                    <Column class="text-center">Dependencia</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Creado</Column>
                    <Column class="text-center">Actualizado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <template v-if="jobTitles">
                    <Row v-for="jt in jobTitles.items" :key="jt._id">
                    <Column>
                        <p class="text-sm font-medium text-gray-900">{{ jt.name }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ jt.description || '-' }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ jt.dependency || '-' }}</p>
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
                            <p class="text-sm text-gray-900">{{ $ParseDate(jt.created_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(jt.created_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex flex-col items-center">
                            <p class="text-sm text-gray-900">{{ $ParseDate(jt.updated_at)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                            <p class="text-xs text-gray-500">{{ $ParseDate(jt.updated_at)?.toFormat('hh:mm a') ?? '-' }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button v-if="$can('job-titles.update')" theme="icon" v-tooltip:left="'Editar'" @handle="() => router.push(`/job-titles/${jt._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                            </Button>
                            <Button theme="icon" v-tooltip:left="'Imprimir PDF'" @handle="() => openPrintModal(jt)">
                                <Icon icon="Order" width="16" height="16" class="text-inherit" />
                            </Button>
                        </div>
                    </Column>
                </Row>
                </template>
            </template>

            <template #pagination>
                <Pagination v-if="jobTitles" :pagination="jobTitles.pagination" />
            </template>
        </Table>

    </Page>

    <Transition name="fade">
        <Modal v-if="modal.print" title="Imprimir ficha del cargo" :subtitle="current.print?.name" size="sm:max-w-lg" @close="() => { modal.print = false; current.print = null; selectedEmployee = null }">
            <div class="space-y-4 p-1 min-h-[280px]">
                <SearchSelect
                    v-model="searchEmployee"
                    label="Empleado"
                    name="employee"
                    :route="$url('dashboard/employees/list')"
                >
                    <template #items="{ result }">
                        <div
                            v-for="item in result"
                            :key="item._id"
                            class="px-3 py-2.5 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                            @mousedown.prevent="selectEmployee(item)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                    {{ item.display_name?.charAt(0)?.toUpperCase() }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="font-medium text-gray-900 truncate">{{ item.display_name }}</p>
                                    <div class="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                        <span>{{ item.identification }}</span>
                                        <span v-if="item.email" class="truncate">{{ item.email }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </SearchSelect>
            </div>
            <template #footer>
                <div class="flex justify-end">
                    <Button color="primary" :disabled="!selectedEmployee" @handle="() => generatePdf()">
                        Generar PDF
                    </Button>
                </div>
            </template>
        </Modal>
    </Transition>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const jobTitles = ref(null)
const modal = reactive({ print: false })
const current = reactive({ print: null })
const searchEmployee = ref('')
const selectedEmployee = ref(null)

const inputs = reactive({
    search: ''
})

const onSearch = (val) => {
    router.push({ query: { ...route.query, search: val || undefined, page: 1 } })
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/job-titles',
        params: {
            page: route.query?.page || 1,
            limit: 15,
            search: String(route.query?.search || '')
        }
    })

    if(!success) return

    jobTitles.value = response

}

const openPrintModal = (jt) => {
    current.print = jt
    selectedEmployee.value = null
    searchEmployee.value = ''
    modal.print = true
}

const selectEmployee = (item) => {
    searchEmployee.value = item.display_name
    selectedEmployee.value = item
}

const getToken = () => {
    const raw = localStorage.getItem(import.meta.env.VITE_SESSION_KEY || 'session')
    if (!raw) return ''
    try {
        const session = JSON.parse(raw)
        return session?.access_token || ''
    } catch {
        return ''
    }
}

const generatePdf = async () => {
    if (!selectedEmployee.value || !current.print) return

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/dashboard/job-titles/${current.print._id}/print?employee_id=${encodeURIComponent(selectedEmployee.value._id)}`

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
    })

    if (!response.ok) return

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')

    modal.print = false
    current.print = null
    selectedEmployee.value = null
}

watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
