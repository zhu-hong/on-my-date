import { resolve } from 'path'
import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import { presetWind } from 'unocss'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    unocss({
      presets: [
        presetWind(),
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['@zhu-hong/usedate', 'vue', 'element-ui'],
    },
  },
})
