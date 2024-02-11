import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        base: {
          name: "Inter",
          weights: [400, 500, 600, 700],
        },
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
