import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL);

export default socket;
