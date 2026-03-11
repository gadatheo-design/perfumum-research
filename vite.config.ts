import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// Plugin qui supprime les location.reload() du client Vite HMR
// Le proxy Manus ne supporte pas les WebSockets → les reconnexions HMR
// provoquent des rechargements infinis. On remplace reload() par console.debug().
const noHmrReload = (): import('vite').Plugin => ({
  name: 'no-hmr-reload',
  transform(code: string, id: string) {
    if (id.includes('@vite/client') || id.includes('vite/dist/client')) {
      const patched = code
        .replace(/location\.reload\(\)/g, 'console.debug("[HMR] reload suppressed by noHmrReload plugin")')
        .replace(/window\.location\.reload\(\)/g, 'console.debug("[HMR] reload suppressed")');
      return { code: patched, map: null };
    }
  },
});

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime({ injectTo: "body" }),
  noHmrReload(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Chunking minimal et sûr — laisser Rollup gérer les dépendances
        // pour éviter les cycles de dépendances
        manualChunks: (id) => {
          // Séparer uniquement React (noyau critique, pas de dépendances externes)
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react/jsx-runtime')
          ) {
            return 'react-vendor';
          }
          // Tout le reste : laisser Rollup décider
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext || "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "wouter",
      "@tanstack/react-query",
      "@trpc/client",
      "@trpc/react-query",
    ],
    exclude: ["reactflow"],
    force: false,
  },

  server: {
    host: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: "wss",
      overlay: false,
    },
    fs: {
      strict: false,
    },
  },

  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    target: "esnext",
  },

  cacheDir: ".vite",
});
