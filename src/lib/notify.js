// Fire-and-forget POST to /api/notify; failures must never affect the user.

const KEY = "morpli:visitor";

// Anonymous visitor id + download counter, persisted in localStorage.
function visitor() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    const v = saved?.id
      ? saved
      : { id: Math.random().toString(36).slice(2, 10), n: 0 };
    v.n += 1;
    localStorage.setItem(KEY, JSON.stringify(v));
    return v;
  } catch {
    return { id: "anon", n: 0 }; // storage blocked (e.g. private mode)
  }
}

export function notifyDownload({ letter, font, gradient, decors }) {
  const v = visitor();
  try {
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        letter,
        font,
        gradient,
        decors,
        visitor: v.id,
        nth: v.n,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
