#!/usr/bin/env node
/**
 * audio-sender.js
 *
 * Sends an audio file to the TEDx live-translation API via WebSocket,
 * formatted as PCM s16le, 16 kHz, mono – exactly as required by the spec.
 *
 * Later this script can be adapted to accept live audio from a USB/Dante
 * interface connected to a Behringer X32 by replacing the ffmpeg input
 * with a live capture device (e.g. "-f avfoundation -i :<device-index>").
 *
 * Prerequisites:
 *   brew install ffmpeg          # audio conversion
 *   npm install                  # installs the 'ws' package
 *
 * Usage:
 *   node audio-sender.js <path-to-audio-file>
 *
 * Required environment variables:
 *   API_KEY      – Bearer auth token (server-to-server, never share with clients)
 *
 * Optional environment variables:
 *   SESSION_ID   – Reuse an existing session instead of creating a new one
 *   SENDER_TOKEN – Required when SESSION_ID is provided
 *   API_BASE_URL – Defaults to https://tedxapi.hyper-foundry.com
 *   TALK_ID      – Defaults to "talk-2026-05-25"
 *   SPEAKER_ID   – Defaults to "speaker-01"
 */

'use strict';

// Load variables from .env file (in the same directory) into process.env
// This must happen before reading any process.env.* values below.
require('dotenv').config();

const { spawn } = require('child_process');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

// ─── Configuration ────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;
const TALK_ID = process.env.TALK_ID || 'talk-2026-05-25';
const SPEAKER_ID = process.env.SPEAKER_ID || 'speaker-01';

// PCM spec required by the API
const SAMPLE_RATE = 16000;   // Hz
const CHANNELS = 1;       // mono
const BIT_DEPTH = 16;      // bits per sample (s16le)
const BYTES_PER_SAMPLE = BIT_DEPTH / 8;

// Max bytes per WebSocket frame = 1 second of audio
const FRAME_BYTES = SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE; // 32 000 bytes

// ─── Argument validation ──────────────────────────────────────────────────────

const audioFilePath = process.argv[2];

if (!audioFilePath) {
  console.error('❌  Usage: node audio-sender.js <path-to-audio-file>');
  process.exit(1);
}

if (!fs.existsSync(audioFilePath)) {
  console.error(`❌  File not found: ${audioFilePath}`);
  process.exit(1);
}

if (!API_KEY) {
  console.error('❌  API_KEY environment variable is not set.');
  console.error('    export API_KEY="your-bearer-token"');
  process.exit(1);
}

// ─── Helper: create a new session via REST ────────────────────────────────────

async function createSession() {
  console.log('🔧  Creating live session…');
  const res = await fetch(`${API_BASE_URL}/v1/live-sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_languages: ['it', 'en'],
      target_language: 'en',
      translation_mode: 'fixed_target_language',
      talk_id: TALK_ID,
      speaker_id: SPEAKER_ID,
      glossary_terms: [],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Session creation failed – HTTP ${res.status}: ${body}`);
  }

  const data = await res.json();
  console.log(`✅  Session created: ${data.session_id}`);
  return data; // { session_id, sender_token, ... }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Obtain session credentials -------------------------------------------
  let sessionId, senderToken;

  if (process.env.SESSION_ID && process.env.SENDER_TOKEN) {
    // Reuse an existing session (useful when the session was created by a
    // separate backend and you just need to stream audio into it).
    sessionId = process.env.SESSION_ID;
    senderToken = process.env.SENDER_TOKEN;
    console.log(`♻️   Reusing session ${sessionId}`);
  } else {
    const session = await createSession();
    sessionId = session.session_id;
    senderToken = session.sender_token;
    // Print so you can export them and reuse without re-creating:
    console.log(`SESSION_ID=${sessionId}`);
    console.log(`SENDER_TOKEN=${senderToken}`);
  }

  // 2. Open the sender WebSocket --------------------------------------------
  const wsUrl = `${API_BASE_URL}/v1/live-sessions/${sessionId}/audio?token=${encodeURIComponent(senderToken)}`;
  console.log(`🔌  Connecting sender WebSocket…`);

  const ws = new WebSocket(wsUrl);

  ws.on('error', (err) => {
    console.error('❌  WebSocket error:', err.message);
    process.exit(1);
  });

  ws.on('close', (code, reason) => {
    console.log(`🔴  WebSocket closed (code ${code}): ${reason || 'no reason'}`);
  });

  // 3. Wait for the connection to open, then kick off audio streaming --------
  ws.on('open', () => {
    console.log('🟢  WebSocket open. Sending session_start…');

    // First message MUST be the JSON session_start frame
    ws.send(JSON.stringify({
      type: 'session_start',
      audio_format: 'pcm_s16le',
      sample_rate: SAMPLE_RATE,
      channels: CHANNELS,
    }));

    console.log(`🎵  Streaming "${path.basename(audioFilePath)}" → PCM s16le ${SAMPLE_RATE}Hz mono…`);
    streamAudio(audioFilePath, ws);
  });
}

