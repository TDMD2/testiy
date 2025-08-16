export const config = { runtime: "edge" };

function getClientIP(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (!xff) return "";
  return xff.split(",")[0].trim();
}

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const e = searchParams.get("e") || "unknown";

  // Extract sid from Referer querystring if present
  const ref = req.headers.get("referer") || "";
  let sid = "";
  try {
    if (ref) {
      const u = new URL(ref);
      sid = u.searchParams.get("sid") || "";
    }
  } catch {}

  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIP(req.headers);

  // Compact log line (shows in Vercel logs)
  console.log(JSON.stringify({ ts: new Date().toISOString(), e, sid, ip, ua, ref }));

  // Return a 204 (works fine for <img> pixels and link hits)
  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
      "content-type": "image/gif",
    },
  });
}
