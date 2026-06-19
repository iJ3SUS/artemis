<template>
    <Page>
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button color="gray" @handle="router.push('/users')">
                    <Icon icon="ArrowLeft" width="16" height="16" />
                </Button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Crear usuario</h1>
                    <p class="text-gray-600 mt-1">Agrega un nuevo usuario al sistema</p>
                </div>
            </div>
            <Button color="primary" @handle="create" :disabled="!http.loading">Guardar</Button>
        </div>

        <Form :form :errors></Form>
    </Page>
</template>

<script setup lang="ts">
import { UserSchema } from "./schemas.ts"

import Form from './components/Form.vue'

const http = useHttp()

const router = useRouter()

const { form, errors, submit } = useForm(UserSchema)

const create = async () => {

    form.display_name = `${form.names} ${form.surnames}`.trim()

    const { success, response } = await submit({
        method: 'POST',
        url: 'dashboard/users'
    })

    if(!success) return

    router.push('/users')

}

</script>