// ─── Audio streaming via ffmpeg ───────────────────────────────────────────────

/**
 * Spawns ffmpeg to decode/resample the input file to raw PCM s16le
 * (16 kHz, mono) and pipes it to the WebSocket in chunks of at most
 * FRAME_BYTES (= 1 second of audio).
 *
 * To switch to live input from an audio interface later, replace
 * the inputArgs array with something like:
 *   ['-f', 'avfoundation', '-i', ':2']   // macOS, device index 2
 *   ['-f', 'alsa', '-i', 'hw:1']         // Linux (ALSA)
 */
function streamAudio(filePath, ws) {
  // ffmpeg input arguments – file mode
  const inputArgs = [
    '-re',            // read at native frame rate (real-time pacing)
    '-i', filePath,   // ← swap this block for live device args later
  ];

  // ffmpeg output: raw PCM s16le, 16 kHz, mono, piped to stdout
  const outputArgs = [
    '-f', 's16le',
    '-ar', String(SAMPLE_RATE),
    '-ac', String(CHANNELS),
    'pipe:1',
  ];

  const ffmpeg = spawn('ffmpeg', [
    ...inputArgs,
    ...outputArgs,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  ffmpeg.stderr.on('data', (data) => {
    // ffmpeg writes progress to stderr – show only on first few lines
    // (comment out if too noisy)
    process.stderr.write(data);
  });

  // Accumulate incoming PCM bytes into a rolling buffer and flush in
  // exactly-1-second chunks to stay within the API's max-frame limit.
  let buffer = Buffer.alloc(0);

  ffmpeg.stdout.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    // Send as many complete 1-second frames as possible
    while (buffer.length >= FRAME_BYTES) {
      const frame = buffer.subarray(0, FRAME_BYTES);
      buffer = buffer.subarray(FRAME_BYTES);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(frame);
        process.stdout.write('▶ '); // visual progress tick
      }
    }
  });

  ffmpeg.stdout.on('end', () => {
    // Flush any remaining audio (< 1 second) as the final frame
    if (buffer.length > 0 && ws.readyState === WebSocket.OPEN) {
      ws.send(buffer);
      process.stdout.write('▶ ');
    }
    console.log('\n✅  Audio file fully sent. Closing connection.');
    ws.close();
  });

  ffmpeg.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.error('\n❌  ffmpeg not found. Install it with: brew install ffmpeg');
    } else {
      console.error('\n❌  ffmpeg error:', err.message);
    }
    ws.close();
    process.exit(1);
  });

  ffmpeg.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n⚠️   ffmpeg exited with code ${code}`);
    }
  });

  // Graceful shutdown on Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n⏹   Interrupted – closing connection.');
    ffmpeg.kill('SIGTERM');
    ws.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('❌  Fatal error:', err.message);
  process.exit(1);
});
