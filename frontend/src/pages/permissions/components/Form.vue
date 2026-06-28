<template>
    <div>

        <Card>
            <template #header>
                Información del permiso
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="3">
                        <Text
                            v-model="form.name"
                            :errors="errors"
                            name="name"
                            label="Nombre"
                            placeholder="Nombre del permiso"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.key"
                            :errors="errors"
                            name="key"
                            label="Clave"
                            placeholder="ej: users.create"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.module"
                            :errors="errors"
                            name="module"
                            label="Módulo"
                            placeholder="ej: users"
                        />
                    </Col>
                    <Col size="6">
                        <Textarea
                            v-model="form.description"
                            :errors="errors"
                            name="description"
                            label="Descripción"
                            placeholder="Descripción del permiso"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

    </div>
</template>
<script setup>

const props = defineProps({
    errors: Object,
    form: Object
})

</script>
