import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import darkTheme from './scripts/postcss-dark-theme.js';

export default defineConfig({ plugins: [react()], base: './', css: { postcss: { plugins: [darkTheme()] } } });
