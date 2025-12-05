// WARNING: Replace these placeholders with your actual Supabase project keys.
const SUPABASE_URL = 'https://wdocnovzaymlxthbfdnt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2Nub3Z6YXltbHh0aGJmZG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTYzOTQsImV4cCI6MjA3OTk5MjM5NH0.AI7Rls0euUEiffuZayERmHrCCVflRGovAul9v4CwOWc';

// The global 'supabase' object will be available after the main library is loaded
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);