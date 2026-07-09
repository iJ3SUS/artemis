<template>
    <div>

        <Card>
            <template #header>
                Información de la incapacidad
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="3">
                        <Multiselect
                            v-model="form.employee_id"
                            :errors="errors"
                            name="employee_id"
                            label="Empleado"
                            route="dashboard/employees"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.start_date"
                            :errors="errors"
                            name="start_date"
                            label="Fecha de inicio"
                            type="date"
                            :transform="formatDateInput"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.end_date"
                            :errors="errors"
                            name="end_date"
                            label="Fecha de terminación"
                            type="date"
                            :transform="formatDateInput"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.paid_days"
                            :errors="errors"
                            name="paid_days"
                            label="Días pagados"
                            type="number"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.payment_date"
                            :errors="errors"
                            name="payment_date"
                            label="Fecha de pago"
                            type="date"
                            :transform="formatDateInput"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.amount"
                            :errors="errors"
                            name="amount"
                            label="Monto"
                            type="number"
                            money
                        />
                    </Col>
                    <Col size="6">
                        <Textarea
                            v-model="form.notes"
                            :errors="errors"
                            name="notes"
                            label="Observación"
                            placeholder="Observaciones adicionales"
                        />
                    </Col>
                    <Col size="3">
                        <Switch
                            v-model="form.active"
                            :errors="errors"
                            name="active"
                            label="Activo"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

    </div>
</template>

<script setup lang="ts">

const formatDateInput = (val) => {
    if (!val) return ''
    const str = String(val)
    try {
        return $ParseDate(str)?.toFormat('yyyy-MM-dd') ?? ''
    } catch {
        return str.length >= 10 ? str.substring(0, 10) : str
    }
}

</script>
