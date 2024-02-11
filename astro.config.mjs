import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import alpinejs from "@astrojs/alpinejs";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true, // or a path to the reset file
    }),
    alpinejs(),
    icon(),
  ],
  image: {
    domains: ["images.ctfassets.net"],
  },
});
