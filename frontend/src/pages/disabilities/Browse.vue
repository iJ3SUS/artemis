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
                        <Column>
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.start_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column>
                            <p class="text-sm text-gray-700">{{ $ParseDate(d.end_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </Column>
                        <Column>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="d.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                {{ d.status === 'paid' ? 'Pagada' : 'Pendiente' }}
                            </span>
                        </Column>
                        <Column>
                            <div class="flex items-center justify-center gap-2">
                                <Button v-if="d.status !== 'paid' && $can('disabilities.update')" color="primary" @handle="openPayment(d)">
                                    Pagar
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

        <Modal v-if="showPaymentModal" title="Pagar incapacidad" :subtitle="`#${paymentData.number} - ${paymentData.employee?.display_name}`" size="sm:max-w-md" @close="closePayment">
            <template #content>
                <div class="space-y-4 p-1">
                    <Text
                        v-model="paymentForm.paid_days"
                        label="Días pagados"
                        name="paid_days"
                        type="number"
                        :errors="paymentErrors"
                    />
                    <Text
                        v-model="paymentForm.payment_date"
                        label="Fecha de pago"
                        name="payment_date"
                        type="date"
                        :transform="formatDateInput"
                        :errors="paymentErrors"
                    />
                    <Textarea
                        v-model="paymentForm.notes"
                        label="Información adicional"
                        name="notes"
                        :errors="paymentErrors"
                    />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button color="gray" @handle="closePayment">Cancelar</Button>
                    <Button color="primary" @handle="pay" :disabled="!http.loading">Confirmar pago</Button>
                </div>
            </template>
        </Modal>

    </Page>
</template>

<script setup lang="ts">

import Swal from 'sweetalert2'

const http = useHttp()
const route = useRoute()
const router = useRouter()

const disabilities = ref(null)

const inputs = reactive({
    search: ''
})

const showPaymentModal = ref(false)
const paymentData = ref(null)
const paymentForm = reactive({
    paid_days: 0,
    payment_date: null,
    notes: ''
})
const paymentErrors = ref({})

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
    paymentForm.paid_days = disability.paid_days || 0
    paymentForm.payment_date = disability.payment_date || null
    paymentForm.notes = disability.notes || ''
    paymentErrors.value = {}
    showPaymentModal.value = true
}

const closePayment = () => {
    showPaymentModal.value = false
    paymentData.value = null
}

const pay = async () => {

    const { success, response, message } = await http.request({
        method: 'PUT',
        url: `dashboard/disabilities/${paymentData.value._id}`,
        data: {
            paid_days: paymentForm.paid_days,
            payment_date: paymentForm.payment_date,
            notes: paymentForm.notes,
            status: 'paid'
        }
    })

    if(!success) {
        if (response?.errors) {
            paymentErrors.value = response.errors
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'Ocurrió un error al procesar el pago',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Pagada',
        text: 'La incapacidad se marcó como pagada correctamente',
        confirmButtonText: 'Aceptar'
    })

    closePayment()
    load()

}

const formatDateInput = (val) => {
    if (!val) return ''
    const str = String(val)
    try {
        return $ParseDate(str)?.toFormat('yyyy-MM-dd') ?? ''
    } catch {
        return str.length >= 10 ? str.substring(0, 10) : str
    }
}

watch(() => route.query, () => {
    load()
})


onMounted(() => {
    if (route.query?.search) inputs.search = String(route.query.search)
    load()
})
</script>
