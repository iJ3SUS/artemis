<template>
    <Page>
        <Heading :sticky="true">
            <template #back>
                <Button color="gray" @handle="router.push('/users')">
                    <Icon icon="ArrowLeft" width="16" height="16" />
                </Button>
            </template>
            <template #title>
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Editar usuario</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Modifica los datos del usuario</p>
                </div>
            </template>
            <template #actions>
                <Button color="primary" @handle="update" :disabled="!http.loading">Guardar</Button>
            </template>
        </Heading>

        <div v-if="user">
            <Form :form :errors></Form>

            <Form :form :errors></Form>
        </div>
    </Page>
</template>

<script setup lang="ts">
import { UserSchema } from "./schemas.ts"

import Form from './components/Form.vue'

const http = useHttp()

const router = useRouter()
const route = useRoute()

const { form, errors, fill, submit } = useForm(UserSchema)

const user = ref(null)

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: `dashboard/users/${route.params.id}`
    })

    if(!success) return

    user.value = response

    fill(response)

}

const update = async () => {

    form.display_name = `${form.names} ${form.surnames}`.trim()

    const { success, response } = await submit({
        method: 'PUT',
        url: `dashboard/users/${route.params.id}`
    })

    if(!success) return 

}

onMounted(() => {

    load()

})

</script>