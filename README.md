<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## configuracion variables de entorno

Aquí tienes una guía breve y práctica para obtener y configurar cada variable de entorno que listaste, con comandos y buenas prácticas.

Resumen rápido — dónde ponerlas

En desarrollo local: archivo .env (no lo subas al repositorio).
En producción: usar el panel de tu proveedor (Railway / Heroku / Vercel / AWS Secrets Manager / Azure Key Vault) o variables de entorno del sistema.
Nunca comites valores sensibles; rota y restringe permisos.
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
Si usas MySQL/MariaDB local:
Instala el servidor (ej. MySQL).
Crea base y usuario:
DB_HOST=localhost, DB_PORT=3306 (por defecto), DB_USER y DB_PASSWORD según lo creado, DB_NAME=sivex.
Si usas un servicio en la nube (Railway, PlanetScale, Amazon RDS):
Copia host, puerto, usuario, password y nombre de BD desde el panel del proveedor.
Pega esos valores en las variables de entorno del servicio (o en .env local).
NODE_ENV
Entorno de ejecución: "development" | "production" | "test".
En producción configura NODE_ENV=production; en local usa development o test.
JWT_SECRET
Genera un secreto seguro (no usar texto legible). Ejemplo:
Guarda el resultado en JWT_SECRET en tu .env o en el gestor de secretos.
Rota periódicamente y no lo expongas en logs.
HOST_FRONTEND
URL pública de tu frontend (ej.: https://mi-frontend.example.com).
La obtienes desde el despliegue del frontend (Vercel, Netlify, Railway, etc.) y se usa para CORS y enlaces en emails.
GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, GMAIL_REFRESH_TOKEN
Crear credenciales OAuth en Google Cloud Console:
Ve a https://console.cloud.google.com/apis/credentials
Crea un proyecto si no tienes.
Habilita Gmail API (Library → Gmail API → Enable).
Crea credenciales OAuth 2.0 (tipo: Desktop o Web según flujo). Obtendrás CLIENT_ID y CLIENT_SECRET.
En REDIRECT_URI pon la URL que usarás (p. ej. https://developers.google.com/oauthplayground si usas OAuth Playground para obtener refresh token).
Obtener REFRESH_TOKEN (usando OAuth Playground):
Abre https://developers.google.com/oauthplayground
Settings → marca “Use your own OAuth credentials” y pega CLIENT_ID / CLIENT_SECRET.
Selecciona scope de Gmail (por ejemplo: https://mail.google.com/ o https://www.googleapis.com/auth/gmail.send).
Authorize APIs → Exchange authorization code for tokens → copia refresh token.
GMAIL_USER = dirección de correo asociada (ej. tu-email@gmail.com).
Guarda CLIENT_ID, CLIENT_SECRET y REFRESH_TOKEN como variables seguras. Evita usar usuario/clave directas.
BASE_EVIDENCE_URL
URL pública del servicio que sirve evidencias (downloads). En local puede ser http://localhost:3001/evidence/download; en prod la URL pública del microservicio.
Obtenerla desde el despliegue del servicio que maneja archivos.
Buenas prácticas y seguridad

No comites .env. Añade .env a .gitignore.
Usa gestores de secretos en producción (Vault, AWS Secrets Manager, Railway secrets).
Minimiza permisos: el usuario DB debería tener solo los permisos necesarios.
Asegura la cuenta de Gmail: usa una cuenta dedicada o servicio con permisos mínimos; activa 2FA y usa OAuth refresh tokens (no contraseñas en texto).
Regenera/rota JWT_SECRET y claves si sospechas compromiso.
Marca password en tu entidad como select:false para evitar fugas en consultas.
Para Windows (temporal, session): PowerShell:
Cómo cargarlas en NestJS (ejemplo)

Usa dotenv / @nestjs/config; en main app module:
Accede con process.env.DB_HOST o ConfigService.
¿Quieres que genere comandos específicos para tu despliegue en Railway/Heroku o que aplique select:false en la entidad User y actualice los tests?
