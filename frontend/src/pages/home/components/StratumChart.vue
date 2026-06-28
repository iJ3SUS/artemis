<template>
    <Card>
        <template #header>
            Nivel socioeconómico (estrato)
        </template>
        <template #content>
            <div v-if="data" class="h-64">
                <Bar :data="chart_data" :options="bar_options" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Chart as ChartJS } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const http = useHttp()

const data = ref(null)

const stratum_labels: Record<number, string> = { 1: 'Estrato 1', 2: 'Estrato 2', 3: 'Estrato 3', 4: 'Estrato 4', 5: 'Estrato 5' }

const bar_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
    }
}

const chart_data = computed(() => {
    if (!data.value) return null
    return {
        labels: data.value.map((i: any) => stratum_labels[i.stratum] || `Estrato ${i.stratum}`),
        datasets: [{
            data: data.value.map((i: any) => i.count),
            backgroundColor: '#10B981'
        }]
    }
})

onMounted(async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/charts/employees/stratum'
    })
    if (success) data.value = response
})
</script>
