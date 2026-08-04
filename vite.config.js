import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Extract base domain from VITE_API_URL (e.g. http://localhost:5000) or VITE_API_TARGET
  const target = env.VITE_API_TARGET || (env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : 'http://localhost:5000');

  return {
    plugins: [react()],
    preview: {
      port: 10000,
      host: true,
      allowedHosts: true,
    },
    server: {
      port: 3000,
      host: true,
      watch: {
        usePolling: true,
        interval: 500,
      },
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
        },
      },
    },
  };
});

