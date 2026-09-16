# Real-time production deployment

FocusGuard's real-time layer uses Django Channels and Redis. PostgreSQL remains
the persistent application database.

## Render configuration

1. Provision a managed Redis service that is reachable by the backend.
2. Set its private TLS/non-TLS connection string as the backend's `REDIS_URL`
   environment variable. Do not put this value in source control.
3. Change the Render web service start command to:

   ```text
   daphne -b 0.0.0.0 -p $PORT config.asgi:application
   ```

4. Keep `ALLOWED_HOSTS` configured with the Render backend host and keep
   `FRONTEND_URL`/`CORS_ALLOWED_ORIGINS` configured with the Vercel frontend
   origin. The ASGI origin validator uses these host settings for WebSocket
   upgrades.

The authenticated WebSocket endpoint is:

```text
wss://focusguard-backend-xn94.onrender.com/ws/realtime/?token=<JWT access token>
```

The frontend derives `ws`/`wss` automatically from `VITE_API_URL`; no frontend
production URL needs to change.
