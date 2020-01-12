import io from 'socket.io-client';

export const Socket = new io({
  path: '/ws'
});