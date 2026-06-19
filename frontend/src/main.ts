import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Button } from 'lite-ui/components/buttons'
import { Grid, Col } from 'lite-ui/components/grid'
import { Text, Textarea, Select, Multiselect, Switch, Checkbox, Signature } from 'lite-ui/components/inputs'
import { Modal } from 'lite-ui/components/modals'
import { Table, Row, Column } from 'lite-ui/components/table'
import { Icon } from 'lite-ui/components/icons'

import Pagination from '@/components/page/Pagination.vue'

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.component('Button', Button)
app.component('Grid', Grid)
app.component('Col', Col)
app.component('Text', Text)
app.component('Textarea', Textarea)
app.component('Select', Select)
app.component('Multiselect', Multiselect)
app.component('Switch', Switch)
app.component('Checkbox', Checkbox)
app.component('Signature', Signature)
app.component('Modal', Modal)
app.component('Table', Table)
app.component('Row', Row)
app.component('Column', Column)
app.component('Icon', Icon)
app.component('Pagination', Pagination)

app.use(createPinia())
app.use(router)

app.mount('#app')
