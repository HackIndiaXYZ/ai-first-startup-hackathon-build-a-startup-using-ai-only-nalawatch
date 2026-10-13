import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_ACTIONS === 'true'
  ? '/ai-first-startup-hackathon-build-a-startup-using-ai-only-nalawatch/'
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
