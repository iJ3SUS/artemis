<template>
    <Page>
        <template #heading>
            <Heading>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Demografía de los empleados</p>
                    </div>
                </template>
            </Heading>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenderChart v-can="'charts.employees.gender'" />
            <AgeRangeChart v-can="'charts.employees.age-range'" />
            <StratumChart v-can="'charts.employees.stratum'" />
            <JobTitleChart v-can="'charts.employees.job-title'" />
            <CityChart v-can="'charts.employees.city'" />
        </div>
    </Page>
</template>

<script setup lang="ts">
import GenderChart from './components/GenderChart.vue'
import AgeRangeChart from './components/AgeRangeChart.vue'
import StratumChart from './components/StratumChart.vue'
import JobTitleChart from './components/JobTitleChart.vue'
import CityChart from './components/CityChart.vue'
</script>
