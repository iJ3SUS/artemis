<template>
    <Modal v-if="show" :title="`Cambiar contraseña`" :subtitle="user.display_name" @close="close">
        <div class="space-y-4">
            <Text
                v-model="form.password"
                label="Nueva contraseña"
                name="password"
                type="password"
                :errors="errors"
                placeholder="Mínimo 6 caracteres"
            />
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button color="gray" @handle="close">Cancelar</Button>
                <Button color="primary" @handle="change" :disabled="loading">Cambiar</Button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    user: Record<string, any>
}>()

const emit = defineEmits<{
    'close': []
}>()

const { form, errors, loading, submit } = useForm({
    password: ''
})

const close = () => {
    errors.value = {}
    emit('close')
}

const change = async () => {
    const { success } = await submit({
        method: 'PUT',
        url: `dashboard/users/${props.user._id}/password`
    })

    if (!success) return

    Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'La contraseña se cambió correctamente',
        confirmButtonText: 'Aceptar'
    })

    emit('close')
}
</script>
