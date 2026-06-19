<template>
    <Page>
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button color="gray" @handle="router.push('/users')">
                    <Icon icon="ArrowLeft" width="16" height="16" />
                </Button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Editar usuario</h1>
                    <p class="text-gray-600 mt-1">Modifica los datos del usuario</p>
                </div>
            </div>
            <Button color="primary" @handle="update" :disabled="!http.loading">Guardar</Button>
        </div>

        <div v-if="user">
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