# EDUSPACE MANAGER — Contexto Compartido del Equipo

> Documento de referencia única para los 4 integrantes del equipo.
> **Regla de oro:** antes de tocar código, leer este documento y actualizarlo al terminar.

---

## 1. Nombre del proyecto

**EDUSPACE MANAGER**

## 2. Descripción

API REST para una universidad tecnológica que centraliza la gestión de **espacios físicos**
(salones, laboratorios y auditorios) y las **reservas** que realizan los **docentes** sobre ellos,
incluyendo la solicitud de **recursos adicionales** (proyector, sonido, portátiles, etc.).

## 3. Objetivo

Permitir registrar facultades, docentes, espacios y recursos, y gestionar reservas de espacios
validando que la cantidad de personas solicitada **no supere la capacidad máxima** del espacio.

## 4. Requisitos funcionales

| ID  | Requisito |
| --- | --------- |
| RF1 | Registrar unidades académicas (facultades). Ej.: Facultad de Ingeniería, Facultad de Diseño. |
| RF2 | Registrar y administrar docentes autorizados para reservar. Cada docente pertenece a una facultad. |
| RF3 | Registrar espacios (salones, laboratorios, auditorios). Cada espacio pertenece a una facultad y tiene capacidad máxima. |
| RF4 | Registrar recursos adicionales (proyector, sistema de sonido, computadores portátiles). |
| RF5 | Crear reservas. Una reserva pertenece a un docente y a un espacio, y puede solicitar múltiples recursos. |
| RF6 | Validar que la cantidad de personas de una reserva no supere la capacidad máxima del espacio. |
| RF7 | Obtener el detalle completo de una reserva: docente, facultad, espacio y recursos solicitados. |
| RF8 | Listar, actualizar y eliminar cada una de las entidades (CRUD). |

## 5. Requisitos técnicos

- NestJS + TypeORM + MySQL.
- Configuración por variables de entorno (`.env`).
- DTOs diferenciados para creación y actualización, con validación (`class-validator`).
- Inyección de dependencias e inyección de repositorios en servicios.
- API REST.
- **Nunca** subir `.env` al repositorio. Debe existir `.env.example`.

## 6. Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Runtime | Node.js (LTS) |
| Framework | NestJS |
| ORM | TypeORM |
| Base de datos | MySQL 8 |
| Validación | class-validator + class-transformer |
| Config | @nestjs/config (dotenv) |
| Control de versiones | Git + GitHub |

## 7. Arquitectura

Arquitectura **modular** de NestJS (una carpeta por dominio). Cada módulo es autocontenido
(controller + service + entity + dto + module) y se registra en `AppModule`.

```
Cliente HTTP
    │
    ▼
main.ts (puerto, globalPrefix, ValidationPipe global)
    │
    ▼
AppModule ── ConfigModule (global, lee .env)
        └── TypeOrmModule.forRootAsync (usa ConfigService)
              └── Módulos de dominio
```

**Capas por módulo de dominio:**

1. **Controller** — expone endpoints REST, delega en el servicio.
2. **Service** — lógica de negocio (incluye la regla de capacidad). Usa repositorios inyectados.
3. **Repository** — TypeORM (`@InjectRepository`), acceso a datos.
4. **Entity** — mapeo a tabla MySQL.
5. **DTO** — validación de entrada (Create/Update).

**Decisiones de arquitectura:**

- `ValidationPipe` global con `whitelist: true` y `transform: true` para validar/limpiar DTOs.
- Prefijo global de rutas `/api`.
- Regla de negocio (capacidad) implementada **en el servicio de Reservas**, no en el controller,
  para evitar duplicación y mantener la lógica centralizada.
- Relación muchos-a-muchos Reserva↔Recurso con `@ManyToMany` + `@JoinTable` (no requiere entidad
  intermedia porque la tabla de unión no tiene campos propios).

## 8. Entidades

| Entidad | Tabla | Campos principales | Tipo |
| --- | --- | --- | --- |
| `Facultad` | `facultades` | `id`, `nombre` (unique), `descripcion?` | — |
| `Docente` | `docentes` | `id`, `nombre`, `email` (unique), `facultadId` (FK) | — |
| `Espacio` | `espacios` | `id`, `nombre`, `tipo` (enum), `capacidadMaxima`, `facultadId` (FK) | — |
| `Recurso` | `recursos` | `id`, `nombre` (unique), `descripcion?` | — |
| `Reserva` | `reservas` | `id`, `docenteId` (FK), `espacioId` (FK), `cantidadPersonas`, `fecha`, `horaInicio`, `horaFin` | — |

> `id` numérico autoincremental (`int unsigned`). `?` = opcional.

### Enum `EspacioTipo`

```
SALON | LABORATORIO | AUDITORIO
```

## 9. Relaciones entre entidades

