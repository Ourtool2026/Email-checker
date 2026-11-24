import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    rules: {
      // Frontend-only prototype: sample data in lib/data is a mutable in-memory store.
      // Pages change it in place and call refresh() (lib/store.js) to re-render.
      // Replace with API calls + state when the backend lands.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      // Sample photos and generated avatars are tiny static files; next/image adds nothing here.
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default config;
