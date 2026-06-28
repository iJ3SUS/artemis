<template>
    <Card v-if="data" v-can="'charts.employees.city'">
        <template #header>
            Lugar de residencia
        </template>
        <template #content>
            <div :style="{ height: chart_height + 'px' }">
                <Bar :data="chart_data" :options="horizontal_bar_options" />
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

const horizontal_bar_options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } }
    }
}

const chart_height = computed(() => {
    if (!data.value) return 256
    return Math.max(256, data.value.length * 28)
})

const chart_data = computed(() => {
    if (!data.value) return null
    return {
        labels: data.value.map((i: any) => i.city_name),
        datasets: [{
            data: data.value.map((i: any) => i.count),
            backgroundColor: '#F59E0B'
        }]
    }
})

onMounted(async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/charts/employees/city'
    })
    if (success) data.value = response
})
</script>
