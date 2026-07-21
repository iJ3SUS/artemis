<template>
    <div class="p-1">
        <div v-if="timeline && timeline.length" class="relative">
            <div class="absolute left-[11px] top-1 bottom-1 w-px bg-gray-200" />

            <div v-for="(entry, i) in timeline" :key="entry._id" class="relative pl-8 pb-6 last:pb-0">
                <div class="absolute left-2 top-1 w-2 h-2 rounded-full ring-2 ring-white"
                    :class="statusOptions.find(s => s.value === entry.stage)?.color?.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-300'" />

                <div class="text-[13px]">
                    <div class="flex items-center gap-1.5">
                        <span class="font-semibold"
                            :class="statusOptions.find(s => s.value === entry.stage)?.color || 'text-gray-600'">
                            {{ statusOptions.find(s => s.value === entry.stage)?.label || '-' }}
                        </span>
                        <span class="text-gray-300">|</span>
                        <span class="text-gray-400">{{ entry.user?.display_name }}</span>
                    </div>
                    <p class="text-gray-400 mt-0.5">{{ $ParseDate(entry.date)?.toFormat('dd/MM/yyyy HH:mm') ?? '-' }}</p>
                    <p v-if="entry.observation" class="text-gray-500 mt-1.5 bg-gray-50 rounded-md px-3 py-2 leading-relaxed">
                        {{ entry.observation }}
                    </p>
                </div>
            </div>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-10">Sin novedades en la línea de tiempo</p>
    </div>
</template>

<script setup lang="ts">
import { statusOptions } from '../options'

defineProps<{
    timeline: Record<string, any>[]
}>()
</script>
