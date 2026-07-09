<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/disabilities')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Crear incapacidad</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Registra una nueva incapacidad</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('disabilities.create')" color="primary" @handle="create" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <Form :form :errors></Form>
    </Page>
</template>

<script setup lang="ts">
import { DisabilitySchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()

const { form, errors, submit } = useForm(DisabilitySchema)

const create = async () => {

    const { success, message } = await submit({
        method: 'POST',
        url: 'dashboard/disabilities'
    })

    if(!success) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'Ocurrió un error al guardar la incapacidad',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'La incapacidad se guardó correctamente',
        confirmButtonText: 'Aceptar'
    })

    router.push('/disabilities')

}

</script>
