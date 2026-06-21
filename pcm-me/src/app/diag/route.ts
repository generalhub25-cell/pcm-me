// TEMP diagnostic — gated, safe yes/no checks only. Remove after debugging.
// No Payload/sharp static imports. Returns ONLY booleans + ok/fail (error
// code/name only — never messages, env values, URLs, tokens, or row data).
export const dynamic = 'force-dynamic'

const GATE = '6de37025658093854af5b9a94907bee3'

// Safe label for a failure: short code or error name only, never the message.
const fail = (e: unknown): string => {
  const err = e as { code?: string; name?: string }
  return 'fail:' + String(err?.code || err?.name || 'error').slice(0, 24)
}

// Heavily redacted error description: strips URLs/connection strings, long
// tokens, and @-addresses so no secret/URL/value can appear. For pinpointing
// the init failure only.
const redacted = (e: unknown): string => {
  let m = String((e as { message?: string })?.message || '')
  m = m
    .replace(/[a-z]+:\/\/\S+/gi, '<url>')
    .replace(/\b[A-Za-z0-9_-]{20,}\b/g, '<token>')
    .replace(/\S+@\S+/g, '<redacted>')
  return m.slice(0, 180)
}

export async function GET(req: Request) {
  // Gate: 404 unless the exact token is supplied. Not discoverable/usable without it.
  const key = new URL(req.url).searchParams.get('key')
  if (key !== GATE) {
    return new Response('Not found', { status: 404 })
  }

  const out: Record<string, unknown> = {
    vercelEnvPresent: !!process.env.VERCEL,
    isProduction: process.env.NODE_ENV === 'production',
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasNonPoolingUrl: !!process.env.POSTGRES_URL_NON_POOLING,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
  }

  // 1) sharp native load (load only; no output kept)
  try {
    const { createRequire } = await import('module')
    createRequire(import.meta.url)('sharp')
    out.sharpLoad = 'ok'
  } catch (e) {
    out.sharpLoad = fail(e)
    out.sharpLoadHint = redacted(e)
  }

  // 2) Postgres adapter module import
  try {
    await import('@payloadcms/db-postgres')
    out.dbPostgresImport = 'ok'
  } catch (e) {
    out.dbPostgresImport = fail(e)
  }

  // 3) DB connectivity only: connect + trivial probe. No rows/data returned.
  try {
    const pg = await import('pg')
    const client = new pg.default.Client({ connectionString: process.env.POSTGRES_URL })
    await client.connect()
    await client.query('select 1')
    await client.end()
    out.dbConnect = 'ok'
  } catch (e) {
    out.dbConnect = fail(e)
  }

  // 4) Full Payload init (the path pages use). ok/fail code only; no data.
  try {
    const [{ getPayload }, configMod] = await Promise.all([
      import('payload'),
      import('../../payload.config'),
    ])
    await getPayload({ config: configMod.default })
    out.getPayloadInit = 'ok'
  } catch (e) {
    out.getPayloadInit = fail(e)
    out.getPayloadInitHint = redacted(e)
  }

  return new Response(JSON.stringify(out, null, 2), {
    headers: { 'Content-Type': 'application/json', 'X-Robots-Tag': 'noindex' },
  })
}
