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
  // build: {
  //   lib: {
  //     entry: resolve(__dirname),
  //   },
  //   rollupOptions: {
  //     external: ['@zhu-hong/datematrix', 'vue', 'element-ui'],
  //     output: {
  //       format: 'esm',
  //       dir: '',
  //       file: '',
  //     },
  //   },
  // },
})
