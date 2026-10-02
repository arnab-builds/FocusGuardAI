import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, {
  pingRenderHealth,
  pingDbHealth,
  pingHealth,
} from "../src/index.js";

describe("FocusGuard Keepalive Worker", () => {
  it("pingRenderHealth sends GET to Render /health/", async () => {
    let calledUrl = null;
    let options = null;

    const mockFetch = async (url, opts) => {
      calledUrl = url;
      options = opts;
      return { ok: true, status: 200 };
    };

    const result = await pingRenderHealth(mockFetch);
    assert.equal(result, true);
    assert.equal(
      calledUrl,
      "https://focusguard-backend-xn94.onrender.com/health/"
    );
  });

  it("pingHealth maintains backwards compatibility", () => {
    assert.equal(pingHealth, pingRenderHealth);
  });

  it("pingDbHealth skips when secret is not configured", async () => {
    let called = false;
    const mockFetch = async () => {
      called = true;
      return { ok: true, status: 200 };
    };

    const result = await pingDbHealth("", mockFetch);
    assert.equal(result, false);
    assert.equal(called, false);
  });

  it("pingDbHealth sends GET to /health/db/ with X-Health-Secret", async () => {
    let calledUrl = null;
    let headers = null;

    const mockFetch = async (url, opts) => {
      calledUrl = url;
      headers = opts?.headers;
      return { ok: true, status: 200 };
    };

    const result = await pingDbHealth("my-secret-key", mockFetch);
    assert.equal(result, true);
    assert.equal(
      calledUrl,
      "https://focusguard-backend-xn94.onrender.com/health/db/"
    );
    assert.equal(headers?.["X-Health-Secret"], "my-secret-key");
  });

  it("scheduled triggers Render keepalive on 10-minute cron", async () => {
    let pingedUrl = null;
    globalThis.fetch = async (url) => {
      pingedUrl = url;
      return { ok: true, status: 200 };
    };

    await worker.scheduled(
      { cron: "*/10 * * * *" },
      { CLOUDFLARE_DB_HEALTH_SECRET: "secret" }
    );
    assert.equal(
      pingedUrl,
      "https://focusguard-backend-xn94.onrender.com/health/"
    );
  });

  it("scheduled triggers DB keepalive on 6-hour cron", async () => {
    let pingedUrl = null;
    let pingedHeaders = null;

    globalThis.fetch = async (url, opts) => {
      pingedUrl = url;
      pingedHeaders = opts?.headers;
      return { ok: true, status: 200 };
    };

    await worker.scheduled(
      { cron: "0 */6 * * *" },
      { CLOUDFLARE_DB_HEALTH_SECRET: "my-db-secret" }
    );
    assert.equal(
      pingedUrl,
      "https://focusguard-backend-xn94.onrender.com/health/db/"
    );
    assert.equal(pingedHeaders?.["X-Health-Secret"], "my-db-secret");
  });

  it("fetch handler returns active status", async () => {
    const res = worker.fetch();
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /active/i);
  });
});
