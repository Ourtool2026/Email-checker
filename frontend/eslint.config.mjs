import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Frontend-only prototype: sample data in lib/data is an in-memory store that pages
      // change in place, then call refresh() (lib/store.ts). Replace with API calls and
      // typed records when the backend lands.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      // Sample photos and generated avatars are small static files.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // vendored shadcn/ui primitives and hooks (same source as Tirik Send): keep them identical to upstream
    "components/ui/**",
    "hooks/**",
  ]),
])

export default eslintConfig
