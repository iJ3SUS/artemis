<template>
    <div class="space-y-4 p-1">
        <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide"># Número</p>
                <p class="text-lg font-bold text-gray-900 mt-0.5">{{ String(disability.number).padStart(5, '0') }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1"
                    :class="statusOptions.find(s => s.value === disability.status?.stage)?.color || 'bg-gray-100 text-gray-800'">
                    {{ statusOptions.find(s => s.value === disability.status?.stage)?.label || '-' }}
                </span>
            </div>
        </div>

        <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Empleado</p>
            <p class="text-sm font-medium text-gray-900 mt-0.5">{{ disability.employee?.display_name || '-' }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inicio</p>
                <p class="text-sm font-bold text-gray-900 mt-0.5">{{ $ParseDate(disability.start_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Terminación</p>
                <p class="text-sm font-bold text-gray-900 mt-0.5">{{ $ParseDate(disability.end_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
            </div>
        </div>

        <div class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Enfermedades</p>
            <div v-if="disability.diseases?.length" class="mt-1 space-y-1">
                <div v-for="dz in disability.diseases" :key="dz._id" class="text-sm text-gray-700">
                    <span class="font-medium">{{ dz.code }}</span> - {{ dz.description }}
                </div>
            </div>
            <p v-else class="text-sm text-gray-500 mt-0.5">-</p>
        </div>

        <div v-if="disability.amount || disability.days_paid" class="grid grid-cols-2 gap-4">
            <div v-if="disability.days_paid" class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Días pagados</p>
                <p class="text-sm font-bold text-gray-900 mt-0.5">{{ disability.days_paid }}</p>
            </div>
            <div v-if="disability.amount" class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor del pago</p>
                <p class="text-sm font-bold text-gray-900 mt-0.5">$ {{ Number(disability.amount).toLocaleString('es-CO') }}</p>
            </div>
        </div>

        <div v-if="disability.notes" class="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notas</p>
            <p class="text-sm text-gray-700 mt-0.5">{{ disability.notes }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { statusOptions } from '../options'

defineProps<{
    disability: Record<string, any> | null
}>()
</script>
