<template>
    <Modal v-if="show" :title="`Actualizar salario`" :subtitle="`${employee.names} ${employee.surnames}`" @close="close">
        <div class="space-y-4">
            <div v-if="employee.salary" class="flex items-center gap-2 px-3 py-2.5 rounded-md bg-surface-hover">
                <span class="text-sm text-text-muted">Salario actual:</span>
                <span class="text-sm font-semibold text-text">{{ formatCurrency(employee.salary) }}</span>
            </div>

            <Text
                v-model="form.salary"
                label="Nuevo salario"
                name="salary"
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

            <Textarea
                v-model="form.reason"
                label="Motivo (opcional)"
                name="reason"
                :errors="errors"
                placeholder="Ej: Ajuste anual, promoción..."
            />
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button color="gray" @handle="close">Cancelar</Button>
                <Button color="primary" @handle="update" :disabled="loading">Guardar</Button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    employee: Record<string, any>
}>()

const emit = defineEmits<{
    'close': []
    'saved': []
}>()

const { form, errors, loading, submit } = useForm({
    salary: props.employee?.salary || '',
    reason: ''
})

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value)
}

const close = () => {
    errors.value = {}
    emit('close')
}

const update = async () => {
    const { success } = await submit({
        method: 'PUT',
        url: `dashboard/employees/${props.employee._id}/salary`
    })

    if (!success) return

    Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El salario se actualizó correctamente',
        confirmButtonText: 'Aceptar'
    })

    emit('saved')
    emit('close')
}
</script>
