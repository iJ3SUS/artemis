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
import Page from '@/components/page/Page.vue'
import Card from '@/components/page/Card.vue'
import Heading from '@/components/page/Heading.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import SearchSelect from '@/components/inputs/SearchSelect.vue'
import Avatar from '@/components/Avatar.vue'

import tooltipDirective from '@/directives/tooltip'

import { url } from '@/utils/globals'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$ParseDate = ParseDate
app.config.globalProperties.$can = can
app.config.globalProperties.$url = url

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
app.component('Page', Page)
app.component('Card', Card)
app.component('Heading', Heading)
app.component('SearchInput', SearchInput)
app.component('SearchSelect', SearchSelect)
app.component('Avatar', Avatar)

app.directive('tooltip', tooltipDirective)

app.use(createPinia())
app.use(router)

app.mount('#app')
