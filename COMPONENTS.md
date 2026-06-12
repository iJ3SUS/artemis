# LiteUI

LiteUI es una librería de componentes de interfaz de usuario para Vue 3, diseñada con Tailwind CSS.

## Instalación (Proyecto Consumidor)

Puedes instalar esta librería directamente desde el repositorio de GitHub especificando un tag (versión).

### Instalar una versión específica (Recomendado)
Para instalar la última versión disponible (ejemplo: `v0.0.10`):

```bash
npm install git+https://github.com/iJ3SUS/LiteUI.git#v0.0.10
```

### Actualizar la librería
Si ya tienes la librería instalada y hay una nueva versión publicada (ej. de `v0.0.10` a `v0.0.11`), debes forzar la actualización instalando explícitamente el nuevo tag:

```bash
npm install git+https://github.com/iJ3SUS/LiteUI.git#v0.0.11
```

*Nota: Si tienes problemas de caché con NPM al instalar desde Git, puedes eliminar la carpeta de la librería dentro de `node_modules` y volver a instalar:*
```bash
# Windows
Remove-Item -Recurse -Force node_modules/lite-ui
npm install

# Mac/Linux
rm -rf node_modules/lite-ui
npm install
```

---

## Importar componentes

Cada categoría de componentes se importa desde su propia ruta:

```js
import { Button } from 'lite-ui/components/buttons'
import { Grid, Col } from 'lite-ui/components/grid'
import { Text, Textarea, Select, Multiselect, Switch, Checkbox, Signature } from 'lite-ui/components/inputs'
import { Modal } from 'lite-ui/components/modals'
import { Table, Row, Column } from 'lite-ui/components/table'
import { Icon } from 'lite-ui/components/icons'
```

---

## Componentes

### Button

Botón estilizado con soporte para temas, colores y estados.

**Props:**

| Prop         | Tipo    | Default     | Descripción |
|--------------|---------|-------------|-------------|
| `theme`      | String  | `'default'` | Forma del botón. Valores: `'default'`, `'icon'`, `'circle'`, `'rounded'` |
| `color`      | String  | `'default'` | Color del botón. Valores: `'default'`, `'primary'`, `'success'`, `'danger'`, `'transparent'`, `'gray'`, `'gray-100'` |
| `disabled`   | Boolean | `false`     | Deshabilita el botón |

**Eventos:**

| Evento    | Descripción |
|-----------|-------------|
| `handle`  | Se emite al hacer clic |

**Slot:** `default` - Contenido del botón.

```vue
<Button color="primary" @handle="guardar">Guardar</Button>
<Button theme="circle" color="danger" @handle="eliminar"><Icon icon="Trash" width="16" height="16" /></Button>
<Button theme="rounded" color="success" :disabled="true">Confirmar</Button>
```

---

### Grid

Contenedor de cuadrícula CSS Grid con columnas responsivas.

**Props:**

| Prop       | Tipo          | Default | Descripción |
|------------|---------------|---------|-------------|
| `columns`  | Number/String | `12`    | Número de columnas (1-12). En móvil siempre es 1 columna, en desktop se aplica el valor |

**Slot:** `default` - Columnas (`Col`) o contenido.

```vue
<Grid :columns="3">
    <Col :size="1">Columna 1</Col>
    <Col :size="2">Columna 2</Col>
</Grid>
```

---

### Col

Columna individual dentro de un `Grid`. Soporta drag & drop opcional.

**Props:**

| Prop        | Tipo          | Default | Descripción |
|-------------|---------------|---------|-------------|
| `size`      | Number/String | `1`     | Ancho en columnas (1-12). En móvil ocupa 12 columnas |
| `uuid`      | String        | `''`    | Identificador único para drag & drop |
| `draggable` | Boolean       | `false` | Habilita el arrastre del elemento |

**Eventos:**

| Evento   | Parámetros     | Descripción |
|----------|----------------|-------------|
| `change` | `(from, to)`   | Se emite al soltar un elemento arrastrado. `from` y `to` son los `uuid` de origen y destino |

**Slot:** `default` - Contenido de la columna.

```vue
<Grid :columns="6">
    <Col :size="3" uuid="col-1" :draggable="true" @change="reordenar">Contenido A</Col>
    <Col :size="3" uuid="col-2" :draggable="true" @change="reordenar">Contenido B</Col>
</Grid>
```

