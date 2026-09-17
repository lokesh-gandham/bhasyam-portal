import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    tanstackStart(),

    nitro({
      preset: "node-server",
      inlineDynamicImports: true,
    }),

    react(),
    tailwindcss(),
  ],

  server: {
    port: 3000,

    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  environments: {
    ssr: {
      build: {
        rollupOptions: {
          output: {
            codeSplitting: false,
          },
        },
      },
    },
  },
});
