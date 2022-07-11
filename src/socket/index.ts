import { io } from 'socket.io-client';
import { Config } from '@/config';

const url = Config.ws
const socket = io(url, {
  transports: ['websocket'],
  path: '/chat',
  reconnection: true,
  reconnectionAttempts: Infinity,
  autoConnect: false
});

export default socket

