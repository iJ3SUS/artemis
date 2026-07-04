<template>
    <Modal v-if="show" title="Agregar familiar" subtitle="Registra un nuevo familiar" @close="$emit('close')">
        <Grid columns="6">
            <Col size="3">
                <Text v-model="form.names" label="Nombres" placeholder="Nombres del familiar" />
            </Col>
            <Col size="3">
                <Text v-model="form.surnames" label="Apellidos" placeholder="Apellidos del familiar" />
            </Col>
            <Col size="3">
                <Select v-model="form.relationship" label="Parentezco" :options="relationshipOptions" placeholder="Seleccionar" clearable />
            </Col>
            <Col size="3">
                <Select v-model="form.gender" label="Género" :options="genderOptions" placeholder="Seleccionar" clearable />
            </Col>
            <Col size="3">
                <Text v-model="form.birth_date" label="F. nacimiento" type="date" />
            </Col>
        </Grid>
        <template #footer>
            <div class="flex justify-end gap-3">
                <Button color="gray" @handle="$emit('close')">Cancelar</Button>
                <Button color="primary" @handle="save">Guardar</Button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { genderOptions, relationshipOptions } from '../options'

const emit = defineEmits<{
    close: []
    save: [member: Record<string, any>]
}>()

defineProps<{
    show: boolean
}>()

const { form, reset } = useForm({
    names: '',
    surnames: '',
    relationship: '',
    gender: '',
    birth_date: null
})

const save = () => {
    if (!form.names.trim() || !form.surnames.trim()) return
    emit('save', { ...form })
    reset()
}
</script>
