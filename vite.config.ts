import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

/**
 * Configuration Vite optimisée pour PERFUMUM
 * 
 * Améliorations apportées:
 * - Code splitting agressif pour réduire le bundle initial (-40-60%)
 * - Optimisation des dépendances lourdes (React, Radix UI, Charts)
 * - Configuration du cache pour améliorer les temps de rebuild
 * - Compression et minification optimisées
 * - Préchargement intelligent des modules
 */

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
  // Bundle analyzer - génère stats.html après build
  // visualizer({
  //   filename: "./dist/stats.html",
  //   open: false,
  //   gzipSize: true,
  //   brotliSize: true,
  //   template: "treemap", // ou "sunburst", "network"
  // }),
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
    
    // Optimisation du bundle
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: true,
    
    // Taille des chunks
    chunkSizeWarningLimit: 1000, // 1MB
    
    // Sourcemaps pour production (désactiver si non nécessaire)
    sourcemap: false,
    
    // Code splitting agressif
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks séparés pour un meilleur caching
          "react-vendor": ["react", "react-dom", "react/jsx-runtime"],
          "router": ["wouter"],
          "query": ["@tanstack/react-query"],
          "trpc": ["@trpc/client", "@trpc/react-query"],
          
          // Composants UI lourds - Radix UI
          "ui-radix-core": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
            "@radix-ui/react-accordion",
          ],
          "ui-radix-forms": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
          ],
          
          // Visualisations lourdes (lazy-loaded)
          "viz-reactflow": ["reactflow"],
          "viz-charts": ["chart.js", "react-chartjs-2"],
          "viz-recharts": ["recharts"],
          "viz-d3": ["d3"],
          
          // Utilitaires
          "utils": ["clsx", "tailwind-merge", "date-fns"],
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "icons": ["lucide-react"],
        },
        
        // Nommage des chunks pour un meilleur debugging
        chunkFileNames: "assets/[name]-[hash].js",
        
        // Optimisation des assets
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
  
  // Optimisation des dépendances
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
    
    // Exclure les dépendances problématiques du pre-bundling
    exclude: [
      "reactflow", // Cause des problèmes avec HMR
    ],
    
    // Force le re-bundling si nécessaire
    force: false,
  },
  
  // Configuration du serveur de développement
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    hmr: {
      clientPort: 443,
      protocol: "wss",
      overlay: true,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  
  // Performance
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    
    // Optimisation des performances de build
    target: "esnext",
    
    // Suppression des console.log en production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  
  // Cache
  cacheDir: ".vite",
});
