import { serveAPI } from "https://js.sabae.cc/wsutil.js";

const getIndex = async () => {
  let idx = 0;
  try {
    idx = parseInt(await Deno.readTextFile("static/index.txt"));
  } catch (e) {
    await Deno.mkdir("static", { recursive: true });
  }
  idx++;
  await Deno.writeTextFile("static/index.txt", idx);
  return idx;
};

const limit = 32 * 1024; // 32kb

serveAPI("/api/", async (param) => {
  const d = param;
  if (d === null) {
    return "err: null";
  }
  const idx = await getIndex();
  const d2 = typeof d == "string" ? new TextEncoder().encode(d) : d;
  if (d2.length > limit) {
    return "err: limit " + limit;
  }
  await Deno.writeFile("static/" + idx + ".html", d2);
  return idx;
});
