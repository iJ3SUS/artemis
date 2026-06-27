<template>
    <div>

        <Card>
            <template #header>
                Información del rol
            </template>

            <template #content>
                <Grid columns="1">
                    <Col>
                        <Text
                            v-model="form.name"
                            :errors="errors"
                            name="name"
                            label="Nombre"
                            placeholder="Nombre del rol"
                        />
                    </Col>
                    <Col>
                        <Textarea
                            v-model="form.description"
                            :errors="errors"
                            name="description"
                            label="Descripción"
                            placeholder="Descripción del rol"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <PermissionsSelector v-model="form.permissions" />

    </div>
</template>
<script setup>

import PermissionsSelector from './PermissionsSelector.vue'

const props = defineProps({
    errors: Object,
    form: Object
})

</script>
