<template>
    <Modal v-if="show" :title="isEdit ? 'Editar familiar' : 'Agregar familiar'" :subtitle="isEdit ? 'Actualiza los datos del familiar' : 'Registra un nuevo familiar'" @close="$emit('close')">
        <template #content>
            <div class="p-6">
                <Grid columns="6">
                    <Col size="3">
                        <Text v-model="form.names" :errors="errors" name="names" label="Nombres" placeholder="Nombres del familiar" />
                    </Col>
                    <Col size="3">
                        <Text v-model="form.surnames" :errors="errors" name="surnames" label="Apellidos" placeholder="Apellidos del familiar" />
                    </Col>
                    <Col size="3">
                        <Select v-model="form.relationship" :errors="errors" name="relationship" label="Parentezco" :options="relationshipOptions" placeholder="Seleccionar" clearable />
                    </Col>
                    <Col size="3">
                        <Select v-model="form.gender" :errors="errors" name="gender" label="Género" :options="genderOptions" placeholder="Seleccionar" clearable />
                    </Col>
                    <Col size="3">
                        <Text v-model="form.birth_date" :errors="errors" name="birth_date" label="F. nacimiento" type="date" />
                    </Col>
                </Grid>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-3">
                <Button color="gray" @handle="$emit('close')" :disabled="loading">Cancelar</Button>
                <Button color="primary" @handle="isEdit ? update() : save()" :loading="loading">{{ isEdit ? 'Actualizar' : 'Guardar' }}</Button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { genderOptions, relationshipOptions } from '../options'

const emit = defineEmits<{
    close: []
    success: []
}>()

const props = defineProps<{
    show: boolean
    member: Record<string, any> | null
    employeeId: string
}>()

const isEdit = computed(() => !!props.member)

const { form, loading, errors, submit, reset, fill } = useForm({
    names: '',
    surnames: '',
    relationship: '',
    gender: '',
    birth_date: null
})

watch(() => props.show, (val) => {
    if (val && props.member) {
        fill(props.member)
    } else if (val) {
        reset()
    }
})

const save = async () => {
    const { success } = await submit({
        method: 'POST',
        url: `dashboard/employees/${props.employeeId}/family`
    })

    if (!success) return

    reset()
    emit('success')
}

const update = async () => {
    const { success } = await submit({
        method: 'PUT',
        url: `dashboard/employees/${props.employeeId}/family/${props.member._id}`
    })

    if (!success) return

    reset()
    emit('success')
}
</script>
