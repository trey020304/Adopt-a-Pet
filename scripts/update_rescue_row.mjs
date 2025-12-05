#!/usr/bin/env node
/*
  update_rescue_row.mjs

  Usage:
    SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/update_rescue_row.mjs --id <row-id> --data '{"animal_type":"Dog","size":"Large"}'

  Notes:
  - This script uses the Supabase service_role key and MUST be run server-side (never expose the service_role key in client code).
  - The --data argument should be a JSON string with the columns you want to update. For array columns (health_condition, behavior_condition) pass arrays or comma-separated strings.
*/

import dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);
function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--id') out.id = args[++i];
    else if (a === '--data') out.data = args[++i];
    else if (a === '--table') out.table = args[++i];
    else if (a === '--help') out.help = true;
  }
  return out;
}

const parsed = parseArgs(args);
if (parsed.help || !parsed.id || !parsed.data) {
  console.log('\nUsage:');
  console.log('  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/update_rescue_row.mjs --id <row-id> --data "{\"animal_type\":\"Dog\"}"');
  console.log('\nOptional: --table <tableName>  (default: rescue)');
  process.exit(parsed.help ? 0 : 1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment.');
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(parsed.data);
} catch (e) {
  console.error('ERROR: --data must be valid JSON. Received:', parsed.data);
  process.exit(1);
}

const table = parsed.table || 'rescue';

try {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Normalize health_condition / behavior_condition if passed as comma-separated strings
  if (payload.health_condition && typeof payload.health_condition === 'string') {
    payload.health_condition = payload.health_condition.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (payload.behavior_condition && typeof payload.behavior_condition === 'string') {
    payload.behavior_condition = payload.behavior_condition.split(',').map(s => s.trim()).filter(Boolean);
  }

  console.log('Updating table', table, 'id', parsed.id, 'with', payload);
  const { data, error } = await supabase.from(table).update(payload).eq('id', parsed.id).select();
  if (error) {
    console.error('Supabase update error:', error);
    process.exit(1);
  }
  console.log('Update successful. Returned row(s):', data);
  process.exit(0);
} catch (e) {
  console.error('Unexpected error:', e);
  process.exit(1);
}
