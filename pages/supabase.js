console.log("supabase.js loaded");
console.log("supabase global:", window.supabase);

const SUPABASE_URL = "https://ujigpvrowzlcawxehtzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaWdwdnJvd3psY2F3eGVodHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzI3MDksImV4cCI6MjA4MTIwODcwOX0.msE70BJL2TV_kR8NnC6uKwnt5KXG2R69psja_g69vhY";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("supabaseClient created:", window.supabaseClient);