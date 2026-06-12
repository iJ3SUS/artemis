# RRHH Project - Agent Instructions

## Project Overview

Monorepo con pnpm workspaces para sistema de Recursos Humanos con integración de WhatsApp Business API.

## Structure

```
RRHH/
├── backend/          # Fastify + MongoDB (lemon-api framework)
├── frontend/         # Vue 3 + Vite + Tailwind v4
└── opencode.json     # opencode configuration
```

## Quick Reference

### Frontend
- Vue 3 Composition API con `<script setup lang="ts">`
- Pinia Setup Stores
- Tailwind v4 dark theme con clases semánticas
- Auto-imports: Vue APIs, stores, composables, entities, utils
- Ver skill `frontend-dev` para detalles

### Backend
- lemon-api framework (Fastify wrapper)
- Módulos en `app/<modulo>/` con models, routes, schemas
- Rutas: `<accion>.<metodo>.js` con 3 exports obligatorios
- MongoDB ODM con query API
- Ver skill `backend-dev` para detalles

### UI Components
- LiteUI: librería de componentes importados globalmente
- Button, Grid, Col, Text, Select, Modal, Table, Icon, etc.
- Ver skill `lite-ui` para props y eventos

## Conventions

### Idioma
- UI/errores: español
- Variables/funciones/rutas: inglés
- Labels navegación: español

### Timezone
- Siempre `America/Bogota`

### Path Aliases
- Backend: `#src/*`, `#app/*`, `#plugins/*`, `#utils/*`
- Frontend: `@/` -> `./src`

### Code Style
- 4 espacios indentación
- Sin punto y coma (backend)
- Sin comentarios innecesarios
- snake_case para variables/estado
- PascalCase para clases/componentes

## Skills Disponibles

- `frontend-dev` - Desarrollo Vue 3, stores, composables, Tailwind
- `backend-dev` - Módulos, rutas, modelos, schemas, middlewares
- `lite-ui` - Componentes UI (Button, Text, Modal, Table, etc.)
