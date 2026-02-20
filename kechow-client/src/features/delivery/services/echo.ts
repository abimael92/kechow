import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',

  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),

  forceTLS: false,
  enabledTransports: ['ws'],

  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json',
    },
  },
});

echo.connector.pusher.connection.bind('connected', () => {
  console.log('WebSocket connected');
});

echo.connector.pusher.connection.bind('error', (err: any) => {
  console.error('WebSocket error', err);
});

export default echo;
