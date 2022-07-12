import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import unocss from 'unocss/vite'
import { presetWind } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

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
      transformers: [
        transformerDirective(),
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index'),
      formats: ['es'],
    },

    rollupOptions: {
      external: ['@zhu-hong/usedate', 'vue', 'element-ui'],
    },
  },
})
