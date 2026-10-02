# FocusGuard Render & Database Keep-Alive Worker

This isolated Cloudflare Worker performs two scheduled keep-alive tasks:
1. Every 10 minutes (`*/10 * * * *`): Sends a lightweight `GET` request to `https://focusguard-backend-xn94.onrender.com/health/` to keep the Render backend service active without touching the database.
2. Every 6 hours (`0 */6 * * *`): Sends an authenticated `GET` request to `https://focusguard-backend-xn94.onrender.com/health/db/` with header `X-Health-Secret` to execute a harmless `SELECT 1` query to prevent Supabase Free tier database pausing.

Cloudflare Cron Triggers run in UTC.

## Secret Configuration

Set the database health secret in Cloudflare using Wrangler:

```bash
npx wrangler secret put CLOUDFLARE_DB_HEALTH_SECRET
```

Ensure the same secret value is configured on Render in `CLOUDFLARE_DB_HEALTH_SECRET`.

## Local Test

Run the Worker with scheduled-event testing enabled:

```text
npx wrangler dev --test-scheduled
```

Trigger the 10-minute Render keepalive:

```text
curl "http://localhost:8787/cdn-cgi/local/scheduled?cron=*/10+*+*+*+*"
```

Trigger the 6-hour DB keepalive:

```text
curl "http://localhost:8787/cdn-cgi/local/scheduled?cron=0+*/6+*+*+*"
```

## Deployment

Deploy the Worker to Cloudflare:

```bash
npx wrangler deploy
```
