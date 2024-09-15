# clausulas_paragrafos_crud

API CRUD desarrollada en NestJS para la gestión de base de datos no relacional (MongoDB).

# Especificaciones Técnicas

## Tecnologías Implementadas y Versiones

- [NestJS](https://github.com/nestjs/nest): 20.17.0
- Nest CLI: 10.4.5
- [MongoDB](https://github.com/mongodb/mongo): 7.0.14
- NPM: 10.8.2


## Variables de Entorno

```shell
DB_HOST=CLAUSUAS_PARAGRAFOS_HOST
DB_PORT=CLAUSUAS_PARAGRAFOS_PORT
DB_NAME=CLAUSUAS_PARAGRAFOS_NAME
```

**NOTA:** Las variables se asignan en una archivo privado .env

## Ejecución del Proyecto

```shell
#1. Clonar el repositorio
git clone  https://github.com/udistrital/clausulas_paragrafos_crud.git #Opcion 1: Via HTTPS
git clone  git@github.com:udistrital/clausulas_paragrafos_crud.git #Opcion 2: Via SSH


#2. Moverse a la carpeta del repositorio
cd clausulas_paragrafos_crud

#3. Moverse a la rama **develop**
git pull origin develop && git checkout develop

#4. Instalar dependencias
npm install

# Si no se instalan en su totalidad, ejecutar:
npm install --save @nestjs/mongoose mongoose
npm install --save @nestjs/swagger swagger-ui-express

# 5. Crear el archivo .env y asignar las variables de entorno
touch .env
```

### Ejecución Pruebas

Pruebas unitarias
```shell
# Test
npm test

# Se ejecutará jest, validando los casos de prueba en los archivos .spec.ts
```


# Modelo de Datos

![Modelo de datos Formularios dinámicos](/database/Modelo%20de%20datos%20Clausulas%20y%20Paragrafos.png)

# Licencia

clausulas_paragrafos_crud is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

clausulas_paragrafos_crud is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_crud. If not, see https://www.gnu.org/licenses/.