<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/job-titles')">
                        <Icon icon="ArrowLeft" width="16" height="16" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Crear cargo</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Agrega un nuevo cargo laboral</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="create" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <Form :form :errors></Form>
    </Page>
</template>

<script setup lang="ts">
import { JobTitleSchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()

const optionStore = useOptionsStore()

const { form, errors, submit } = useForm(JobTitleSchema)

const create = async () => {

    const { success, response } = await submit({
        method: 'POST',
        url: 'dashboard/job-titles'
    })

    if(!success) return

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El cargo se guardó correctamente',
        confirmButtonText: 'Aceptar'
    })

    optionStore.refresh('job_titles')

    router.push('/job-titles')

}

</script>
