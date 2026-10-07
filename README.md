# clausulas_paragrafos_crud

API CRUD desarrollada en NestJS para la gestión de base de datos no relacional (MongoDB).

# Especificaciones Técnicas

## Tecnologías Implementadas y Versiones

- [Node.js](https://nodejs.org/): 24.21.0 (LTS Krypton)
- [NestJS](https://github.com/nestjs/nest): 12.1.2
- Nest CLI: 12.0.8
- [TypeScript](https://www.typescriptlang.org/): 6.0.3
- [Mongoose](https://mongoosejs.com/): 9.10.4
- [MongoDB](https://github.com/mongodb/mongo): 8.3.4
- [pnpm](https://pnpm.io/): 12.9.1

## Prerrequisitos

- Node.js >= 24.21.0
- pnpm >= 12.9.1, habilitado con `corepack enable pnpm`
- Una instancia de MongoDB >= 8.0 accesible
- Docker (opcional, para levantar MongoDB en local)

## Variables de Entorno

```shell
CLAUSUAS_PARAGRAFOS_DB_USER=[usuario con acceso a la base de datos]
CLAUSUAS_PARAGRAFOS_DB_PASS=[password del usuario]
CLAUSUAS_PARAGRAFOS_DB_HOST=[Host de la base de datos]
CLAUSUAS_PARAGRAFOS_DB_PORT=[Puerto de conexión con la base de datos]
CLAUSUAS_PARAGRAFOS_DB_NAME=[nombre de la base de datos]
CLAUSUAS_PARAGRAFOS_DB_AUTH=[nombre de la base de datos de credenciales]
PORT=[puerto en el que expone el servicio, 8080 por defecto]
```

**NOTA:** Las variables se asignan en un archivo privado .env

**NOTA:** El prefijo `CLAUSUAS_` (sin la `L` de «CLAUSULAS») es el nombre real de las variables en
el código y en los parámetros del AWS SSM Parameter Store. No se renombra para no romper el
despliegue.

## Ejecución del Proyecto

```shell
#1. Clonar el repositorio
git clone  https://github.com/udistrital/clausulas_paragrafos_crud.git #Opcion 1: Via HTTPS
git clone  git@github.com:udistrital/clausulas_paragrafos_crud.git #Opcion 2: Via SSH


#2. Moverse a la carpeta del repositorio
cd clausulas_paragrafos_crud

#3. Moverse a la rama **develop**
git pull origin develop && git checkout develop

#4. Habilitar pnpm e instalar dependencias
corepack enable pnpm
pnpm install --frozen-lockfile

#5. Crear el archivo .env y asignar las variables de entorno
touch .env

#6. Levantar el servicio
pnpm run start:dev
```

La documentación OpenAPI queda disponible en `http://localhost:8080/swagger` y se regenera en
`swagger/swagger.json` y `swagger/swagger.yaml` en cada arranque.

### MongoDB local con Docker (opcional)

```shell
docker run -d --name mongo-clausulas -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  mongo:8.3.4
```

### Ejecución Pruebas

```shell
# Pruebas unitarias: ejecuta jest sobre los archivos .spec.ts
pnpm test

# Pruebas unitarias con reporte de cobertura (carpeta coverage/)
pnpm run test:cov

# Prueba e2e del endpoint de salud (no requiere MongoDB ni .env)
pnpm run test:e2e

# Pruebas de integración contra MongoDB real (ver sección siguiente)
pnpm run test:integration

# Análisis estático y formato
pnpm run lint
pnpm run format
```

**NOTA:** Jest se ejecuta con `node --experimental-vm-modules` (ya incluido en los scripts) porque
`@nestjs/testing` 12 se publica como ESM. Use siempre `pnpm test` y no `jest` directamente. Node
muestra un `ExperimentalWarning` inofensivo.

### Pruebas de integración

Levantan la aplicación completa (`AppModule`) contra una **MongoDB real** y llaman a los endpoints con
Supertest. No requieren VPN ni otros servicios: este CRUD no consume ningún servicio externo, solo MongoDB.
Son opt-in: `pnpm test` y el pipeline no las ejecutan.

Requisitos:

```shell
# MongoDB local (si el contenedor ya existe: docker start mongo-clausulas)
docker run -d --name mongo-clausulas -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo:8.3.4
```

El `.env` debe tener las variables `CLAUSUAS_PARAGRAFOS_DB_*` apuntando a esa instancia (usuario, clave,
host, puerto y base de autenticación). El nombre de la base **se ignora**: las pruebas usan
`clausulas_integration` (o `INTEGRATION_DB_NAME`) para no tocar otros datos, y la **eliminan al terminar**.
Por seguridad, si el nombre no contiene `test` o `integration` las pruebas se niegan a correr.

```shell
pnpm run test:integration
```

| Archivo (`test/`) | Qué valida |
|---|---|
| `clausulas.integration-spec.ts`, `paragrafos.integration-spec.ts` | CRUD, filtros (`query`), paginación (`limit`/`offset`), orden (`orderBy`/`sort`), `PUT` que devuelve el documento actualizado (`returnDocument: 'after'` de Mongoose 9) y borrado lógico |
| `ordenes.integration-spec.ts` | `orden-clausulas` y `orden-paragrafos`: el orden de los ids se conserva |
| `plantilla-tipo-contratos.integration-spec.ts` | Versionado, `$lookup` de cláusulas y parágrafos, filtros de `tipo-contrato/:id`, 404 |
| `contratos.integration-spec.ts` | `POST` (201/409), `GET` con cláusulas y parágrafos ordenados y anidados, `PUT` |
| `flujo-consumidores.integration-spec.ts` | La secuencia exacta de llamadas de `gestion_contractual_mf` y la forma de respuesta que consume `minuta_contractual_mid` |

Las pruebas marcadas `HALLAZGO` fijan el comportamiento **actual** de comportamientos dudosos, para que
un cambio futuro sea deliberado:

- `GET`, `PUT` y `DELETE` con un id inexistente o mal formado responden `500` (no `404`): los services lanzan
  `Error` y los controllers de cláusulas, parágrafos y órdenes no lo capturan.
- `main.ts` no registra un `ValidationPipe` global: los DTO no se validan; solo el esquema de Mongoose frena
  datos incompletos (con `500`).
- La primera versión de una plantilla por tipo de contrato queda numerada `2`.
- `GET plantilla-tipo-contratos/tipo-contrato/:id` no filtra por `version_actual`: con dos versiones sirve la
  más antigua.
- `PUT /contratos/:id` sobre un contrato sin estructura hace *upsert* y crea documentos sin `activo`, que
  `GET /contratos/:id` no devuelve. Para crear hay que usar `POST`.

### Análisis de Calidad (SonarQube)

El pipeline de Drone ejecuta `pnpm run test:cov` y después `sonar-scanner` en las ramas `feature/*`,
`develop`, `release/*`, `hotfix/*` y `master`. La configuración está en `sonar-project.properties` y la
cobertura se toma de `coverage/lcov.info`. Requiere los secrets `SONAR_HOST` y `SONAR_TOKEN` en Drone.

### Compilación

```shell
pnpm run build       # genera dist/
pnpm run start:prod  # ejecuta dist/main
```

## Parches de Seguridad Aplicados

Actualización técnica de la issue
[udistrital/argo_documentacion#364](https://github.com/udistrital/argo_documentacion/issues/364):
atención de alertas de Dependabot y subida de dependencias a versiones estables.

Resultado de `pnpm audit` sobre la rama `develop` sin cambios y sobre esta rama:

| Severidad | Antes (`develop`) | Después |
| -- | -- | -- |
| Crítica | 2 | 0 |
| Alta | 46 | 0 |
| Moderada | 23 | 0 |
| Baja | 11 | 0 |
| **Total** | **82** | **0** |

Alertas críticas resueltas:

- `mongoose` 8.x: [GHSA-vg7j-7cwx-8wgw](https://github.com/advisories/GHSA-vg7j-7cwx-8wgw), resuelta con Mongoose 9.10.4.
- `form-data` 4.0.0 a 4.0.5 (dependencia transitiva): [GHSA-fjxv-7rqg-78g4](https://github.com/advisories/GHSA-fjxv-7rqg-78g4).

Otras alertas relevantes resueltas: `@nestjs/common` ([GHSA-cj7v-w2c7-cp7c](https://github.com/advisories/GHSA-cj7v-w2c7-cp7c)),
`@nestjs/core` ([GHSA-36xv-jgw5-4q75](https://github.com/advisories/GHSA-36xv-jgw5-4q75)), `multer`, `path-to-regexp`, `qs`,
`js-yaml`, `lodash`, `minimatch`, `brace-expansion` y `validator`.

| Área | Antes | Después | Motivo |
| -- | -- | -- | -- |
| Runtime | Node `current` (sin fijar) | Node 24.21.0 LTS | Imagen base reproducible en Docker y Drone |
| Framework | NestJS 10.4.4 | NestJS 12.1.2 | Corrige alertas de `@nestjs/common` y `@nestjs/core`; Express 5 y paquetes ESM |
| ODM | Mongoose 8.7.0 | Mongoose 9.10.4 | Corrige la alerta crítica y 3 más de `mongoose`; retiro de APIs deprecadas |
| Lenguaje | TypeScript 5.6.2 | TypeScript 6.0.3 | Máxima versión dentro del peer range de `@nestjs/swagger` 12 |
| Lint | ESLint 8.57.1 (`.eslintrc.js`) | ESLint 10 (flat config) | El formato `.eslintrc` fue retirado en ESLint 10 |
| Pruebas | Jest 29.7.0 | Jest 30.5.2 | Actualiza dependencias transitivas con alertas (`glob`, `minimatch`, `brace-expansion`) |
| Validación | class-validator 0.14.1 | class-validator 0.15.1 | Corrige `validator` ([GHSA-vghf-hv5q-vc2g](https://github.com/advisories/GHSA-vghf-hv5q-vc2g)) |
| Gestor | pnpm 9.11.0 + doble lockfile | pnpm 12.9.1, lockfile único | `package-lock.json` y `pnpm-lock.yaml` coexistían con grafos de dependencias distintos |
| Dependabot | Sin configuración | `.github/dependabot.yml` | Actualizaciones semanales agrupadas para npm y Docker |

Paquetes retirados por quedar obsoletos o redundantes:

- `swagger-ui-express`: `@nestjs/swagger` 12 ya empaqueta `swagger-ui-dist`.
- `@nestjs/mapped-types`: `PartialType` se consume desde `@nestjs/swagger`, que lo incluye.
- `@typescript-eslint/eslint-plugin` y `@typescript-eslint/parser`: reemplazados por el
  meta-paquete `typescript-eslint`.

TypeScript permanece en la rama 6.x de forma intencional: `@nestjs/swagger` 12 declara el peer
`typescript ^5.5.0 || ^6.0.0` y `typescript-eslint` 8 declara `>=4.8.4 <6.1.0`, por lo que
TypeScript 7 queda fuera de ambos rangos.

# Estado CI

| Develop | Release 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/clausulas_paragrafos_crud/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/clausulas_paragrafos_crud) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/clausulas_paragrafos_crud/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/clausulas_paragrafos_crud) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/clausulas_paragrafos_crud/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/clausulas_paragrafos_crud) |

# Modelo de Datos

![Modelo de datos Formularios dinámicos](/database/Modelo-datos-Clausulas-Paragrafos.png)

[Archivo de modelo de datos](/database/modelo-datos-no-relacional-clausulas-paragrafos.drawio)

# Licencia

clausulas_paragrafos_crud is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

clausulas_paragrafos_crud is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_crud. If not, see https://www.gnu.org/licenses/.
