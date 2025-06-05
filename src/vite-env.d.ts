/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_API_COURSE_URL: string; // Добавьте, если используете
  // определите здесь другие переменные окружения, которые вы используете
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}