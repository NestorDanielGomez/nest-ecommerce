<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Nest-Ecommerce API

Api para carga de productos usando postgres. Enlazar usuarios con productos
Autenticación mediante JWTs y autorización de rutas segun nivel de admin del usuario.
Carga de imagenes al FyleSystem (valicaciones y control de carga).
Prevenir doble conexión de usuarios autenticados.
Uso de websockets, emitir y escuchar mensajes desde el servidor (Nestjs) y cliente (React Vite). Desconectar sockets manualmente

## Instalación del proyecto.

-Clonar proyecto

```bash
$ npm install
```

- Clonar y renombrar el archivo `.env.template` por `.env`.
- Cambiar las variables de entorno segun ambito de desarrollo.
- Levantar la Base de datos.

```bash
$ docker-compose up -d
```

- Correr proyecto en modo desarrollo:

```bash
  $ npm run start:dev
```

-Ejecutar Seed para llenado de la BD

```bash
  $ localhost:3000/api/seed
```

Sitio desplegado en Netlify:
https://ws-socket-nestjs.netlify.app/

Backend desplegado en Render:
https://nest-ecommerce-postgres.onrender.com/api/products

Swagger con los endpoints
https://nest-ecommerce-postgres.onrender.com/api
