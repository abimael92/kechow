/**
 * Laravel Echo factory with pluggable auth (session or Bearer token).
 * Use createEcho(getAuth) then useEcho() so owner/delivery can share one instance.
 * Backend: BROADCAST_CONNECTION=reverb, run reverb:start; authorize channels in routes/channels.php.
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

export type EchoAuthProvider = () => Promise<{ token?: string }>;

export function createEcho(getAuth: EchoAuthProvider): Echo<any> {
  const baseUrl =
    (import.meta.env.VITE_API_URL as string)?.replace(/\/api\/?.*$/i, '') ||
    'http://127.0.0.1:8000';

  return new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY as string,
    wsHost:
      (import.meta.env.VITE_REVERB_HOST as string) || '127.0.0.1',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: import.meta.env.PROD === true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${baseUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Accept: 'application/json',
      },
    },
    authorizer: (channel: any) => ({
      authorize: async (socketId: string) => {
        const auth = await getAuth();
        const headers: Record<string, string> = {
          Accept: 'application/json',
          'X-Socket-ID': socketId,
        };
        if (auth.token) {
          headers.Authorization = `Bearer ${auth.token}`;
        }
        return { auth: auth.token || '' };
      },
    }),
  });
}
