# FocusGuard Render keep-alive Worker

This isolated Cloudflare Worker sends a lightweight `GET` request to
`https://focusguard-backend-xn94.onrender.com/health/` every 10 minutes.

The schedule is `*/10 * * * *`. Cloudflare Cron Triggers run in UTC.

## Local test

Run the Worker with scheduled-event testing enabled:

```text
npx wrangler dev --test-scheduled
```

Then trigger the scheduled handler:

```text
curl "http://localhost:8787/cdn-cgi/local/scheduled?cron=*/10+*+*+*+*"
```

Do not deploy until the Cloudflare account and Worker name have been reviewed.
