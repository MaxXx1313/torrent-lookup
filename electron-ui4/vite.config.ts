import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const CUSTOM_ELEMENTS = ['el-dialog', 'el-dialog-backdrop', 'el-dialog-panel'];
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag: string) => CUSTOM_ELEMENTS.includes(tag),
                }
            }
        }),
        // vueDevTools(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
