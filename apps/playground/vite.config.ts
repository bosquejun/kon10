import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { lathaStart } from '@latha/start/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

export default defineConfig({
  // @libsql/client dynamically requires a platform-specific native binding
  // (e.g. @libsql/linux-x64-gnu). Rollup can't statically analyze that
  // require, so the server (SSR) build must leave it un-bundled and let Node
  // resolve it for real at runtime — this is TanStack Start's own SSR/server
  // Vite build, upstream of (and un-affected by) Nitro's own bundling config.
  ssr: {
    external: ['@libsql/client'],
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    // lathaStart() wraps tanstackStart() and injects the framework's /login and
    // /admin/$ routes, so this app needs no route files for them. In the
    // monorepo it also serves @latha/* packages from source for instant HMR;
    // that is a no-op for apps that install @latha/start from npm.
    lathaStart(),
    // Deploy-target plugin. TanStack Start no longer bundles its own deploy
    // adapters — Nitro auto-detects the host (Vercel, Netlify, Cloudflare,
    // plain Node) from the build environment, so no explicit preset is
    // needed here. Also what makes `pnpm start` (`.output/server/index.mjs`)
    // work at all: without this plugin the build only emits a plain Vite SSR
    // bundle under `dist/`, not the `.output/` tree that script expects.
    nitro({
      rollupConfig: { external: ['@libsql/client'] },
      // Force-copy the full package trees rather than relying on static
      // reference tracing, which can't follow @libsql/client's *dynamic*
      // require() of its platform-specific native binding — so the traced
      // output would otherwise ship without it and crash at runtime.
      // @libsql/linux-x64-gnu matches Vercel's Node.js runtime (Amazon
      // Linux, x64, glibc); adjust if deploying to a different platform.
      traceDeps: ['@libsql/client*', '@libsql/linux-x64-gnu*'],
    }),
    viteReact(),
  ],
})
