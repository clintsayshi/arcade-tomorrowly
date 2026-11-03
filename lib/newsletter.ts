export const defaultMailchimpFormAction = "https://tomorrowly.us11.list-manage.com/subscribe/post?u=fad1d6ad493f2a25ddf447dd0&id=b229560a73&f_id=003599e0f0";

/** Accept only Mailchimp's HTTPS embedded form endpoint, never an arbitrary proxy URL. */
export function mailchimpEndpoint(action: string | undefined): URL | null {
  if (!action) return null;
  try {
    const url = new URL(action.replace(/&amp;/g, "&"));
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !/^(?:[a-z0-9-]+\.)+list-manage\.com$/i.test(url.hostname) ||
      !/^\/subscribe\/post\/?$/.test(url.pathname) ||
      !/^[a-z0-9]+$/i.test(url.searchParams.get("u") ?? "") ||
      !/^[a-z0-9]+$/i.test(url.searchParams.get("id") ?? "")) return null;
    url.pathname = "/subscribe/post-json";
    url.hash = "";
    url.searchParams.delete("EMAIL");
    url.searchParams.set("c", "newsletterCallback");
    return url;
  } catch { return null; }
}

export function parseMailchimpResponse(body: string): { result: "success" | "error"; msg: string } {
  const trimmed = body.trim();
  const match = /^newsletterCallback\(([\s\S]*)\);?$/.exec(trimmed);
  const value: unknown = JSON.parse(match ? match[1] : trimmed);
  if (!value || typeof value !== "object" || !("result" in value) || !("msg" in value) ||
    (value.result !== "success" && value.result !== "error") || typeof value.msg !== "string") {
    throw new Error("Unexpected newsletter provider response");
  }
  return { result: value.result, msg: value.msg };
}

export function newsletterFailure(message: string): string {
  if (/already (?:subscribed|a list member)/i.test(message)) return "You’re already on the list. Keep an eye on your inbox for the next update!";
  if (/too many|too many recent|rate limit/i.test(message)) return "Too many attempts. Please wait a little before trying again.";
  if (/captcha/i.test(message)) return "Mailchimp needs an extra verification step. Please use the signup page below.";
  if (/valid.*email|email.*invalid|email address.*look/i.test(message)) return "Please check your email address and try again.";
  return "We couldn’t complete your signup. Please try again or use the signup page below.";
}
