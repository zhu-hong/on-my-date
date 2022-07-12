import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import unocss from 'unocss/vite'
import { presetWind } from 'unocss'

// @ts-ignore
import nested from 'postcss-nested'

export default defineConfig({
  plugins: [
    vue({
      style: {
        postcssPlugins: [
          nested(),
        ],
      },
    }),
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
