BildyApp - Backend API

Esta es la API para el backend de BildyApp, un sistema de gestión de albaranes y facturación. Está construida con Node.js, Express y MongoDB.

## Cómo levantar el proyecto

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd practicaintermedia
Instala las dependencias:

Bash
npm install
Crea tu archivo .env en la raíz del proyecto. Tienes un .env.example de referencia:

Fragmento de código
PORT=3000
NODE_ENV=development
PUBLIC_URL=http://localhost:3000
DB_URI=mongodb+srv://<usuario>:<password>@cluster/bildyapp
JWT_SECRET=tu_secreto_super_seguro
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
Arranca el servidor:

Para desarrollo (con watch): npm run dev

Para producción: npm start

Progreso del desarrollo (Historial de funcionalidades)
A lo largo de los commits se han ido implementando las siguientes características hasta llegar a la versión actual:

Setup inicial y arquitectura: Configuración del servidor con Express (v5), conexión a MongoDB mediante Mongoose y variables de entorno nativas de Node 22. Estructuración en carpetas (controladores, modelos, rutas, etc.).

Sistema de Autenticación: Implementación del modelo de usuario (User.js), registro, login y generación de tokens JWT (Access Token de 15 min y Refresh Token de 7 días). Encriptación de contraseñas con bcryptjs.

Validación de cuenta y seguridad: Añadida la verificación de email mediante un código de 6 dígitos. Implementación de middleware de seguridad (helmet, cors, express-rate-limit, express-mongo-sanitize).

Validación de datos con Zod: Creación de un middleware genérico para validar el body de las peticiones mediante esquemas de zod (user.validator.js), centralizando también el manejo de errores.

Onboarding y entidades de negocio: Creado el modelo Company.js. Rutas para actualizar los datos personales del usuario y para crear/asignar una compañía (soportando modalidad freelance o empresa normal).

Subida de archivos: Configuración de multer para la subida de logos de empresa, guardándolos en la carpeta /uploads y validando que solo sean imágenes (jpeg, png, webp, gif) de máximo 5MB.

Gestión de equipo y roles: Lógica para invitar nuevos compañeros al espacio de trabajo (rol guest), cambio de contraseñas y opciones de borrado de cuenta (soporte para soft delete y hard delete). Eventos centralizados con EventEmitter para el envío futuro de notificaciones.

Endpoints principales
El archivo api.http que se incluye en el proyecto tiene ejemplos para probar todas las rutas directamente desde VSCode (con la extensión REST Client).

Auth & Usuario (/api/user)

POST /register: Crear cuenta nueva.

PUT /validation: Validar el código de 6 dígitos del email.

POST /login: Iniciar sesión (devuelve tokens).

POST /refresh: Renovar el token de acceso.

POST /logout: Cerrar sesión.

GET /: Ver perfil actual y compañía asignada.

PUT /password: Cambiar la contraseña.

DELETE /: Borrar cuenta (?soft=true para borrado lógico).

Onboarding & Empresa

PUT /register: Añadir datos personales (NIF, dirección).

PATCH /company: Configurar empresa o darse de alta como freelance.

PATCH /logo: Subir o actualizar el logo (multipart/form-data).

POST /invite: Mandar invitación a un compañero (solo admin).
