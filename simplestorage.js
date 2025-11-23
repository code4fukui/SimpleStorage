import { serveAPI } from "https://js.sabae.cc/wsutil.js";
import { SHAKE128 } from "https://code4fukui.github.io/SHA3/SHAKE128.js";
import { Base16 } from "https://code4fukui.github.io/Base16/Base16.js";

const digest = (s) => {
  const bin = new TextEncoder().encode(s);
  const hash = SHAKE128.digest(bin, 128);
  return Base16.encode(hash).toUpperCase();
};

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

const saveHTML = async (d) => {
  const idx = await getIndex();
  const d2 = typeof d == "string" ? new TextEncoder().encode(d) : d;
  if (d2.length > limit) {
    return "err: limit " + limit;
  }
  await Deno.writeFile("static/" + idx + ".html", d2);
  return idx;
};

const saveHTML2 = async (d, pass, idx) => {
  const d2 = typeof d == "string" ? new TextEncoder().encode(d) : d;
  if (d2.length > limit) {
    return "err: limit " + limit;
  }
  if (!idx) {
    const idx = await getIndex();
    await Deno.writeFile("static/" + idx + ".html", d2);
    if (pass) {
      const dpass = digest(pass);
      await Deno.writeTextFile("static/" + idx + ".html.pass", dpass);
    }
    return idx;
  } else {
    try {
      const dpass = await Deno.readTextFile("static/" + idx + ".html.pass");
      const dpass2 = digest(pass);
      if (dpass != dpass2) return "err: pass not match";
      if (d2.length > 0) {
        await Deno.writeFile("static/" + idx + ".html", d2);
      } else {
        await Deno.remove("static/" + idx + ".html");
      }
      return idx;
    } catch (e) {
      console.log(e);
    }
    return "err: pass not match";
  }
};

serveAPI("/api/", async (param, req, path, conninfo) => {
  try {
    const d = param;
    if (d === null) {
      return "err: null";
    }
    if (path == "/api/") { // ver 1
      const idx = await saveHTML(d);
      return idx;
    } else if (path == "/api/save") {
      const idx = param.idx;
      const d = param.html;
      const pass = param.pass;
      const idx2 = await saveHTML2(d, pass, idx);
      return idx2;
    }
  } catch (e) {
    return null;
  }
});
