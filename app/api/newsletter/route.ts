import { defaultMailchimpFormAction, mailchimpEndpoint, newsletterFailure, parseMailchimpResponse } from "@/lib/newsletter";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ message: "Please sign up from the Arcade website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ message: "Please submit the newsletter form." }, { status: 415 });
  }
  const body = await request.text();
  if (body.length > 2048) return Response.json({ message: "Please check your submission." }, { status: 413 });
  let data: unknown;
  try { data = JSON.parse(body); } catch {
    return Response.json({ message: "Please check your submission." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || !("email" in data) || typeof data.email !== "string") {
    return Response.json({ message: "Please enter your email address." }, { status: 400 });
  }
  const email = data.email.trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  }
  if (!("fullName" in data) || typeof data.fullName !== "string" || !data.fullName.trim() || data.fullName.trim().length > 150) {
    return Response.json({ message: "Please enter your full name (up to 150 characters)." }, { status: 400 });
  }
  if ("website" in data && data.website) {
    return Response.json({ message: "We couldn’t complete your signup." }, { status: 400 });
  }
  const endpoint = mailchimpEndpoint(process.env.MAILCHIMP_FORM_ACTION ?? defaultMailchimpFormAction);
  if (!endpoint) return Response.json({ message: "Newsletter signups aren’t open yet. Please check back soon." }, { status: 503 });
  endpoint.searchParams.set("EMAIL", email);
  endpoint.searchParams.set("FNAME", data.fullName.trim());
  endpoint.searchParams.set(`b_${endpoint.searchParams.get("u")}_${endpoint.searchParams.get("id")}`, "");
  try {
    const response = await fetch(endpoint, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("Newsletter provider unavailable");
    const result = parseMailchimpResponse(await response.text());
    if (result.result !== "success") return Response.json({ message: newsletterFailure(result.msg) }, { status: 422 });
    return Response.json({ success: true, message: "Thanks for signing up! If we send a confirmation email, follow its link to finish joining." });
  } catch {
    return Response.json({ message: "We couldn’t reach the signup service. Please try again shortly." }, { status: 502 });
  }
}
