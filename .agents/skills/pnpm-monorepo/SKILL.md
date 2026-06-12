# PNPM Monorepo Skill

Skill para gestionar el monorepo con pnpm. Usa estos comandos para instalar dependencias, ejecutar scripts y administrar workspaces.

## Estructura del proyecto

```
business-api/
├── backend/
├── frontend/
├── package.json
└── pnpm-workspace.yaml
```

## Instalación de dependencias

### Instalar SOLO en un workspace

```bash
# Dependencia en frontend
pnpm add vue --filter frontend

# Dev dependency en frontend
pnpm add -D vite --filter frontend

# Dependencia en backend
pnpm add fastify --filter backend

# Dev dependency en backend
pnpm add -D typescript --filter backend
```

### Instalar en múltiples workspaces

```bash
pnpm add zod --filter frontend --filter backend
```

### Instalar en la raíz del monorepo

Para tooling global (eslint, prettier, turbo, etc.):

```bash
pnpm add -w turbo
pnpm add -Dw eslint prettier typescript
```

`-w` = workspace root

### Dependencia desde GitHub

```bash
pnpm add git+https://github.com/user/repo.git --filter backend
```

### Dependencia local entre workspaces

```bash
pnpm add @myorg/shared@workspace:* --filter frontend
```

## Ejecutar scripts

### Ejecutar en TODOS los workspaces

```bash
pnpm -r dev
pnpm -r --parallel dev
```

### Ejecutar SOLO en un workspace

```bash
pnpm --filter frontend dev
pnpm --filter backend dev
pnpm --filter frontend build
```

### Ejecutar en múltiples workspaces

```bash
pnpm --filter frontend --filter backend build
```

### Ejecutar comando temporal

```bash
pnpm dlx create-vite
```

## Gestión de dependencias

### Instalar todas las dependencias

```bash
pnpm install
```

### Eliminar dependencias

```bash
# Frontend
pnpm remove vue --filter frontend

# Backend
pnpm remove fastify --filter backend

# Root
pnpm remove -w turbo
```

### Actualizar dependencias

```bash
# Todo el monorepo
pnpm update -r

# Una dependencia específica
pnpm update joi -r

# Una dependencia en un workspace
pnpm update lemon-api --filter backend
```

### Ver por qué existe una dependencia

```bash
pnpm why joi
```

### Ver workspaces

```bash
pnpm m ls
```

## Reinstalación limpia

### Windows PowerShell

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item pnpm-lock.yaml -Force
pnpm install
```

### Linux/macOS

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## Scripts recomendados en package.json raíz

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  }
}
```