---

### Text

Campo de texto con label flotante, máscara (IMask), validación y soporte `v-model`.

**Props:**

| Prop         | Tipo           | Default              | Descripción |
|--------------|----------------|----------------------|-------------|
| `modelValue` | String/Number  | `''`                 | Valor del campo (v-model) |
| `id`         | String         | `null`               | ID del input |
| `type`       | String         | `'text'`             | Tipo de input HTML |
| `label`      | String         | `''`                 | Etiqueta flotante |
| `maxLength`  | String/Number  | `100`                | Longitud máxima |
| `mask`       | Object         | `{ mask: String }`   | Máscara IMask |
| `disabled`   | Boolean        | `false`              | Solo lectura |
| `placeholder`| String         | `''`                 | Texto placeholder |
| `name`       | String         | `''`                 | Nombre para identificar errores |
| `errors`     | Object         | `{}`                 | Objeto de errores (clave = `name`) |
| `centered`   | Boolean        | `false`              | Centra el texto |
| `size`       | String         | `'h-11'`             | Clase de altura Tailwind |
| `transform`  | Function       | `(value) => value`   | Función para transformar el valor mostrado |
| `money`      | Boolean        | `false`              | Formato monetario |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite el valor sin máscara (v-model) |
| `enter`              | Tecla Enter presionada |
| `focus`              | El campo recibe foco |
| `blur`               | El campo pierde foco |

```vue
<Text v-model="nombre" label="Nombre" name="nombre" :errors="errores" />
<Text v-model="telefono" label="Teléfono" :mask="{ mask: '0000-0000' }" />
<Text v-model="precio" label="Precio" :transform="(v) => '$ ' + v" />
```

---

### Textarea

Área de texto multilínea con label flotante, máscara y validación.

**Props:**

| Prop         | Tipo           | Default              | Descripción |
|--------------|----------------|----------------------|-------------|
| `modelValue` | String/Number  | `''`                 | Valor del campo (v-model) |
| `id`         | String         | `null`               | ID del textarea |
| `label`      | String         | `''`                 | Etiqueta flotante |
| `maxLength`  | String/Number  | `100`                | Longitud máxima |
| `mask`       | Object         | `{ mask: String }`   | Máscara IMask |
| `disabled`   | Boolean        | `false`              | Solo lectura |
| `placeholder`| String         | `''`                 | Texto placeholder |
| `name`       | String         | `''`                 | Nombre para identificar errores |
| `errors`     | Object         | `{}`                 | Objeto de errores |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite el valor sin máscara (v-model) |
| `enter`              | Tecla Enter presionada |
| `removeError`        | Se elimina un error |

```vue
<Textarea v-model="descripcion" label="Descripción" name="descripcion" :errors="errores" />
```

---

### Select

Selector desplegable con label flotante, validación y soporte `v-model`.

**Props:**

| Prop              | Tipo    | Default    | Descripción |
|-------------------|---------|------------|-------------|
| `label`           | String  | `""`       | Etiqueta flotante |
| `id`              | String  | `null`     | ID del select |
| `options`         | Array   | `[]`       | Array de opciones (objetos) |
| `option_label`    | String  | `'label'`  | Propiedad del objeto a mostrar como texto |
| `option_value`    | String  | `'value'`  | Propiedad del objeto a usar como valor |
| `modelValue`      | Any     | `null`     | Valor seleccionado (v-model) |
| `errors`          | Object  | `{}`       | Objeto de errores |
| `name`            | String  | `''`       | Nombre para identificar errores |
| `disabled`        | Boolean | `false`    | Deshabilita el select |
| `disablePlaceholder` | Boolean | `false` | Permite seleccionar el placeholder "Sin seleccionar" |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite el valor seleccionado (v-model) |
| `change`             | Emite el valor seleccionado al cambiar |

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

### Multiselect

Campo de búsqueda con autocompletado remoto. Hace peticiones HTTP con debounce y caché.

**Props:**

| Prop         | Tipo     | Default  | Descripción |
|--------------|----------|----------|-------------|
| `modelValue` | String/Number | `''` | Valor del campo (v-model) |
| `label`      | String   | `''`     | Etiqueta del campo |
| `route`      | String   | `''`     | URL de la API para buscar (recibe `?keyword=`) |
| `transform`  | Function | `null`   | Función para transformar la respuesta de la API |
| `disabled`   | Boolean  | `false`  | Deshabilita el campo |
| `headers`    | Object   | `{}`     | Headers HTTP adicionales para la petición |