```
Facultad 1 ────< Docente     (una facultad tiene muchos docentes)
Facultad 1 ────< Espacio     (una facultad tiene muchos espacios)
Docente  1 ────< Reserva     (un docente hace muchas reservas)
Espacio  1 ────< Reserva     (un espacio tiene muchas reservas)
Reserva  >────< Recurso      (muchos-a-muchos; tabla de unión: reserva_recursos)
```

- `Docente.facultadId` → FK a `facultades.id` (ManyToOne / OneToMany).
- `Espacio.facultadId` → FK a `facultades.id` (ManyToOne / OneToMany).
- `Reserva.docenteId` → FK a `docentes.id`.
- `Reserva.espacioId` → FK a `espacios.id`.
- `Reserva` ↔ `Recurso` mediante `@JoinTable` → tabla `reserva_recursos`
  (`reservaId`, `recursoId`, PK compuesta).

## 10. Reglas de negocio

| Regla | Descripción | Implementación |
| --- | --- | --- |
| RN1 | `reserva.cantidadPersonas <= espacio.capacidadMaxima` | En `ReservasService.create`/`update`: cargar el espacio y lanzar `BadRequestException` si se supera. |
| RN2 | Una reserva debe referenciar un docente y un espacio existentes | FKs + validación de existencia. |
| RN3 | Los recursos de una reserva deben existir | Validar ids de recursos antes de asociar. |

## 11. Estructura de carpetas (propuesta)

```
Proyecto EduSpace/
├── .env.example
├── .gitignore
├── EDUSPACE_MANAGER_CONTEXT.md
├── package.json
├── tsconfig.json
├── nest-cli.json
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    │   └── enums/
    │       └── espacio-tipo.enum.ts
    ├── facultades/
    │   ├── facultades.module.ts
    │   ├── facultades.controller.ts
    │   ├── facultades.service.ts
    │   ├── entities/
    │   │   └── facultad.entity.ts
    │   └── dto/
    │       ├── create-facultad.dto.ts
    │       └── update-facultad.dto.ts
    ├── docentes/
    │   ├── docentes.module.ts
    │   ├── docentes.controller.ts
    │   ├── docentes.service.ts
    │   ├── entities/
    │   │   └── docente.entity.ts
    │   └── dto/
    │       ├── create-docente.dto.ts
    │       └── update-docente.dto.ts
    ├── espacios/
    │   ├── espacios.module.ts
    │   ├── espacios.controller.ts
    │   ├── espacios.service.ts
    │   ├── entities/
    │   │   └── espacio.entity.ts
    │   └── dto/
    │       ├── create-espacio.dto.ts
    │       └── update-espacio.dto.ts
    ├── recursos/
    │   ├── recursos.module.ts
    │   ├── recursos.controller.ts
    │   ├── recursos.service.ts
    │   ├── entities/
    │   │   └── recurso.entity.ts
    │   └── dto/
    │       ├── create-recurso.dto.ts
    │       └── update-recurso.dto.ts
    └── reservas/
        ├── reservas.module.ts
        ├── reservas.controller.ts
        ├── reservas.service.ts
        ├── entities/
        │   └── reserva.entity.ts
        └── dto/
            ├── create-reserva.dto.ts
            └── update-reserva.dto.ts
```

## 12. Endpoints previstos

Prefijo global: `/api`

### Facultades
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/facultades` | Crear facultad |
| GET | `/api/facultades` | Listar facultades |
| GET | `/api/facultades/:id` | Obtener facultad |
| PATCH | `/api/facultades/:id` | Actualizar facultad |
| DELETE | `/api/facultades/:id` | Eliminar facultad |

### Docentes
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/docentes` | Crear docente |
| GET | `/api/docentes` | Listar docentes |
| GET | `/api/docentes/:id` | Obtener docente (incluye facultad) |
| PATCH | `/api/docentes/:id` | Actualizar docente |
| DELETE | `/api/docentes/:id` | Eliminar docente |

### Espacios
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/espacios` | Crear espacio |
| GET | `/api/espacios` | Listar espacios (incluye facultad) |
| GET | `/api/espacios/:id` | Obtener espacio |
| PATCH | `/api/espacios/:id` | Actualizar espacio |
| DELETE | `/api/espacios/:id` | Eliminar espacio |

### Recursos
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/recursos` | Crear recurso |
| GET | `/api/recursos` | Listar recursos |
| GET | `/api/recursos/:id` | Obtener recurso |
| PATCH | `/api/recursos/:id` | Actualizar recurso |
| DELETE | `/api/recursos/:id` | Eliminar recurso |

