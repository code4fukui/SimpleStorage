import { serveDir } from "jsr:@std/http/file-server";
import { CBOR } from "https://js.sabae.cc/CBOR.js";

export const ret = (body, status = 200, mime = "text/plain") => {
  if (body instanceof Uint8Array) {
    if (mime == "text/plain") {
      mime = "application/octet-stream";
    }
  } else if (typeof body == "object") {
    if (mime == "application/cbor") {
      body = CBOR.encode(body);
    } else {
      body = new TexcEncoder().encode(JSON.stringify(body));
      mime = "application/json";
    }
  } else if (typeof body == "string") {
    mime = "text/plain";
  }
  return new Response(
    body,
    {
      status,
      headers: {
        "Content-Type": mime,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  );
};

export const addCORS = (res) => {
  const headers = res.headers;
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "*");
  return res;
};

export const serveDirCORS = async (req, opt) => {
  const isHead = req.method === "HEAD";
  const method = isHead ? "GET" : req.method;
  const req2 = req.method == "GET" ? req : new Request(req.url, { method, headers: req.headers });
  const res = await serveDir(req2, opt);
  addCORS(res);
  if (isHead) {
    return new Response(null, { status: res.status, headers: res.headers });
  }
  return res;
};

const decoder = new TextDecoder();

const get = async (req, ctype) => {
  //console.log(ctype, req.headers);
  if (!ctype) return null;
  const bin = await req.bytes();
  if (ctype == "text/plain") {
    return decoder.decode(bin);
  } else if (ctype == "application/cbor") {
    return CBOR.decode(bin);
  } else if (ctype == "application/json") {
    return JSON.parse(decoder.decode(bin));
  } else if (ctype == "application/octet-stream") {
    return bin;
  } // application/x-www-form-urlencoded
  throw new Error("unsupported ctype");
};

export const makeFetch = (api) => { // await api(param, req, path, conn);
  const serveAPI = async (path, req, conn) => {
    if (req.method == "OPTIONS") return ret("ok");
    const ctype = req.headers.get("Content-Type");
    const param = await get(req, ctype);
    const res = await api(param, req, path, conn);
    if (res) {
      return ret(res, 200, ctype);
    }
    return ret("not found", 404);
  };
  const serve = async (req, conn) => {
    const path = new URL(req.url).pathname;
    if (path.startsWith("/api/")) {
      return await serveAPI(path.substring("/api/".length), req, conn);
    } else {
      return await serveDirCORS(req, { fsRoot: "static", urlRoot: "" });
    }
  };
  return serve;
};