**Slot:** `items` - Slot con scope `{ result }` para renderizar los resultados personalizados.

```vue
<Multiselect v-model="cliente" label="Buscar cliente" route="/api/clientes" :headers="{ Authorization: 'Bearer token' }">
    <template #items="{ result }">
        <div v-for="item in result" :key="item.id" @click="seleccionar(item)" class="p-2 hover:bg-gray-100 cursor-pointer">
            {{ item.nombre }}
        </div>
    </template>
</Multiselect>
```

---

### Switch

Interruptor toggle con etiqueta.

**Props:**

| Prop         | Tipo    | Default | Descripción |
|--------------|---------|---------|-------------|
| `label`      | String  | `""`    | Texto junto al switch |
| `modelValue` | Boolean | `false` | Estado del switch (v-model) |
| `disabled`   | Boolean | `false` | Deshabilita el switch |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite el nuevo estado boolean (v-model) |
| `change`             | Emite el nuevo estado boolean |

```vue
<Switch v-model="activo" label="Activar notificaciones" />
```

---

### Checkbox

Casilla de verificación con etiqueta y soporte `v-model`.

**Props:**

| Prop         | Tipo    | Default | Descripción |
|--------------|---------|---------|-------------|
| `modelValue` | Boolean | `false` | Estado del checkbox (v-model) |
| `id`         | String  | `null`  | ID del checkbox |
| `label`      | String  | `""`    | Texto de la etiqueta |
| `disabled`   | Boolean | `false` | Deshabilita el checkbox |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite el nuevo estado boolean (v-model) |
| `change`             | Emite el nuevo estado boolean |

**Slot:** `default` - Permite personalizar el contenido de la etiqueta (sobrescribe `label`).

```vue
<Checkbox v-model="acepto" label="Acepto los términos" />
<Checkbox v-model="opcion"><strong>Opción personalizada</strong></Checkbox>
```

---

### Signature

Pad de firma digital con canvas. Usa la librería `signature_pad`.

**Props:**

| Prop            | Tipo    | Default           | Descripción |
|-----------------|---------|-------------------|-------------|
| `modelValue`    | String  | `null`            | Imagen en base64 de la firma (v-model) |
| `id`            | String  | `null`            | ID del canvas |
| `label`         | String  | `''`              | Etiqueta flotante |
| `name`          | String  | `''`              | Nombre para identificar errores |
| `errors`        | Object  | `{}`              | Objeto de errores |
| `disabled`      | Boolean | `false`           | Solo lectura (oculta botón limpiar) |
| `height`        | Number  | `140`             | Alto del canvas en px |
| `width`         | Number  | `400`             | Ancho del canvas en px |
| `penColor`      | String  | `'#111827'`       | Color del trazo |
| `strokeWidth`   | Number  | `2`               | Grosor del trazo |
| `backgroundColor` | String | `'rgba(0,0,0,0)'` | Color de fondo del canvas |

**Eventos:**

| Evento               | Descripción |
|----------------------|-------------|
| `update:modelValue`  | Emite la firma como DataURL PNG (v-model) o `null` al limpiar |

```vue
<Signature v-model="firma" id="firma" label="Firma" name="firma" :errors="errores" :height="200" :width="600" />
```

---

### Modal

Ventana modal con header, cuerpo y footer. Bloquea el scroll del body al abrirse.

**Props:**

| Prop       | Tipo   | Default         | Descripción |
|------------|--------|-----------------|-------------|
| `title`    | String | `"Modal"`       | Título del modal |
| `id`       | String | auto-generado   | ID del contenedor del cuerpo |
| `size`     | String | `'sm:max-w-md'` | Clase Tailwind para el ancho máximo |
| `subtitle` | String | `""`            | Subtítulo debajo del título |

**Eventos:**

| Evento  | Descripción |
|---------|-------------|
| `close` | Se emite al hacer clic en el botón de cerrar |

**Slots:**

| Slot      | Descripción |
|-----------|-------------|
| `default` | Contenido del cuerpo (scrollable) |
| `content` | Reemplaza todo el cuerpo (sin padding ni scroll automático) |
| `footer`  | Pie del modal (fijo, con borde superior) |

