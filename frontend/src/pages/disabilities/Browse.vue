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
                    <Button v-if="$can('disabilities.create')" color="primary" @handle="() => router.push('/disabilities/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nueva incapacidad
                    </Button>
                </template>
            </Heading>
        </template>

        <Table>
            <template #top>
                <div class="p-4">
                    <SearchInput v-model="inputs.search" @handle="(val) => onSearch(val)" placeholder="Número, observación" label="Buscar" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">#</Column>
                    <Column class="text-center">Empleado</Column>
                    <Column class="text-center">Enfermedad</Column>
                    <Column class="text-center">Inicio</Column>
                    <Column class="text-center">Terminación</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <template v-if="disabilities">
                    <Row v-for="d in disabilities.items" :key="d._id">
                        <Column class="text-center">
                            <p class="text-sm font-medium text-gray-900">{{ String(d.number).padStart(5, '0') }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ d.employee?.display_name || '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ d.diseases?.map(dz => dz.code).join(', ') || '-' }}</p>
                        </Column>
                        <Column class="text-center">
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.start_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column class="text-center">
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.end_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column class="text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="statusOptions.find(s => s.value === d.status?.stage)?.color || 'bg-gray-100 text-gray-800'">
                                {{ statusOptions.find(s => s.value === d.status?.stage)?.label || '-' }}
                            </span>
                        </Column>
                        <Column>
                            <div class="flex items-center justify-center gap-2">
                                <Button v-if="$can('disabilities.update')" :disabled="d.status?.stage !== 1" theme="icon" v-tooltip:left="'Pagar'" @handle="() => openPayment(d)">
                                    <Icon icon="Dollar" width="16" height="16" class="text-inherit" />
                                </Button>
                                <Button v-if="$can('disabilities.update')" :disabled="d.status?.stage !== 1" theme="icon" v-tooltip:left="'Editar'" @handle="() => router.push(`/disabilities/${d._id}/edit`)">
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

        
        <pre>
            {{ disabilities }}
        </pre>

    </Page>

    <Transition name="fade">
        <Modal v-if="modal.payment" title="Pagar incapacidad" :subtitle="`#${current.payment.number} - ${current.payment.employee?.display_name}`" size="sm:max-w-md" @close="() => { modal.payment = false; current.payment = null }">
            <PaymentModal :disability="current.payment" @close="() => { modal.payment = false; current.payment = null }" @success="() => { modal.payment = false; current.payment = null; load() }" />
        </Modal>
    </Transition>

</template>

<script setup lang="ts">

import { statusOptions } from './options'
import PaymentModal from './components/PaymentModal.vue'

const http = useHttp()
const route = useRoute()
const router = useRouter()

const disabilities = ref(null)

const inputs = reactive({
    search: ''
})

const modal = reactive({ payment: false })
const current = reactive({ payment: null })

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

const openPayment = (disability) => {
    current.payment = disability
    modal.payment = true
}

watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
