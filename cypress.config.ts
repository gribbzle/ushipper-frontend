import { defineConfig } from 'cypress';

export default defineConfig({
    video: false,
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'http://localhost:3000',
    },
    viewportWidth: 1440,
    viewportHeight: 1024,
});
