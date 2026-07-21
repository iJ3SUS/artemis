<template>
    <div class="space-y-4 p-1">
                <div class="flex gap-4">
                    <div class="flex-1 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inicio</p>
                        <p class="text-lg font-bold text-gray-900 mt-0.5">{{ $ParseDate(disability.start_date).toFormat('dd/MM/yyyy') }}</p>
                    </div>
                    <div class="flex-1 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Terminación</p>
                        <p class="text-lg font-bold text-gray-900 mt-0.5">{{ $ParseDate(disability.end_date).toFormat('dd/MM/yyyy') }}</p>
                    </div>
                </div>
                <Text
                    v-model="form.days_paid"
                    label="Días pagados"
                    name="days_paid"
                    type="number"
                    :errors="errors"
                />
                <Text
                    v-model="form.amount"
                    label="Valor del pago"
                    name="amount"
                    type="text"
                    money
                    :mask="{
                        mask: Number,
                        scale: 0,
                        thousandsSeparator: ' ',
                        padFractionalZeros: false,
                        normalizeZeros: true,
                        radix: '.',
                        mapToRadix: [','],
                        min: 0,
                        autofix: true,
                    }"
                    :errors="errors"
                    placeholder="0"
                />
                <Text
                    v-model="form.paid_at"
                    label="Fecha de pago"
                    name="paid_at"
                    type="date"
                    :transform="(val) => String(val || '').substring(0, 10)"
                    :errors="errors"
                />
                <Textarea
                    v-model="form.observations"
                    label="Observaciones"
                    name="observations"
                    :errors="errors"
                />
        <div class="flex justify-end gap-2 pt-2">
            <Button color="gray" @handle="() => $emit('close')">Cancelar</Button>
            <Button color="primary" @handle="() => pay()" :loading="loading">Confirmar pago</Button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { DateTime } from 'luxon'
import Swal from 'sweetalert2'

const emit = defineEmits<{
    close: []
    success: []
}>()

const props = defineProps<{
    disability: Record<string, any> | null
}>()

const { form, loading, errors, submit, fill } = useForm({
    days_paid: 0,
    amount: '',
    paid_at: null,
    observations: ''
})

onMounted(() => {
    fill(props.disability)
    form.paid_at = DateTime.now().toFormat('yyyy-MM-dd')
    const start = ParseDate(props.disability.start_date)
    const end = ParseDate(props.disability.end_date)
    form.days_paid = Math.ceil(end.diff(start, 'days').days)
})

const pay = async () => {

    const { success, message } = await submit({
        method: 'PUT',
        url: `dashboard/disabilities/${props.disability._id}/payment`,
    })

    if(!success) {
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

    emit('success')
}
</script>

