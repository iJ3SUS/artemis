<template>
    <Page>
        <div class="mb-6 flex items-center gap-4">
            <Button color="gray" @handle="router.push('/users')">
                <Icon icon="ArrowLeft" width="16" height="16" />
            </Button>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Editar usuario</h1>
                <p class="text-gray-600 mt-1">Modifica los datos del usuario</p>
            </div>
        </div>
    </Page>
</template>

<script setup lang="ts">

const router = useRouter()
</script>