### Reservas
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/reservas` | Crear reserva (valida RN1) |
| GET | `/api/reservas` | Listar reservas |
| GET | `/api/reservas/:id` | **Detalle completo** (docente, facultad, espacio, recursos) |
| PATCH | `/api/reservas/:id` | Actualizar reserva (valida RN1) |
| DELETE | `/api/reservas/:id` | Eliminar reserva |

> **Consulta avanzada (RF7):** `GET /api/reservas/:id` debe devolver:
> `nombre del docente`, `facultad`, `espacio físico`, `recursos adicionales`.
> Se implementa cargando las relaciones con TypeORM (`relations` o `QueryBuilder`).

## 13. Convenciones de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Entidades (clase) | Singular, PascalCase | `Facultad`, `Reserva` |
| Tablas | Plural, snake_case | `facultades`, `reserva_recursos` |
| Módulos / carpetas | Plural, kebab-case | `facultades`, `reservas` |
| Controllers | `Nombre` + `Controller` | `FacultadesController` |
| Services | `Nombre` + `Service` | `FacultadesService` |
| DTOs | `Create` / `Update` + `Nombre` + `Dto` | `CreateReservaDto` |
| Archivos | kebab-case | `create-reserva.dto.ts` |
| Enum | Singular, PascalCase, valores UPPER_SNAKE | `EspacioTipo.SALON` |
| Columnas | camelCase (TypeORM → snake_case en BD) | `capacidadMaxima` → `capacidad_maxima` |
| Commits | Conventional Commits | `feat(reservas): agrega validación de capacidad` |

## 14. Estrategia de Git

- Rama principal: `main` (o `master`).
- Cada integrante trabaja en su rama: `feat/<dominio>-<nombre>`.
- Flujo: `pull` de `main` → crear rama → trabajar → `push` → Pull Request a `main`.
- Commits atómicos y en español, con Conventional Commits.
- **Nunca** commitear `.env`.

### Ramas propuestas (por integrante / dominio)

| Integrante | Dominio asignado | Rama |
| --- | --- | --- |
| Integrante 1 | Setup + Facultades | `feat/setup-facultades` |
| Integrante 2 | Docentes | `feat/docentes` |
| Integrante 3 | Espacios + Recursos | `feat/espacios-recursos` |
| Integrante 4 | Reservas (regla de negocio + detalle) | `feat/reservas` |

> **Pendiente:** reemplazar "Integrante N" por los nombres reales del equipo y confirmar
> el reparto de dominios. Las dependencias obligan a que las entidades base (Facultad, Docente,
> Espacio, Recurso) existan antes que Reservas.

## 15. Estado actual del proyecto

- **Scaffolding de NestJS 12 creado** (ESM: `"type": "module"`). Los imports relativos
  usan extensión `.js` (ej.: `import { AppModule } from './app.module.js'`).
- **Toolchain:** vitest (tests), oxlint (lint), prettier (format). No usa eslint/jest.
- **Dependencias instaladas:** NestJS 12, @nestjs/config, @nestjs/typeorm, typeorm, mysql2,
  class-validator, class-transformer.
- **Configuración base lista:** `ConfigModule` global, `TypeOrmModule.forRootAsync` con MySQL,
  `ValidationPipe` global (whitelist + transform), prefijo `/api`.
- **Creados:** `.env.example` y `.gitignore` (incluye `.env`).
- **Módulos de dominio SIN implementar** (Facultades, Docentes, Espacios, Recursos, Reservas)
  y sin entidades todavía.
- Compilación (`npm run build`) y lint (`npm run lint`) pasan sin errores.
- Repositorio git inicializado en la carpeta del proyecto (rama `main`). Sin commits todavía.

## 16. Decisiones técnicas importantes

1. **IDs numéricos autoincrementales** (`int unsigned`) por simplicidad.
2. **`tipo` de espacio como enum** (no tabla aparte): SALON / LABORATORIO / AUDITORIO.
3. **Reserva↔Recurso con `@ManyToMany`** y tabla de unión `reserva_recursos` (sin entidad intermedia).
4. **Regla de capacidad en el service** de Reservas, reutilizada por `create` y `update`.
5. **DTOs separados** para creación y actualización (`UpdateXDto` extiende `CreateXDto` con `PartialType`).
6. **`synchronize: true` solo en desarrollo** (genera tablas automáticamente); en producción usar migraciones.
7. Configuración de BD vía `ConfigService` leyendo `.env` (sin credenciales en código).
8. Idioma de código y mensajes: español.

## 17. Pendientes

- [x] Corregir la ubicación del repositorio git (ver Problemas conocidos).
- [ ] Definir nombres reales de los 4 integrantes y reparto de dominios.
- [x] Inicializar el proyecto NestJS (scaffolding) y dependencias.
- [x] Crear `.env.example` y `.gitignore`.
- [ ] Implementar módulo por módulo según el reparto.
- [ ] Definir si las reservas requieren validación de solapamiento de horarios (no pedido en el caso; se omite salvo decisión del equipo).

## 18. Problemas conocidos

1. ~~Repositorio git mal ubicado~~ → **Resuelto:** repositorio inicializado en `Proyecto EduSpace`
   (rama `main`). No queda `.git` en `C:\Users\camil`.
2. ~~No existe `.gitignore` ni `.env.example`~~ → **Resuelto:** ambos creados.
