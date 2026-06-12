---
name: lite-ui
description: Use when working with LiteUI components in Vue templates. Covers Button, Grid, Col, Text, Textarea, Select, Multiselect, Switch, Checkbox, Signature, Modal, Table, Row, Column, and Icon components with their props, events, and slots.
---

# LiteUI Components

Componentes importados globalmente en `main.ts`. No requieren import en componentes.

## Button

Botón con temas, colores y estados.

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | String | `'default'` | `'default'`, `'icon'`, `'circle'`, `'rounded'` |
| `color` | String | `'default'` | `'default'`, `'primary'`, `'success'`, `'danger'`, `'transparent'`, `'gray'` |
| `disabled` | Boolean | `false` | Deshabilita el botón |

**Evento:** `@handle` — clic

```vue
<Button color="primary" @handle="guardar">Guardar</Button>
<Button theme="circle" color="danger" @handle="eliminar"><Icon icon="Trash" /></Button>
```

---

## Grid y Col

Contenedor de cuadrícula con columnas responsivas.

**Grid Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `columns` | Number/String | `12` |

**Col Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | Number/String | `1` | Ancho en columnas (1-12) |
| `uuid` | String | `''` | ID para drag & drop |
| `draggable` | Boolean | `false` | Habilita arrastre |

**Col Evento:** `@change(from, to)` — drag & drop

```vue
<Grid :columns="3">
    <Col :size="1">Columna 1</Col>
    <Col :size="2">Columna 2</Col>
</Grid>
```

---

## Text

Campo de texto con label flotante, máscara y validación.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `modelValue` | String/Number | `''` |
| `label` | String | `''` |
| `type` | String | `'text'` |
| `maxLength` | String/Number | `100` |
| `mask` | Object | `{ mask: String }` |
| `disabled` | Boolean | `false` |
| `placeholder` | String | `''` |
| `name` | String | `''` |
| `errors` | Object | `{}` |
| `centered` | Boolean | `false` |
| `money` | Boolean | `false` |

**Eventos:** `@update:modelValue`, `@enter`, `@focus`, `@blur`

```vue
<Text v-model="nombre" label="Nombre" name="nombre" :errors="errores" />
<Text v-model="telefono" label="Teléfono" :mask="{ mask: '0000-0000' }" />
```

---

## Textarea

Área de texto multilínea con label flotante.

**Props:** Mismas que Text (sin `type`, `centered`, `money`)

**Eventos:** `@update:modelValue`, `@enter`, `@removeError`

```vue
<Textarea v-model="descripcion" label="Descripción" name="descripcion" :errors="errores" />
```

---

## Select

Selector desplegable con label flotante.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `label` | String | `""` |
| `options` | Array | `[]` |
| `option_label` | String | `'label'` |
| `option_value` | String | `'value'` |
| `modelValue` | Any | `null` |
| `errors` | Object | `{}` |
| `name` | String | `''` |
| `disabled` | Boolean | `false` |

**Eventos:** `@update:modelValue`, `@change`

```vue
<Select
    v-model="pais"
    label="País"
    :options="paises"
    option_label="nombre"
    option_value="id"
    name="pais"
    :errors="errores"
/>
```

---

## Multiselect

Búsqueda con autocompletado remoto.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `modelValue` | String/Number | `''` |
| `label` | String | `''` |
| `route` | String | `''` |
| `transform` | Function | `null` |
| `disabled` | Boolean | `false` |
| `headers` | Object | `{}` |

**Slot:** `#items="{ result }"` — resultados personalizados

```vue
<Multiselect v-model="cliente" label="Buscar cliente" route="/api/clientes">
    <template #items="{ result }">
        <div v-for="item in result" :key="item.id">{{ item.nombre }}</div>
    </template>
</Multiselect>
```

---

## Switch

Interruptor toggle con etiqueta.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `label` | String | `""` |
| `modelValue` | Boolean | `false` |
| `disabled` | Boolean | `false` |

**Eventos:** `@update:modelValue`, `@change`

```vue
<Switch v-model="activo" label="Activar notificaciones" />
```

---

## Checkbox

Casilla de verificación con etiqueta.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `modelValue` | Boolean | `false` |
| `id` | String | `null` |
| `label` | String | `""` |
| `disabled` | Boolean | `false` |

**Eventos:** `@update:modelValue`, `@change`

**Slot:** `default` — personaliza etiqueta

```vue
<Checkbox v-model="acepto" label="Acepto los términos" />
```

---

## Signature

Pad de firma digital con canvas.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `modelValue` | String | `null` |
| `id` | String | `null` |
| `label` | String | `''` |
| `name` | String | `''` |
| `errors` | Object | `{}` |
| `disabled` | Boolean | `false` |
| `height` | Number | `140` |
| `width` | Number | `400` |
| `penColor` | String | `'#111827'` |
| `strokeWidth` | Number | `2` |

**Evento:** `@update:modelValue` — DataURL PNG o `null`

```vue
<Signature v-model="firma" label="Firma" name="firma" :errors="errores" :height="200" :width="600" />
```

---

## Modal

Ventana modal con header, cuerpo y footer.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `title` | String | `"Modal"` |
| `id` | String | auto-generado |
| `size` | String | `'sm:max-w-md'` |
| `subtitle` | String | `""` |

**Evento:** `@close`

**Slots:**
| Slot | Descripción |
|------|-------------|
| `default` | Contenido del cuerpo |
| `content` | Reemplaza cuerpo completo |
| `footer` | Pie del modal |

```vue
<Modal v-if="mostrar" title="Editar usuario" @close="mostrar = false">
    <Text v-model="nombre" label="Nombre" />

    <template #footer>
        <Button color="primary" @handle="guardar">Guardar</Button>
    </template>
</Modal>
```

---

## Table, Row, Column

Tabla con slots para cabecera, cuerpo y paginación.

**Table Slots:**
| Slot | Descripción |
|------|-------------|
| `top` | Zona superior (filtros, botones) |
| `head` | Cabecera (`<thead>`) |
| `body` | Cuerpo (`<tbody>`) |
| `pagination` | Paginación |

```vue
<Table>
    <template #top>
        <div class="p-4 flex justify-between">
            <Text v-model="buscar" label="Buscar" />
            <Button color="primary" @handle="agregar">Agregar</Button>
        </div>
    </template>
    <template #head>
        <tr>
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-left">Email</th>
        </tr>
    </template>
    <template #body>
        <Row v-for="user in usuarios" :key="user.id">
            <Column>{{ user.nombre }}</Column>
            <Column>{{ user.email }}</Column>
        </Row>
    </template>
</Table>
```

---

## Icon

Iconos SVG con carga asíncrona.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `icon` | String | `'Add'` |
| `width` | String | `'24'` |
| `height` | String | `'24'` |
| `class` | String | `'text-slate-900'` |

**Iconos:** `Account`, `ArrowLeft`, `ArrowRight`, `Cancel`, `Cart`, `Cash`, `CashRegister`, `Chat`, `ChevronDown`, `ChevronRight`, `Close`, `Cog`, `DatabasePlus`, `Dollar`, `ExclamationCircle`, `Filter`, `Forbidden`, `Home`, `Key`, `Location`, `Logs`, `Mail`, `MapPin`, `Menu`, `Order`, `Pencil`, `Phone`, `Point`, `ReceiptTax`, `Sailboat`, `See`, `Sent`, `ShoppingBag`, `Trash`, `UserCog`, `UserShare`, `Whatsapp`, `EyeDolar`

```vue
<Icon icon="Home" width="20" height="20" class="text-blue-500" />
<Icon icon="Trash" width="16" height="16" class="text-red-600" />
```