```vue
<Modal v-if="mostrar" title="Editar usuario" subtitle="Modifica los datos" @close="mostrar = false">
    <Text v-model="nombre" label="Nombre" />

    <template #footer>
        <Button color="primary" @handle="guardar">Guardar</Button>
    </template>
</Modal>
```

---

### Table

Tabla con slots para cabecera, cuerpo, zona superior y paginación.

**Props:** Sin props.

**Slots:**

| Slot          | Descripción |
|---------------|-------------|
| `top`         | Zona superior (ej: filtros, botones). Por defecto un padding vacío |
| `head`        | Cabecera de la tabla (`<thead>`) |
| `body`        | Cuerpo de la tabla (`<tbody>`) |
| `pagination`  | Zona de paginación (debajo de la tabla) |

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
    <template #pagination>
        <div class="flex justify-center">...</div>
    </template>
</Table>
```

---

### Row

Fila de tabla (`<tr>`) con hover y zebra striping.

**Props:** Sin props.

**Slot:** `default` - Columnas (`Column`).

```vue
<Row>
    <Column>Contenido</Column>
</Row>
```

---

### Column

Celda de tabla (`<td>`) con padding.

**Props:** Sin props.

**Slot:** `default` - Contenido de la celda.

```vue
<Column>{{ dato }}</Column>
```

---

### Icon

Componente de iconos SVG con carga asíncrona. Carga dinámicamente el archivo `Icon{nombre}.vue`.

**Props:**

| Prop    | Tipo   | Default            | Descripción |
|---------|--------|--------------------|----|
| `icon`  | String | `'Add'`            | Nombre del icono (sin prefijo `Icon`). Se carga `Icon{icon}.vue` |
| `width` | String | `'24'`             | Ancho del SVG |
| `height`| String | `'24'`             | Alto del SVG |
| `class` | String | `'text-slate-900'` | Clase Tailwind para el color (se pasa como prop `color` al SVG) |

**Iconos disponibles:**

`Account`, `ArrowLeft`, `ArrowRight`, `Cancel`, `Cart`, `Cash`, `CashRegister`, `Chat`, `ChevronDown`, `ChevronRight`, `Close`, `Cog`, `DatabasePlus`, `Dollar`, `ExclamationCircle`, `Filter`, `Forbidden`, `Home`, `Key`, `Location`, `Logs`, `Mail`, `MapPin`, `Menu`, `Order`, `Pencil`, `Phone`, `Point`, `ReceiptTax`, `Sailboat`, `See`, `Sent`, `ShoppingBag`, `Trash`, `UserCog`, `UserShare`, `Whatsapp`, `EyeDolar`

```vue
<Icon icon="Home" width="20" height="20" class="text-blue-500" />
<Icon icon="Trash" width="16" height="16" class="text-red-600" />
```

---

## Flujo de Trabajo: Cómo crear y publicar una nueva versión

Como autor de la librería, cada vez que hagas cambios y quieras que los proyectos consumidores los reciban, debes seguir este flujo estricto:

### 1. Actualizar la versión
Abre el archivo `package.json` y actualiza el número de versión (ej. de `"version": "0.0.10"` a `"version": "0.0.11"`).

### 2. Construir la librería
Es **obligatorio** compilar los archivos antes de subir los cambios para que la carpeta `dist/` contenga el código más reciente.

```bash
npm run build
```

### 3. Guardar los cambios en Git (Commit)
Agrega todos los cambios (incluyendo la carpeta `dist/` actualizada y el `package.json`) y haz un commit.

```bash
git add .
git commit -m "Bump version to 0.0.11: Descripción de tus cambios"
```

### 4. Subir a la rama principal
```bash
git push origin main
```

### 5. Crear y publicar el Tag (Crucial para la instalación)
NPM utiliza los **tags** de Git para identificar las versiones. Debes crear un tag que coincida con la versión de tu `package.json`.

```bash
# Crear el tag localmente
git tag v0.0.11

# Subir el tag a GitHub
git push origin v0.0.11
```

¡Listo! Una vez que el tag esté en GitHub, los proyectos consumidores podrán instalar o actualizar a esta nueva versión usando el comando de instalación con el nuevo tag.