# PAWELLE — Bugs and Fixes Log

| Bug ID | Description | Component | Root Cause | Fix Applied | Status |
|---|---|---|---|---|---|
| BUG-001 | PowerShell disables script execution on `npm.ps1` | Environment / CLI | Windows ExecutionPolicy prevents running unsigned PowerShell scripts | Use `npm.cmd` and `npx.cmd` in all CLI commands | Fixed |
| BUG-002 | TypeScript type mismatch on Lucide icons in RoleSwitcherBanner | Component / TS | Lucide icons expect `LucideIcon` type rather than generic `FC<{ size?: number }>` | Imported `LucideIcon` type from `lucide-react` and updated prop signature | Fixed |
| BUG-003 | Vite environment types missing in `supabase.ts` | Config / TS | `import.meta.env` requires `vite/client` type reference | Created `src/vite-env.d.ts` with `/// <reference types="vite/client" />` | Fixed |
| BUG-004 | Node environment lacks `localStorage` during Vitest execution | Services / Store | Running unit tests in Node environment threw `localStorage is undefined` in `loadState`/`saveState` | Added `typeof localStorage !== 'undefined'` guard before accessing browser storage | Fixed |
| BUG-005 | Inventory deduction used `product_id` against `getProductBySlug` in `createOrder` | Services / Store | `createOrder` called `getProductBySlug(item.product_id)` which returned undefined, defaulting stock to 10 | Changed lookup to `this.products.find(p => p.id === item.product_id)` to accurately deduct real inventory | Fixed |
| BUG-006 | Vite single large bundle warning (>500 kB) | Build / Vite | All vendor dependencies were bundled into a single JS file | Configured `build.rollupOptions.output.manualChunks` splitting `vendor`, `icons`, and `supabase` | Fixed |
