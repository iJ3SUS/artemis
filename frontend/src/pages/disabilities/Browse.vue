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
                    <Column class="text-center">Días</Column>
                    <Column class="text-center">Vigencia</Column>
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
                            <p class="text-sm text-gray-900 font-medium">
                                {{ $ParseDate(d.end_date)?.diff($ParseDate(d.start_date), 'days').days || '-' }}
                            </p>
                        </Column>
                        <Column class="text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="isActive(d) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'">
                                {{ isActive(d) ? 'Vigente' : 'Vencida' }}
                            </span>
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
                                <Button v-if="$can('disabilities.update')" :disabled="d.status?.stage !== 1" theme="icon" v-tooltip:left="'Cancelar'" @handle="() => handleCancel(d)">
                                    <Icon icon="Cancel" width="16" height="16" class="text-inherit" />
                                </Button>
                                <Button v-if="$can('disabilities.update')" :disabled="d.status?.stage !== 1" theme="icon" v-tooltip:left="'Editar'" @handle="() => router.push(`/disabilities/${d._id}/edit`)">
                                    <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                                </Button>
                                <Button theme="icon" v-tooltip:left="'Línea de tiempo'" @handle="() => openTimeline(d)">
                                    <Icon icon="Logs" width="16" height="16" class="text-inherit" />
                                </Button>
                                <Button theme="icon" v-tooltip:left="'Detalle'" @handle="() => openDetail(d)">
                                    <Icon icon="Eye" width="16" height="16" class="text-inherit" />
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

    <Transition name="fade">
        <Modal v-if="modal.payment" title="Pagar incapacidad" :subtitle="`#${current.payment.number} - ${current.payment.employee?.display_name}`" size="sm:max-w-md" @close="() => { modal.payment = false; current.payment = null }">
            <PaymentModal :disability="current.payment" @close="() => { modal.payment = false; current.payment = null }" @success="() => { modal.payment = false; current.payment = null; load() }" />
        </Modal>
    </Transition>

    <Transition name="fade">
        <Modal v-if="modal.timeline" title="Línea de tiempo" :subtitle="`#${current.timeline.number} - ${current.timeline.employee?.display_name}`" size="sm:max-w-lg" @close="() => { modal.timeline = false; current.timeline = null }">
            <TimelineModal :timeline="current.timeline.timeline" />
        </Modal>
    </Transition>

    <Transition name="fade">
        <Modal v-if="modal.detail" title="Detalle de incapacidad" :subtitle="`#${current.detail.number} - ${current.detail.employee?.display_name}`" size="sm:max-w-lg" @close="() => { modal.detail = false; current.detail = null }">
            <DetailModal :disability="current.detail" />
        </Modal>
    </Transition>

</template>

<script setup lang="ts">

import Swal from 'sweetalert2'
import { DateTime } from 'luxon'
import { statusOptions } from './options'
import PaymentModal from './components/PaymentModal.vue'
import TimelineModal from './components/TimelineModal.vue'
import DetailModal from './components/DetailModal.vue'

const http = useHttp()
const route = useRoute()
const router = useRouter()

const disabilities = ref(null)

const inputs = reactive({
    search: ''
})

const modal = reactive({ payment: false, timeline: false, detail: false })
const current = reactive({ payment: null, timeline: null, detail: null })

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

const isActive = (d) => {
    const today = DateTime.now().startOf('day')
    const start = ParseDate(d.start_date)?.startOf('day')
    const end = ParseDate(d.end_date)?.startOf('day')
    if (!start || !end) return false
    return today >= start && today <= end
}

const openPayment = (disability) => {
    current.payment = disability
    modal.payment = true
}

const openTimeline = (disability) => {
    current.timeline = disability
    modal.timeline = true
}

const openDetail = (disability) => {
    current.detail = disability
    modal.detail = true
}

const handleCancel = async (disability) => {
    const { value: observation } = await Swal.fire({
        title: 'Cancelar incapacidad',
        text: `#${String(disability.number).padStart(5, '0')} - ${disability.employee?.display_name}`,
        icon: 'warning',
        input: 'textarea',
        inputPlaceholder: 'Motivo de cancelación (opcional)',
        inputAttributes: { 'aria-label': 'Motivo de cancelación' },
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Volver',
        confirmButtonColor: '#dc2626',
        reverseButtons: true,
    })

    if (observation === undefined) return

    const { success, message } = await http.request({
        method: 'PUT',
        url: `dashboard/disabilities/${disability._id}/cancel`,
        data: { observation: observation || '' },
    })

    if (!success) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'No se pudo cancelar la incapacidad',
            confirmButtonText: 'Aceptar',
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Cancelada',
        text: 'La incapacidad se canceló correctamente',
        confirmButtonText: 'Aceptar',
    })

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
