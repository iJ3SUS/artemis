# Esquemas de Base de Datos — RRHH

Estructura de colecciones y campos para migración de datos.

---

## MongoDB: `employees`

```json
{
    "_id": "ObjectId",
    "names": "string (required)",
    "surnames": "string (required)",
    "display_name": "string (auto: names + surnames)",
    "identification": "string (required)",
    "email": "string (email, required)",
    "phone": {
        "indicative": "string",
        "number": "string"
    },
    "gender": "string | male | female | other",
    "birth_date": "ISODate",
    "stratum": "number | 1-6",
    "dependents": "number (integer, min 0)",
    "housing_type": "string | own | rented | family | other",
    "job_title_id": "ObjectId -> job_titles._id",
    "contract_type": "number | 1=Fijo | 2=Indefinido | 3=Obra labor | 4=Prestación servicios",
    "education_level": "string | primary | secondary | technical | technologist | professional | specialization | master | doctorate",
    "city": {
        "country_code": "string",
        "country_name": "string",
        "state_code": "string",
        "state_name": "string",
        "city_code": "string",
        "city_name": "string"
    },
    "entry_date": "ISODate",
    "retirement_date": "ISODate",
    "active": "boolean (default true)",
    "transport_type": "string | car | motorcycle | bicycle | public | walking | other",
    "eps": "string",
    "afp": "string",
    "afc": "string",
    "blood_type": "string | A+ | A- | B+ | B- | AB+ | AB- | O+ | O-",
    "medications": ["string"],
    "allergies": ["string"],
    "illnesses": ["string"],
    "clothing": {
        "shoe_size": "string",
        "shirt_size": "string",
        "jacket_size": "string",
        "pants_size": "string"
    },
    "emergency_contact": {
        "name": "string",
        "relationship": "string",
        "phone": "string"
    },
    "salary": "number (escrito por ruta de salario, NO en upsert de empleado)",
    "created_at": "ISODate",
    "updated_at": "ISODate"
}
```

### Relaciones

| Campo | Apunta a |
|-------|----------|
| `job_title_id` | `job_titles._id` |

---

## MongoDB: `job_titles`

```json
{
    "_id": "ObjectId",
    "name": "string (required)",
    "description": "string",
    "parent_id": "ObjectId -> job_titles._id (estructura jerárquica)",
    "active": "boolean (default true)",
    "dependency": "string (nombre del área/departamento)",
    "functions": ["string"],
    "requirements": ["string"],
    "risks": ["string"],
    "level": "number (usado para ordenamiento en árbol, NO en schema upsert)",
    "created_at": "ISODate",
    "updated_at": "ISODate"
}
```

### Relaciones

| Campo | Apunta a |
|-------|----------|
| `parent_id` | `job_titles._id` (auto-referencia) |

---

## MongoDB: `family_members`

```json
{
    "_id": "ObjectId",
    "employee_id": "ObjectId -> employees._id (required, asignado por ruta)",
    "names": "string (required)",
    "surnames": "string (required)",
    "relationship": "string (required) | spouse | child | father | mother | sibling | grandparent | other",
    "gender": "string | male | female | other",
    "birth_date": "ISODate",
    "created_at": "ISODate",
    "updated_at": "ISODate"
}
```

### Relaciones

| Campo | Apunta a |
|-------|----------|
| `employee_id` | `employees._id` |

---

## MongoDB: `salary_histories`

```json
{
    "_id": "ObjectId",
    "employee_id": "ObjectId -> employees._id",
    "job_title_id": "ObjectId -> job_titles._id",
    "salary": "number (positive, required)",
    "reason": "string",
    "created_at": "ISODate",
    "updated_at": "ISODate"
}
```

### Relaciones

| Campo | Apunta a |
|-------|----------|
| `employee_id` | `employees._id` |
| `job_title_id` | `job_titles._id` |

---

## MongoDB: `settings`

```json
{
    "_id": "ObjectId",
    "key": "string (ej: 'company')",
    "name": "string (nombre de la empresa)",
    "logo": "string (URL o base64 del logo)",
    "created_at": "ISODate",
    "updated_at": "ISODate"
}
```

---

## Resumen de Colecciones

| Colección | Descripción |
|-----------|-------------|
| `employees` | Empleados |
| `job_titles` | Cargos laborales |
| `family_members` | Familiares de empleados |
| `salary_histories` | Historial de salarios |
| `settings` | Configuraciones del sistema |

---

## Valores Enumerados

### `contract_type`
- `1` = Fijo
- `2` = Indefinido
- `3` = Obra labor
- `4` = Prestación de servicios

### `education_level`
- `primary` = Primaria
- `secondary` = Secundaria
- `technical` = Técnico
- `technologist` = Tecnólogo
- `professional` = Profesional
- `specialization` = Especialización
- `master` = Maestría
- `doctorate` = Doctorado

### `gender`
- `male`
- `female`
- `other`

### `housing_type`
- `own` = Propia
- `rented` = Arrendada
- `family` = Familiar
- `other` = Otra

### `transport_type`
- `car`
- `motorcycle`
- `bicycle`
- `public`
- `walking`
- `other`

### `blood_type`
- `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

### `stratum`
- `1` al `6`

### `relationship` (family_members)
- `spouse` = Cónyuge
- `child` = Hijo/a
- `father` = Padre
- `mother` = Madre
- `sibling` = Hermano/a
- `grandparent` = Abuelo/a
- `other` = Otro
