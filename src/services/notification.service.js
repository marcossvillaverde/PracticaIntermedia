import { EventEmitter } from 'node:events';

// Servicio de notificaciones
// Hacemos log por consola

class NotificationService extends EventEmitter {}

const notificationService = new NotificationService();

// Listeners

notificationService.on('user:registered', (usuario) => {
  console.log(`[EVENTO] user:registered — ${usuario.email} (código: ${usuario.verificationCode})`);
});

notificationService.on('user:verified', (usuario) => {
  console.log(`[EVENTO] user:verified — ${usuario.email}`);
});

notificationService.on('user:invited', (datos) => {
  console.log(`[EVENTO] user:invited — ${datos.email} invitado por ${datos.invitadoPor}`);
});

notificationService.on('user:deleted', (usuario) => {
  console.log(`[EVENTO] user:deleted — ${usuario.email}`);
});

export default notificationService;