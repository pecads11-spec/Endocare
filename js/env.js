// Processed by Vite - replaces import.meta.env at build time
// Exposes env vars to window for non-module scripts (chatbot.js)
window.__ENV__ = Object.assign(window.__ENV__ || {}, {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
});
