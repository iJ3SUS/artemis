# Best Practices — General

## Monorepo

- **Package manager**: pnpm con workspaces (`pnpm-workspace.yaml`)
- **Workspaces**: `backend/` y `frontend/`
- **ESM en todos lados**: `"type": "module"` en el root y en ambos workspaces
- **Dependencias compartidas en el root**: `axios`, `joi`, `luxon` se declaran en el `package.json` del root
- **`allowBuilds: bcrypt`** requerido en `pnpm-workspace.yaml` para la compilación nativa de node-gyp
- Scripts del root usan `pnpm -r` para ejecutar en todos los workspaces

```bash
pnpm dev          # backend + frontend en paralelo
pnpm build        # build de todos los workspaces
```

## Entorno y Secretos

- Archivos `.env` **nunca** se commitean (están en `.gitignore`)
- `.env.example` **sí** se commitea como plantilla (permitido con `!.env.example` en los `.gitignore` de cada workspace)
- Variables de entorno del frontend usan prefijo `VITE_`: `VITE_API_URL`, `VITE_SESSION_KEY`, `VITE_TIMEZONE`
- Variables de entorno del backend se cargan con `dotenv` y se organizan por namespace: `config.db`, `config.server`, `config.jwt`, `config.meta`

## Zona Horaria

- **Siempre** `America/Bogota` para operaciones de fecha/hora
- Backend: `DateTime.now().setZone('America/Bogota')` con `luxon`
- Frontend: `VITE_TIMEZONE=America/Bogota`

## Idioma

- **Mensajes de error y UI**: español
- **Nombres de variables, funciones, clases, rutas, colecciones**: inglés
- **Labels de navegación**: español (`'Configuración'`, `'WhatsApp'`)
- **Mensajes técnicos/infraestructura**: inglés (`'Channel not found'`, `'File is required'`)

## Convención sobre Configuración

- No hay ESLint, Prettier, ni EditorConfig — el estilo se enforce mediante documentación y agent skills
- No hay tests automatizados — `pnpm test` es NOP
- No hay lint automatizado — `pnpm lint` es NOP
- La estructura de directorios y los nombres de archivo definen el comportamiento (rutas del backend, auto-imports del frontend)

## Path Aliases

- **Backend**: aliases de Node.js en `package.json` (`imports`): `#src/*`, `#app/*`, `#plugins/*`, `#utils/*`, `#middlewares/*`
- **Frontend**: alias de Vite en `vite.config.ts`: `@` -> `./src`
- **Nunca** usar rutas relativas (`../../`) para imports cruzados — siempre usar aliases

## Framework Core

- **`lemon-api`**: dependencia git (`git+https://github.com/iJ3SUS/LemonApi.git`) — no viene de npm
- Provee: Fastify wrapper, MongoDB ODM, middlewares base, plugin router (auto-descubre rutas por convención de nombres)

## Git

- `.gitignore` del root: mínimo (`node_modules/`, `.env`)
- Cada workspace tiene su propio `.gitignore` con reglas específicas
- `use-cases/` del backend está gitignored (payloads de webhook para testing local)

## Agent Skills

- Skills reutilizables en `.agents/skills/` para desarrollo asistido por IA
- `AGENTS.md` es la referencia canónica de todas las convenciones del proyecto
