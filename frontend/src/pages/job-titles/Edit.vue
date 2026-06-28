<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/job-titles')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Editar cargo</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Modifica los datos del cargo</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('job-titles.update')" color="primary" @handle="update" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <div v-if="jobTitle">
            <Form :form :errors></Form>
        </div>
    </Page>
</template>

<script setup lang="ts">
import { JobTitleSchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()
const route = useRoute()

const optionStore = useOptionsStore()

const { form, errors, fill, submit } = useForm(JobTitleSchema)

const jobTitle = ref(null)

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: `dashboard/job-titles/${route.params.id}`
    })

    if(!success) return

    jobTitle.value = response

    fill(response)

}

const update = async () => {

    const { success, response } = await submit({
        method: 'PUT',
        url: `dashboard/job-titles/${route.params.id}`
    })

    if(!success) return

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El cargo se actualizó correctamente',
        confirmButtonText: 'Aceptar'
    })

    optionStore.refresh('job_titles')

}

onMounted(() => {

    load()

})

</script>
