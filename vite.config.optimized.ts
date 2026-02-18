import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import manusRuntime from "vite-plugin-manus-runtime";

/**
 * Configuration Vite optimisée pour PERFUMUM
 * 
 * Améliorations apportées:
 * - Code splitting agressif pour réduire le bundle initial
 * - Optimisation des dépendances lourdes (React Flow, Chart.js, Leaflet)
 * - Configuration du cache pour améliorer les temps de rebuild
 * - Compression et minification optimisées
 * - Préchargement intelligent des modules
 */

export default defineConfig({
  plugins: [
    react(),
    manusRuntime(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  build: {
    // Optimisation du bundle
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    
    // Code splitting agressif
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks séparés pour un meilleur caching
          "react-vendor": ["react", "react-dom", "react/jsx-runtime"],
          "router": ["wouter"],
          "query": ["@tanstack/react-query"],
          "trpc": ["@trpc/client", "@trpc/react-query"],
          
          // Composants UI lourds
          "ui-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          
          // Visualisations lourdes (lazy-loaded)
          "viz-reactflow": ["reactflow"],
          "viz-charts": ["chart.js", "react-chartjs-2"],
          "viz-maps": ["leaflet", "react-leaflet"],
          "viz-recharts": ["recharts"],
          
          // Utilitaires
          "utils": ["clsx", "tailwind-merge", "date-fns"],
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "icons": ["lucide-react"],
        },
        
        // Nommage des chunks pour un meilleur debugging
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `assets/[name]-[hash].js`;
        },
        
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
    
    // Taille des chunks
    chunkSizeWarningLimit: 1000, // 1MB
    
    // Sourcemaps pour production (désactiver si non nécessaire)
    sourcemap: false,
    
    // Optimisation CSS
    cssCodeSplit: true,
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
    port: 3000,
    strictPort: false,
    host: true,
    
    // HMR optimisé
    hmr: {
      overlay: true,
    },
    
    // Proxy pour l'API
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  
  // Preview (production locale)
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
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
  
  // Définir les variables d'environnement
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
