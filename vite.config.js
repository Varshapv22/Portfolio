import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:    'index.html',
        journey: 'journey.html',
        boat:    'boat_game.html',
      },
    },
  },
});
