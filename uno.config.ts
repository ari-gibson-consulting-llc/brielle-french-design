import {
  defineConfig,
  presetAttributify, presetTypography, presetUno, presetWebFonts,
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        base: 'Inter',
      }
    }),
  ],
})