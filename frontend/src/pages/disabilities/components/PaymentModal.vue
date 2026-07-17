<template>
    <Modal v-if="show" title="Pagar incapacidad" :subtitle="`#${disability.number} - ${disability.employee?.display_name}`" size="sm:max-w-md" @close="$emit('close')">
        <template #content>
            <div class="space-y-4 p-1">
                <Text
                    v-model="form.paid_days"
                    label="Días pagados"
                    name="paid_days"
                    type="number"
                    :errors="errors"
                />
                <Text
                    v-model="form.payment_date"
                    label="Fecha de pago"
                    name="payment_date"
                    type="date"
                    :transform="(val) => String(val || '').substring(0, 10)"
                    :errors="errors"
                />
                <Textarea
                    v-model="form.notes"
                    label="Información adicional"
                    name="notes"
                    :errors="errors"
                />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button color="gray" @handle="$emit('close')">Cancelar</Button>
                <Button color="primary" @handle="pay" :loading="loading">Confirmar pago</Button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">

import Swal from 'sweetalert2'

const emit = defineEmits<{
    close: []
    success: []
}>()

const props = defineProps<{
    show: boolean
    disability: Record<string, any> | null
}>()

const { form, loading, errors, submit, fill } = useForm({
    paid_days: 0,
    payment_date: null,
    notes: ''
})

watch(() => props.show, (val) => {
    if (val && props.disability) {
        fill(props.disability)
    }
})

const pay = async () => {

    form.status = 'paid'

    const { success, message } = await submit({
        method: 'PUT',
        url: `dashboard/disabilities/${props.disability._id}`,
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
