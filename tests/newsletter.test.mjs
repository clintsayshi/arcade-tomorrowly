import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Resolve the app alias while testing the actual TypeScript implementation in Node 24+.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/newsletter") return { url: new URL("../lib/newsletter.ts", import.meta.url).href, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
const helpers = await import("../lib/newsletter.ts");
const { POST } = await import("../app/api/newsletter/route.ts");
const action = "https://tomorrowly.us1.list-manage.com/subscribe/post?u=abc123&amp;id=def456&amp;f_id=hello";

function request(body, origin = "https://arcade.tomorrowly.co.za") {
  return new Request("https://arcade.tomorrowly.co.za/api/newsletter", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ fullName: "Test Player", ...body }),
  });
}

test("accepts the embedded form URL and preserves its form identity", () => {
  const url = helpers.mailchimpEndpoint(action);
  assert.equal(url.pathname, "/subscribe/post-json");
  assert.equal(url.searchParams.get("u"), "abc123");
  assert.equal(url.searchParams.get("id"), "def456");
  assert.equal(url.searchParams.get("f_id"), "hello");
  assert.equal(url.searchParams.get("c"), "newsletterCallback");
});

test("rejects non-Mailchimp URLs, credentials, insecure URLs and missing audience parameters", () => {
  for (const url of [undefined, "not a url", "http://tomorrowly.us1.list-manage.com/subscribe/post?u=a&id=b", "https://evil.com/subscribe/post?u=a&id=b", "https://us1.list-manage.com.evil.com/subscribe/post?u=a&id=b", "https://user:pass@us1.list-manage.com/subscribe/post?u=a&id=b", "https://us1.list-manage.com/subscribe/post?u=a"]) assert.equal(helpers.mailchimpEndpoint(url), null);
});

test("parses provider JSON/JSONP without executing it", () => {
  assert.equal(helpers.parseMailchimpResponse('newsletterCallback({"result":"success","msg":"Almost finished"});').result, "success");
  assert.equal(helpers.parseMailchimpResponse('{"result":"error","msg":"Invalid email"}').result, "error");
  assert.throws(() => helpers.parseMailchimpResponse('newsletterCallback({"result":"success","msg":"OK"});evil()'));
  assert.throws(() => helpers.parseMailchimpResponse('{"result":"unknown","msg":"OK"}'));
});

test("rejects invalid email, honeypot and foreign-origin submissions", async () => {
  assert.equal((await POST(request({ email: "broken" }))).status, 400);
  assert.equal((await POST(request({ email: "player@example.com", website: "spam" }))).status, 400);
  assert.equal((await POST(request({ email: "player@example.com" }, "https://evil.com"))).status, 403);
});

test("missing integration never returns a false signup success", async () => {
  const previous = process.env.MAILCHIMP_FORM_ACTION;
  process.env.MAILCHIMP_FORM_ACTION = "";
  try {
    const response = await POST(request({ email: "player@example.com" }));
    assert.equal(response.status, 503);
    assert.notEqual((await response.json()).success, true);
  } finally { if (previous !== undefined) process.env.MAILCHIMP_FORM_ACTION = previous; }
});

test("provider acceptance, duplicate, challenge and network failure are distinguished", async () => {
  const previous = process.env.MAILCHIMP_FORM_ACTION;
  const originalFetch = globalThis.fetch;
  process.env.MAILCHIMP_FORM_ACTION = action;
  try {
    let destination;
    globalThis.fetch = async url => { destination = url; return new Response('newsletterCallback({"result":"success","msg":"Please confirm"})'); };
    const accepted = await POST(request({ email: " player@example.com " }));
    assert.equal(accepted.status, 200);
    assert.equal((await accepted.json()).success, true);
    assert.equal(destination.searchParams.get("EMAIL"), "player@example.com");
    assert.equal(destination.searchParams.get("FNAME"), "Test Player");
    assert.equal(destination.searchParams.get("b_abc123_def456"), "");
    for (const message of ["already subscribed", "Please complete the captcha"]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ result: "error", msg: message }));
      const rejected = await POST(request({ email: "player@example.com" }));
      assert.equal(rejected.status, 422);
      assert.notEqual((await rejected.json()).success, true);
    }
    globalThis.fetch = async () => { throw new Error("network failed"); };
    assert.equal((await POST(request({ email: "player@example.com" }))).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (previous === undefined) delete process.env.MAILCHIMP_FORM_ACTION;
    else process.env.MAILCHIMP_FORM_ACTION = previous;
  }
});


test("requires the Full Name field expected by the supplied Mailchimp form", async () => {
  for (const fullName of ["", "   ", "x".repeat(151), null]) {
    const response = await POST(request({ email: "player@example.com", fullName }));
    assert.equal(response.status, 400);
  }
});
