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
                    <Column class="text-center">Estado</Column>
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
                        <Column class="text-center">
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.start_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column class="text-center">
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.end_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column class="text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="d.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                {{ d.status === 'paid' ? 'Pagada' : 'Pendiente' }}
                            </span>
                        </Column>
                        <Column>
                            <div class="flex items-center justify-center gap-2">
                                <Button v-if="d.status?.stage === 1 && $can('disabilities.update')" theme="icon" v-tooltip:left="'Pagar'" @handle="openPayment(d)">
                                    <Icon icon="Dollar" width="16" height="16" class="text-inherit" />
                                </Button>
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

        <PaymentModal :show="showPaymentModal" :disability="paymentData" @close="closePayment" @success="onPaymentSuccess" />

    </Page>
</template>

<script setup lang="ts">

import PaymentModal from './components/PaymentModal.vue'

const http = useHttp()
const route = useRoute()
const router = useRouter()

const disabilities = ref(null)

const inputs = reactive({
    search: ''
})

const showPaymentModal = ref(false)
const paymentData = ref(null)

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
    paymentData.value = disability
    showPaymentModal.value = true
}

const closePayment = () => {
    showPaymentModal.value = false
    paymentData.value = null
}

const onPaymentSuccess = () => {
    closePayment()
    load()
}

watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
