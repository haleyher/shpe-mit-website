/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CALENDAR_ID?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
  readonly VITE_POINTS_API_URL?: string;
  readonly VITE_SLACK_CLIENT_ID?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
