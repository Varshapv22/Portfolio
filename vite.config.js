import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Portfolio/',

  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        journey: 'journey.html',
        boat: 'boat_game.html',
      },
    },
  },
});
