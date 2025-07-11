/// <reference types="vite/client" />

// If you want to explicitly list your VITE_… vars instead of pulling in everything:
interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  // add more env vars here as needed, e.g.
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
