<template>
    <div class="p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600 mt-1">Bienvenido al panel de gestión</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Icon icon="Account" width="20" height="20" class="text-primary-600" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">24</div>
                        <div class="text-sm text-gray-600">Usuarios activos</div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Icon icon="Chat" width="20" height="20" class="text-green-600" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">156</div>
                        <div class="text-sm text-gray-600">Mensajes hoy</div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Icon icon="Whatsapp" width="20" height="20" class="text-primary-600" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">89%</div>
                        <div class="text-sm text-gray-600">Tasa de respuesta</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Actividad reciente</h2>
            <p class="text-gray-600">Contenido del dashboard en construcción...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
