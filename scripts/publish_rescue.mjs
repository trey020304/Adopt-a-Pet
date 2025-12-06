#!/usr/bin/env node
/*
 Simple helper to insert an `animals` row into Supabase using the
 service_role key. Use this when client-side inserts fail due to RLS
 or missing anon key in the browser.

 Usage (PowerShell):
   $env:SUPABASE_URL = 'https://your-project.supabase.co'
   $env:SUPABASE_SERVICE_ROLE_KEY = '...service_role_key...'
   node .\scripts\publish_rescue.mjs --file rescue_payload.json

 The file should contain a JSON object matching the `animals` row shape.
*/

import fs from 'fs/promises';
import fetch from 'node-fetch';

function usage() {
  console.log('Usage: node scripts/publish_rescue.mjs --file <json-file>');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args[0] !== '--file') usage();
  const file = args[1];

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(2);
  }

  let payload;
  try {
    const txt = await fs.readFile(file, 'utf8');
    payload = JSON.parse(txt);
  } catch (e) {
    console.error('Failed to read/parse file', e.message);
    process.exit(3);
  }

  try {
    const url = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/animals`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE,
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(Array.isArray(payload) ? payload : [payload])
    });
    const body = await res.text();
    console.log('Status:', res.status);
    try { console.log('Response:', JSON.stringify(JSON.parse(body), null, 2)); } catch(e) { console.log('Response (raw):', body); }
    if (!res.ok) process.exit(4);
  } catch (e) {
    console.error('Request failed', e);
    process.exit(5);
  }
}

main();
