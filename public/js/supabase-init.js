// WARNING: Replace these placeholders with your actual Supabase project keys.
const SUPABASE_URL = 'https://wdocnovzaymlxthbfdnt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2Nub3Z6YXltbHh0aGJmZG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTYzOTQsImV4cCI6MjA3OTk5MjM5NH0.AI7Rls0euUEiffuZayERmHrCCVflRGovAul9v4CwOWc';

// Initialize the Supabase client and attach it to `window.supabase` so other
// scripts (static pages and React) can access the client via the global.
// Note: use `window.supabase = window.supabase.createClient(...)` instead of
// `const supabase = ...` so the client is available globally.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);