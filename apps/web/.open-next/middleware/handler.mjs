
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.7.4";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "../../node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// ../../node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// ../../node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "../../node_modules/@opennextjs/aws/dist/http/util.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const body = await event.arrayBuffer();
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body: shouldHaveBody ? Buffer2.from(body) : void 0,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
var envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          const origin = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
          for (const [key, value] of Object.entries(globalThis.openNextConfig.functions ?? {}).filter(([key2]) => key2 !== "default")) {
            if (value.patterns.some((pattern) => {
              return new RegExp(
                // transform glob pattern to regex
                `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`
              ).test(_path);
            })) {
              debug("Using origin", key, value.patterns);
              return origin[key];
            }
          }
          if (_path.startsWith("/_next/image") && origin.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return origin.imageOptimizer;
          }
          if (origin.default) {
            debug("Using default origin", origin.default, _path);
            return origin.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/stream.js
import { Readable } from "node:stream";
function toReadableStream(value, isBase64) {
  return Readable.toWeb(Readable.from(Buffer.from(value, isBase64 ? "base64" : "utf8")));
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return Readable.toWeb(Readable.from([Buffer.from("SOMETHING")]));
  }
  return Readable.toWeb(Readable.from([]));
}
var init_stream = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    try {
      let e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}, r = new e.Error().stack;
      r && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[r] = "5ec42333-77c7-4db0-9621-820f8bbfa967", e._sentryDebugIdIdentifier = "sentry-dbid-5ec42333-77c7-4db0-9621-820f8bbfa967");
    } catch (e) {
    }
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(n) {
        var o = r[n];
        if (void 0 !== o) return o.exports;
        var i = r[n] = { exports: {} }, f = true;
        try {
          e[n](i, i.exports, t), f = false;
        } finally {
          f && delete r[n];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, n, o, i) => {
          if (n) {
            i = i || 0;
            for (var f = e2.length; f > 0 && e2[f - 1][2] > i; f--) e2[f] = e2[f - 1];
            e2[f] = [n, o, i];
            return;
          }
          for (var l = 1 / 0, f = 0; f < e2.length; f++) {
            for (var [n, o, i] = e2[f], a = true, d = 0; d < n.length; d++) (false & i || l >= i) && Object.keys(t.O).every((e3) => t.O[e3](n[d])) ? n.splice(d--, 1) : (a = false, i < l && (l = i));
            if (a) {
              e2.splice(f--, 1);
              var u = o();
              void 0 !== u && (r2 = u);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var n in r2) t.o(r2, n) && !t.o(e2, n) && Object.defineProperty(e2, n, { enumerable: true, get: r2[n] });
      }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 149: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, n2) => {
          var o, i, [f, l, a] = n2, d = 0;
          if (f.some((r4) => 0 !== e2[r4])) {
            for (o in l) t.o(l, o) && (t.m[o] = l[o]);
            if (a) var u = a(t);
          }
          for (r3 && r3(n2); d < f.length; d++) i = f[d], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(u);
        }, n = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        n.forEach(r2.bind(null, 0)), n.push = r2.bind(null, n.push.bind(n));
      })();
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/middleware.js
var require_middleware = __commonJS({
  ".next/server/middleware.js"() {
    "use strict";
    try {
      let e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}, t = new e.Error().stack;
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "1bf65b46-2960-4573-a97c-f734d2014390", e._sentryDebugIdIdentifier = "sentry-dbid-1bf65b46-2960-4573-a97c-f734d2014390");
    } catch (e) {
    }
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[751], { 46: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return a;
      }, wrapRequestHandler: function() {
        return s;
      } });
      let n = r(670), i = r(711);
      function a() {
        return (0, i.interceptFetch)(r.g.fetch);
      }
      function s(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, i.reader, () => e2(t2, r2));
      }
    }, 325: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var i2 = {}, a = t2.split(n), s = (r2 || {}).decode || e2, o = 0; o < a.length; o++) {
              var l = a[o], u = l.indexOf("=");
              if (!(u < 0)) {
                var d = l.substr(0, u).trim(), c = l.substr(++u, l.length).trim();
                '"' == c[0] && (c = c.slice(1, -1)), void 0 == i2[d] && (i2[d] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(c, s));
              }
            }
            return i2;
          }, t.serialize = function(e3, t2, n2) {
            var a = n2 || {}, s = a.encode || r;
            if ("function" != typeof s) throw TypeError("option encode is invalid");
            if (!i.test(e3)) throw TypeError("argument name is invalid");
            var o = s(t2);
            if (o && !i.test(o)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + o;
            if (null != a.maxAge) {
              var u = a.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (a.domain) {
              if (!i.test(a.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + a.domain;
            }
            if (a.path) {
              if (!i.test(a.path)) throw TypeError("option path is invalid");
              l += "; Path=" + a.path;
            }
            if (a.expires) {
              if ("function" != typeof a.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly && (l += "; HttpOnly"), a.secure && (l += "; Secure"), a.sameSite) switch ("string" == typeof a.sameSite ? a.sameSite.toLowerCase() : a.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 356: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 457: (e, t) => {
      "use strict";
      var r = { H: null, A: null, TaintRegistryObjects: /* @__PURE__ */ new WeakMap(), TaintRegistryValues: /* @__PURE__ */ new Map(), TaintRegistryByteLengths: /* @__PURE__ */ new Set(), TaintRegistryPendingRequests: /* @__PURE__ */ new Set() }, n = Array.isArray, i = Symbol.for("react.transitional.element"), a = Symbol.for("react.portal"), s = (Symbol.for("react.fragment"), Symbol.for("react.strict_mode"), Symbol.for("react.profiler"), Symbol.for("react.forward_ref"), Symbol.for("react.suspense"), Symbol.for("react.suspense_list"), Symbol.for("react.memo"), Symbol.for("react.lazy")), o = (Symbol.for("react.activity"), Symbol.for("react.postpone")), l = (Symbol.for("react.view_transition"), Symbol.iterator);
      Object.prototype.hasOwnProperty, Object.assign;
      var u = /\/+/g;
      function d(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function c() {
      }
      "function" == typeof reportError && reportError;
      var p = Object.getPrototypeOf, h = (r.TaintRegistryObjects, r.TaintRegistryValues), m = (r.TaintRegistryByteLengths, r.TaintRegistryPendingRequests);
      p(Uint32Array.prototype).constructor, "function" == typeof FinalizationRegistry && new FinalizationRegistry(function(e2) {
        var t2 = h.get(e2);
        void 0 !== t2 && (m.forEach(function(r2) {
          r2.push(e2), t2.count++;
        }), 1 === t2.count ? h.delete(e2) : t2.count--);
      }), t.unstable_postpone = function(e2) {
        throw (e2 = Error(e2)).$$typeof = o, e2;
      };
    }, 521: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 563: (e, t, r) => {
      var n;
      (() => {
        var i = { 226: function(i2, a2) {
          !function(s2, o) {
            "use strict";
            var l = "function", u = "undefined", d = "object", c = "string", p = "major", h = "model", m = "name", f = "type", g = "vendor", y = "version", v = "architecture", _ = "console", b = "mobile", w = "tablet", x = "smarttv", S = "wearable", k = "embedded", T = "Amazon", E = "Apple", R = "ASUS", C = "BlackBerry", O = "Browser", I = "Chrome", A = "Firefox", P = "Google", N = "Huawei", j = "Microsoft", M = "Motorola", L = "Opera", D = "Samsung", $ = "Sharp", Z = "Sony", q = "Xiaomi", U = "Zebra", z = "Facebook", F = "Chromium OS", B = "Mac OS", W = function(e2, t2) {
              var r2 = {};
              for (var n2 in e2) t2[n2] && t2[n2].length % 2 == 0 ? r2[n2] = t2[n2].concat(e2[n2]) : r2[n2] = e2[n2];
              return r2;
            }, V = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, H = function(e2, t2) {
              return typeof e2 === c && -1 !== K(t2).indexOf(K(e2));
            }, K = function(e2) {
              return e2.toLowerCase();
            }, X = function(e2, t2) {
              if (typeof e2 === c) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === u ? e2 : e2.substring(0, 350);
            }, G = function(e2, t2) {
              for (var r2, n2, i3, a3, s3, u2, c2 = 0; c2 < t2.length && !s3; ) {
                var p2 = t2[c2], h2 = t2[c2 + 1];
                for (r2 = n2 = 0; r2 < p2.length && !s3 && p2[r2]; ) if (s3 = p2[r2++].exec(e2)) for (i3 = 0; i3 < h2.length; i3++) u2 = s3[++n2], typeof (a3 = h2[i3]) === d && a3.length > 0 ? 2 === a3.length ? typeof a3[1] == l ? this[a3[0]] = a3[1].call(this, u2) : this[a3[0]] = a3[1] : 3 === a3.length ? typeof a3[1] !== l || a3[1].exec && a3[1].test ? this[a3[0]] = u2 ? u2.replace(a3[1], a3[2]) : void 0 : this[a3[0]] = u2 ? a3[1].call(this, u2, a3[2]) : void 0 : 4 === a3.length && (this[a3[0]] = u2 ? a3[3].call(this, u2.replace(a3[1], a3[2])) : o) : this[a3] = u2 || o;
                c2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === d && t2[r2].length > 0) {
                for (var n2 = 0; n2 < t2[r2].length; n2++) if (H(t2[r2][n2], e2)) return "?" === r2 ? o : r2;
              } else if (H(t2[r2], e2)) return "?" === r2 ? o : r2;
              return e2;
            }, J = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [y, [m, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [y, [m, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [m, y], [/opios[\/ ]+([\w\.]+)/i], [y, [m, L + " Mini"]], [/\bopr\/([\w\.]+)/i], [y, [m, L]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [m, y], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [y, [m, "UC" + O]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [y, [m, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [y, [m, "WeChat"]], [/konqueror\/([\w\.]+)/i], [y, [m, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [y, [m, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [y, [m, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[m, /(.+)/, "$1 Secure " + O], y], [/\bfocus\/([\w\.]+)/i], [y, [m, A + " Focus"]], [/\bopt\/([\w\.]+)/i], [y, [m, L + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [y, [m, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [y, [m, "Dolphin"]], [/coast\/([\w\.]+)/i], [y, [m, L + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [y, [m, "MIUI " + O]], [/fxios\/([-\w\.]+)/i], [y, [m, A]], [/\bqihu|(qi?ho?o?|360)browser/i], [[m, "360 " + O]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[m, /(.+)/, "$1 " + O], y], [/(comodo_dragon)\/([\w\.]+)/i], [[m, /_/g, " "], y], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [m, y], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [m], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[m, z], y], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [m, y], [/\bgsa\/([\w\.]+) .*safari\//i], [y, [m, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [y, [m, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [y, [m, I + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[m, I + " WebView"], y], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [y, [m, "Android " + O]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [m, y], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [y, [m, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [y, m], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [m, [y, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [m, y], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[m, "Netscape"], y], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [y, [m, A + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [m, y], [/(cobalt)\/([\w\.]+)/i], [m, [y, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[v, "amd64"]], [/(ia32(?=;))/i], [[v, K]], [/((?:i[346]|x)86)[;\)]/i], [[v, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[v, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[v, "armhf"]], [/windows (ce|mobile); ppc;/i], [[v, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[v, /ower/, "", K]], [/(sun4\w)[;\)]/i], [[v, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[v, K]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [h, [g, D], [f, w]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [h, [g, D], [f, b]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [h, [g, E], [f, b]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [h, [g, E], [f, w]], [/(macintosh);/i], [h, [g, E]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [h, [g, $], [f, b]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [h, [g, N], [f, w]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [h, [g, N], [f, b]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[h, /_/g, " "], [g, q], [f, b]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[h, /_/g, " "], [g, q], [f, w]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [h, [g, "OPPO"], [f, b]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [h, [g, "Vivo"], [f, b]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [h, [g, "Realme"], [f, b]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [h, [g, M], [f, b]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [h, [g, M], [f, w]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [h, [g, "LG"], [f, w]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [h, [g, "LG"], [f, b]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [h, [g, "Lenovo"], [f, w]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[h, /_/g, " "], [g, "Nokia"], [f, b]], [/(pixel c)\b/i], [h, [g, P], [f, w]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [h, [g, P], [f, b]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [h, [g, Z], [f, b]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[h, "Xperia Tablet"], [g, Z], [f, w]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [h, [g, "OnePlus"], [f, b]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [h, [g, T], [f, w]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[h, /(.+)/g, "Fire Phone $1"], [g, T], [f, b]], [/(playbook);[-\w\),; ]+(rim)/i], [h, g, [f, w]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [h, [g, C], [f, b]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [h, [g, R], [f, w]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [h, [g, R], [f, b]], [/(nexus 9)/i], [h, [g, "HTC"], [f, w]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [g, [h, /_/g, " "], [f, b]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [h, [g, "Acer"], [f, w]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [h, [g, "Meizu"], [f, b]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [g, h, [f, b]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [g, h, [f, w]], [/(surface duo)/i], [h, [g, j], [f, w]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [h, [g, "Fairphone"], [f, b]], [/(u304aa)/i], [h, [g, "AT&T"], [f, b]], [/\bsie-(\w*)/i], [h, [g, "Siemens"], [f, b]], [/\b(rct\w+) b/i], [h, [g, "RCA"], [f, w]], [/\b(venue[\d ]{2,7}) b/i], [h, [g, "Dell"], [f, w]], [/\b(q(?:mv|ta)\w+) b/i], [h, [g, "Verizon"], [f, w]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [h, [g, "Barnes & Noble"], [f, w]], [/\b(tm\d{3}\w+) b/i], [h, [g, "NuVision"], [f, w]], [/\b(k88) b/i], [h, [g, "ZTE"], [f, w]], [/\b(nx\d{3}j) b/i], [h, [g, "ZTE"], [f, b]], [/\b(gen\d{3}) b.+49h/i], [h, [g, "Swiss"], [f, b]], [/\b(zur\d{3}) b/i], [h, [g, "Swiss"], [f, w]], [/\b((zeki)?tb.*\b) b/i], [h, [g, "Zeki"], [f, w]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[g, "Dragon Touch"], h, [f, w]], [/\b(ns-?\w{0,9}) b/i], [h, [g, "Insignia"], [f, w]], [/\b((nxa|next)-?\w{0,9}) b/i], [h, [g, "NextBook"], [f, w]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[g, "Voice"], h, [f, b]], [/\b(lvtel\-)?(v1[12]) b/i], [[g, "LvTel"], h, [f, b]], [/\b(ph-1) /i], [h, [g, "Essential"], [f, b]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [h, [g, "Envizen"], [f, w]], [/\b(trio[-\w\. ]+) b/i], [h, [g, "MachSpeed"], [f, w]], [/\btu_(1491) b/i], [h, [g, "Rotor"], [f, w]], [/(shield[\w ]+) b/i], [h, [g, "Nvidia"], [f, w]], [/(sprint) (\w+)/i], [g, h, [f, b]], [/(kin\.[onetw]{3})/i], [[h, /\./g, " "], [g, j], [f, b]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [h, [g, U], [f, w]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [h, [g, U], [f, b]], [/smart-tv.+(samsung)/i], [g, [f, x]], [/hbbtv.+maple;(\d+)/i], [[h, /^/, "SmartTV"], [g, D], [f, x]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[g, "LG"], [f, x]], [/(apple) ?tv/i], [g, [h, E + " TV"], [f, x]], [/crkey/i], [[h, I + "cast"], [g, P], [f, x]], [/droid.+aft(\w)( bui|\))/i], [h, [g, T], [f, x]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [h, [g, $], [f, x]], [/(bravia[\w ]+)( bui|\))/i], [h, [g, Z], [f, x]], [/(mitv-\w{5}) bui/i], [h, [g, q], [f, x]], [/Hbbtv.*(technisat) (.*);/i], [g, h, [f, x]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[g, X], [h, X], [f, x]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[f, x]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [g, h, [f, _]], [/droid.+; (shield) bui/i], [h, [g, "Nvidia"], [f, _]], [/(playstation [345portablevi]+)/i], [h, [g, Z], [f, _]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [h, [g, j], [f, _]], [/((pebble))app/i], [g, h, [f, S]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [h, [g, E], [f, S]], [/droid.+; (glass) \d/i], [h, [g, P], [f, S]], [/droid.+; (wt63?0{2,3})\)/i], [h, [g, U], [f, S]], [/(quest( 2| pro)?)/i], [h, [g, z], [f, S]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [g, [f, k]], [/(aeobc)\b/i], [h, [g, T], [f, k]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [h, [f, b]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [h, [f, w]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[f, w]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[f, b]], [/(android[-\w\. ]{0,9});.+buil/i], [h, [g, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [y, [m, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [y, [m, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [m, y], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [y, m]], os: [[/microsoft (windows) (vista|xp)/i], [m, y], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [m, [y, Y, J]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[m, "Windows"], [y, Y, J]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[y, /_/g, "."], [m, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[m, B], [y, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [y, m], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [m, y], [/\(bb(10);/i], [y, [m, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [y, [m, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [y, [m, A + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [y, [m, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [y, [m, "watchOS"]], [/crkey\/([\d\.]+)/i], [y, [m, I + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[m, F], y], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [m, y], [/(sunos) ?([\w\.\d]*)/i], [[m, "Solaris"], y], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [m, y]] }, ee = function(e2, t2) {
              if (typeof e2 === d && (t2 = e2, e2 = o), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof s2 !== u && s2.navigator ? s2.navigator : o, n2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), i3 = r2 && r2.userAgentData ? r2.userAgentData : o, a3 = t2 ? W(Q, t2) : Q, _2 = r2 && r2.userAgent == n2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[m] = o, t3[y] = o, G.call(t3, n2, a3.browser), t3[p] = typeof (e3 = t3[y]) === c ? e3.replace(/[^\d\.]/g, "").split(".")[0] : o, _2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[m] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[v] = o, G.call(e3, n2, a3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[g] = o, e3[h] = o, e3[f] = o, G.call(e3, n2, a3.device), _2 && !e3[f] && i3 && i3.mobile && (e3[f] = b), _2 && "Macintosh" == e3[h] && r2 && typeof r2.standalone !== u && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[h] = "iPad", e3[f] = w), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[m] = o, e3[y] = o, G.call(e3, n2, a3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[m] = o, e3[y] = o, G.call(e3, n2, a3.os), _2 && !e3[m] && i3 && "Unknown" != i3.platform && (e3[m] = i3.platform.replace(/chrome os/i, F).replace(/macos/i, B)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return n2;
              }, this.setUA = function(e3) {
                return n2 = typeof e3 === c && e3.length > 350 ? X(e3, 350) : e3, this;
              }, this.setUA(n2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = V([m, y, p]), ee.CPU = V([v]), ee.DEVICE = V([h, g, f, _, b, x, w, S, k]), ee.ENGINE = ee.OS = V([m, y]), typeof a2 !== u ? (i2.exports && (a2 = i2.exports = ee), a2.UAParser = ee) : r.amdO ? void 0 === (n = function() {
              return ee;
            }.call(t, r, t, e)) || (e.exports = n) : typeof s2 !== u && (s2.UAParser = ee);
            var et = typeof s2 !== u && (s2.jQuery || s2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, a = {};
        function s(e2) {
          var t2 = a[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = a[e2] = { exports: {} }, n2 = true;
          try {
            i[e2].call(r2.exports, r2, r2.exports, s), n2 = false;
          } finally {
            n2 && delete a[e2];
          }
          return r2.exports;
        }
        s.ab = "//", e.exports = s(226);
      })();
    }, 586: (e, t, r) => {
      "use strict";
      let n, i, a, s, o, l;
      r.r(t), r.d(t, { default: () => aV });
      var u, d, c, p, h = {};
      r.r(h), r.d(h, { BRAND: () => rJ, DIRTY: () => tQ, EMPTY_PATH: () => tX, INVALID: () => tJ, NEVER: () => nj, OK: () => t0, ParseStatus: () => tY, Schema: () => t7, ZodAny: () => rT, ZodArray: () => rO, ZodBigInt: () => r_, ZodBoolean: () => rb, ZodBranded: () => rQ, ZodCatch: () => rG, ZodDate: () => rw, ZodDefault: () => rX, ZodDiscriminatedUnion: () => rN, ZodEffects: () => rV, ZodEnum: () => rF, ZodError: () => tF, ZodFirstPartyTypeKind: () => p, ZodFunction: () => rZ, ZodIntersection: () => rj, ZodIssueCode: () => tU, ZodLazy: () => rq, ZodLiteral: () => rU, ZodMap: () => rD, ZodNaN: () => rY, ZodNativeEnum: () => rB, ZodNever: () => rR, ZodNull: () => rk, ZodNullable: () => rK, ZodNumber: () => rv, ZodObject: () => rI, ZodOptional: () => rH, ZodParsedType: () => tZ, ZodPipeline: () => r0, ZodPromise: () => rW, ZodReadonly: () => r1, ZodRecord: () => rL, ZodSchema: () => t7, ZodSet: () => r$, ZodString: () => ry, ZodSymbol: () => rx, ZodTransformer: () => rV, ZodTuple: () => rM, ZodType: () => t7, ZodUndefined: () => rS, ZodUnion: () => rA, ZodUnknown: () => rE, ZodVoid: () => rC, addIssueToContext: () => tG, any: () => na, array: () => nu, bigint: () => r8, boolean: () => ne, coerce: () => nN, custom: () => r4, date: () => nt, datetimeRegex: () => rg, defaultErrorMap: () => tB, discriminatedUnion: () => nh, effect: () => nT, enum: () => nx, function: () => n_, getErrorMap: () => tH, getParsedType: () => tq, instanceof: () => r9, intersection: () => nm, isAborted: () => t1, isAsync: () => t3, isDirty: () => t2, isValid: () => t4, late: () => r3, lazy: () => nb, literal: () => nw, makeIssue: () => tK, map: () => ny, nan: () => r7, nativeEnum: () => nS, never: () => no, null: () => ni, nullable: () => nR, number: () => r6, object: () => nd, objectUtil: () => d, oboolean: () => nP, onumber: () => nA, optional: () => nE, ostring: () => nI, pipeline: () => nO, preprocess: () => nC, promise: () => nk, quotelessJson: () => tz, record: () => ng, set: () => nv, setErrorMap: () => tV, strictObject: () => nc, string: () => r5, symbol: () => nr, transformer: () => nT, tuple: () => nf, undefined: () => nn, union: () => np, unknown: () => ns, util: () => u, void: () => nl });
      var m = {};
      async function f() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      r.r(m), r.d(m, { config: () => aZ, default: () => az, middleware: () => aU });
      let g = null;
      async function y() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        g || (g = f());
        let e10 = await g;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function v(...e10) {
        let t10 = await f();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let _ = null;
      function b() {
        return _ || (_ = y()), _;
      }
      function w(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
        let t10 = new Proxy(function() {
        }, { get(t11, r10) {
          if ("then" === r10) return {};
          throw Object.defineProperty(Error(w(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, construct() {
          throw Object.defineProperty(Error(w(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, apply(r10, n10, i10) {
          if ("function" == typeof i10[0]) return i10[0](t10);
          throw Object.defineProperty(Error(w(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        } });
        return new Proxy({}, { get: () => t10 });
      }, enumerable: false, configurable: false }), b();
      class x extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class S extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class k extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let T = "_N_T_", E = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function R(e10) {
        var t10, r10, n10, i10, a2, s2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, a2 = false; l2(); ) if ("," === (r10 = e10.charAt(o2))) {
            for (n10 = o2, o2 += 1, l2(), i10 = o2; o2 < e10.length && "=" !== (r10 = e10.charAt(o2)) && ";" !== r10 && "," !== r10; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (a2 = true, o2 = i10, s2.push(e10.substring(t10, n10)), t10 = o2) : o2 = n10 + 1;
          } else o2 += 1;
          (!a2 || o2 >= e10.length) && s2.push(e10.substring(t10, e10.length));
        }
        return s2;
      }
      function C(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n10, i10] of e10.entries()) "set-cookie" === n10.toLowerCase() ? (r10.push(...R(i10)), t10[n10] = 1 === r10.length ? r10[0] : r10) : t10[n10] = i10;
        return t10;
      }
      function O(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...E, GROUP: { builtinReact: [E.reactServerComponents, E.actionBrowser], serverOnly: [E.reactServerComponents, E.actionBrowser, E.instrument, E.middleware], neutralTarget: [E.apiNode, E.apiEdge], clientOnly: [E.serverSideRendering, E.appPagesBrowser], bundled: [E.reactServerComponents, E.actionBrowser, E.serverSideRendering, E.appPagesBrowser, E.shared, E.instrument, E.middleware], appPages: [E.reactServerComponents, E.serverSideRendering, E.appPagesBrowser, E.actionBrowser] } });
      let I = Symbol("response"), A = Symbol("passThrough"), P = Symbol("waitUntil");
      class N {
        constructor(e10, t10) {
          this[A] = false, this[P] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[I] || (this[I] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[A] = true;
        }
        waitUntil(e10) {
          if ("external" === this[P].kind) return (0, this[P].function)(e10);
          this[P].promises.push(e10);
        }
      }
      class j extends N {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function M(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function L(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n10 || t10 > -1 ? { pathname: e10.substring(0, n10 ? r10 : t10), query: n10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function D(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = L(e10);
        return "" + t10 + r10 + n10 + i10;
      }
      function $(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = L(e10);
        return "" + r10 + t10 + n10 + i10;
      }
      function Z(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = L(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let q = /* @__PURE__ */ new WeakMap();
      function U(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n10 = q.get(t10);
        n10 || (n10 = t10.map((e11) => e11.toLowerCase()), q.set(t10, n10));
        let i10 = e10.split("/", 2);
        if (!i10[1]) return { pathname: e10 };
        let a2 = i10[1].toLowerCase(), s2 = n10.indexOf(a2);
        return s2 < 0 ? { pathname: e10 } : (r10 = t10[s2], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let z = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function F(e10, t10) {
        return new URL(String(e10).replace(z, "localhost"), t10 && String(t10).replace(z, "localhost"));
      }
      let B = Symbol("NextURLInternal");
      class W {
        constructor(e10, t10, r10) {
          let n10, i10;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n10 = t10, i10 = r10 || {}) : i10 = r10 || t10 || {}, this[B] = { url: F(e10, n10 ?? i10.base), options: i10, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n10, i10;
          let a2 = function(e11, t11) {
            var r11, n11;
            let { basePath: i11, i18n: a3, trailingSlash: s3 } = null != (r11 = t11.nextConfig) ? r11 : {}, o3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : s3 };
            i11 && Z(o3.pathname, i11) && (o3.pathname = function(e12, t12) {
              if (!Z(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : "/" + r12;
            }(o3.pathname, i11), o3.basePath = i11);
            let l2 = o3.pathname;
            if (o3.pathname.startsWith("/_next/data/") && o3.pathname.endsWith(".json")) {
              let e12 = o3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              o3.buildId = e12[0], l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t11.parseData && (o3.pathname = l2);
            }
            if (a3) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(o3.pathname) : U(o3.pathname, a3.locales);
              o3.locale = e12.detectedLocale, o3.pathname = null != (n11 = e12.pathname) ? n11 : o3.pathname, !e12.detectedLocale && o3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(l2) : U(l2, a3.locales)).detectedLocale && (o3.locale = e12.detectedLocale);
            }
            return o3;
          }(this[B].url.pathname, { nextConfig: this[B].options.nextConfig, parseData: true, i18nProvider: this[B].options.i18nProvider }), s2 = function(e11, t11) {
            let r11;
            if ((null == t11 ? void 0 : t11.host) && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[B].url, this[B].options.headers);
          this[B].domainLocale = this[B].options.i18nProvider ? this[B].options.i18nProvider.detectDomainLocale(s2) : function(e11, t11, r11) {
            if (e11) for (let a3 of (r11 && (r11 = r11.toLowerCase()), e11)) {
              var n11, i11;
              if (t11 === (null == (n11 = a3.domain) ? void 0 : n11.split(":", 1)[0].toLowerCase()) || r11 === a3.defaultLocale.toLowerCase() || (null == (i11 = a3.locales) ? void 0 : i11.some((e12) => e12.toLowerCase() === r11))) return a3;
            }
          }(null == (t10 = this[B].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, s2);
          let o2 = (null == (r10 = this[B].domainLocale) ? void 0 : r10.defaultLocale) || (null == (i10 = this[B].options.nextConfig) || null == (n10 = i10.i18n) ? void 0 : n10.defaultLocale);
          this[B].url.pathname = a2.pathname, this[B].defaultLocale = o2, this[B].basePath = a2.basePath ?? "", this[B].buildId = a2.buildId, this[B].locale = a2.locale ?? o2, this[B].trailingSlash = a2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n10) {
            if (!t11 || t11 === r10) return e11;
            let i10 = e11.toLowerCase();
            return !n10 && (Z(i10, "/api") || Z(i10, "/" + t11.toLowerCase())) ? e11 : D(e11, "/" + t11);
          }((e10 = { basePath: this[B].basePath, buildId: this[B].buildId, defaultLocale: this[B].options.forceLocale ? void 0 : this[B].defaultLocale, locale: this[B].locale, pathname: this[B].url.pathname, trailingSlash: this[B].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = M(t10)), e10.buildId && (t10 = $(D(t10, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t10 = D(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : $(t10, "/") : M(t10);
        }
        formatSearch() {
          return this[B].url.search;
        }
        get buildId() {
          return this[B].buildId;
        }
        set buildId(e10) {
          this[B].buildId = e10;
        }
        get locale() {
          return this[B].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[B].locale || !(null == (r10 = this[B].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[B].locale = e10;
        }
        get defaultLocale() {
          return this[B].defaultLocale;
        }
        get domainLocale() {
          return this[B].domainLocale;
        }
        get searchParams() {
          return this[B].url.searchParams;
        }
        get host() {
          return this[B].url.host;
        }
        set host(e10) {
          this[B].url.host = e10;
        }
        get hostname() {
          return this[B].url.hostname;
        }
        set hostname(e10) {
          this[B].url.hostname = e10;
        }
        get port() {
          return this[B].url.port;
        }
        set port(e10) {
          this[B].url.port = e10;
        }
        get protocol() {
          return this[B].url.protocol;
        }
        set protocol(e10) {
          this[B].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[B].url = F(e10), this.analyze();
        }
        get origin() {
          return this[B].url.origin;
        }
        get pathname() {
          return this[B].url.pathname;
        }
        set pathname(e10) {
          this[B].url.pathname = e10;
        }
        get hash() {
          return this[B].url.hash;
        }
        set hash(e10) {
          this[B].url.hash = e10;
        }
        get search() {
          return this[B].url.search;
        }
        set search(e10) {
          this[B].url.search = e10;
        }
        get password() {
          return this[B].url.password;
        }
        set password(e10) {
          this[B].url.password = e10;
        }
        get username() {
          return this[B].url.username;
        }
        set username(e10) {
          this[B].url.username = e10;
        }
        get basePath() {
          return this[B].basePath;
        }
        set basePath(e10) {
          this[B].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new W(String(this), this[B].options);
        }
      }
      var V = r(681);
      let H = Symbol("internal request");
      class K extends Request {
        constructor(e10, t10 = {}) {
          let r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          O(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          let n10 = new W(r10, { headers: C(this.headers), nextConfig: t10.nextConfig });
          this[H] = { cookies: new V.RequestCookies(this.headers), nextUrl: n10, url: n10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[H].cookies;
        }
        get nextUrl() {
          return this[H].nextUrl;
        }
        get page() {
          throw new S();
        }
        get ua() {
          throw new k();
        }
        get url() {
          return this[H].url;
        }
      }
      class X {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let G = Symbol("internal response"), Y = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function J(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, i10] of e10.request.headers) t10.set("x-middleware-request-" + n10, i10), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class Q extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          let r10 = this.headers, n10 = new Proxy(new V.ResponseCookies(r10), { get(e11, n11, i10) {
            switch (n11) {
              case "delete":
              case "set":
                return (...i11) => {
                  let a2 = Reflect.apply(e11[n11], e11, i11), s2 = new Headers(r10);
                  return a2 instanceof V.ResponseCookies && r10.set("x-middleware-set-cookie", a2.getAll().map((e12) => (0, V.stringifyCookie)(e12)).join(",")), J(t10, s2), a2;
                };
              default:
                return X.get(e11, n11, i10);
            }
          } });
          this[G] = { cookies: n10, url: t10.url ? new W(t10.url, { headers: C(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[G].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new Q(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!Y.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, i10 = new Headers(null == n10 ? void 0 : n10.headers);
          return i10.set("Location", O(e10)), new Q(null, { ...n10, headers: i10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", O(e10)), J(t10, r10), new Q(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), J(e10, t10), new Q(null, { ...e10, headers: t10 });
        }
      }
      function ee(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), i10 = n10.origin === r10.origin;
        return { url: i10 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: i10 };
      }
      let et = "Next-Router-Prefetch", er = ["RSC", "Next-Router-State-Tree", et, "Next-HMR-Refresh", "Next-Router-Segment-Prefetch"], en = "_rsc";
      class ei extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ei();
        }
      }
      class ea extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return X.get(t10, r10, n10);
            let i10 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i10);
            if (void 0 !== a2) return X.get(t10, a2, n10);
          }, set(t10, r10, n10, i10) {
            if ("symbol" == typeof r10) return X.set(t10, r10, n10, i10);
            let a2 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            return X.set(t10, s2 ?? r10, n10, i10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return X.has(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== i10 && X.has(t10, i10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return X.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === i10 || X.deleteProperty(t10, i10);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return ei.callable;
              default:
                return X.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new ea(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let es = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eo {
        disable() {
          throw es;
        }
        getStore() {
        }
        run() {
          throw es;
        }
        exit() {
          throw es;
        }
        enterWith() {
          throw es;
        }
        static bind(e10) {
          return e10;
        }
      }
      let el = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage;
      function eu() {
        return el ? new el() : new eo();
      }
      let ed = eu(), ec = eu();
      class ep extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ep();
        }
      }
      class eh {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return ep.callable;
              default:
                return X.get(e11, t10, r10);
            }
          } });
        }
      }
      let em = Symbol.for("next.mutated.cookies");
      class ef {
        static wrap(e10, t10) {
          let r10 = new V.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], i10 = /* @__PURE__ */ new Set(), a2 = () => {
            let e11 = ed.getStore();
            if (e11 && (e11.pathWasRevalidated = true), n10 = r10.getAll().filter((e12) => i10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new V.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, s2 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case em:
                return n10;
              case "delete":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              case "set":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              default:
                return X.get(e11, t11, r11);
            }
          } });
          return s2;
        }
      }
      function eg(e10) {
        if ("action" !== function(e11) {
          let t10 = ec.getStore();
          switch (!t10 && function(e12) {
            throw Object.defineProperty(Error(`\`${e12}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
          }(e11), t10.type) {
            case "request":
            default:
              return t10;
            case "prerender":
            case "prerender-ppr":
            case "prerender-legacy":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside a prerender. This is a bug in Next.js.`), "__NEXT_ERROR_CODE", { value: "E401", enumerable: false, configurable: true });
            case "cache":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside "use cache". Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E37", enumerable: false, configurable: true });
            case "unstable-cache":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside unstable_cache. Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E69", enumerable: false, configurable: true });
          }
        }(e10).phase) throw new ep();
      }
      var ey = function(e10) {
        return e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404", e10;
      }(ey || {}), ev = function(e10) {
        return e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents", e10;
      }(ev || {}), e_ = function(e10) {
        return e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer", e10;
      }(e_ || {}), eb = function(e10) {
        return e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch", e10;
      }(eb || {}), ew = function(e10) {
        return e10.startServer = "startServer.startServer", e10;
      }(ew || {}), ex = function(e10) {
        return e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult", e10;
      }(ex || {}), eS = function(e10) {
        return e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch", e10;
      }(eS || {}), ek = function(e10) {
        return e10.executeRoute = "Router.executeRoute", e10;
      }(ek || {}), eT = function(e10) {
        return e10.runHandler = "Node.runHandler", e10;
      }(eT || {}), eE = function(e10) {
        return e10.runHandler = "AppRouteRouteHandlers.runHandler", e10;
      }(eE || {}), eR = function(e10) {
        return e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport", e10;
      }(eR || {}), eC = function(e10) {
        return e10.execute = "Middleware.execute", e10;
      }(eC || {});
      let eO = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], eI = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"];
      function eA(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let { context: eP, propagation: eN, trace: ej, SpanStatusCode: eM, SpanKind: eL, ROOT_CONTEXT: eD } = n = r(980);
      class e$ extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eZ = (e10, t10) => {
        (function(e11) {
          return "object" == typeof e11 && null !== e11 && e11 instanceof e$;
        })(t10) && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && e10.recordException(t10), e10.setStatus({ code: eM.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, eq = /* @__PURE__ */ new Map(), eU = n.createContextKey("next.rootSpanId"), ez = 0, eF = () => ez++, eB = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } };
      class eW {
        getTracerInstance() {
          return ej.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eP;
        }
        getTracePropagationData() {
          let e10 = eP.active(), t10 = [];
          return eN.inject(e10, t10, eB), t10;
        }
        getActiveScopeSpan() {
          return ej.getSpan(null == eP ? void 0 : eP.active());
        }
        withPropagatedContext(e10, t10, r10) {
          let n10 = eP.active();
          if (ej.getSpanContext(n10)) return t10();
          let i10 = eN.extract(n10, e10, r10);
          return eP.with(i10, t10);
        }
        trace(...e10) {
          var t10;
          let [r10, n10, i10] = e10, { fn: a2, options: s2 } = "function" == typeof n10 ? { fn: n10, options: {} } : { fn: i10, options: { ...n10 } }, o2 = s2.spanName ?? r10;
          if (!eO.includes(r10) && "1" !== process.env.NEXT_OTEL_VERBOSE || s2.hideSpan) return a2();
          let l2 = this.getSpanContext((null == s2 ? void 0 : s2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t10 = ej.getSpanContext(l2)) ? void 0 : t10.isRemote) && (u2 = true) : (l2 = (null == eP ? void 0 : eP.active()) ?? eD, u2 = true);
          let d2 = eF();
          return s2.attributes = { "next.span_name": o2, "next.span_type": r10, ...s2.attributes }, eP.with(l2.setValue(eU, d2), () => this.getTracerInstance().startActiveSpan(o2, s2, (e11) => {
            let t11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0, n11 = () => {
              eq.delete(d2), t11 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && eI.includes(r10 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t11, end: performance.now() });
            };
            u2 && eq.set(d2, new Map(Object.entries(s2.attributes ?? {})));
            try {
              if (a2.length > 1) return a2(e11, (t13) => eZ(e11, t13));
              let t12 = a2(e11);
              if (eA(t12)) return t12.then((t13) => (e11.end(), t13)).catch((t13) => {
                throw eZ(e11, t13), t13;
              }).finally(n11);
              return e11.end(), n11(), t12;
            } catch (t12) {
              throw eZ(e11, t12), n11(), t12;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, n10, i10] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eO.includes(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n10;
            "function" == typeof e11 && "function" == typeof i10 && (e11 = e11.apply(this, arguments));
            let a2 = arguments.length - 1, s2 = arguments[a2];
            if ("function" != typeof s2) return t10.trace(r10, e11, () => i10.apply(this, arguments));
            {
              let n11 = t10.getContext().bind(eP.active(), s2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[a2] = function(e13) {
                return null == t11 || t11(e13), n11.apply(this, arguments);
              }, i10.apply(this, arguments)));
            }
          } : i10;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n10 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, n10);
        }
        getSpanContext(e10) {
          return e10 ? ej.setSpan(eP.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eP.active().getValue(eU);
          return eq.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = eP.active().getValue(eU), n10 = eq.get(r10);
          n10 && n10.set(e10, t10);
        }
      }
      let eV = (() => {
        let e10 = new eW();
        return () => e10;
      })(), eH = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eH);
      class eK {
        constructor(e10, t10, r10, n10) {
          var i10;
          let a2 = e10 && function(e11, t11) {
            let r11 = ea.from(e11.headers);
            return { isOnDemandRevalidate: r11.get("x-prerender-revalidate") === t11.previewModeId, revalidateOnlyGenerated: r11.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, s2 = null == (i10 = r10.get(eH)) ? void 0 : i10.value;
          this._isEnabled = !!(!a2 && s2 && e10 && s2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: eH, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: eH, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function eX(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of R(r10)) n10.append("set-cookie", e11);
          for (let e11 of new V.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      var eG = r(879), eY = r.n(eG);
      class eJ extends Error {
        constructor(e10, t10) {
          super("Invariant: " + (e10.endsWith(".") ? e10 : e10 + ".") + " This is a bug in Next.js.", t10), this.name = "InvariantError";
        }
      }
      class eQ {
        constructor(e10, t10) {
          this.cache = /* @__PURE__ */ new Map(), this.sizes = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10 || (() => 1);
        }
        set(e10, t10) {
          if (!e10 || !t10) return;
          let r10 = this.calculateSize(t10);
          if (r10 > this.maxSize) return void console.warn("Single item size exceeds maxSize");
          this.cache.has(e10) && (this.totalSize -= this.sizes.get(e10) || 0), this.cache.set(e10, t10), this.sizes.set(e10, r10), this.totalSize += r10, this.touch(e10);
        }
        has(e10) {
          return !!e10 && (this.touch(e10), !!this.cache.get(e10));
        }
        get(e10) {
          if (!e10) return;
          let t10 = this.cache.get(e10);
          if (void 0 !== t10) return this.touch(e10), t10;
        }
        touch(e10) {
          let t10 = this.cache.get(e10);
          void 0 !== t10 && (this.cache.delete(e10), this.cache.set(e10, t10), this.evictIfNecessary());
        }
        evictIfNecessary() {
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) this.evictLeastRecentlyUsed();
        }
        evictLeastRecentlyUsed() {
          let e10 = this.cache.keys().next().value;
          if (void 0 !== e10) {
            let t10 = this.sizes.get(e10) || 0;
            this.totalSize -= t10, this.cache.delete(e10), this.sizes.delete(e10);
          }
        }
        reset() {
          this.cache.clear(), this.sizes.clear(), this.totalSize = 0;
        }
        keys() {
          return [...this.cache.keys()];
        }
        remove(e10) {
          this.cache.has(e10) && (this.totalSize -= this.sizes.get(e10) || 0, this.cache.delete(e10), this.sizes.delete(e10));
        }
        clear() {
          this.cache.clear(), this.sizes.clear(), this.totalSize = 0;
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      r(356).Buffer, new eQ(52428800, (e10) => e10.size), process.env.NEXT_PRIVATE_DEBUG_CACHE && console.debug.bind(console, "DefaultCacheHandler:"), process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let e0 = Symbol.for("@next/cache-handlers-map"), e1 = Symbol.for("@next/cache-handlers-set"), e2 = globalThis;
      function e4() {
        if (e2[e0]) return e2[e0].entries();
      }
      async function e3(e10, t10) {
        if (!e10) return t10();
        let r10 = e9(e10);
        try {
          return await t10();
        } finally {
          let t11 = function(e11, t12) {
            let r11 = new Set(e11.pendingRevalidatedTags), n10 = new Set(e11.pendingRevalidateWrites);
            return { pendingRevalidatedTags: t12.pendingRevalidatedTags.filter((e12) => !r11.has(e12)), pendingRevalidates: Object.fromEntries(Object.entries(t12.pendingRevalidates).filter(([t13]) => !(t13 in e11.pendingRevalidates))), pendingRevalidateWrites: t12.pendingRevalidateWrites.filter((e12) => !n10.has(e12)) };
          }(r10, e9(e10));
          await e6(e10, t11);
        }
      }
      function e9(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function e5(e10, t10) {
        if (0 === e10.length) return;
        let r10 = [];
        t10 && r10.push(t10.revalidateTag(e10));
        let n10 = function() {
          if (e2[e1]) return e2[e1].values();
        }();
        if (n10) for (let t11 of n10) r10.push(t11.expireTags(...e10));
        await Promise.all(r10);
      }
      async function e6(e10, t10) {
        let r10 = (null == t10 ? void 0 : t10.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], n10 = (null == t10 ? void 0 : t10.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, i10 = (null == t10 ? void 0 : t10.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([e5(r10, e10.incrementalCache), ...Object.values(n10), ...i10]);
      }
      let e7 = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e8 {
        disable() {
          throw e7;
        }
        getStore() {
        }
        run() {
          throw e7;
        }
        exit() {
          throw e7;
        }
        enterWith() {
          throw e7;
        }
        static bind(e10) {
          return e10;
        }
      }
      let te = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage, tt = te ? new te() : new e8();
      class tr {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new (eY())(), this.callbackQueue.pause();
        }
        after(e10) {
          if (eA(e10)) this.waitUntil || tn(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || tn();
          let r10 = ec.getStore();
          r10 && this.workUnitStores.add(r10);
          let n10 = tt.getStore(), i10 = n10 ? n10.rootTaskSpawnPhase : null == r10 ? void 0 : r10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let a2 = (t10 = async () => {
            try {
              await tt.run({ rootTaskSpawnPhase: i10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, te ? te.bind(t10) : e8.bind(t10));
          this.callbackQueue.add(a2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = ed.getStore();
          if (!e10) throw Object.defineProperty(new eJ("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return e3(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new eJ("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tn() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function ti(e10) {
        let t10, r10 = { then: (n10, i10) => (t10 || (t10 = e10()), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, i10)) };
        return r10;
      }
      class ta {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function ts() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let to = Symbol.for("@next/request-context"), tl = (e10) => {
        let t10 = ["/layout"];
        if (e10.startsWith("/")) {
          let r10 = e10.split("/");
          for (let e11 = 1; e11 < r10.length + 1; e11++) {
            let n10 = r10.slice(0, e11).join("/");
            n10 && (n10.endsWith("/page") || n10.endsWith("/route") || (n10 = `${n10}${!n10.endsWith("/") ? "/" : ""}layout`), t10.push(n10));
          }
        }
        return t10;
      };
      async function tu(e10, t10, r10) {
        let n10 = [], i10 = r10 && r10.size > 0;
        for (let t11 of tl(e10)) t11 = `${T}${t11}`, n10.push(t11);
        if (t10.pathname && !i10) {
          let e11 = `${T}${t10.pathname}`;
          n10.push(e11);
        }
        return { tags: n10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = e4();
          if (r11) for (let [n11, i11] of r11) "getExpiration" in i11 && t11.set(n11, ti(async () => i11.getExpiration(...e11)));
          return t11;
        }(n10) };
      }
      class td extends K {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tc = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tp = (e10, t10) => eV().withPropagatedContext(e10.headers, t10, tc), th = false;
      async function tm(e10) {
        var t10;
        let n10, i10;
        if (!th && (th = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis: e11, wrapRequestHandler: t11 } = r(46);
          e11(), tp = t11(tp);
        }
        await b();
        let a2 = void 0 !== globalThis.__BUILD_MANIFEST;
        e10.request.url = e10.request.url.replace(/\.rsc($|\?)/, "$1");
        let s2 = new W(e10.request.url, { headers: e10.request.headers, nextConfig: e10.request.nextConfig });
        for (let e11 of [...s2.searchParams.keys()]) {
          let t11 = s2.searchParams.getAll(e11), r10 = function(e12) {
            for (let t12 of ["nxtP", "nxtI"]) if (e12 !== t12 && e12.startsWith(t12)) return e12.substring(t12.length);
            return null;
          }(e11);
          if (r10) {
            for (let e12 of (s2.searchParams.delete(r10), t11)) s2.searchParams.append(r10, e12);
            s2.searchParams.delete(e11);
          }
        }
        let o2 = s2.buildId;
        s2.buildId = "";
        let l2 = function(e11) {
          let t11 = new Headers();
          for (let [r10, n11] of Object.entries(e11)) for (let e12 of Array.isArray(n11) ? n11 : [n11]) void 0 !== e12 && ("number" == typeof e12 && (e12 = e12.toString()), t11.append(r10, e12));
          return t11;
        }(e10.request.headers), u2 = l2.has("x-nextjs-data"), d2 = "1" === l2.get("RSC");
        u2 && "/index" === s2.pathname && (s2.pathname = "/");
        let c2 = /* @__PURE__ */ new Map();
        if (!a2) for (let e11 of er) {
          let t11 = e11.toLowerCase(), r10 = l2.get(t11);
          null !== r10 && (c2.set(t11, r10), l2.delete(t11));
        }
        let p2 = new td({ page: e10.page, input: function(e11) {
          let t11 = "string" == typeof e11, r10 = t11 ? new URL(e11) : e11;
          return r10.searchParams.delete(en), t11 ? r10.toString() : r10;
        }(s2).toString(), init: { body: e10.request.body, headers: l2, method: e10.request.method, nextConfig: e10.request.nextConfig, signal: e10.request.signal } });
        u2 && Object.defineProperty(p2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCache && e10.IncrementalCache && (globalThis.__incrementalCache = new e10.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e10.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: ts() }) }));
        let h2 = e10.request.waitUntil ?? (null == (t10 = function() {
          let e11 = globalThis[to];
          return null == e11 ? void 0 : e11.get();
        }()) ? void 0 : t10.waitUntil), m2 = new j({ request: p2, page: e10.page, context: h2 ? { waitUntil: h2 } : void 0 });
        if ((n10 = await tp(p2, () => {
          if ("/middleware" === e10.page || "/src/middleware" === e10.page) {
            let t11 = m2.waitUntil.bind(m2), r10 = new ta();
            return eV().trace(eC.execute, { spanName: `middleware ${p2.method} ${p2.nextUrl.pathname}`, attributes: { "http.target": p2.nextUrl.pathname, "http.method": p2.method } }, async () => {
              try {
                var n11, a3, s3, l3, u3, d3;
                let c3 = ts(), h3 = await tu("/", p2.nextUrl, null), f3 = (u3 = p2.nextUrl, d3 = (e11) => {
                  i10 = e11;
                }, function(e11, t12, r11, n12, i11, a4, s4, o3, l4, u4, d4) {
                  function c4(e12) {
                    r11 && r11.setHeader("Set-Cookie", e12);
                  }
                  let p3 = {};
                  return { type: "request", phase: e11, implicitTags: a4, url: { pathname: n12.pathname, search: n12.search ?? "" }, rootParams: i11, get headers() {
                    return p3.headers || (p3.headers = function(e12) {
                      let t13 = ea.from(e12);
                      for (let e13 of er) t13.delete(e13.toLowerCase());
                      return ea.seal(t13);
                    }(t12.headers)), p3.headers;
                  }, get cookies() {
                    if (!p3.cookies) {
                      let e12 = new V.RequestCookies(ea.from(t12.headers));
                      eX(t12, e12), p3.cookies = eh.seal(e12);
                    }
                    return p3.cookies;
                  }, set cookies(value) {
                    p3.cookies = value;
                  }, get mutableCookies() {
                    if (!p3.mutableCookies) {
                      let e12 = function(e13, t13) {
                        let r12 = new V.RequestCookies(ea.from(e13));
                        return ef.wrap(r12, t13);
                      }(t12.headers, s4 || (r11 ? c4 : void 0));
                      eX(t12, e12), p3.mutableCookies = e12;
                    }
                    return p3.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return p3.userspaceMutableCookies || (p3.userspaceMutableCookies = function(e12) {
                      let t13 = new Proxy(e12, { get(e13, r12, n13) {
                        switch (r12) {
                          case "delete":
                            return function(...r13) {
                              return eg("cookies().delete"), e13.delete(...r13), t13;
                            };
                          case "set":
                            return function(...r13) {
                              return eg("cookies().set"), e13.set(...r13), t13;
                            };
                          default:
                            return X.get(e13, r12, n13);
                        }
                      } });
                      return t13;
                    }(this.mutableCookies)), p3.userspaceMutableCookies;
                  }, get draftMode() {
                    return p3.draftMode || (p3.draftMode = new eK(l4, t12, this.cookies, this.mutableCookies)), p3.draftMode;
                  }, renderResumeDataCache: o3 ?? null, isHmrRefresh: u4, serverComponentsHmrCache: d4 || globalThis.__serverComponentsHmrCache };
                }("action", p2, void 0, u3, {}, h3, d3, void 0, c3, false, void 0)), g3 = function({ page: e11, fallbackRouteParams: t12, renderOpts: r11, requestEndedState: n12, isPrefetchRequest: i11, buildId: a4, previouslyRevalidatedTags: s4 }) {
                  var o3;
                  let l4 = { isStaticGeneration: !r11.shouldWaitOnAllReady && !r11.supportsDynamicResponse && !r11.isDraftMode && !r11.isPossibleServerAction, page: e11, fallbackRouteParams: t12, route: (o3 = e11.split("/").reduce((e12, t13, r12, n13) => t13 ? "(" === t13[0] && t13.endsWith(")") || "@" === t13[0] || ("page" === t13 || "route" === t13) && r12 === n13.length - 1 ? e12 : e12 + "/" + t13 : e12, "")).startsWith("/") ? o3 : "/" + o3, incrementalCache: r11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: r11.cacheLifeProfiles, isRevalidate: r11.isRevalidate, isPrerendering: r11.nextExport, fetchCache: r11.fetchCache, isOnDemandRevalidate: r11.isOnDemandRevalidate, isDraftMode: r11.isDraftMode, requestEndedState: n12, isPrefetchRequest: i11, buildId: a4, reactLoadableManifest: (null == r11 ? void 0 : r11.reactLoadableManifest) || {}, assetPrefix: (null == r11 ? void 0 : r11.assetPrefix) || "", afterContext: function(e12) {
                    let { waitUntil: t13, onClose: r12, onAfterTaskError: n13 } = e12;
                    return new tr({ waitUntil: t13, onClose: r12, onTaskError: n13 });
                  }(r11), dynamicIOEnabled: r11.experimental.dynamicIO, dev: r11.dev ?? false, previouslyRevalidatedTags: s4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t13 = e4();
                    if (t13) for (let [r12, n13] of t13) "refreshTags" in n13 && e12.set(r12, ti(async () => n13.refreshTags()));
                    return e12;
                  }() };
                  return r11.store = l4, l4;
                }({ page: "/", fallbackRouteParams: null, renderOpts: { cacheLifeProfiles: null == (a3 = e10.request.nextConfig) || null == (n11 = a3.experimental) ? void 0 : n11.cacheLife, experimental: { isRoutePPREnabled: false, dynamicIO: false, authInterrupts: !!(null == (l3 = e10.request.nextConfig) || null == (s3 = l3.experimental) ? void 0 : s3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: t11, onClose: r10.onClose.bind(r10), onAfterTaskError: void 0 }, requestEndedState: { ended: false }, isPrefetchRequest: p2.headers.has(et), buildId: o2 ?? "", previouslyRevalidatedTags: [] });
                return await ed.run(g3, () => ec.run(f3, e10.handler, p2, m2));
              } finally {
                setTimeout(() => {
                  r10.dispatchClose();
                }, 0);
              }
            });
          }
          return e10.handler(p2, m2);
        })) && !(n10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        n10 && i10 && n10.headers.set("set-cookie", i10);
        let f2 = null == n10 ? void 0 : n10.headers.get("x-middleware-rewrite");
        if (n10 && f2 && (d2 || !a2)) {
          let t11 = new W(f2, { forceLocale: true, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          a2 || t11.host !== p2.nextUrl.host || (t11.buildId = o2 || t11.buildId, n10.headers.set("x-middleware-rewrite", String(t11)));
          let { url: r10, isRelative: i11 } = ee(t11.toString(), s2.toString());
          !a2 && u2 && n10.headers.set("x-nextjs-rewrite", r10), d2 && i11 && (s2.pathname !== t11.pathname && n10.headers.set("x-nextjs-rewritten-path", t11.pathname), s2.search !== t11.search && n10.headers.set("x-nextjs-rewritten-query", t11.search.slice(1)));
        }
        let g2 = null == n10 ? void 0 : n10.headers.get("Location");
        if (n10 && g2 && !a2) {
          let t11 = new W(g2, { forceLocale: false, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          n10 = new Response(n10.body, n10), t11.host === s2.host && (t11.buildId = o2 || t11.buildId, n10.headers.set("Location", t11.toString())), u2 && (n10.headers.delete("Location"), n10.headers.set("x-nextjs-redirect", ee(t11.toString(), s2.toString()).url));
        }
        let y2 = n10 || Q.next(), v2 = y2.headers.get("x-middleware-override-headers"), _2 = [];
        if (v2) {
          for (let [e11, t11] of c2) y2.headers.set(`x-middleware-request-${e11}`, t11), _2.push(e11);
          _2.length > 0 && y2.headers.set("x-middleware-override-headers", v2 + "," + _2.join(","));
        }
        return { response: y2, waitUntil: ("internal" === m2[P].kind ? Promise.all(m2[P].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: p2.fetchMetrics };
      }
      var tf = Object.defineProperty, tg = Object.defineProperties, ty = Object.getOwnPropertyDescriptors, tv = Object.getOwnPropertySymbols, t_ = Object.prototype.hasOwnProperty, tb = Object.prototype.propertyIsEnumerable, tw = (e10, t10, r10) => t10 in e10 ? tf(e10, t10, { enumerable: true, configurable: true, writable: true, value: r10 }) : e10[t10] = r10, tx = (e10, t10) => {
        for (var r10 in t10 || (t10 = {})) t_.call(t10, r10) && tw(e10, r10, t10[r10]);
        if (tv) for (var r10 of tv(t10)) tb.call(t10, r10) && tw(e10, r10, t10[r10]);
        return e10;
      }, tS = (e10, t10) => tg(e10, ty(t10)), tk = class extends Error {
        constructor(e10, t10, r10) {
          super(t10 || e10.toString(), { cause: r10 }), this.status = e10, this.statusText = t10, this.error = r10;
        }
      }, tT = async (e10, t10) => {
        var r10, n10, i10, a2, s2, o2;
        let l2 = t10 || {}, u2 = { onRequest: [null == t10 ? void 0 : t10.onRequest], onResponse: [null == t10 ? void 0 : t10.onResponse], onSuccess: [null == t10 ? void 0 : t10.onSuccess], onError: [null == t10 ? void 0 : t10.onError], onRetry: [null == t10 ? void 0 : t10.onRetry] };
        if (!t10 || !(null == t10 ? void 0 : t10.plugins)) return { url: e10, options: l2, hooks: u2 };
        for (let d2 of (null == t10 ? void 0 : t10.plugins) || []) {
          if (d2.init) {
            let n11 = await (null == (r10 = d2.init) ? void 0 : r10.call(d2, e10.toString(), t10));
            l2 = n11.options || l2, e10 = n11.url;
          }
          u2.onRequest.push(null == (n10 = d2.hooks) ? void 0 : n10.onRequest), u2.onResponse.push(null == (i10 = d2.hooks) ? void 0 : i10.onResponse), u2.onSuccess.push(null == (a2 = d2.hooks) ? void 0 : a2.onSuccess), u2.onError.push(null == (s2 = d2.hooks) ? void 0 : s2.onError), u2.onRetry.push(null == (o2 = d2.hooks) ? void 0 : o2.onRetry);
        }
        return { url: e10, options: l2, hooks: u2 };
      }, tE = class {
        constructor(e10) {
          this.options = e10;
        }
        shouldAttemptRetry(e10, t10) {
          return this.options.shouldRetry ? Promise.resolve(e10 < this.options.attempts && this.options.shouldRetry(t10)) : Promise.resolve(e10 < this.options.attempts);
        }
        getDelay() {
          return this.options.delay;
        }
      }, tR = class {
        constructor(e10) {
          this.options = e10;
        }
        shouldAttemptRetry(e10, t10) {
          return this.options.shouldRetry ? Promise.resolve(e10 < this.options.attempts && this.options.shouldRetry(t10)) : Promise.resolve(e10 < this.options.attempts);
        }
        getDelay(e10) {
          return Math.min(this.options.maxDelay, this.options.baseDelay * 2 ** e10);
        }
      }, tC = async (e10) => {
        let t10 = {}, r10 = async (e11) => "function" == typeof e11 ? await e11() : e11;
        if (null == e10 ? void 0 : e10.auth) {
          if ("Bearer" === e10.auth.type) {
            let n10 = await r10(e10.auth.token);
            if (!n10) return t10;
            t10.authorization = `Bearer ${n10}`;
          } else if ("Basic" === e10.auth.type) {
            let n10 = r10(e10.auth.username), i10 = r10(e10.auth.password);
            if (!n10 || !i10) return t10;
            t10.authorization = `Basic ${btoa(`${n10}:${i10}`)}`;
          } else if ("Custom" === e10.auth.type) {
            let n10 = r10(e10.auth.value);
            if (!n10) return t10;
            t10.authorization = `${r10(e10.auth.prefix)} ${n10}`;
          }
        }
        return t10;
      }, tO = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
      function tI(e10) {
        if (void 0 === e10) return false;
        let t10 = typeof e10;
        return "string" === t10 || "number" === t10 || "boolean" === t10 || null === t10 || "object" === t10 && (!!Array.isArray(e10) || !e10.buffer && (e10.constructor && "Object" === e10.constructor.name || "function" == typeof e10.toJSON));
      }
      function tA(e10) {
        try {
          return JSON.parse(e10);
        } catch (t10) {
          return e10;
        }
      }
      function tP(e10) {
        return "function" == typeof e10;
      }
      async function tN(e10) {
        let t10 = new Headers(null == e10 ? void 0 : e10.headers);
        for (let [r10, n10] of Object.entries(await tC(e10) || {})) t10.set(r10, n10);
        if (!t10.has("content-type")) {
          let r10 = tI(null == e10 ? void 0 : e10.body) ? "application/json" : null;
          r10 && t10.set("content-type", r10);
        }
        return t10;
      }
      var tj = class e10 extends Error {
        constructor(t10, r10) {
          super(r10 || JSON.stringify(t10, null, 2)), this.issues = t10, Object.setPrototypeOf(this, e10.prototype);
        }
      };
      async function tM(e10, t10) {
        let r10 = await e10["~standard"].validate(t10);
        if (r10.issues) throw new tj(r10.issues);
        return r10.value;
      }
      var tL = ["get", "post", "put", "patch", "delete"], tD = (e10) => ({ id: "apply-schema", name: "Apply Schema", version: "1.0.0", async init(t10, r10) {
        var n10, i10, a2, s2;
        let o2 = (null == (i10 = null == (n10 = e10.plugins) ? void 0 : n10.find((e11) => {
          var r11;
          return null != (r11 = e11.schema) && !!r11.config && (t10.startsWith(e11.schema.config.baseURL || "") || t10.startsWith(e11.schema.config.prefix || ""));
        })) ? void 0 : i10.schema) || e10.schema;
        if (o2) {
          let e11 = t10;
          (null == (a2 = o2.config) ? void 0 : a2.prefix) && e11.startsWith(o2.config.prefix) && (e11 = e11.replace(o2.config.prefix, ""), o2.config.baseURL && (t10 = t10.replace(o2.config.prefix, o2.config.baseURL))), (null == (s2 = o2.config) ? void 0 : s2.baseURL) && e11.startsWith(o2.config.baseURL) && (e11 = e11.replace(o2.config.baseURL, ""));
          let n11 = o2.schema[e11];
          if (n11) {
            let e12 = tS(tx({}, r10), { method: n11.method, output: n11.output });
            return (null == r10 ? void 0 : r10.disableValidation) || (e12 = tS(tx({}, e12), { body: n11.input ? await tM(n11.input, null == r10 ? void 0 : r10.body) : null == r10 ? void 0 : r10.body, params: n11.params ? await tM(n11.params, null == r10 ? void 0 : r10.params) : null == r10 ? void 0 : r10.params, query: n11.query ? await tM(n11.query, null == r10 ? void 0 : r10.query) : null == r10 ? void 0 : r10.query })), { url: t10, options: e12 };
          }
        }
        return { url: t10, options: r10 };
      } }), t$ = async (e10, t10) => {
        var r10, n10, i10, a2, s2, o2, l2, u2;
        let { hooks: d2, url: c2, options: p2 } = await tT(e10, t10), h2 = function(e11) {
          if (null == e11 ? void 0 : e11.customFetchImpl) return e11.customFetchImpl;
          if ("undefined" != typeof globalThis && tP(globalThis.fetch)) return globalThis.fetch;
          if ("undefined" != typeof window && tP(window.fetch)) return window.fetch;
          throw Error("No fetch implementation found");
        }(p2), m2 = new AbortController(), f2 = null != (r10 = p2.signal) ? r10 : m2.signal, g2 = function(e11, t11) {
          let { baseURL: r11, params: n11, query: i11 } = t11 || { query: {}, params: {}, baseURL: "" }, a3 = e11.startsWith("http") ? e11.split("/").slice(0, 3).join("/") : r11 || "";
          if (e11.startsWith("@")) {
            let t12 = e11.toString().split("@")[1].split("/")[0];
            tL.includes(t12) && (e11 = e11.replace(`@${t12}/`, "/"));
          }
          a3.endsWith("/") || (a3 += "/");
          let [s3, o3] = e11.replace(a3, "").split("?"), l3 = new URLSearchParams(o3);
          for (let [e12, t12] of Object.entries(i11 || {})) null != t12 && l3.set(e12, String(t12));
          if (n11) if (Array.isArray(n11)) for (let [e12, t12] of s3.split("/").filter((e13) => e13.startsWith(":")).entries()) {
            let r12 = n11[e12];
            s3 = s3.replace(t12, r12);
          }
          else for (let [e12, t12] of Object.entries(n11)) s3 = s3.replace(`:${e12}`, String(t12));
          (s3 = s3.split("/").map(encodeURIComponent).join("/")).startsWith("/") && (s3 = s3.slice(1));
          let u3 = l3.toString();
          return (u3 = u3.length > 0 ? `?${u3}`.replace(/\+/g, "%20") : "", a3.startsWith("http")) ? new URL(`${s3}${u3}`, a3) : `${a3}${s3}${u3}`;
        }(c2, p2), y2 = function(e11) {
          if (!(null == e11 ? void 0 : e11.body)) return null;
          let t11 = new Headers(null == e11 ? void 0 : e11.headers);
          if (tI(e11.body) && !t11.has("content-type")) {
            for (let [t12, r11] of Object.entries(null == e11 ? void 0 : e11.body)) r11 instanceof Date && (e11.body[t12] = r11.toISOString());
            return JSON.stringify(e11.body);
          }
          return e11.body;
        }(p2), v2 = await tN(p2), _2 = function(e11, t11) {
          var r11;
          if (null == t11 ? void 0 : t11.method) return t11.method.toUpperCase();
          if (e11.startsWith("@")) {
            let n11 = null == (r11 = e11.split("@")[1]) ? void 0 : r11.split("/")[0];
            return tL.includes(n11) ? n11.toUpperCase() : (null == t11 ? void 0 : t11.body) ? "POST" : "GET";
          }
          return (null == t11 ? void 0 : t11.body) ? "POST" : "GET";
        }(c2, p2), b2 = tS(tx({}, p2), { url: g2, headers: v2, body: y2, method: _2, signal: f2 });
        for (let e11 of d2.onRequest) if (e11) {
          let t11 = await e11(b2);
          t11 instanceof Object && (b2 = t11);
        }
        ("pipeTo" in b2 && "function" == typeof b2.pipeTo || "function" == typeof (null == (n10 = null == t10 ? void 0 : t10.body) ? void 0 : n10.pipe)) && !("duplex" in b2) && (b2.duplex = "half");
        let { clearTimeout: w2 } = function(e11, t11) {
          let r11;
          return !(null == e11 ? void 0 : e11.signal) && (null == e11 ? void 0 : e11.timeout) && (r11 = setTimeout(() => null == t11 ? void 0 : t11.abort(), null == e11 ? void 0 : e11.timeout)), { abortTimeout: r11, clearTimeout: () => {
            r11 && clearTimeout(r11);
          } };
        }(p2, m2), x2 = await h2(b2.url, b2);
        w2();
        let S2 = { response: x2, request: b2 };
        for (let e11 of d2.onResponse) if (e11) {
          let r11 = await e11(tS(tx({}, S2), { response: (null == (i10 = null == t10 ? void 0 : t10.hookOptions) ? void 0 : i10.cloneResponse) ? x2.clone() : x2 }));
          r11 instanceof Response ? x2 = r11 : r11 instanceof Object && (x2 = r11.response);
        }
        if (x2.ok) {
          if ("HEAD" === b2.method) return { data: "", error: null };
          let e11 = function(e12) {
            let t11 = e12.headers.get("content-type"), r12 = /* @__PURE__ */ new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]);
            if (!t11) return "json";
            let n11 = t11.split(";").shift() || "";
            return tO.test(n11) ? "json" : r12.has(n11) || n11.startsWith("text/") ? "text" : "blob";
          }(x2), r11 = { data: "", response: x2, request: b2 };
          if ("json" === e11 || "text" === e11) {
            let e12 = await x2.text(), t11 = null != (a2 = b2.jsonParser) ? a2 : tA;
            r11.data = await t11(e12);
          } else r11.data = await x2[e11]();
          for (let e12 of ((null == b2 ? void 0 : b2.output) && b2.output && !b2.disableValidation && (r11.data = await tM(b2.output, r11.data)), d2.onSuccess)) e12 && await e12(tS(tx({}, r11), { response: (null == (s2 = null == t10 ? void 0 : t10.hookOptions) ? void 0 : s2.cloneResponse) ? x2.clone() : x2 }));
          return (null == t10 ? void 0 : t10.throw) ? r11.data : { data: r11.data, error: null };
        }
        let k2 = null != (o2 = null == t10 ? void 0 : t10.jsonParser) ? o2 : tA, T2 = await x2.text(), E2 = function(e11) {
          try {
            return JSON.parse(e11), true;
          } catch (e12) {
            return false;
          }
        }(T2), R2 = E2 ? await k2(T2) : null, C2 = { response: x2, responseText: T2, request: b2, error: tS(tx({}, R2), { status: x2.status, statusText: x2.statusText }) };
        for (let e11 of d2.onError) e11 && await e11(tS(tx({}, C2), { response: (null == (l2 = null == t10 ? void 0 : t10.hookOptions) ? void 0 : l2.cloneResponse) ? x2.clone() : x2 }));
        if (null == t10 ? void 0 : t10.retry) {
          let r11 = function(e11) {
            if ("number" == typeof e11) return new tE({ type: "linear", attempts: e11, delay: 1e3 });
            switch (e11.type) {
              case "linear":
                return new tE(e11);
              case "exponential":
                return new tR(e11);
              default:
                throw Error("Invalid retry strategy");
            }
          }(t10.retry), n11 = null != (u2 = t10.retryAttempt) ? u2 : 0;
          if (await r11.shouldAttemptRetry(n11, x2)) {
            for (let e11 of d2.onRetry) e11 && await e11(S2);
            let i11 = r11.getDelay(n11);
            return await new Promise((e11) => setTimeout(e11, i11)), await t$(e10, tS(tx({}, t10), { retryAttempt: n11 + 1 }));
          }
        }
        if (null == t10 ? void 0 : t10.throw) throw new tk(x2.status, x2.statusText, E2 ? R2 : T2);
        return { data: null, error: tS(tx({}, R2), { status: x2.status, statusText: x2.statusText }) };
      };
      !function(e10) {
        e10.assertEqual = (e11) => {
        }, e10.assertIs = function(e11) {
        }, e10.assertNever = function(e11) {
          throw Error();
        }, e10.arrayToEnum = (e11) => {
          let t10 = {};
          for (let r10 of e11) t10[r10] = r10;
          return t10;
        }, e10.getValidEnumValues = (t10) => {
          let r10 = e10.objectKeys(t10).filter((e11) => "number" != typeof t10[t10[e11]]), n10 = {};
          for (let e11 of r10) n10[e11] = t10[e11];
          return e10.objectValues(n10);
        }, e10.objectValues = (t10) => e10.objectKeys(t10).map(function(e11) {
          return t10[e11];
        }), e10.objectKeys = "function" == typeof Object.keys ? (e11) => Object.keys(e11) : (e11) => {
          let t10 = [];
          for (let r10 in e11) Object.prototype.hasOwnProperty.call(e11, r10) && t10.push(r10);
          return t10;
        }, e10.find = (e11, t10) => {
          for (let r10 of e11) if (t10(r10)) return r10;
        }, e10.isInteger = "function" == typeof Number.isInteger ? (e11) => Number.isInteger(e11) : (e11) => "number" == typeof e11 && Number.isFinite(e11) && Math.floor(e11) === e11, e10.joinValues = function(e11, t10 = " | ") {
          return e11.map((e12) => "string" == typeof e12 ? `'${e12}'` : e12).join(t10);
        }, e10.jsonStringifyReplacer = (e11, t10) => "bigint" == typeof t10 ? t10.toString() : t10;
      }(u || (u = {})), (d || (d = {})).mergeShapes = (e10, t10) => ({ ...e10, ...t10 });
      let tZ = u.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]), tq = (e10) => {
        switch (typeof e10) {
          case "undefined":
            return tZ.undefined;
          case "string":
            return tZ.string;
          case "number":
            return Number.isNaN(e10) ? tZ.nan : tZ.number;
          case "boolean":
            return tZ.boolean;
          case "function":
            return tZ.function;
          case "bigint":
            return tZ.bigint;
          case "symbol":
            return tZ.symbol;
          case "object":
            if (Array.isArray(e10)) return tZ.array;
            if (null === e10) return tZ.null;
            if (e10.then && "function" == typeof e10.then && e10.catch && "function" == typeof e10.catch) return tZ.promise;
            if ("undefined" != typeof Map && e10 instanceof Map) return tZ.map;
            if ("undefined" != typeof Set && e10 instanceof Set) return tZ.set;
            if ("undefined" != typeof Date && e10 instanceof Date) return tZ.date;
            return tZ.object;
          default:
            return tZ.unknown;
        }
      }, tU = u.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]), tz = (e10) => JSON.stringify(e10, null, 2).replace(/"([^"]+)":/g, "$1:");
      class tF extends Error {
        get errors() {
          return this.issues;
        }
        constructor(e10) {
          super(), this.issues = [], this.addIssue = (e11) => {
            this.issues = [...this.issues, e11];
          }, this.addIssues = (e11 = []) => {
            this.issues = [...this.issues, ...e11];
          };
          let t10 = new.target.prototype;
          Object.setPrototypeOf ? Object.setPrototypeOf(this, t10) : this.__proto__ = t10, this.name = "ZodError", this.issues = e10;
        }
        format(e10) {
          let t10 = e10 || function(e11) {
            return e11.message;
          }, r10 = { _errors: [] }, n10 = (e11) => {
            for (let i10 of e11.issues) if ("invalid_union" === i10.code) i10.unionErrors.map(n10);
            else if ("invalid_return_type" === i10.code) n10(i10.returnTypeError);
            else if ("invalid_arguments" === i10.code) n10(i10.argumentsError);
            else if (0 === i10.path.length) r10._errors.push(t10(i10));
            else {
              let e12 = r10, n11 = 0;
              for (; n11 < i10.path.length; ) {
                let r11 = i10.path[n11];
                n11 === i10.path.length - 1 ? (e12[r11] = e12[r11] || { _errors: [] }, e12[r11]._errors.push(t10(i10))) : e12[r11] = e12[r11] || { _errors: [] }, e12 = e12[r11], n11++;
              }
            }
          };
          return n10(this), r10;
        }
        static assert(e10) {
          if (!(e10 instanceof tF)) throw Error(`Not a ZodError: ${e10}`);
        }
        toString() {
          return this.message;
        }
        get message() {
          return JSON.stringify(this.issues, u.jsonStringifyReplacer, 2);
        }
        get isEmpty() {
          return 0 === this.issues.length;
        }
        flatten(e10 = (e11) => e11.message) {
          let t10 = {}, r10 = [];
          for (let n10 of this.issues) if (n10.path.length > 0) {
            let r11 = n10.path[0];
            t10[r11] = t10[r11] || [], t10[r11].push(e10(n10));
          } else r10.push(e10(n10));
          return { formErrors: r10, fieldErrors: t10 };
        }
        get formErrors() {
          return this.flatten();
        }
      }
      tF.create = (e10) => new tF(e10);
      let tB = (e10, t10) => {
        let r10;
        switch (e10.code) {
          case tU.invalid_type:
            r10 = e10.received === tZ.undefined ? "Required" : `Expected ${e10.expected}, received ${e10.received}`;
            break;
          case tU.invalid_literal:
            r10 = `Invalid literal value, expected ${JSON.stringify(e10.expected, u.jsonStringifyReplacer)}`;
            break;
          case tU.unrecognized_keys:
            r10 = `Unrecognized key(s) in object: ${u.joinValues(e10.keys, ", ")}`;
            break;
          case tU.invalid_union:
            r10 = "Invalid input";
            break;
          case tU.invalid_union_discriminator:
            r10 = `Invalid discriminator value. Expected ${u.joinValues(e10.options)}`;
            break;
          case tU.invalid_enum_value:
            r10 = `Invalid enum value. Expected ${u.joinValues(e10.options)}, received '${e10.received}'`;
            break;
          case tU.invalid_arguments:
            r10 = "Invalid function arguments";
            break;
          case tU.invalid_return_type:
            r10 = "Invalid function return type";
            break;
          case tU.invalid_date:
            r10 = "Invalid date";
            break;
          case tU.invalid_string:
            "object" == typeof e10.validation ? "includes" in e10.validation ? (r10 = `Invalid input: must include "${e10.validation.includes}"`, "number" == typeof e10.validation.position && (r10 = `${r10} at one or more positions greater than or equal to ${e10.validation.position}`)) : "startsWith" in e10.validation ? r10 = `Invalid input: must start with "${e10.validation.startsWith}"` : "endsWith" in e10.validation ? r10 = `Invalid input: must end with "${e10.validation.endsWith}"` : u.assertNever(e10.validation) : r10 = "regex" !== e10.validation ? `Invalid ${e10.validation}` : "Invalid";
            break;
          case tU.too_small:
            r10 = "array" === e10.type ? `Array must contain ${e10.exact ? "exactly" : e10.inclusive ? "at least" : "more than"} ${e10.minimum} element(s)` : "string" === e10.type ? `String must contain ${e10.exact ? "exactly" : e10.inclusive ? "at least" : "over"} ${e10.minimum} character(s)` : "number" === e10.type || "bigint" === e10.type ? `Number must be ${e10.exact ? "exactly equal to " : e10.inclusive ? "greater than or equal to " : "greater than "}${e10.minimum}` : "date" === e10.type ? `Date must be ${e10.exact ? "exactly equal to " : e10.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e10.minimum))}` : "Invalid input";
            break;
          case tU.too_big:
            r10 = "array" === e10.type ? `Array must contain ${e10.exact ? "exactly" : e10.inclusive ? "at most" : "less than"} ${e10.maximum} element(s)` : "string" === e10.type ? `String must contain ${e10.exact ? "exactly" : e10.inclusive ? "at most" : "under"} ${e10.maximum} character(s)` : "number" === e10.type ? `Number must be ${e10.exact ? "exactly" : e10.inclusive ? "less than or equal to" : "less than"} ${e10.maximum}` : "bigint" === e10.type ? `BigInt must be ${e10.exact ? "exactly" : e10.inclusive ? "less than or equal to" : "less than"} ${e10.maximum}` : "date" === e10.type ? `Date must be ${e10.exact ? "exactly" : e10.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e10.maximum))}` : "Invalid input";
            break;
          case tU.custom:
            r10 = "Invalid input";
            break;
          case tU.invalid_intersection_types:
            r10 = "Intersection results could not be merged";
            break;
          case tU.not_multiple_of:
            r10 = `Number must be a multiple of ${e10.multipleOf}`;
            break;
          case tU.not_finite:
            r10 = "Number must be finite";
            break;
          default:
            r10 = t10.defaultError, u.assertNever(e10);
        }
        return { message: r10 };
      }, tW = tB;
      function tV(e10) {
        tW = e10;
      }
      function tH() {
        return tW;
      }
      !function(e10) {
        e10.errToObj = (e11) => "string" == typeof e11 ? { message: e11 } : e11 || {}, e10.toString = (e11) => "string" == typeof e11 ? e11 : e11?.message;
      }(c || (c = {}));
      let tK = (e10) => {
        let { data: t10, path: r10, errorMaps: n10, issueData: i10 } = e10, a2 = [...r10, ...i10.path || []], s2 = { ...i10, path: a2 };
        if (void 0 !== i10.message) return { ...i10, path: a2, message: i10.message };
        let o2 = "";
        for (let e11 of n10.filter((e12) => !!e12).slice().reverse()) o2 = e11(s2, { data: t10, defaultError: o2 }).message;
        return { ...i10, path: a2, message: o2 };
      }, tX = [];
      function tG(e10, t10) {
        let r10 = tW, n10 = tK({ issueData: t10, data: e10.data, path: e10.path, errorMaps: [e10.common.contextualErrorMap, e10.schemaErrorMap, r10, r10 === tB ? void 0 : tB].filter((e11) => !!e11) });
        e10.common.issues.push(n10);
      }
      class tY {
        constructor() {
          this.value = "valid";
        }
        dirty() {
          "valid" === this.value && (this.value = "dirty");
        }
        abort() {
          "aborted" !== this.value && (this.value = "aborted");
        }
        static mergeArray(e10, t10) {
          let r10 = [];
          for (let n10 of t10) {
            if ("aborted" === n10.status) return tJ;
            "dirty" === n10.status && e10.dirty(), r10.push(n10.value);
          }
          return { status: e10.value, value: r10 };
        }
        static async mergeObjectAsync(e10, t10) {
          let r10 = [];
          for (let e11 of t10) {
            let t11 = await e11.key, n10 = await e11.value;
            r10.push({ key: t11, value: n10 });
          }
          return tY.mergeObjectSync(e10, r10);
        }
        static mergeObjectSync(e10, t10) {
          let r10 = {};
          for (let n10 of t10) {
            let { key: t11, value: i10 } = n10;
            if ("aborted" === t11.status || "aborted" === i10.status) return tJ;
            "dirty" === t11.status && e10.dirty(), "dirty" === i10.status && e10.dirty(), "__proto__" !== t11.value && (void 0 !== i10.value || n10.alwaysSet) && (r10[t11.value] = i10.value);
          }
          return { status: e10.value, value: r10 };
        }
      }
      let tJ = Object.freeze({ status: "aborted" }), tQ = (e10) => ({ status: "dirty", value: e10 }), t0 = (e10) => ({ status: "valid", value: e10 }), t1 = (e10) => "aborted" === e10.status, t2 = (e10) => "dirty" === e10.status, t4 = (e10) => "valid" === e10.status, t3 = (e10) => "undefined" != typeof Promise && e10 instanceof Promise;
      class t9 {
        constructor(e10, t10, r10, n10) {
          this._cachedPath = [], this.parent = e10, this.data = t10, this._path = r10, this._key = n10;
        }
        get path() {
          return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
        }
      }
      let t5 = (e10, t10) => {
        if (t4(t10)) return { success: true, data: t10.value };
        if (!e10.common.issues.length) throw Error("Validation failed but no issues detected.");
        return { success: false, get error() {
          if (this._error) return this._error;
          let t11 = new tF(e10.common.issues);
          return this._error = t11, this._error;
        } };
      };
      function t6(e10) {
        if (!e10) return {};
        let { errorMap: t10, invalid_type_error: r10, required_error: n10, description: i10 } = e10;
        if (t10 && (r10 || n10)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
        return t10 ? { errorMap: t10, description: i10 } : { errorMap: (t11, i11) => {
          let { message: a2 } = e10;
          return "invalid_enum_value" === t11.code ? { message: a2 ?? i11.defaultError } : void 0 === i11.data ? { message: a2 ?? n10 ?? i11.defaultError } : "invalid_type" !== t11.code ? { message: i11.defaultError } : { message: a2 ?? r10 ?? i11.defaultError };
        }, description: i10 };
      }
      class t7 {
        get description() {
          return this._def.description;
        }
        _getType(e10) {
          return tq(e10.data);
        }
        _getOrReturnCtx(e10, t10) {
          return t10 || { common: e10.parent.common, data: e10.data, parsedType: tq(e10.data), schemaErrorMap: this._def.errorMap, path: e10.path, parent: e10.parent };
        }
        _processInputParams(e10) {
          return { status: new tY(), ctx: { common: e10.parent.common, data: e10.data, parsedType: tq(e10.data), schemaErrorMap: this._def.errorMap, path: e10.path, parent: e10.parent } };
        }
        _parseSync(e10) {
          let t10 = this._parse(e10);
          if (t3(t10)) throw Error("Synchronous parse encountered promise.");
          return t10;
        }
        _parseAsync(e10) {
          return Promise.resolve(this._parse(e10));
        }
        parse(e10, t10) {
          let r10 = this.safeParse(e10, t10);
          if (r10.success) return r10.data;
          throw r10.error;
        }
        safeParse(e10, t10) {
          let r10 = { common: { issues: [], async: t10?.async ?? false, contextualErrorMap: t10?.errorMap }, path: t10?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e10, parsedType: tq(e10) }, n10 = this._parseSync({ data: e10, path: r10.path, parent: r10 });
          return t5(r10, n10);
        }
        "~validate"(e10) {
          let t10 = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e10, parsedType: tq(e10) };
          if (!this["~standard"].async) try {
            let r10 = this._parseSync({ data: e10, path: [], parent: t10 });
            return t4(r10) ? { value: r10.value } : { issues: t10.common.issues };
          } catch (e11) {
            e11?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = true), t10.common = { issues: [], async: true };
          }
          return this._parseAsync({ data: e10, path: [], parent: t10 }).then((e11) => t4(e11) ? { value: e11.value } : { issues: t10.common.issues });
        }
        async parseAsync(e10, t10) {
          let r10 = await this.safeParseAsync(e10, t10);
          if (r10.success) return r10.data;
          throw r10.error;
        }
        async safeParseAsync(e10, t10) {
          let r10 = { common: { issues: [], contextualErrorMap: t10?.errorMap, async: true }, path: t10?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e10, parsedType: tq(e10) }, n10 = this._parse({ data: e10, path: r10.path, parent: r10 });
          return t5(r10, await (t3(n10) ? n10 : Promise.resolve(n10)));
        }
        refine(e10, t10) {
          let r10 = (e11) => "string" == typeof t10 || void 0 === t10 ? { message: t10 } : "function" == typeof t10 ? t10(e11) : t10;
          return this._refinement((t11, n10) => {
            let i10 = e10(t11), a2 = () => n10.addIssue({ code: tU.custom, ...r10(t11) });
            return "undefined" != typeof Promise && i10 instanceof Promise ? i10.then((e11) => !!e11 || (a2(), false)) : !!i10 || (a2(), false);
          });
        }
        refinement(e10, t10) {
          return this._refinement((r10, n10) => !!e10(r10) || (n10.addIssue("function" == typeof t10 ? t10(r10, n10) : t10), false));
        }
        _refinement(e10) {
          return new rV({ schema: this, typeName: p.ZodEffects, effect: { type: "refinement", refinement: e10 } });
        }
        superRefine(e10) {
          return this._refinement(e10);
        }
        constructor(e10) {
          this.spa = this.safeParseAsync, this._def = e10, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: (e11) => this["~validate"](e11) };
        }
        optional() {
          return rH.create(this, this._def);
        }
        nullable() {
          return rK.create(this, this._def);
        }
        nullish() {
          return this.nullable().optional();
        }
        array() {
          return rO.create(this);
        }
        promise() {
          return rW.create(this, this._def);
        }
        or(e10) {
          return rA.create([this, e10], this._def);
        }
        and(e10) {
          return rj.create(this, e10, this._def);
        }
        transform(e10) {
          return new rV({ ...t6(this._def), schema: this, typeName: p.ZodEffects, effect: { type: "transform", transform: e10 } });
        }
        default(e10) {
          return new rX({ ...t6(this._def), innerType: this, defaultValue: "function" == typeof e10 ? e10 : () => e10, typeName: p.ZodDefault });
        }
        brand() {
          return new rQ({ typeName: p.ZodBranded, type: this, ...t6(this._def) });
        }
        catch(e10) {
          return new rG({ ...t6(this._def), innerType: this, catchValue: "function" == typeof e10 ? e10 : () => e10, typeName: p.ZodCatch });
        }
        describe(e10) {
          return new this.constructor({ ...this._def, description: e10 });
        }
        pipe(e10) {
          return r0.create(this, e10);
        }
        readonly() {
          return r1.create(this);
        }
        isOptional() {
          return this.safeParse(void 0).success;
        }
        isNullable() {
          return this.safeParse(null).success;
        }
      }
      let t8 = /^c[^\s-]{8,}$/i, re = /^[0-9a-z]+$/, rt = /^[0-9A-HJKMNP-TV-Z]{26}$/i, rr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, rn = /^[a-z0-9_-]{21}$/i, ri = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, ra = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, rs = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ro = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, rl = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ru = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, rd = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, rc = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, rp = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, rh = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", rm = RegExp(`^${rh}$`);
      function rf(e10) {
        let t10 = "[0-5]\\d";
        e10.precision ? t10 = `${t10}\\.\\d{${e10.precision}}` : null == e10.precision && (t10 = `${t10}(\\.\\d+)?`);
        let r10 = e10.precision ? "+" : "?";
        return `([01]\\d|2[0-3]):[0-5]\\d(:${t10})${r10}`;
      }
      function rg(e10) {
        let t10 = `${rh}T${rf(e10)}`, r10 = [];
        return r10.push(e10.local ? "Z?" : "Z"), e10.offset && r10.push("([+-]\\d{2}:?\\d{2})"), t10 = `${t10}(${r10.join("|")})`, RegExp(`^${t10}$`);
      }
      class ry extends t7 {
        _parse(e10) {
          var t10, r10, n10, a2;
          let s2;
          if (this._def.coerce && (e10.data = String(e10.data)), this._getType(e10) !== tZ.string) {
            let t11 = this._getOrReturnCtx(e10);
            return tG(t11, { code: tU.invalid_type, expected: tZ.string, received: t11.parsedType }), tJ;
          }
          let o2 = new tY();
          for (let l2 of this._def.checks) if ("min" === l2.kind) e10.data.length < l2.value && (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.too_small, minimum: l2.value, type: "string", inclusive: true, exact: false, message: l2.message }), o2.dirty());
          else if ("max" === l2.kind) e10.data.length > l2.value && (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.too_big, maximum: l2.value, type: "string", inclusive: true, exact: false, message: l2.message }), o2.dirty());
          else if ("length" === l2.kind) {
            let t11 = e10.data.length > l2.value, r11 = e10.data.length < l2.value;
            (t11 || r11) && (s2 = this._getOrReturnCtx(e10, s2), t11 ? tG(s2, { code: tU.too_big, maximum: l2.value, type: "string", inclusive: true, exact: true, message: l2.message }) : r11 && tG(s2, { code: tU.too_small, minimum: l2.value, type: "string", inclusive: true, exact: true, message: l2.message }), o2.dirty());
          } else if ("email" === l2.kind) rs.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "email", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("emoji" === l2.kind) i || (i = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), i.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "emoji", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("uuid" === l2.kind) rr.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "uuid", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("nanoid" === l2.kind) rn.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "nanoid", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("cuid" === l2.kind) t8.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "cuid", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("cuid2" === l2.kind) re.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "cuid2", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("ulid" === l2.kind) rt.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "ulid", code: tU.invalid_string, message: l2.message }), o2.dirty());
          else if ("url" === l2.kind) try {
            new URL(e10.data);
          } catch {
            tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "url", code: tU.invalid_string, message: l2.message }), o2.dirty();
          }
          else "regex" === l2.kind ? (l2.regex.lastIndex = 0, l2.regex.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "regex", code: tU.invalid_string, message: l2.message }), o2.dirty())) : "trim" === l2.kind ? e10.data = e10.data.trim() : "includes" === l2.kind ? e10.data.includes(l2.value, l2.position) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: { includes: l2.value, position: l2.position }, message: l2.message }), o2.dirty()) : "toLowerCase" === l2.kind ? e10.data = e10.data.toLowerCase() : "toUpperCase" === l2.kind ? e10.data = e10.data.toUpperCase() : "startsWith" === l2.kind ? e10.data.startsWith(l2.value) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: { startsWith: l2.value }, message: l2.message }), o2.dirty()) : "endsWith" === l2.kind ? e10.data.endsWith(l2.value) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: { endsWith: l2.value }, message: l2.message }), o2.dirty()) : "datetime" === l2.kind ? rg(l2).test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: "datetime", message: l2.message }), o2.dirty()) : "date" === l2.kind ? rm.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: "date", message: l2.message }), o2.dirty()) : "time" === l2.kind ? RegExp(`^${rf(l2)}$`).test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { code: tU.invalid_string, validation: "time", message: l2.message }), o2.dirty()) : "duration" === l2.kind ? ra.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "duration", code: tU.invalid_string, message: l2.message }), o2.dirty()) : "ip" === l2.kind ? (t10 = e10.data, !(("v4" === (r10 = l2.version) || !r10) && ro.test(t10) || ("v6" === r10 || !r10) && ru.test(t10)) && 1 && (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "ip", code: tU.invalid_string, message: l2.message }), o2.dirty())) : "jwt" === l2.kind ? !function(e11, t11) {
            if (!ri.test(e11)) return false;
            try {
              let [r11] = e11.split(".");
              if (!r11) return false;
              let n11 = r11.replace(/-/g, "+").replace(/_/g, "/").padEnd(r11.length + (4 - r11.length % 4) % 4, "="), i10 = JSON.parse(atob(n11));
              if ("object" != typeof i10 || null === i10 || "typ" in i10 && i10?.typ !== "JWT" || !i10.alg || t11 && i10.alg !== t11) return false;
              return true;
            } catch {
              return false;
            }
          }(e10.data, l2.alg) && (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "jwt", code: tU.invalid_string, message: l2.message }), o2.dirty()) : "cidr" === l2.kind ? (n10 = e10.data, !(("v4" === (a2 = l2.version) || !a2) && rl.test(n10) || ("v6" === a2 || !a2) && rd.test(n10)) && 1 && (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "cidr", code: tU.invalid_string, message: l2.message }), o2.dirty())) : "base64" === l2.kind ? rc.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "base64", code: tU.invalid_string, message: l2.message }), o2.dirty()) : "base64url" === l2.kind ? rp.test(e10.data) || (tG(s2 = this._getOrReturnCtx(e10, s2), { validation: "base64url", code: tU.invalid_string, message: l2.message }), o2.dirty()) : u.assertNever(l2);
          return { status: o2.value, value: e10.data };
        }
        _regex(e10, t10, r10) {
          return this.refinement((t11) => e10.test(t11), { validation: t10, code: tU.invalid_string, ...c.errToObj(r10) });
        }
        _addCheck(e10) {
          return new ry({ ...this._def, checks: [...this._def.checks, e10] });
        }
        email(e10) {
          return this._addCheck({ kind: "email", ...c.errToObj(e10) });
        }
        url(e10) {
          return this._addCheck({ kind: "url", ...c.errToObj(e10) });
        }
        emoji(e10) {
          return this._addCheck({ kind: "emoji", ...c.errToObj(e10) });
        }
        uuid(e10) {
          return this._addCheck({ kind: "uuid", ...c.errToObj(e10) });
        }
        nanoid(e10) {
          return this._addCheck({ kind: "nanoid", ...c.errToObj(e10) });
        }
        cuid(e10) {
          return this._addCheck({ kind: "cuid", ...c.errToObj(e10) });
        }
        cuid2(e10) {
          return this._addCheck({ kind: "cuid2", ...c.errToObj(e10) });
        }
        ulid(e10) {
          return this._addCheck({ kind: "ulid", ...c.errToObj(e10) });
        }
        base64(e10) {
          return this._addCheck({ kind: "base64", ...c.errToObj(e10) });
        }
        base64url(e10) {
          return this._addCheck({ kind: "base64url", ...c.errToObj(e10) });
        }
        jwt(e10) {
          return this._addCheck({ kind: "jwt", ...c.errToObj(e10) });
        }
        ip(e10) {
          return this._addCheck({ kind: "ip", ...c.errToObj(e10) });
        }
        cidr(e10) {
          return this._addCheck({ kind: "cidr", ...c.errToObj(e10) });
        }
        datetime(e10) {
          return "string" == typeof e10 ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e10 }) : this._addCheck({ kind: "datetime", precision: void 0 === e10?.precision ? null : e10?.precision, offset: e10?.offset ?? false, local: e10?.local ?? false, ...c.errToObj(e10?.message) });
        }
        date(e10) {
          return this._addCheck({ kind: "date", message: e10 });
        }
        time(e10) {
          return "string" == typeof e10 ? this._addCheck({ kind: "time", precision: null, message: e10 }) : this._addCheck({ kind: "time", precision: void 0 === e10?.precision ? null : e10?.precision, ...c.errToObj(e10?.message) });
        }
        duration(e10) {
          return this._addCheck({ kind: "duration", ...c.errToObj(e10) });
        }
        regex(e10, t10) {
          return this._addCheck({ kind: "regex", regex: e10, ...c.errToObj(t10) });
        }
        includes(e10, t10) {
          return this._addCheck({ kind: "includes", value: e10, position: t10?.position, ...c.errToObj(t10?.message) });
        }
        startsWith(e10, t10) {
          return this._addCheck({ kind: "startsWith", value: e10, ...c.errToObj(t10) });
        }
        endsWith(e10, t10) {
          return this._addCheck({ kind: "endsWith", value: e10, ...c.errToObj(t10) });
        }
        min(e10, t10) {
          return this._addCheck({ kind: "min", value: e10, ...c.errToObj(t10) });
        }
        max(e10, t10) {
          return this._addCheck({ kind: "max", value: e10, ...c.errToObj(t10) });
        }
        length(e10, t10) {
          return this._addCheck({ kind: "length", value: e10, ...c.errToObj(t10) });
        }
        nonempty(e10) {
          return this.min(1, c.errToObj(e10));
        }
        trim() {
          return new ry({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
        }
        toLowerCase() {
          return new ry({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
        }
        toUpperCase() {
          return new ry({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
        }
        get isDatetime() {
          return !!this._def.checks.find((e10) => "datetime" === e10.kind);
        }
        get isDate() {
          return !!this._def.checks.find((e10) => "date" === e10.kind);
        }
        get isTime() {
          return !!this._def.checks.find((e10) => "time" === e10.kind);
        }
        get isDuration() {
          return !!this._def.checks.find((e10) => "duration" === e10.kind);
        }
        get isEmail() {
          return !!this._def.checks.find((e10) => "email" === e10.kind);
        }
        get isURL() {
          return !!this._def.checks.find((e10) => "url" === e10.kind);
        }
        get isEmoji() {
          return !!this._def.checks.find((e10) => "emoji" === e10.kind);
        }
        get isUUID() {
          return !!this._def.checks.find((e10) => "uuid" === e10.kind);
        }
        get isNANOID() {
          return !!this._def.checks.find((e10) => "nanoid" === e10.kind);
        }
        get isCUID() {
          return !!this._def.checks.find((e10) => "cuid" === e10.kind);
        }
        get isCUID2() {
          return !!this._def.checks.find((e10) => "cuid2" === e10.kind);
        }
        get isULID() {
          return !!this._def.checks.find((e10) => "ulid" === e10.kind);
        }
        get isIP() {
          return !!this._def.checks.find((e10) => "ip" === e10.kind);
        }
        get isCIDR() {
          return !!this._def.checks.find((e10) => "cidr" === e10.kind);
        }
        get isBase64() {
          return !!this._def.checks.find((e10) => "base64" === e10.kind);
        }
        get isBase64url() {
          return !!this._def.checks.find((e10) => "base64url" === e10.kind);
        }
        get minLength() {
          let e10 = null;
          for (let t10 of this._def.checks) "min" === t10.kind && (null === e10 || t10.value > e10) && (e10 = t10.value);
          return e10;
        }
        get maxLength() {
          let e10 = null;
          for (let t10 of this._def.checks) "max" === t10.kind && (null === e10 || t10.value < e10) && (e10 = t10.value);
          return e10;
        }
      }
      ry.create = (e10) => new ry({ checks: [], typeName: p.ZodString, coerce: e10?.coerce ?? false, ...t6(e10) });
      class rv extends t7 {
        constructor() {
          super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
        }
        _parse(e10) {
          let t10;
          if (this._def.coerce && (e10.data = Number(e10.data)), this._getType(e10) !== tZ.number) {
            let t11 = this._getOrReturnCtx(e10);
            return tG(t11, { code: tU.invalid_type, expected: tZ.number, received: t11.parsedType }), tJ;
          }
          let r10 = new tY();
          for (let n10 of this._def.checks) "int" === n10.kind ? u.isInteger(e10.data) || (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.invalid_type, expected: "integer", received: "float", message: n10.message }), r10.dirty()) : "min" === n10.kind ? (n10.inclusive ? e10.data < n10.value : e10.data <= n10.value) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_small, minimum: n10.value, type: "number", inclusive: n10.inclusive, exact: false, message: n10.message }), r10.dirty()) : "max" === n10.kind ? (n10.inclusive ? e10.data > n10.value : e10.data >= n10.value) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_big, maximum: n10.value, type: "number", inclusive: n10.inclusive, exact: false, message: n10.message }), r10.dirty()) : "multipleOf" === n10.kind ? 0 !== function(e11, t11) {
            let r11 = (e11.toString().split(".")[1] || "").length, n11 = (t11.toString().split(".")[1] || "").length, i10 = r11 > n11 ? r11 : n11;
            return Number.parseInt(e11.toFixed(i10).replace(".", "")) % Number.parseInt(t11.toFixed(i10).replace(".", "")) / 10 ** i10;
          }(e10.data, n10.value) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.not_multiple_of, multipleOf: n10.value, message: n10.message }), r10.dirty()) : "finite" === n10.kind ? Number.isFinite(e10.data) || (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.not_finite, message: n10.message }), r10.dirty()) : u.assertNever(n10);
          return { status: r10.value, value: e10.data };
        }
        gte(e10, t10) {
          return this.setLimit("min", e10, true, c.toString(t10));
        }
        gt(e10, t10) {
          return this.setLimit("min", e10, false, c.toString(t10));
        }
        lte(e10, t10) {
          return this.setLimit("max", e10, true, c.toString(t10));
        }
        lt(e10, t10) {
          return this.setLimit("max", e10, false, c.toString(t10));
        }
        setLimit(e10, t10, r10, n10) {
          return new rv({ ...this._def, checks: [...this._def.checks, { kind: e10, value: t10, inclusive: r10, message: c.toString(n10) }] });
        }
        _addCheck(e10) {
          return new rv({ ...this._def, checks: [...this._def.checks, e10] });
        }
        int(e10) {
          return this._addCheck({ kind: "int", message: c.toString(e10) });
        }
        positive(e10) {
          return this._addCheck({ kind: "min", value: 0, inclusive: false, message: c.toString(e10) });
        }
        negative(e10) {
          return this._addCheck({ kind: "max", value: 0, inclusive: false, message: c.toString(e10) });
        }
        nonpositive(e10) {
          return this._addCheck({ kind: "max", value: 0, inclusive: true, message: c.toString(e10) });
        }
        nonnegative(e10) {
          return this._addCheck({ kind: "min", value: 0, inclusive: true, message: c.toString(e10) });
        }
        multipleOf(e10, t10) {
          return this._addCheck({ kind: "multipleOf", value: e10, message: c.toString(t10) });
        }
        finite(e10) {
          return this._addCheck({ kind: "finite", message: c.toString(e10) });
        }
        safe(e10) {
          return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: c.toString(e10) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: c.toString(e10) });
        }
        get minValue() {
          let e10 = null;
          for (let t10 of this._def.checks) "min" === t10.kind && (null === e10 || t10.value > e10) && (e10 = t10.value);
          return e10;
        }
        get maxValue() {
          let e10 = null;
          for (let t10 of this._def.checks) "max" === t10.kind && (null === e10 || t10.value < e10) && (e10 = t10.value);
          return e10;
        }
        get isInt() {
          return !!this._def.checks.find((e10) => "int" === e10.kind || "multipleOf" === e10.kind && u.isInteger(e10.value));
        }
        get isFinite() {
          let e10 = null, t10 = null;
          for (let r10 of this._def.checks) if ("finite" === r10.kind || "int" === r10.kind || "multipleOf" === r10.kind) return true;
          else "min" === r10.kind ? (null === t10 || r10.value > t10) && (t10 = r10.value) : "max" === r10.kind && (null === e10 || r10.value < e10) && (e10 = r10.value);
          return Number.isFinite(t10) && Number.isFinite(e10);
        }
      }
      rv.create = (e10) => new rv({ checks: [], typeName: p.ZodNumber, coerce: e10?.coerce || false, ...t6(e10) });
      class r_ extends t7 {
        constructor() {
          super(...arguments), this.min = this.gte, this.max = this.lte;
        }
        _parse(e10) {
          let t10;
          if (this._def.coerce) try {
            e10.data = BigInt(e10.data);
          } catch {
            return this._getInvalidInput(e10);
          }
          if (this._getType(e10) !== tZ.bigint) return this._getInvalidInput(e10);
          let r10 = new tY();
          for (let n10 of this._def.checks) "min" === n10.kind ? (n10.inclusive ? e10.data < n10.value : e10.data <= n10.value) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_small, type: "bigint", minimum: n10.value, inclusive: n10.inclusive, message: n10.message }), r10.dirty()) : "max" === n10.kind ? (n10.inclusive ? e10.data > n10.value : e10.data >= n10.value) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_big, type: "bigint", maximum: n10.value, inclusive: n10.inclusive, message: n10.message }), r10.dirty()) : "multipleOf" === n10.kind ? e10.data % n10.value !== BigInt(0) && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.not_multiple_of, multipleOf: n10.value, message: n10.message }), r10.dirty()) : u.assertNever(n10);
          return { status: r10.value, value: e10.data };
        }
        _getInvalidInput(e10) {
          let t10 = this._getOrReturnCtx(e10);
          return tG(t10, { code: tU.invalid_type, expected: tZ.bigint, received: t10.parsedType }), tJ;
        }
        gte(e10, t10) {
          return this.setLimit("min", e10, true, c.toString(t10));
        }
        gt(e10, t10) {
          return this.setLimit("min", e10, false, c.toString(t10));
        }
        lte(e10, t10) {
          return this.setLimit("max", e10, true, c.toString(t10));
        }
        lt(e10, t10) {
          return this.setLimit("max", e10, false, c.toString(t10));
        }
        setLimit(e10, t10, r10, n10) {
          return new r_({ ...this._def, checks: [...this._def.checks, { kind: e10, value: t10, inclusive: r10, message: c.toString(n10) }] });
        }
        _addCheck(e10) {
          return new r_({ ...this._def, checks: [...this._def.checks, e10] });
        }
        positive(e10) {
          return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: c.toString(e10) });
        }
        negative(e10) {
          return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: c.toString(e10) });
        }
        nonpositive(e10) {
          return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: c.toString(e10) });
        }
        nonnegative(e10) {
          return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: c.toString(e10) });
        }
        multipleOf(e10, t10) {
          return this._addCheck({ kind: "multipleOf", value: e10, message: c.toString(t10) });
        }
        get minValue() {
          let e10 = null;
          for (let t10 of this._def.checks) "min" === t10.kind && (null === e10 || t10.value > e10) && (e10 = t10.value);
          return e10;
        }
        get maxValue() {
          let e10 = null;
          for (let t10 of this._def.checks) "max" === t10.kind && (null === e10 || t10.value < e10) && (e10 = t10.value);
          return e10;
        }
      }
      r_.create = (e10) => new r_({ checks: [], typeName: p.ZodBigInt, coerce: e10?.coerce ?? false, ...t6(e10) });
      class rb extends t7 {
        _parse(e10) {
          if (this._def.coerce && (e10.data = !!e10.data), this._getType(e10) !== tZ.boolean) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.boolean, received: t10.parsedType }), tJ;
          }
          return t0(e10.data);
        }
      }
      rb.create = (e10) => new rb({ typeName: p.ZodBoolean, coerce: e10?.coerce || false, ...t6(e10) });
      class rw extends t7 {
        _parse(e10) {
          let t10;
          if (this._def.coerce && (e10.data = new Date(e10.data)), this._getType(e10) !== tZ.date) {
            let t11 = this._getOrReturnCtx(e10);
            return tG(t11, { code: tU.invalid_type, expected: tZ.date, received: t11.parsedType }), tJ;
          }
          if (Number.isNaN(e10.data.getTime())) return tG(this._getOrReturnCtx(e10), { code: tU.invalid_date }), tJ;
          let r10 = new tY();
          for (let n10 of this._def.checks) "min" === n10.kind ? e10.data.getTime() < n10.value && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_small, message: n10.message, inclusive: true, exact: false, minimum: n10.value, type: "date" }), r10.dirty()) : "max" === n10.kind ? e10.data.getTime() > n10.value && (tG(t10 = this._getOrReturnCtx(e10, t10), { code: tU.too_big, message: n10.message, inclusive: true, exact: false, maximum: n10.value, type: "date" }), r10.dirty()) : u.assertNever(n10);
          return { status: r10.value, value: new Date(e10.data.getTime()) };
        }
        _addCheck(e10) {
          return new rw({ ...this._def, checks: [...this._def.checks, e10] });
        }
        min(e10, t10) {
          return this._addCheck({ kind: "min", value: e10.getTime(), message: c.toString(t10) });
        }
        max(e10, t10) {
          return this._addCheck({ kind: "max", value: e10.getTime(), message: c.toString(t10) });
        }
        get minDate() {
          let e10 = null;
          for (let t10 of this._def.checks) "min" === t10.kind && (null === e10 || t10.value > e10) && (e10 = t10.value);
          return null != e10 ? new Date(e10) : null;
        }
        get maxDate() {
          let e10 = null;
          for (let t10 of this._def.checks) "max" === t10.kind && (null === e10 || t10.value < e10) && (e10 = t10.value);
          return null != e10 ? new Date(e10) : null;
        }
      }
      rw.create = (e10) => new rw({ checks: [], coerce: e10?.coerce || false, typeName: p.ZodDate, ...t6(e10) });
      class rx extends t7 {
        _parse(e10) {
          if (this._getType(e10) !== tZ.symbol) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.symbol, received: t10.parsedType }), tJ;
          }
          return t0(e10.data);
        }
      }
      rx.create = (e10) => new rx({ typeName: p.ZodSymbol, ...t6(e10) });
      class rS extends t7 {
        _parse(e10) {
          if (this._getType(e10) !== tZ.undefined) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.undefined, received: t10.parsedType }), tJ;
          }
          return t0(e10.data);
        }
      }
      rS.create = (e10) => new rS({ typeName: p.ZodUndefined, ...t6(e10) });
      class rk extends t7 {
        _parse(e10) {
          if (this._getType(e10) !== tZ.null) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.null, received: t10.parsedType }), tJ;
          }
          return t0(e10.data);
        }
      }
      rk.create = (e10) => new rk({ typeName: p.ZodNull, ...t6(e10) });
      class rT extends t7 {
        constructor() {
          super(...arguments), this._any = true;
        }
        _parse(e10) {
          return t0(e10.data);
        }
      }
      rT.create = (e10) => new rT({ typeName: p.ZodAny, ...t6(e10) });
      class rE extends t7 {
        constructor() {
          super(...arguments), this._unknown = true;
        }
        _parse(e10) {
          return t0(e10.data);
        }
      }
      rE.create = (e10) => new rE({ typeName: p.ZodUnknown, ...t6(e10) });
      class rR extends t7 {
        _parse(e10) {
          let t10 = this._getOrReturnCtx(e10);
          return tG(t10, { code: tU.invalid_type, expected: tZ.never, received: t10.parsedType }), tJ;
        }
      }
      rR.create = (e10) => new rR({ typeName: p.ZodNever, ...t6(e10) });
      class rC extends t7 {
        _parse(e10) {
          if (this._getType(e10) !== tZ.undefined) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.void, received: t10.parsedType }), tJ;
          }
          return t0(e10.data);
        }
      }
      rC.create = (e10) => new rC({ typeName: p.ZodVoid, ...t6(e10) });
      class rO extends t7 {
        _parse(e10) {
          let { ctx: t10, status: r10 } = this._processInputParams(e10), n10 = this._def;
          if (t10.parsedType !== tZ.array) return tG(t10, { code: tU.invalid_type, expected: tZ.array, received: t10.parsedType }), tJ;
          if (null !== n10.exactLength) {
            let e11 = t10.data.length > n10.exactLength.value, i11 = t10.data.length < n10.exactLength.value;
            (e11 || i11) && (tG(t10, { code: e11 ? tU.too_big : tU.too_small, minimum: i11 ? n10.exactLength.value : void 0, maximum: e11 ? n10.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: n10.exactLength.message }), r10.dirty());
          }
          if (null !== n10.minLength && t10.data.length < n10.minLength.value && (tG(t10, { code: tU.too_small, minimum: n10.minLength.value, type: "array", inclusive: true, exact: false, message: n10.minLength.message }), r10.dirty()), null !== n10.maxLength && t10.data.length > n10.maxLength.value && (tG(t10, { code: tU.too_big, maximum: n10.maxLength.value, type: "array", inclusive: true, exact: false, message: n10.maxLength.message }), r10.dirty()), t10.common.async) return Promise.all([...t10.data].map((e11, r11) => n10.type._parseAsync(new t9(t10, e11, t10.path, r11)))).then((e11) => tY.mergeArray(r10, e11));
          let i10 = [...t10.data].map((e11, r11) => n10.type._parseSync(new t9(t10, e11, t10.path, r11)));
          return tY.mergeArray(r10, i10);
        }
        get element() {
          return this._def.type;
        }
        min(e10, t10) {
          return new rO({ ...this._def, minLength: { value: e10, message: c.toString(t10) } });
        }
        max(e10, t10) {
          return new rO({ ...this._def, maxLength: { value: e10, message: c.toString(t10) } });
        }
        length(e10, t10) {
          return new rO({ ...this._def, exactLength: { value: e10, message: c.toString(t10) } });
        }
        nonempty(e10) {
          return this.min(1, e10);
        }
      }
      rO.create = (e10, t10) => new rO({ type: e10, minLength: null, maxLength: null, exactLength: null, typeName: p.ZodArray, ...t6(t10) });
      class rI extends t7 {
        constructor() {
          super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
        }
        _getCached() {
          if (null !== this._cached) return this._cached;
          let e10 = this._def.shape(), t10 = u.objectKeys(e10);
          return this._cached = { shape: e10, keys: t10 }, this._cached;
        }
        _parse(e10) {
          if (this._getType(e10) !== tZ.object) {
            let t11 = this._getOrReturnCtx(e10);
            return tG(t11, { code: tU.invalid_type, expected: tZ.object, received: t11.parsedType }), tJ;
          }
          let { status: t10, ctx: r10 } = this._processInputParams(e10), { shape: n10, keys: i10 } = this._getCached(), a2 = [];
          if (!(this._def.catchall instanceof rR && "strip" === this._def.unknownKeys)) for (let e11 in r10.data) i10.includes(e11) || a2.push(e11);
          let s2 = [];
          for (let e11 of i10) {
            let t11 = n10[e11], i11 = r10.data[e11];
            s2.push({ key: { status: "valid", value: e11 }, value: t11._parse(new t9(r10, i11, r10.path, e11)), alwaysSet: e11 in r10.data });
          }
          if (this._def.catchall instanceof rR) {
            let e11 = this._def.unknownKeys;
            if ("passthrough" === e11) for (let e12 of a2) s2.push({ key: { status: "valid", value: e12 }, value: { status: "valid", value: r10.data[e12] } });
            else if ("strict" === e11) a2.length > 0 && (tG(r10, { code: tU.unrecognized_keys, keys: a2 }), t10.dirty());
            else if ("strip" === e11) ;
            else throw Error("Internal ZodObject error: invalid unknownKeys value.");
          } else {
            let e11 = this._def.catchall;
            for (let t11 of a2) {
              let n11 = r10.data[t11];
              s2.push({ key: { status: "valid", value: t11 }, value: e11._parse(new t9(r10, n11, r10.path, t11)), alwaysSet: t11 in r10.data });
            }
          }
          return r10.common.async ? Promise.resolve().then(async () => {
            let e11 = [];
            for (let t11 of s2) {
              let r11 = await t11.key, n11 = await t11.value;
              e11.push({ key: r11, value: n11, alwaysSet: t11.alwaysSet });
            }
            return e11;
          }).then((e11) => tY.mergeObjectSync(t10, e11)) : tY.mergeObjectSync(t10, s2);
        }
        get shape() {
          return this._def.shape();
        }
        strict(e10) {
          return c.errToObj, new rI({ ...this._def, unknownKeys: "strict", ...void 0 !== e10 ? { errorMap: (t10, r10) => {
            let n10 = this._def.errorMap?.(t10, r10).message ?? r10.defaultError;
            return "unrecognized_keys" === t10.code ? { message: c.errToObj(e10).message ?? n10 } : { message: n10 };
          } } : {} });
        }
        strip() {
          return new rI({ ...this._def, unknownKeys: "strip" });
        }
        passthrough() {
          return new rI({ ...this._def, unknownKeys: "passthrough" });
        }
        extend(e10) {
          return new rI({ ...this._def, shape: () => ({ ...this._def.shape(), ...e10 }) });
        }
        merge(e10) {
          return new rI({ unknownKeys: e10._def.unknownKeys, catchall: e10._def.catchall, shape: () => ({ ...this._def.shape(), ...e10._def.shape() }), typeName: p.ZodObject });
        }
        setKey(e10, t10) {
          return this.augment({ [e10]: t10 });
        }
        catchall(e10) {
          return new rI({ ...this._def, catchall: e10 });
        }
        pick(e10) {
          let t10 = {};
          for (let r10 of u.objectKeys(e10)) e10[r10] && this.shape[r10] && (t10[r10] = this.shape[r10]);
          return new rI({ ...this._def, shape: () => t10 });
        }
        omit(e10) {
          let t10 = {};
          for (let r10 of u.objectKeys(this.shape)) e10[r10] || (t10[r10] = this.shape[r10]);
          return new rI({ ...this._def, shape: () => t10 });
        }
        deepPartial() {
          return function e10(t10) {
            if (t10 instanceof rI) {
              let r10 = {};
              for (let n10 in t10.shape) {
                let i10 = t10.shape[n10];
                r10[n10] = rH.create(e10(i10));
              }
              return new rI({ ...t10._def, shape: () => r10 });
            }
            if (t10 instanceof rO) return new rO({ ...t10._def, type: e10(t10.element) });
            if (t10 instanceof rH) return rH.create(e10(t10.unwrap()));
            if (t10 instanceof rK) return rK.create(e10(t10.unwrap()));
            if (t10 instanceof rM) return rM.create(t10.items.map((t11) => e10(t11)));
            else return t10;
          }(this);
        }
        partial(e10) {
          let t10 = {};
          for (let r10 of u.objectKeys(this.shape)) {
            let n10 = this.shape[r10];
            e10 && !e10[r10] ? t10[r10] = n10 : t10[r10] = n10.optional();
          }
          return new rI({ ...this._def, shape: () => t10 });
        }
        required(e10) {
          let t10 = {};
          for (let r10 of u.objectKeys(this.shape)) if (e10 && !e10[r10]) t10[r10] = this.shape[r10];
          else {
            let e11 = this.shape[r10];
            for (; e11 instanceof rH; ) e11 = e11._def.innerType;
            t10[r10] = e11;
          }
          return new rI({ ...this._def, shape: () => t10 });
        }
        keyof() {
          return rz(u.objectKeys(this.shape));
        }
      }
      rI.create = (e10, t10) => new rI({ shape: () => e10, unknownKeys: "strip", catchall: rR.create(), typeName: p.ZodObject, ...t6(t10) }), rI.strictCreate = (e10, t10) => new rI({ shape: () => e10, unknownKeys: "strict", catchall: rR.create(), typeName: p.ZodObject, ...t6(t10) }), rI.lazycreate = (e10, t10) => new rI({ shape: e10, unknownKeys: "strip", catchall: rR.create(), typeName: p.ZodObject, ...t6(t10) });
      class rA extends t7 {
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10), r10 = this._def.options;
          if (t10.common.async) return Promise.all(r10.map(async (e11) => {
            let r11 = { ...t10, common: { ...t10.common, issues: [] }, parent: null };
            return { result: await e11._parseAsync({ data: t10.data, path: t10.path, parent: r11 }), ctx: r11 };
          })).then(function(e11) {
            for (let t11 of e11) if ("valid" === t11.result.status) return t11.result;
            for (let r12 of e11) if ("dirty" === r12.result.status) return t10.common.issues.push(...r12.ctx.common.issues), r12.result;
            let r11 = e11.map((e12) => new tF(e12.ctx.common.issues));
            return tG(t10, { code: tU.invalid_union, unionErrors: r11 }), tJ;
          });
          {
            let e11, n10 = [];
            for (let i11 of r10) {
              let r11 = { ...t10, common: { ...t10.common, issues: [] }, parent: null }, a2 = i11._parseSync({ data: t10.data, path: t10.path, parent: r11 });
              if ("valid" === a2.status) return a2;
              "dirty" !== a2.status || e11 || (e11 = { result: a2, ctx: r11 }), r11.common.issues.length && n10.push(r11.common.issues);
            }
            if (e11) return t10.common.issues.push(...e11.ctx.common.issues), e11.result;
            let i10 = n10.map((e12) => new tF(e12));
            return tG(t10, { code: tU.invalid_union, unionErrors: i10 }), tJ;
          }
        }
        get options() {
          return this._def.options;
        }
      }
      rA.create = (e10, t10) => new rA({ options: e10, typeName: p.ZodUnion, ...t6(t10) });
      let rP = (e10) => {
        if (e10 instanceof rq) return rP(e10.schema);
        if (e10 instanceof rV) return rP(e10.innerType());
        if (e10 instanceof rU) return [e10.value];
        if (e10 instanceof rF) return e10.options;
        if (e10 instanceof rB) return u.objectValues(e10.enum);
        else if (e10 instanceof rX) return rP(e10._def.innerType);
        else if (e10 instanceof rS) return [void 0];
        else if (e10 instanceof rk) return [null];
        else if (e10 instanceof rH) return [void 0, ...rP(e10.unwrap())];
        else if (e10 instanceof rK) return [null, ...rP(e10.unwrap())];
        else if (e10 instanceof rQ) return rP(e10.unwrap());
        else if (e10 instanceof r1) return rP(e10.unwrap());
        else if (e10 instanceof rG) return rP(e10._def.innerType);
        else return [];
      };
      class rN extends t7 {
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10);
          if (t10.parsedType !== tZ.object) return tG(t10, { code: tU.invalid_type, expected: tZ.object, received: t10.parsedType }), tJ;
          let r10 = this.discriminator, n10 = t10.data[r10], i10 = this.optionsMap.get(n10);
          return i10 ? t10.common.async ? i10._parseAsync({ data: t10.data, path: t10.path, parent: t10 }) : i10._parseSync({ data: t10.data, path: t10.path, parent: t10 }) : (tG(t10, { code: tU.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [r10] }), tJ);
        }
        get discriminator() {
          return this._def.discriminator;
        }
        get options() {
          return this._def.options;
        }
        get optionsMap() {
          return this._def.optionsMap;
        }
        static create(e10, t10, r10) {
          let n10 = /* @__PURE__ */ new Map();
          for (let r11 of t10) {
            let t11 = rP(r11.shape[e10]);
            if (!t11.length) throw Error(`A discriminator value for key \`${e10}\` could not be extracted from all schema options`);
            for (let i10 of t11) {
              if (n10.has(i10)) throw Error(`Discriminator property ${String(e10)} has duplicate value ${String(i10)}`);
              n10.set(i10, r11);
            }
          }
          return new rN({ typeName: p.ZodDiscriminatedUnion, discriminator: e10, options: t10, optionsMap: n10, ...t6(r10) });
        }
      }
      class rj extends t7 {
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10), n10 = (e11, n11) => {
            if (t1(e11) || t1(n11)) return tJ;
            let i10 = function e12(t11, r11) {
              let n12 = tq(t11), i11 = tq(r11);
              if (t11 === r11) return { valid: true, data: t11 };
              if (n12 === tZ.object && i11 === tZ.object) {
                let n13 = u.objectKeys(r11), i12 = u.objectKeys(t11).filter((e13) => -1 !== n13.indexOf(e13)), a2 = { ...t11, ...r11 };
                for (let n14 of i12) {
                  let i13 = e12(t11[n14], r11[n14]);
                  if (!i13.valid) return { valid: false };
                  a2[n14] = i13.data;
                }
                return { valid: true, data: a2 };
              }
              if (n12 === tZ.array && i11 === tZ.array) {
                if (t11.length !== r11.length) return { valid: false };
                let n13 = [];
                for (let i12 = 0; i12 < t11.length; i12++) {
                  let a2 = e12(t11[i12], r11[i12]);
                  if (!a2.valid) return { valid: false };
                  n13.push(a2.data);
                }
                return { valid: true, data: n13 };
              }
              if (n12 === tZ.date && i11 === tZ.date && +t11 == +r11) return { valid: true, data: t11 };
              return { valid: false };
            }(e11.value, n11.value);
            return i10.valid ? ((t2(e11) || t2(n11)) && t10.dirty(), { status: t10.value, value: i10.data }) : (tG(r10, { code: tU.invalid_intersection_types }), tJ);
          };
          return r10.common.async ? Promise.all([this._def.left._parseAsync({ data: r10.data, path: r10.path, parent: r10 }), this._def.right._parseAsync({ data: r10.data, path: r10.path, parent: r10 })]).then(([e11, t11]) => n10(e11, t11)) : n10(this._def.left._parseSync({ data: r10.data, path: r10.path, parent: r10 }), this._def.right._parseSync({ data: r10.data, path: r10.path, parent: r10 }));
        }
      }
      rj.create = (e10, t10, r10) => new rj({ left: e10, right: t10, typeName: p.ZodIntersection, ...t6(r10) });
      class rM extends t7 {
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10);
          if (r10.parsedType !== tZ.array) return tG(r10, { code: tU.invalid_type, expected: tZ.array, received: r10.parsedType }), tJ;
          if (r10.data.length < this._def.items.length) return tG(r10, { code: tU.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), tJ;
          !this._def.rest && r10.data.length > this._def.items.length && (tG(r10, { code: tU.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t10.dirty());
          let n10 = [...r10.data].map((e11, t11) => {
            let n11 = this._def.items[t11] || this._def.rest;
            return n11 ? n11._parse(new t9(r10, e11, r10.path, t11)) : null;
          }).filter((e11) => !!e11);
          return r10.common.async ? Promise.all(n10).then((e11) => tY.mergeArray(t10, e11)) : tY.mergeArray(t10, n10);
        }
        get items() {
          return this._def.items;
        }
        rest(e10) {
          return new rM({ ...this._def, rest: e10 });
        }
      }
      rM.create = (e10, t10) => {
        if (!Array.isArray(e10)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
        return new rM({ items: e10, typeName: p.ZodTuple, rest: null, ...t6(t10) });
      };
      class rL extends t7 {
        get keySchema() {
          return this._def.keyType;
        }
        get valueSchema() {
          return this._def.valueType;
        }
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10);
          if (r10.parsedType !== tZ.object) return tG(r10, { code: tU.invalid_type, expected: tZ.object, received: r10.parsedType }), tJ;
          let n10 = [], i10 = this._def.keyType, a2 = this._def.valueType;
          for (let e11 in r10.data) n10.push({ key: i10._parse(new t9(r10, e11, r10.path, e11)), value: a2._parse(new t9(r10, r10.data[e11], r10.path, e11)), alwaysSet: e11 in r10.data });
          return r10.common.async ? tY.mergeObjectAsync(t10, n10) : tY.mergeObjectSync(t10, n10);
        }
        get element() {
          return this._def.valueType;
        }
        static create(e10, t10, r10) {
          return new rL(t10 instanceof t7 ? { keyType: e10, valueType: t10, typeName: p.ZodRecord, ...t6(r10) } : { keyType: ry.create(), valueType: e10, typeName: p.ZodRecord, ...t6(t10) });
        }
      }
      class rD extends t7 {
        get keySchema() {
          return this._def.keyType;
        }
        get valueSchema() {
          return this._def.valueType;
        }
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10);
          if (r10.parsedType !== tZ.map) return tG(r10, { code: tU.invalid_type, expected: tZ.map, received: r10.parsedType }), tJ;
          let n10 = this._def.keyType, i10 = this._def.valueType, a2 = [...r10.data.entries()].map(([e11, t11], a3) => ({ key: n10._parse(new t9(r10, e11, r10.path, [a3, "key"])), value: i10._parse(new t9(r10, t11, r10.path, [a3, "value"])) }));
          if (r10.common.async) {
            let e11 = /* @__PURE__ */ new Map();
            return Promise.resolve().then(async () => {
              for (let r11 of a2) {
                let n11 = await r11.key, i11 = await r11.value;
                if ("aborted" === n11.status || "aborted" === i11.status) return tJ;
                ("dirty" === n11.status || "dirty" === i11.status) && t10.dirty(), e11.set(n11.value, i11.value);
              }
              return { status: t10.value, value: e11 };
            });
          }
          {
            let e11 = /* @__PURE__ */ new Map();
            for (let r11 of a2) {
              let n11 = r11.key, i11 = r11.value;
              if ("aborted" === n11.status || "aborted" === i11.status) return tJ;
              ("dirty" === n11.status || "dirty" === i11.status) && t10.dirty(), e11.set(n11.value, i11.value);
            }
            return { status: t10.value, value: e11 };
          }
        }
      }
      rD.create = (e10, t10, r10) => new rD({ valueType: t10, keyType: e10, typeName: p.ZodMap, ...t6(r10) });
      class r$ extends t7 {
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10);
          if (r10.parsedType !== tZ.set) return tG(r10, { code: tU.invalid_type, expected: tZ.set, received: r10.parsedType }), tJ;
          let n10 = this._def;
          null !== n10.minSize && r10.data.size < n10.minSize.value && (tG(r10, { code: tU.too_small, minimum: n10.minSize.value, type: "set", inclusive: true, exact: false, message: n10.minSize.message }), t10.dirty()), null !== n10.maxSize && r10.data.size > n10.maxSize.value && (tG(r10, { code: tU.too_big, maximum: n10.maxSize.value, type: "set", inclusive: true, exact: false, message: n10.maxSize.message }), t10.dirty());
          let i10 = this._def.valueType;
          function a2(e11) {
            let r11 = /* @__PURE__ */ new Set();
            for (let n11 of e11) {
              if ("aborted" === n11.status) return tJ;
              "dirty" === n11.status && t10.dirty(), r11.add(n11.value);
            }
            return { status: t10.value, value: r11 };
          }
          let s2 = [...r10.data.values()].map((e11, t11) => i10._parse(new t9(r10, e11, r10.path, t11)));
          return r10.common.async ? Promise.all(s2).then((e11) => a2(e11)) : a2(s2);
        }
        min(e10, t10) {
          return new r$({ ...this._def, minSize: { value: e10, message: c.toString(t10) } });
        }
        max(e10, t10) {
          return new r$({ ...this._def, maxSize: { value: e10, message: c.toString(t10) } });
        }
        size(e10, t10) {
          return this.min(e10, t10).max(e10, t10);
        }
        nonempty(e10) {
          return this.min(1, e10);
        }
      }
      r$.create = (e10, t10) => new r$({ valueType: e10, minSize: null, maxSize: null, typeName: p.ZodSet, ...t6(t10) });
      class rZ extends t7 {
        constructor() {
          super(...arguments), this.validate = this.implement;
        }
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10);
          if (t10.parsedType !== tZ.function) return tG(t10, { code: tU.invalid_type, expected: tZ.function, received: t10.parsedType }), tJ;
          function r10(e11, r11) {
            return tK({ data: e11, path: t10.path, errorMaps: [t10.common.contextualErrorMap, t10.schemaErrorMap, tW, tB].filter((e12) => !!e12), issueData: { code: tU.invalid_arguments, argumentsError: r11 } });
          }
          function n10(e11, r11) {
            return tK({ data: e11, path: t10.path, errorMaps: [t10.common.contextualErrorMap, t10.schemaErrorMap, tW, tB].filter((e12) => !!e12), issueData: { code: tU.invalid_return_type, returnTypeError: r11 } });
          }
          let i10 = { errorMap: t10.common.contextualErrorMap }, a2 = t10.data;
          if (this._def.returns instanceof rW) {
            let e11 = this;
            return t0(async function(...t11) {
              let s2 = new tF([]), o2 = await e11._def.args.parseAsync(t11, i10).catch((e12) => {
                throw s2.addIssue(r10(t11, e12)), s2;
              }), l2 = await Reflect.apply(a2, this, o2);
              return await e11._def.returns._def.type.parseAsync(l2, i10).catch((e12) => {
                throw s2.addIssue(n10(l2, e12)), s2;
              });
            });
          }
          {
            let e11 = this;
            return t0(function(...t11) {
              let s2 = e11._def.args.safeParse(t11, i10);
              if (!s2.success) throw new tF([r10(t11, s2.error)]);
              let o2 = Reflect.apply(a2, this, s2.data), l2 = e11._def.returns.safeParse(o2, i10);
              if (!l2.success) throw new tF([n10(o2, l2.error)]);
              return l2.data;
            });
          }
        }
        parameters() {
          return this._def.args;
        }
        returnType() {
          return this._def.returns;
        }
        args(...e10) {
          return new rZ({ ...this._def, args: rM.create(e10).rest(rE.create()) });
        }
        returns(e10) {
          return new rZ({ ...this._def, returns: e10 });
        }
        implement(e10) {
          return this.parse(e10);
        }
        strictImplement(e10) {
          return this.parse(e10);
        }
        static create(e10, t10, r10) {
          return new rZ({ args: e10 || rM.create([]).rest(rE.create()), returns: t10 || rE.create(), typeName: p.ZodFunction, ...t6(r10) });
        }
      }
      class rq extends t7 {
        get schema() {
          return this._def.getter();
        }
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10);
          return this._def.getter()._parse({ data: t10.data, path: t10.path, parent: t10 });
        }
      }
      rq.create = (e10, t10) => new rq({ getter: e10, typeName: p.ZodLazy, ...t6(t10) });
      class rU extends t7 {
        _parse(e10) {
          if (e10.data !== this._def.value) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { received: t10.data, code: tU.invalid_literal, expected: this._def.value }), tJ;
          }
          return { status: "valid", value: e10.data };
        }
        get value() {
          return this._def.value;
        }
      }
      function rz(e10, t10) {
        return new rF({ values: e10, typeName: p.ZodEnum, ...t6(t10) });
      }
      rU.create = (e10, t10) => new rU({ value: e10, typeName: p.ZodLiteral, ...t6(t10) });
      class rF extends t7 {
        _parse(e10) {
          if ("string" != typeof e10.data) {
            let t10 = this._getOrReturnCtx(e10), r10 = this._def.values;
            return tG(t10, { expected: u.joinValues(r10), received: t10.parsedType, code: tU.invalid_type }), tJ;
          }
          if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e10.data)) {
            let t10 = this._getOrReturnCtx(e10), r10 = this._def.values;
            return tG(t10, { received: t10.data, code: tU.invalid_enum_value, options: r10 }), tJ;
          }
          return t0(e10.data);
        }
        get options() {
          return this._def.values;
        }
        get enum() {
          let e10 = {};
          for (let t10 of this._def.values) e10[t10] = t10;
          return e10;
        }
        get Values() {
          let e10 = {};
          for (let t10 of this._def.values) e10[t10] = t10;
          return e10;
        }
        get Enum() {
          let e10 = {};
          for (let t10 of this._def.values) e10[t10] = t10;
          return e10;
        }
        extract(e10, t10 = this._def) {
          return rF.create(e10, { ...this._def, ...t10 });
        }
        exclude(e10, t10 = this._def) {
          return rF.create(this.options.filter((t11) => !e10.includes(t11)), { ...this._def, ...t10 });
        }
      }
      rF.create = rz;
      class rB extends t7 {
        _parse(e10) {
          let t10 = u.getValidEnumValues(this._def.values), r10 = this._getOrReturnCtx(e10);
          if (r10.parsedType !== tZ.string && r10.parsedType !== tZ.number) {
            let e11 = u.objectValues(t10);
            return tG(r10, { expected: u.joinValues(e11), received: r10.parsedType, code: tU.invalid_type }), tJ;
          }
          if (this._cache || (this._cache = new Set(u.getValidEnumValues(this._def.values))), !this._cache.has(e10.data)) {
            let e11 = u.objectValues(t10);
            return tG(r10, { received: r10.data, code: tU.invalid_enum_value, options: e11 }), tJ;
          }
          return t0(e10.data);
        }
        get enum() {
          return this._def.values;
        }
      }
      rB.create = (e10, t10) => new rB({ values: e10, typeName: p.ZodNativeEnum, ...t6(t10) });
      class rW extends t7 {
        unwrap() {
          return this._def.type;
        }
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10);
          return t10.parsedType !== tZ.promise && false === t10.common.async ? (tG(t10, { code: tU.invalid_type, expected: tZ.promise, received: t10.parsedType }), tJ) : t0((t10.parsedType === tZ.promise ? t10.data : Promise.resolve(t10.data)).then((e11) => this._def.type.parseAsync(e11, { path: t10.path, errorMap: t10.common.contextualErrorMap })));
        }
      }
      rW.create = (e10, t10) => new rW({ type: e10, typeName: p.ZodPromise, ...t6(t10) });
      class rV extends t7 {
        innerType() {
          return this._def.schema;
        }
        sourceType() {
          return this._def.schema._def.typeName === p.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
        }
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10), n10 = this._def.effect || null, i10 = { addIssue: (e11) => {
            tG(r10, e11), e11.fatal ? t10.abort() : t10.dirty();
          }, get path() {
            return r10.path;
          } };
          if (i10.addIssue = i10.addIssue.bind(i10), "preprocess" === n10.type) {
            let e11 = n10.transform(r10.data, i10);
            if (r10.common.async) return Promise.resolve(e11).then(async (e12) => {
              if ("aborted" === t10.value) return tJ;
              let n11 = await this._def.schema._parseAsync({ data: e12, path: r10.path, parent: r10 });
              return "aborted" === n11.status ? tJ : "dirty" === n11.status || "dirty" === t10.value ? tQ(n11.value) : n11;
            });
            {
              if ("aborted" === t10.value) return tJ;
              let n11 = this._def.schema._parseSync({ data: e11, path: r10.path, parent: r10 });
              return "aborted" === n11.status ? tJ : "dirty" === n11.status || "dirty" === t10.value ? tQ(n11.value) : n11;
            }
          }
          if ("refinement" === n10.type) {
            let e11 = (e12) => {
              let t11 = n10.refinement(e12, i10);
              if (r10.common.async) return Promise.resolve(t11);
              if (t11 instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
              return e12;
            };
            if (false !== r10.common.async) return this._def.schema._parseAsync({ data: r10.data, path: r10.path, parent: r10 }).then((r11) => "aborted" === r11.status ? tJ : ("dirty" === r11.status && t10.dirty(), e11(r11.value).then(() => ({ status: t10.value, value: r11.value }))));
            {
              let n11 = this._def.schema._parseSync({ data: r10.data, path: r10.path, parent: r10 });
              return "aborted" === n11.status ? tJ : ("dirty" === n11.status && t10.dirty(), e11(n11.value), { status: t10.value, value: n11.value });
            }
          }
          if ("transform" === n10.type) if (false !== r10.common.async) return this._def.schema._parseAsync({ data: r10.data, path: r10.path, parent: r10 }).then((e11) => t4(e11) ? Promise.resolve(n10.transform(e11.value, i10)).then((e12) => ({ status: t10.value, value: e12 })) : tJ);
          else {
            let e11 = this._def.schema._parseSync({ data: r10.data, path: r10.path, parent: r10 });
            if (!t4(e11)) return tJ;
            let a2 = n10.transform(e11.value, i10);
            if (a2 instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
            return { status: t10.value, value: a2 };
          }
          u.assertNever(n10);
        }
      }
      rV.create = (e10, t10, r10) => new rV({ schema: e10, typeName: p.ZodEffects, effect: t10, ...t6(r10) }), rV.createWithPreprocess = (e10, t10, r10) => new rV({ schema: t10, effect: { type: "preprocess", transform: e10 }, typeName: p.ZodEffects, ...t6(r10) });
      class rH extends t7 {
        _parse(e10) {
          return this._getType(e10) === tZ.undefined ? t0(void 0) : this._def.innerType._parse(e10);
        }
        unwrap() {
          return this._def.innerType;
        }
      }
      rH.create = (e10, t10) => new rH({ innerType: e10, typeName: p.ZodOptional, ...t6(t10) });
      class rK extends t7 {
        _parse(e10) {
          return this._getType(e10) === tZ.null ? t0(null) : this._def.innerType._parse(e10);
        }
        unwrap() {
          return this._def.innerType;
        }
      }
      rK.create = (e10, t10) => new rK({ innerType: e10, typeName: p.ZodNullable, ...t6(t10) });
      class rX extends t7 {
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10), r10 = t10.data;
          return t10.parsedType === tZ.undefined && (r10 = this._def.defaultValue()), this._def.innerType._parse({ data: r10, path: t10.path, parent: t10 });
        }
        removeDefault() {
          return this._def.innerType;
        }
      }
      rX.create = (e10, t10) => new rX({ innerType: e10, typeName: p.ZodDefault, defaultValue: "function" == typeof t10.default ? t10.default : () => t10.default, ...t6(t10) });
      class rG extends t7 {
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10), r10 = { ...t10, common: { ...t10.common, issues: [] } }, n10 = this._def.innerType._parse({ data: r10.data, path: r10.path, parent: { ...r10 } });
          return t3(n10) ? n10.then((e11) => ({ status: "valid", value: "valid" === e11.status ? e11.value : this._def.catchValue({ get error() {
            return new tF(r10.common.issues);
          }, input: r10.data }) })) : { status: "valid", value: "valid" === n10.status ? n10.value : this._def.catchValue({ get error() {
            return new tF(r10.common.issues);
          }, input: r10.data }) };
        }
        removeCatch() {
          return this._def.innerType;
        }
      }
      rG.create = (e10, t10) => new rG({ innerType: e10, typeName: p.ZodCatch, catchValue: "function" == typeof t10.catch ? t10.catch : () => t10.catch, ...t6(t10) });
      class rY extends t7 {
        _parse(e10) {
          if (this._getType(e10) !== tZ.nan) {
            let t10 = this._getOrReturnCtx(e10);
            return tG(t10, { code: tU.invalid_type, expected: tZ.nan, received: t10.parsedType }), tJ;
          }
          return { status: "valid", value: e10.data };
        }
      }
      rY.create = (e10) => new rY({ typeName: p.ZodNaN, ...t6(e10) });
      let rJ = Symbol("zod_brand");
      class rQ extends t7 {
        _parse(e10) {
          let { ctx: t10 } = this._processInputParams(e10), r10 = t10.data;
          return this._def.type._parse({ data: r10, path: t10.path, parent: t10 });
        }
        unwrap() {
          return this._def.type;
        }
      }
      class r0 extends t7 {
        _parse(e10) {
          let { status: t10, ctx: r10 } = this._processInputParams(e10);
          if (r10.common.async) return (async () => {
            let e11 = await this._def.in._parseAsync({ data: r10.data, path: r10.path, parent: r10 });
            return "aborted" === e11.status ? tJ : "dirty" === e11.status ? (t10.dirty(), tQ(e11.value)) : this._def.out._parseAsync({ data: e11.value, path: r10.path, parent: r10 });
          })();
          {
            let e11 = this._def.in._parseSync({ data: r10.data, path: r10.path, parent: r10 });
            return "aborted" === e11.status ? tJ : "dirty" === e11.status ? (t10.dirty(), { status: "dirty", value: e11.value }) : this._def.out._parseSync({ data: e11.value, path: r10.path, parent: r10 });
          }
        }
        static create(e10, t10) {
          return new r0({ in: e10, out: t10, typeName: p.ZodPipeline });
        }
      }
      class r1 extends t7 {
        _parse(e10) {
          let t10 = this._def.innerType._parse(e10), r10 = (e11) => (t4(e11) && (e11.value = Object.freeze(e11.value)), e11);
          return t3(t10) ? t10.then((e11) => r10(e11)) : r10(t10);
        }
        unwrap() {
          return this._def.innerType;
        }
      }
      function r2(e10, t10) {
        let r10 = "function" == typeof e10 ? e10(t10) : "string" == typeof e10 ? { message: e10 } : e10;
        return "string" == typeof r10 ? { message: r10 } : r10;
      }
      function r4(e10, t10 = {}, r10) {
        return e10 ? rT.create().superRefine((n10, i10) => {
          let a2 = e10(n10);
          if (a2 instanceof Promise) return a2.then((e11) => {
            if (!e11) {
              let e12 = r2(t10, n10), a3 = e12.fatal ?? r10 ?? true;
              i10.addIssue({ code: "custom", ...e12, fatal: a3 });
            }
          });
          if (!a2) {
            let e11 = r2(t10, n10), a3 = e11.fatal ?? r10 ?? true;
            i10.addIssue({ code: "custom", ...e11, fatal: a3 });
          }
        }) : rT.create();
      }
      r1.create = (e10, t10) => new r1({ innerType: e10, typeName: p.ZodReadonly, ...t6(t10) });
      let r3 = { object: rI.lazycreate };
      !function(e10) {
        e10.ZodString = "ZodString", e10.ZodNumber = "ZodNumber", e10.ZodNaN = "ZodNaN", e10.ZodBigInt = "ZodBigInt", e10.ZodBoolean = "ZodBoolean", e10.ZodDate = "ZodDate", e10.ZodSymbol = "ZodSymbol", e10.ZodUndefined = "ZodUndefined", e10.ZodNull = "ZodNull", e10.ZodAny = "ZodAny", e10.ZodUnknown = "ZodUnknown", e10.ZodNever = "ZodNever", e10.ZodVoid = "ZodVoid", e10.ZodArray = "ZodArray", e10.ZodObject = "ZodObject", e10.ZodUnion = "ZodUnion", e10.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e10.ZodIntersection = "ZodIntersection", e10.ZodTuple = "ZodTuple", e10.ZodRecord = "ZodRecord", e10.ZodMap = "ZodMap", e10.ZodSet = "ZodSet", e10.ZodFunction = "ZodFunction", e10.ZodLazy = "ZodLazy", e10.ZodLiteral = "ZodLiteral", e10.ZodEnum = "ZodEnum", e10.ZodEffects = "ZodEffects", e10.ZodNativeEnum = "ZodNativeEnum", e10.ZodOptional = "ZodOptional", e10.ZodNullable = "ZodNullable", e10.ZodDefault = "ZodDefault", e10.ZodCatch = "ZodCatch", e10.ZodPromise = "ZodPromise", e10.ZodBranded = "ZodBranded", e10.ZodPipeline = "ZodPipeline", e10.ZodReadonly = "ZodReadonly";
      }(p || (p = {}));
      let r9 = (e10, t10 = { message: `Input not instance of ${e10.name}` }) => r4((t11) => t11 instanceof e10, t10), r5 = ry.create, r6 = rv.create, r7 = rY.create, r8 = r_.create, ne = rb.create, nt = rw.create, nr = rx.create, nn = rS.create, ni = rk.create, na = rT.create, ns = rE.create, no = rR.create, nl = rC.create, nu = rO.create, nd = rI.create, nc = rI.strictCreate, np = rA.create, nh = rN.create, nm = rj.create, nf = rM.create, ng = rL.create, ny = rD.create, nv = r$.create, n_ = rZ.create, nb = rq.create, nw = rU.create, nx = rF.create, nS = rB.create, nk = rW.create, nT = rV.create, nE = rH.create, nR = rK.create, nC = rV.createWithPreprocess, nO = r0.create, nI = () => r5().optional(), nA = () => r6().optional(), nP = () => ne().optional(), nN = { string: (e10) => ry.create({ ...e10, coerce: true }), number: (e10) => rv.create({ ...e10, coerce: true }), boolean: (e10) => rb.create({ ...e10, coerce: true }), bigint: (e10) => r_.create({ ...e10, coerce: true }), date: (e10) => rw.create({ ...e10, coerce: true }) }, nj = tJ, nM = Symbol("current"), nL = Symbol("previous"), nD = (e10, { ref: t10, refType: r10, param: n10, header: i10, ...a2 } = {}) => ({ ...a2, ...e10 });
      !function(e10) {
        if (void 0 !== e10.ZodType.prototype.openapi) return;
        e10.ZodType.prototype.openapi = function(e11) {
          let { zodOpenApi: t11, ...r11 } = this._def, n11 = new this.constructor({ ...r11, zodOpenApi: { openapi: nD(e11, null == t11 ? void 0 : t11.openapi) } });
          return n11._def.zodOpenApi[nM] = n11, t11 && (n11._def.zodOpenApi[nL] = this), n11;
        };
        let t10 = e10.ZodType.prototype.describe;
        e10.ZodType.prototype.describe = function(...e11) {
          let r11 = t10.apply(this, e11), n11 = r11._def;
          if (n11.zodOpenApi) {
            let t11 = { ...n11.zodOpenApi };
            t11.openapi = nD({ description: e11[0] }, t11.openapi), t11[nL] = this, t11[nM] = r11, n11.zodOpenApi = t11;
          } else n11.zodOpenApi = { openapi: { description: e11[0] }, [nM]: r11 };
          return r11;
        };
        let r10 = e10.ZodObject.prototype.extend;
        e10.ZodObject.prototype.extend = function(...e11) {
          let t11 = r10.apply(this, e11), n11 = t11._def.zodOpenApi;
          if (n11) {
            let e12 = { ...n11 };
            e12.openapi = nD({}, e12.openapi), e12[nL] = this, t11._def.zodOpenApi = e12;
          } else t11._def.zodOpenApi = { [nL]: this };
          return t11;
        };
        let n10 = e10.ZodObject.prototype.omit;
        e10.ZodObject.prototype.omit = function(...e11) {
          let t11 = n10.apply(this, e11), r11 = t11._def.zodOpenApi;
          if (r11) {
            let e12 = { ...r11 };
            e12.openapi = nD({}, e12.openapi), delete e12[nL], delete e12[nM], t11._def.zodOpenApi = e12;
          }
          return t11;
        };
        let i10 = e10.ZodObject.prototype.pick;
        e10.ZodObject.prototype.pick = function(...e11) {
          let t11 = i10.apply(this, e11), r11 = t11._def.zodOpenApi;
          if (r11) {
            let e12 = { ...r11 };
            e12.openapi = nD({}, e12.openapi), delete e12[nL], delete e12[nM], t11._def.zodOpenApi = e12;
          }
          return t11;
        };
      }(h);
      let n$ = ng(np([r5(), r6(), ne()])), nZ = nx(["public", "private", "unlisted"]), nq = nx(["text", "pdf", "tweet", "google_doc", "google_slide", "google_sheet", "image", "video", "notion_doc", "webpage", "onedrive"]), nU = nx(["unknown", "queued", "extracting", "chunking", "embedding", "indexing", "done", "failed"]), nz = nd({ name: r5(), startTime: r6(), endTime: r6().optional(), status: nx(["completed", "failed", "pending"]), error: r5().optional(), metadata: ng(ns()).optional(), finalStatus: nx(["done", "failed"]).optional() }), nF = nd({ startTime: r6(), endTime: r6().optional(), duration: r6().optional(), error: r5().optional(), finalStatus: nx(["completed", "failed", "done"]).optional(), chunkingStrategy: r5().optional(), tokenCount: r6().optional(), steps: nu(nz) }), nB = nd({ id: r5(), customId: r5().nullable().optional(), contentHash: r5().nullable().optional(), orgId: r5(), userId: r5(), connectionId: r5().nullable().optional(), title: r5().nullable().optional(), content: r5().nullable().optional(), summary: r5().nullable().optional(), url: r5().nullable().optional(), source: r5().nullable().optional(), type: nq.default("text"), status: nU.default("unknown"), metadata: n$.nullable().optional(), processingMetadata: nF.nullable().optional(), raw: na().nullable().optional(), ogImage: r5().nullable().optional(), tokenCount: r6().nullable().optional(), wordCount: r6().nullable().optional(), chunkCount: r6().default(0), averageChunkSize: r6().nullable().optional(), summaryEmbedding: nu(r6()).nullable().optional(), summaryEmbeddingModel: r5().nullable().optional(), summaryEmbeddingNew: nu(r6()).nullable().optional(), summaryEmbeddingModelNew: r5().nullable().optional(), createdAt: nN.date(), updatedAt: nN.date() }), nW = nx(["text", "image"]);
      nd({ id: r5(), documentId: r5(), content: r5(), embeddedContent: r5().nullable().optional(), type: nW.default("text"), position: r6(), metadata: n$.nullable().optional(), embedding: nu(r6()).nullable().optional(), embeddingModel: r5().nullable().optional(), embeddingNew: nu(r6()).nullable().optional(), embeddingNewModel: r5().nullable().optional(), matryokshaEmbedding: nu(r6()).nullable().optional(), matryokshaEmbeddingModel: r5().nullable().optional(), createdAt: nN.date() });
      let nV = nx(["notion", "google-drive", "onedrive"]);
      nd({ stateToken: r5(), provider: nV, orgId: r5(), userId: r5(), connectionId: r5(), documentLimit: r6().default(1e4), redirectUrl: r5().nullable().optional(), metadata: n$, containerTags: nu(r5()).nullable().optional(), createdAt: nN.date(), expiresAt: nN.date().nullable().optional() }), nd({ id: r5(), provider: nV, orgId: r5(), userId: r5(), email: r5().nullable().optional(), documentLimit: r6().default(1e4), containerTags: nu(r5()).nullable().optional(), accessToken: r5().nullable().optional(), refreshToken: r5().nullable().optional(), expiresAt: nN.date().nullable().optional(), metadata: ng(ns()), createdAt: nN.date() });
      let nH = nx(["add", "search", "fast_search", "request", "update", "delete", "chat", "search_v4"]);
      nd({ id: r5(), type: nH, orgId: r5(), userId: r5(), keyId: r5().nullable().optional(), statusCode: r6(), duration: r6().nullable().optional(), input: ng(ns()).nullable().optional(), output: ng(ns()).nullable().optional(), originalTokens: r6().nullable().optional(), finalTokens: r6().nullable().optional(), tokensSaved: r6().nullable().optional(), costSavedUSD: r6().nullable().optional(), model: r5().nullable().optional(), provider: r5().nullable().optional(), conversationId: r5().nullable().optional(), contextModified: ne().default(false), metadata: n$.nullable().optional(), origin: r5().default("api"), createdAt: nN.date() }), nd({ id: r5(), name: r5().nullable().optional(), description: r5().nullable().optional(), orgId: r5(), ownerId: r5(), containerTag: r5().nullable().optional(), visibility: nZ.default("private"), isExperimental: ne().default(false), contentTextIndex: ng(ns()).default({}), indexSize: r6().nullable().optional(), metadata: n$.nullable().optional(), createdAt: nN.date(), updatedAt: nN.date() });
      let nK = nx(["updates", "extends", "derives"]), nX = nd({ id: r5(), memory: r5(), spaceId: r5(), orgId: r5(), userId: r5().nullable().optional(), version: r6().default(1), isLatest: ne().default(true), parentMemoryId: r5().nullable().optional(), rootMemoryId: r5().nullable().optional(), memoryRelations: ng(nK).default({}), sourceCount: r6().default(1), isInference: ne().default(false), isForgotten: ne().default(false), forgetAfter: nN.date().nullable().optional(), forgetReason: r5().nullable().optional(), memoryEmbedding: nu(r6()).nullable().optional(), memoryEmbeddingModel: r5().nullable().optional(), memoryEmbeddingNew: nu(r6()).nullable().optional(), memoryEmbeddingNewModel: r5().nullable().optional(), metadata: ng(ns()).nullable().optional(), createdAt: nN.date(), updatedAt: nN.date() });
      nd({ documentId: r5(), spaceId: r5() }), nd({ memoryEntryId: r5(), documentId: r5(), relevanceScore: r6().default(100), metadata: ng(ns()).nullable().optional(), addedAt: nN.date() });
      let nG = nx(["owner", "admin", "editor", "viewer"]);
      nd({ spaceId: r5(), userId: r5(), role: nG.default("viewer"), metadata: n$.nullable().optional(), createdAt: nN.date(), updatedAt: nN.date() });
      let nY = nd({ id: r5(), orgId: r5(), shouldLLMFilter: ne().default(false), filterPrompt: r5().nullable().optional(), includeItems: nu(r5()).nullable().optional(), excludeItems: nu(r5()).nullable().optional(), googleDriveCustomKeyEnabled: ne().default(false), googleDriveClientId: r5().nullable().optional(), googleDriveClientSecret: r5().nullable().optional(), notionCustomKeyEnabled: ne().default(false), notionClientId: r5().nullable().optional(), notionClientSecret: r5().nullable().optional(), onedriveCustomKeyEnabled: ne().default(false), onedriveClientId: r5().nullable().optional(), onedriveClientSecret: r5().nullable().optional(), updatedAt: nN.date() }), nJ = nd({ AND: nu(ns()).optional(), OR: nu(ns()).optional() }).or(ng(ns())), nQ = { category: "technology", isPublic: true, readingTime: 5, source: "web", tag_1: "ai", tag_2: "machine-learning" }, n0 = { connectionId: "conn_123", containerTags: ["user_123", "project_123"], content: "This is a detailed article about machine learning concepts...", createdAt: (/* @__PURE__ */ new Date()).toISOString(), customId: "mem_abc123", id: "acxV5LHMEsG2hMSNb4umbn", metadata: nQ, ogImage: "https://example.com/image.jpg", raw: "This is a detailed article about machine learning concepts...", source: "web", status: "done", summary: "A comprehensive guide to understanding the basics of machine learning and its applications.", title: "Introduction to Machine Learning", tokenCount: 1e3, type: "text", updatedAt: (/* @__PURE__ */ new Date()).toISOString(), url: "https://example.com/article" }, n1 = nd({ id: r5().openapi({ description: "Unique identifier of the memory.", example: "acxV5LHMEsG2hMSNb4umbn" }), customId: r5().nullable().optional().openapi({ description: "Optional custom ID of the memory. This could be an ID from your database that will uniquely identify this memory.", example: "mem_abc123" }), connectionId: r5().nullable().optional().openapi({ description: "Optional ID of connection the memory was created from. This is useful for identifying the source of the memory.", example: "conn_123" }), content: r5().nullable().optional().openapi({ description: "The content to extract and process into a memory. This can be a URL to a website, a PDF, an image, or a video. \n\nPlaintext: Any plaintext format\n\nURL: A URL to a website, PDF, image, or video\n\nWe automatically detect the content type from the url's response format.", examples: ["This is a detailed article about machine learning concepts...", "https://example.com/article", "https://youtube.com/watch?v=abc123", "https://example.com/audio.mp3", "https://aws-s3.com/bucket/file.pdf", "https://example.com/image.jpg"] }), metadata: n$.nullable().optional().openapi({ description: "Optional metadata for the memory. This is used to store additional information about the memory. You can use this to store any additional information you need about the memory. Metadata can be filtered through. Keys must be strings and are case sensitive. Values can be strings, numbers, or booleans. You cannot nest objects.", example: nQ }), source: r5().nullable().optional().openapi({ description: "Source of the memory", example: "web" }), status: nB.shape.status.openapi({ description: "Status of the memory", example: "done" }), summary: r5().nullable().optional().openapi({ description: "Summary of the memory content", example: "A comprehensive guide to understanding the basics of machine learning and its applications." }), title: r5().nullable().optional().openapi({ description: "Title of the memory", example: "Introduction to Machine Learning" }), type: nB.shape.type.openapi({ description: "Type of the memory", example: "text" }), url: r5().nullable().optional().openapi({ description: "URL of the memory", example: "https://example.com/article" }), createdAt: r5().openapi({ description: "Creation timestamp", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), updatedAt: r5().openapi({ description: "Last update timestamp", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), containerTags: nu(r5()).optional().readonly().openapi({ description: "Optional tags this memory should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group memories.", example: ["user_123", "project_123"] }), chunkCount: r6().default(0).openapi({ description: "Number of chunks in the memory", example: 10 }) }).openapi({ description: "Memory object", example: n0 }), n2 = nd({ containerTags: nu(r5()).optional().openapi({ description: "Optional tags this memory should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group memories.", example: ["user_123", "project_123"] }), content: r5().optional().openapi({ description: "The content to extract and process into a memory. This can be a URL to a website, a PDF, an image, or a video. \n\nPlaintext: Any plaintext format\n\nURL: A URL to a website, PDF, image, or video\n\nWe automatically detect the content type from the url's response format.", example: "This is a detailed article about machine learning concepts..." }), customId: r5().optional().openapi({ description: "Optional custom ID of the memory. This could be an ID from your database that will uniquely identify this memory.", example: "mem_abc123" }), metadata: n$.optional().openapi({ description: "Optional metadata for the memory. This is used to store additional information about the memory. You can use this to store any additional information you need about the memory. Metadata can be filtered through. Keys must be strings and are case sensitive. Values can be strings, numbers, or booleans. You cannot nest objects.", example: nQ }) }), n4 = nd({ currentPage: r6(), limit: r6().max(1100).default(10), totalItems: r6(), totalPages: r6() }).openapi({ description: "Pagination metadata", example: { currentPage: 1, limit: 10, totalItems: 100, totalPages: 10 } }), n3 = nd({ memories: nu(n1.pick({ connectionId: true, containerTags: true, createdAt: true, customId: true, id: true, metadata: true, status: true, summary: true, title: true, type: true, updatedAt: true })), pagination: n4 }).openapi({ description: "List of memories", example: { memories: [{ connectionId: n0.connectionId, containerTags: n0.containerTags, createdAt: n0.createdAt, customId: n0.customId, id: n0.id, metadata: n0.metadata, status: n0.status, summary: n0.summary, title: n0.title, type: n0.type, updatedAt: n0.updatedAt }], pagination: { currentPage: 1, limit: 10, totalItems: 100, totalPages: 10 } } });
      nd({ containerTags: nu(r5()).optional().openapi({ description: "Optional tags this memory should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group memories.", example: ["user_123", "project_123"] }), filters: r5().optional().openapi({ description: "Optional filters to apply to the search", example: JSON.stringify({ AND: [{ key: "group", negate: false, value: "jira_users" }, { filterType: "numeric", key: "timestamp", negate: false, numericOperator: ">", value: "1742745777" }] }) }), limit: r5().regex(/^\d+$/).or(r6()).transform(Number).refine((e10) => e10 <= 1100, { message: "Limit cannot be greater than 1100" }).default("10").openapi({ description: "Number of items per page", example: "10" }), order: nx(["asc", "desc"]).default("desc").openapi({ description: "Sort order", example: "desc" }), page: r5().regex(/^\d+$/).or(r6()).transform(Number).default("1").openapi({ description: "Page number to fetch", example: "1" }), sort: nx(["createdAt", "updatedAt"]).default("createdAt").openapi({ description: "Field to sort by", example: "createdAt" }) }).openapi({ description: "Query parameters for listing memories", example: { filters: JSON.stringify({ AND: [{ key: "group", negate: false, value: "jira_users" }, { filterType: "numeric", key: "timestamp", negate: false, numericOperator: ">", value: "1742745777" }] }), limit: 10, order: "desc", page: 1, sort: "createdAt" } });
      let n9 = nd({ id: r5(), status: r5() }), n5 = nd({ categoriesFilter: nu(r5()).optional().openapi({ description: "Optional category filters", example: ["technology", "science"], items: { enum: ["technology", "science", "business", "health"] }, deprecated: true }), chunkThreshold: r6().optional().default(0).refine((e10) => void 0 === e10 || e10 >= 0 && e10 <= 1, { message: "chunkThreshold must be between 0 and 1", params: { max: 1, min: 0 } }).transform(Number).openapi({ description: "Threshold / sensitivity for chunk selection. 0 is least sensitive (returns most chunks, more results), 1 is most sensitive (returns lesser chunks, accurate results)", example: 0.5, maximum: 1, minimum: 0 }), containerTags: nu(r5()).optional().openapi({ description: "Optional tags this search should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to filter memories.", example: ["user_123", "project_123"] }), docId: r5().max(255).optional().openapi({ description: "Optional document ID to search within. You can use this to find chunks in a very large document.", example: "doc_xyz789" }), documentThreshold: r6().optional().default(0).refine((e10) => void 0 === e10 || e10 >= 0 && e10 <= 1, { message: "documentThreshold must be between 0 and 1", params: { max: 1, min: 0 } }).transform(Number).openapi({ description: "Threshold / sensitivity for document selection. 0 is least sensitive (returns most documents, more results), 1 is most sensitive (returns lesser documents, accurate results)", example: 0.5, maximum: 1, minimum: 0 }), filters: nJ.optional().openapi({ description: "Optional filters to apply to the search", example: { AND: [{ key: "group", negate: false, value: "jira_users" }, { filterType: "numeric", key: "timestamp", negate: false, numericOperator: ">", value: "1742745777" }] } }), includeFullDocs: ne().optional().default(false).openapi({ description: "If true, include full document in the response. This is helpful if you want a chatbot to know the full context of the document. ", example: false }), includeSummary: ne().optional().default(false).openapi({ description: "If true, include document summary in the response. This is helpful if you want a chatbot to know the full context of the document. ", example: false }), limit: r6().int().positive().optional().default(10).refine((e10) => void 0 === e10 || e10 > 0 && e10 <= 100, { message: "limit must be between 1 and 100", params: { max: 100, min: 1 } }).openapi({ description: "Maximum number of results to return", example: 10, maximum: 100, minimum: 1 }), onlyMatchingChunks: ne().optional().default(true).openapi({ description: "If true, only return matching chunks without context. Normally, we send the previous and next chunk to provide more context for LLMs. If you only want the matching chunk, set this to true.", example: false }), q: r5().min(1).openapi({ description: "Search query string", example: "machine learning concepts", minLength: 1 }), rerank: ne().optional().default(false).openapi({ description: "If true, rerank the results based on the query. This is helpful if you want to ensure the most relevant results are returned.", example: false }), rewriteQuery: ne().optional().default(false).openapi({ description: "If true, rewrites the query to make it easier to find documents. This increases the latency by about 400ms", example: false }) });
      nd({ containerTag: r5().optional().openapi({ description: "Optional tag this search should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to filter memories.", example: "user_123" }), threshold: r6().optional().default(0.6).refine((e10) => void 0 === e10 || e10 >= 0 && e10 <= 1, { message: "documentThreshold must be between 0 and 1", params: { max: 1, min: 0 } }).transform(Number).openapi({ description: "Threshold / sensitivity for memories selection. 0 is least sensitive (returns most memories, more results), 1 is most sensitive (returns lesser memories, accurate results)", example: 0.5, maximum: 1, minimum: 0 }), filters: nJ.optional().openapi({ description: "Optional filters to apply to the search", example: { AND: [{ key: "group", negate: false, value: "jira_users" }, { filterType: "numeric", key: "timestamp", negate: false, numericOperator: ">", value: "1742745777" }] } }), include: nd({ documents: ne().default(false), summaries: ne().default(false), relatedMemories: ne().default(false) }).optional().default({ documents: false, summaries: false }), limit: r6().int().positive().optional().default(10).refine((e10) => void 0 === e10 || e10 > 0 && e10 <= 100, { message: "limit must be between 1 and 100", params: { max: 100, min: 1 } }).openapi({ description: "Maximum number of results to return", example: 10, maximum: 100, minimum: 1 }), q: r5().min(1).openapi({ description: "Search query string", example: "machine learning concepts", minLength: 1 }), rerank: ne().optional().default(false).openapi({ description: "If true, rerank the results based on the query. This is helpful if you want to ensure the most relevant results are returned.", example: false }), rewriteQuery: ne().optional().default(false).openapi({ description: "If true, rewrites the query to make it easier to find documents. This increases the latency by about 400ms", example: false }) });
      let n6 = nd({ chunks: nu(nd({ content: r5().openapi({ description: "Content of the matching chunk", example: "Machine learning is a subset of artificial intelligence..." }), isRelevant: ne().openapi({ description: "Whether this chunk is relevant to the query", example: true }), score: r6().openapi({ description: "Similarity score for this chunk", example: 0.85, maximum: 1, minimum: 0 }) }).openapi({ description: "Matching content chunk", example: { content: "Machine learning is a subset of artificial intelligence...", isRelevant: true, score: 0.85 } })).openapi({ description: "Matching content chunks from the document", example: [{ content: "Machine learning is a subset of artificial intelligence...", isRelevant: true, score: 0.85 }] }), createdAt: nN.date().openapi({ description: "Document creation date", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), documentId: r5().openapi({ description: "ID of the matching document", example: "doc_xyz789" }), metadata: ng(ns()).nullable().openapi({ description: "Document metadata", example: nQ }), score: r6().openapi({ description: "Relevance score of the match", example: 0.95, maximum: 1, minimum: 0 }), summary: r5().nullable().optional().openapi({ description: "Document summary", example: "A comprehensive guide to understanding the basics of machine learning and its applications." }), content: r5().nullable().optional().openapi({ description: "Full document content (only included when includeFullDocs=true)", example: "This is the complete content of the document about machine learning concepts..." }), title: r5().nullable().openapi({ description: "Document title", example: "Introduction to Machine Learning" }), updatedAt: nN.date().openapi({ description: "Document last update date", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), type: r5().nullable().openapi({ description: "Document type", example: "web" }) }), n7 = nd({ results: nu(n6), timing: r6(), total: r6() }), n8 = nd({ id: r5().openapi({ description: "Document ID", example: "doc_xyz789" }), title: r5().openapi({ description: "Document title", example: "Introduction to Machine Learning" }), type: r5().openapi({ description: "Document type", example: "web" }), metadata: ng(ns()).nullable().openapi({ description: "Document metadata", example: nQ }), createdAt: nN.date().openapi({ description: "Document creation date", format: "date-time" }), updatedAt: nN.date().openapi({ description: "Document last update date", format: "date-time" }) }), ie = nd({ id: r5().openapi({ description: "Memory entry ID", example: "mem_abc123" }), memory: r5().openapi({ description: "The memory content", example: "John prefers machine learning over traditional programming" }), metadata: ng(ns()).nullable().openapi({ description: "Memory metadata", example: { source: "conversation", confidence: 0.9 } }), updatedAt: nN.date().openapi({ description: "Memory last update date", format: "date-time" }), similarity: r6().openapi({ description: "Similarity score between the query and memory entry", example: 0.89, maximum: 1, minimum: 0 }), version: r6().nullable().optional().openapi({ description: "Version number of this memory entry", example: 3 }), context: nd({ parents: nu(nd({ relation: nx(["updates", "extends", "derives"]).openapi({ description: "Relation type between this memory and its parent/child", example: "updates" }), version: r6().nullable().optional().openapi({ description: "Relative version distance from the primary memory (-1 for direct parent, -2 for grand-parent, etc.)", example: -1 }), memory: r5().openapi({ description: "The contextual memory content", example: "Earlier version: Dhravya is working on a patent at Cloudflare." }), metadata: ng(ns()).nullable().optional().openapi({ description: "Contextual memory metadata" }), updatedAt: nN.date().openapi({ description: "Contextual memory last update date", format: "date-time" }) })).optional(), children: nu(nd({ relation: nx(["updates", "extends", "derives"]).openapi({ description: "Relation type between this memory and its parent/child", example: "extends" }), version: r6().nullable().optional().openapi({ description: "Relative version distance from the primary memory (+1 for direct child, +2 for grand-child, etc.)", example: 1 }), memory: r5().openapi({ description: "The contextual memory content", example: "Later version: Dhravya has filed the patent successfully." }), metadata: ng(ns()).nullable().optional().openapi({ description: "Contextual memory metadata" }), updatedAt: nN.date().openapi({ description: "Contextual memory last update date", format: "date-time" }) })).optional() }).optional().openapi({ description: "Object containing arrays of parent and child contextual memories" }), documents: nu(n8).optional().openapi({ description: "Associated documents for this memory entry" }) });
      nd({ results: nu(ie).openapi({ description: "Array of matching memory entries with similarity scores" }), timing: r6().openapi({ description: "Search execution time in milliseconds", example: 245 }), total: r6().openapi({ description: "Total number of results returned", example: 5 }) }), nd({ details: r5().optional().openapi({ description: "Additional error details", example: "Query must be at least 1 character long" }), error: r5().openapi({ description: "Error message", example: "Invalid request parameters" }) });
      let it = nY.omit({ id: true, orgId: true, updatedAt: true }), ir = nd({ createdAt: r5().datetime(), documentLimit: r6().optional(), email: r5().optional(), expiresAt: r5().datetime().optional(), id: r5(), metadata: ng(na()).optional(), provider: r5() }), ii = nd({ count: r6(), hour: np([nt(), r5()]) }), ia = nd({ count: r6(), keyId: r5(), keyName: r5().nullable(), lastUsed: np([nt(), r5()]).nullable() }), is = nd({ byKey: nu(ia.extend({ avgDuration: r6().optional() })), hourly: nu(ii.extend({ avgDuration: r6().optional() })), pagination: n4, totalMemories: r6(), usage: nu(nd({ avgDuration: r6().optional(), count: r6(), lastUsed: np([nt(), r5()]).nullable(), type: nH })) });
      nd({ byKey: nu(ia.extend({ errorCount: r6(), errorRate: r6() })), errors: nu(nd({ count: r6(), percentage: r6(), statusCode: r6(), type: nH })), hourly: nu(ii.extend({ errorCount: r6(), errorRate: r6() })), pagination: n4, summary: nu(nd({ errorRate: r6(), lastRequest: np([nt(), r5()]).nullable(), successRate: r6(), totalRequests: r6(), type: nH })) }), nd({ createdAt: nt(), duration: r6(), id: r5(), ingestion: nd({ createdAt: nt(), metadata: ng(ns()), status: r5(), summary: r5(), title: r5(), url: r5() }).optional(), input: ng(ns()), output: nh("type", [nd({ response: n9, type: nw("add") }), nd({ response: n7, type: nw("search") }), nd({ response: nd({ success: ne() }), type: nw("delete") }), nd({ response: n9, type: nw("update") })]), statusCode: r6(), type: nH }), nd({ logs: nu(ns()), pagination: n4 });
      let io = nd({ analytics: nd({ apiUsage: nd({ current: r6(), limit: r6() }), latency: nd({ current: r6(), trend: nu(r6()), unit: nw("ms") }), usage: nd({ currentDay: nx(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]), tokensByDay: nd({ Fri: r6(), Mon: r6(), Sat: r6(), Sun: r6(), Thu: r6(), Tue: r6(), Wed: r6() }) }) }), overview: nd({ "7d": nd({ amountSaved: nd({ current: r6(), previousPeriod: r6() }), tokensProcessed: nd({ current: r6(), previousPeriod: r6() }), tokensSent: nd({ current: r6(), previousPeriod: r6() }), totalTokensSaved: nd({ current: r6(), previousPeriod: r6() }) }), "30d": nd({ amountSaved: nd({ current: r6(), previousPeriod: r6() }), tokensProcessed: nd({ current: r6(), previousPeriod: r6() }), tokensSent: nd({ current: r6(), previousPeriod: r6() }), totalTokensSaved: nd({ current: r6(), previousPeriod: r6() }) }), "90d": nd({ amountSaved: nd({ current: r6(), previousPeriod: r6() }), tokensProcessed: nd({ current: r6(), previousPeriod: r6() }), tokensSent: nd({ current: r6(), previousPeriod: r6() }), totalTokensSaved: nd({ current: r6(), previousPeriod: r6() }) }), lifetime: nd({ amountSaved: nd({ current: r6(), previousPeriod: r6() }), tokensProcessed: nd({ current: r6(), previousPeriod: r6() }), tokensSent: nd({ current: r6(), previousPeriod: r6() }), totalTokensSaved: nd({ current: r6(), previousPeriod: r6() }) }) }) }), il = nd({ connectionsGrowth: r6(), memoriesGrowth: r6(), searchGrowth: r6(), searchQueries: r6(), tokensGrowth: r6(), tokensProcessed: r6(), totalConnections: r6(), totalMemories: r6() }), iu = nX.extend({ sourceAddedAt: nt().nullable(), sourceRelevanceScore: r6().nullable(), sourceMetadata: ng(ns()).nullable(), spaceContainerTag: r5().nullable() }).openapi({ description: "Memory entry with source relationship data" }), id = nd({ id: nB.shape.id, customId: nB.shape.customId, contentHash: nB.shape.contentHash, orgId: nB.shape.orgId, userId: nB.shape.userId, connectionId: nB.shape.connectionId, title: nB.shape.title, content: nB.shape.content, summary: nB.shape.summary, url: nB.shape.url, source: nB.shape.source, type: nB.shape.type, status: nB.shape.status, metadata: nB.shape.metadata, processingMetadata: nB.shape.processingMetadata, raw: nB.shape.raw, tokenCount: nB.shape.tokenCount, wordCount: nB.shape.wordCount, chunkCount: nB.shape.chunkCount, averageChunkSize: nB.shape.averageChunkSize, summaryEmbedding: nB.shape.summaryEmbedding, summaryEmbeddingModel: nB.shape.summaryEmbeddingModel, createdAt: nB.shape.createdAt, updatedAt: nB.shape.updatedAt, memoryEntries: nu(iu) }).openapi({ description: "Document with associated memory entries" }), ic = nd({ documents: nu(id), pagination: n4 }).openapi({ description: "List of documents with their memory entries" }), ip = nd({ page: r6().default(1).openapi({ description: "Page number to fetch", example: 1 }), limit: r6().default(10).openapi({ description: "Number of items per page", example: 10 }), sort: nx(["createdAt", "updatedAt"]).default("createdAt").openapi({ description: "Field to sort by", example: "createdAt" }), order: nx(["asc", "desc"]).default("desc").openapi({ description: "Sort order", example: "desc" }), containerTags: nu(r5()).optional().openapi({ description: "Optional container tags to filter documents by", example: ["sm_project_default"] }) }).openapi({ description: "Query parameters for listing documents with memory entries" }), ih = nd({ userId: r5().openapi({ description: "User ID to migrate documents for", example: "user_123" }), projectId: r5().default("default").openapi({ description: "Project ID to migrate documents to", example: "school" }) }).openapi({ description: "Request body for migrating MCP documents" }), im = nd({ success: ne().openapi({ description: "Whether the migration was successful", example: true }), migratedCount: r6().openapi({ description: "Number of documents migrated", example: 5 }), message: r5().openapi({ description: "Status message", example: "Successfully migrated 5 documents" }), documentIds: nu(r5()).optional().openapi({ description: "IDs of migrated documents", example: ["doc_123", "doc_456", "doc_789"] }) }).openapi({ description: "Response for MCP document migration" });
      nd({ documents: nu(n1.pick({ id: true, customId: true, title: true, type: true, status: true, createdAt: true, updatedAt: true, metadata: true, containerTags: true })), totalCount: r6().openapi({ description: "Total number of processing documents", example: 5 }) }).openapi({ description: "List of documents currently being processed", example: { documents: [{ id: "doc_123", customId: "custom_123", title: "My Document", type: "text", status: "extracting", createdAt: "2024-12-27T12:00:00Z", updatedAt: "2024-12-27T12:01:00Z", metadata: {}, containerTags: ["sm_project_default"] }], totalCount: 5 } });
      let ig = nd({ id: r5().openapi({ description: "Unique identifier of the project", example: "proj_abc123" }), name: r5().openapi({ description: "Display name of the project", example: "My Awesome Project" }), containerTag: r5().openapi({ description: "Container tag for organizing memories (format: sm_project_{name})", example: "sm_project_my_awesome_project" }), createdAt: r5().openapi({ description: "Creation timestamp", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), updatedAt: r5().openapi({ description: "Last update timestamp", example: (/* @__PURE__ */ new Date()).toISOString(), format: "date-time" }), isExperimental: ne().openapi({ description: "Whether the project (space) is in experimental mode", example: false }), documentCount: r6().optional().openapi({ description: "Number of documents in this project", example: 42 }) }).openapi({ description: "Project object for organizing memories" }), iy = nd({ name: r5().min(1).max(100).openapi({ description: "Name for the project", example: "My Awesome Project", minLength: 1, maxLength: 100 }) }).openapi({ description: "Request body for creating a new project" }), iv = nd({ projects: nu(ig).openapi({ description: "List of projects" }) }).openapi({ description: "Response containing list of projects" }), i_ = nd({ action: nx(["move", "delete"]).openapi({ description: "Action to perform on documents in the project", example: "move" }), targetProjectId: r5().optional().openapi({ description: "Target project ID when action is 'move'", example: "proj_xyz789" }) }).refine((e10) => "move" !== e10.action || !!e10.targetProjectId, { message: "targetProjectId is required when action is 'move'", path: ["targetProjectId"] }).openapi({ description: "Request body for deleting a project" }), ib = nd({ success: ne().openapi({ description: "Whether the deletion was successful", example: true }), message: r5().openapi({ description: "Status message", example: "Project deleted successfully" }), documentsAffected: r6().openapi({ description: "Number of documents affected by the operation", example: 10 }), memoriesAffected: r6().openapi({ description: "Number of memories affected by the operation", example: 5 }) }).openapi({ description: "Response for project deletion" });
      nd({ ids: nu(r5()).min(1).max(100).optional().openapi({ description: "Array of memory IDs to delete (max 100 at once)", example: ["acxV5LHMEsG2hMSNb4umbn", "bxcV5LHMEsG2hMSNb4umbn"] }), containerTags: nu(r5()).min(1).optional().openapi({ description: "Array of container tags - all memories in these containers will be deleted", example: ["user_123", "project_123"] }) }).refine((e10) => !!e10.ids?.length || !!e10.containerTags?.length, { message: "Either 'ids' or 'containerTags' must be provided" }).openapi({ description: "Request body for bulk deleting memories by IDs or container tags", example: { ids: ["acxV5LHMEsG2hMSNb4umbn", "bxcV5LHMEsG2hMSNb4umbn"] } }), nd({ success: ne().openapi({ description: "Whether the bulk deletion was successful", example: true }), deletedCount: r6().openapi({ description: "Number of memories successfully deleted", example: 2 }), errors: nu(nd({ id: r5(), error: r5() })).optional().openapi({ description: "Array of errors for memories that couldn't be deleted (only applicable when deleting by IDs)" }), containerTags: nu(r5()).optional().openapi({ description: "Container tags that were processed (only applicable when deleting by container tags)", example: ["user_123", "project_123"] }) }).openapi({ description: "Response for bulk memory deletion" });
      let iw = nd({ message: r5(), settings: nd({ excludeItems: nu(r5().min(1).max(20)).optional(), filterPrompt: r5().min(1).max(750).optional(), includeItems: nu(r5().min(1).max(20)).optional(), shouldLLMFilter: ne().optional() }) }), ix = nd({ from: r5().datetime().optional(), limit: r6().int().min(1).max(100).default(20), page: r6().int().min(1).default(1), period: nx(["24h", "7d", "30d", "all"]).optional(), to: r5().datetime().optional() }), iS = nd({ inWaitlist: ne(), accessGranted: ne(), createdAt: r5().datetime() }), ik = /* @__PURE__ */ ((e10) => async function(t10, r10) {
        let n10 = tS(tx(tx({}, e10), r10), { plugins: [...(null == e10 ? void 0 : e10.plugins) || [], tD(e10 || {})] });
        if (null == e10 ? void 0 : e10.catchAllError) try {
          return await t$(t10, n10);
        } catch (e11) {
          return { data: null, error: { status: 500, statusText: "Fetch Error", message: "Fetch related error. Captured by catchAllError option. See error property for more details.", error: e11 } };
        }
        return await t$(t10, n10);
      })({ baseURL: "https://supermemory-api.jstanley82.workers.dev/v3", credentials: "include", retry: { attempts: 3, delay: 100, type: "linear" }, schema: { schema: { "@get/analytics/chat": { output: io, query: ix }, "@get/analytics/memory": { output: il, query: ix }, "@get/analytics/usage": { output: is, query: ix }, "@post/connections/:provider": { input: nd({ containerTags: nu(r5()).optional(), documentLimit: r6().int().min(1).max(1e4).optional(), metadata: ng(np([r5(), r6(), ne()])).optional().nullable(), redirectUrl: r5().optional() }), output: nd({ authLink: r5(), expiresIn: r5(), id: r5(), redirectsTo: r5().optional() }), params: nd({ provider: nx(["google-drive", "notion", "onedrive"]) }) }, "@post/connections/list": { input: nd({ containerTags: nu(r5()).optional() }), output: nu(ir) }, "@get/connections": { output: nu(ir), query: nd({ endUserId: r5().optional() }).optional() }, "@get/connections/:connectionId": { output: ir, params: nd({ connectionId: r5() }) }, "@delete/connections/:connectionId": { output: nd({ id: r5(), provider: r5() }), params: nd({ connectionId: r5() }) }, "@get/settings": { output: nd({ settings: nd({}).passthrough() }) }, "@patch/settings": { input: it, output: iw }, "@post/memories": { input: n2, output: n9 }, "@post/memories/list": { body: nd({ limit: r6().optional(), page: r6().optional(), status: r5().optional(), containerTags: nu(r5()).optional() }).optional(), output: n3 }, "@post/memories/documents": { input: ip, output: ic }, "@post/memories/documents/by-ids": { input: nd({ ids: nu(r5()), by: nx(["id", "customId"]).optional(), containerTags: nu(r5()).optional() }), output: ic }, "@post/memories/migrate-mcp": { input: ih, output: im }, "@delete/memories/:id": { output: na(), params: nd({ id: r5() }) }, "@post/search": { input: n5, output: n7 }, "@get/projects": { output: iv }, "@post/projects": { input: iy, output: ig }, "@delete/projects/:projectId": { input: i_, output: ib, params: nd({ projectId: r5() }) }, "@get/waitlist/status": { output: iS } }, config: s } });
      class iT extends Error {
        constructor(e10, t10) {
          super(e10), this.name = "BetterAuthError", this.message = e10, this.cause = t10, this.stack = "";
        }
      }
      let iE = /* @__PURE__ */ Object.create(null), iR = (e10) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e10 ? iE : globalThis), iC = new Proxy(iE, { get: (e10, t10) => iR()[t10] ?? iE[t10], has: (e10, t10) => t10 in iR() || t10 in iE, set: (e10, t10, r10) => (iR(true)[t10] = r10, true), deleteProperty(e10, t10) {
        if (!t10) return false;
        let r10 = iR(true);
        return delete r10[t10], true;
      }, ownKeys: () => Object.keys(iR(true)) });
      function iO(e10, t10 = "/api/auth") {
        return !function(e11) {
          try {
            let t11 = new URL(e11);
            return "/" !== t11.pathname;
          } catch (t11) {
            throw new iT(`Invalid base URL: ${e11}. Please provide a valid base URL.`);
          }
        }(e10) ? (t10 = t10.startsWith("/") ? t10 : `/${t10}`, `${e10.replace(/\/+$/, "")}${t10}`) : e10;
      }
      "undefined" != typeof process && process.env, new TextEncoder().encode;
      let iI = (e10, t10) => {
        let r10 = { t: `${e10}${t10}`, value: e10, tFormat: t10, toMilliseconds: () => {
          switch (t10) {
            case "ms":
              return e10;
            case "s":
              return 1e3 * e10;
            case "m":
              return 1e3 * e10 * 60;
            case "h":
              return 1e3 * e10 * 3600;
            case "d":
              return 1e3 * e10 * 86400;
            case "w":
              return 1e3 * e10 * 604800;
            case "y":
              return 1e3 * e10 * 31536e3;
          }
        }, toSeconds: () => r10.toMilliseconds() / 1e3, toMinutes: () => r10.toSeconds() / 60, toHours: () => r10.toMinutes() / 60, toDays: () => r10.toHours() / 24, toWeeks: () => r10.toDays() / 7, toYears: () => r10.toDays() / 365, getDate: () => new Date(Date.now() + r10.toMilliseconds()), add: (e11) => {
          let t11 = "string" == typeof e11 ? iA(e11).toMilliseconds() : e11.toMilliseconds();
          return iI(r10.toMilliseconds() + t11, "ms");
        }, subtract: (e11) => {
          let t11 = "string" == typeof e11 ? iA(e11).toMilliseconds() : e11.toMilliseconds();
          return iI(r10.toMilliseconds() - t11, "ms");
        }, multiply: (e11) => iI(r10.toMilliseconds() * e11, "ms"), divide: (e11) => iI(r10.toMilliseconds() / e11, "ms"), equals: (e11) => {
          let t11 = "string" == typeof e11 ? iA(e11).toMilliseconds() : e11.toMilliseconds();
          return r10.toMilliseconds() === t11;
        }, lessThan: (e11) => {
          let t11 = "string" == typeof e11 ? iA(e11).toMilliseconds() : e11.toMilliseconds();
          return r10.toMilliseconds() < t11;
        }, greaterThan: (e11) => {
          let t11 = "string" == typeof e11 ? iA(e11).toMilliseconds() : e11.toMilliseconds();
          return r10.toMilliseconds() > t11;
        }, format: (e11) => {
          let t11 = r10.getDate();
          return e11.replace(/YYYY|MM|DD|HH|mm|ss/g, (e12) => {
            switch (e12) {
              case "YYYY":
                return t11.getFullYear().toString();
              case "MM":
                return (t11.getMonth() + 1).toString().padStart(2, "0");
              case "DD":
                return t11.getDate().toString().padStart(2, "0");
              case "HH":
                return t11.getHours().toString().padStart(2, "0");
              case "mm":
                return t11.getMinutes().toString().padStart(2, "0");
              case "ss":
                return t11.getSeconds().toString().padStart(2, "0");
              default:
                return e12;
            }
          });
        }, fromNow: () => {
          let e11 = r10.toMilliseconds();
          return e11 < 0 ? r10.ago() : e11 < 1e3 ? "in a few seconds" : e11 < 6e4 ? `in ${Math.round(e11 / 1e3)} seconds` : e11 < 36e5 ? `in ${Math.round(e11 / 6e4)} minutes` : e11 < 864e5 ? `in ${Math.round(e11 / 36e5)} hours` : e11 < 6048e5 ? `in ${Math.round(e11 / 864e5)} days` : e11 < 26298e5 ? `in ${Math.round(e11 / 6048e5)} weeks` : e11 < 315576e5 ? `in ${Math.round(e11 / 26298e5)} months` : `in ${Math.round(e11 / 315576e5)} years`;
        }, ago: () => {
          let e11 = -r10.toMilliseconds();
          return e11 < 0 ? r10.fromNow() : e11 < 1e3 ? "a few seconds ago" : e11 < 6e4 ? `${Math.round(e11 / 1e3)} seconds ago` : e11 < 36e5 ? `${Math.round(e11 / 6e4)} minutes ago` : e11 < 864e5 ? `${Math.round(e11 / 36e5)} hours ago` : e11 < 6048e5 ? `${Math.round(e11 / 864e5)} days ago` : e11 < 26298e5 ? `${Math.round(e11 / 6048e5)} weeks ago` : e11 < 315576e5 ? `${Math.round(e11 / 26298e5)} months ago` : `${Math.round(e11 / 315576e5)} years ago`;
        } };
        return r10;
      }, iA = (e10) => {
        let t10 = e10.match(/^(\d+)(ms|s|m|h|d|w|y)$/);
        if (!t10) throw Error("Invalid time format");
        return iI(parseInt(t10[1]), t10[2]);
      }, iP = (e10, t10) => {
        t10?.cookiePrefix && (t10.cookieName ? t10.cookiePrefix = `${t10.cookiePrefix}-` : t10.cookiePrefix = `${t10.cookiePrefix}.`);
        let r10 = "headers" in e10 ? e10.headers : e10, n10 = e10 instanceof Request ? e10 : void 0;
        !function(e11, t11, r11) {
          if (e11) return iO(e11, t11);
          let n11 = iC.BETTER_AUTH_URL || iC.NEXT_PUBLIC_BETTER_AUTH_URL || iC.PUBLIC_BETTER_AUTH_URL || iC.NUXT_PUBLIC_BETTER_AUTH_URL || iC.NUXT_PUBLIC_AUTH_URL || ("/" !== iC.BASE_URL ? iC.BASE_URL : void 0);
          if (n11) return iO(n11, t11);
          let i11 = r11?.headers.get("x-forwarded-host"), a3 = r11?.headers.get("x-forwarded-proto");
          if (i11 && a3) return iO(`${a3}://${i11}`, t11);
          if (r11) {
            let e12 = function(e13) {
              try {
                return new URL(e13).origin;
              } catch (e14) {
                return null;
              }
            }(r11.url);
            if (!e12) throw new iT("Could not get origin from request. Please provide a valid base URL.");
            return iO(e12, t11);
          }
          "undefined" != typeof window && window.location && iO(window.location.origin, t11);
        }(n10?.url, t10?.path, n10);
        let i10 = r10.get("cookie");
        if (!i10) return null;
        let { cookieName: a2 = "session_token", cookiePrefix: s2 = "better-auth." } = t10 || {}, o2 = `${s2}${a2}`, l2 = `__Secure-${o2}`, u2 = function(e11) {
          let t11 = e11.split("; "), r11 = /* @__PURE__ */ new Map();
          return t11.forEach((e12) => {
            let [t12, n11] = e12.split("=");
            r11.set(t12, n11);
          }), r11;
        }(i10), d2 = u2.get(o2) || u2.get(l2);
        return d2 || null;
      };
      r(563), "undefined" == typeof URLPattern || URLPattern;
      var iN = r(633);
      /* @__PURE__ */ new WeakMap();
      let ij = "function" == typeof iN.unstable_postpone;
      function iM(e10, t10) {
        return `Route ${e10} needs to bail out of prerendering at this point because it used ${t10}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === function(e10) {
        return e10.includes("needs to bail out of prerendering at this point because it used") && e10.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }(iM("%%%", "^^^"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), /* @__PURE__ */ new WeakMap();
      let iL = "9.46.0", iD = globalThis;
      function i$() {
        return iZ(iD), iD;
      }
      function iZ(e10) {
        let t10 = e10.__SENTRY__ = e10.__SENTRY__ || {};
        return t10.version = t10.version || iL, t10[iL] = t10[iL] || {};
      }
      function iq(e10, t10, r10 = iD) {
        let n10 = r10.__SENTRY__ = r10.__SENTRY__ || {}, i10 = n10[iL] = n10[iL] || {};
        return i10[e10] || (i10[e10] = t10());
      }
      function iU(e10 = iD.crypto || iD.msCrypto) {
        let t10 = () => 16 * Math.random();
        try {
          if (e10?.randomUUID) return e10.randomUUID().replace(/-/g, "");
          e10?.getRandomValues && (t10 = () => {
            let t11 = new Uint8Array(1);
            return e10.getRandomValues(t11), t11[0];
          });
        } catch {
        }
        return "10000000100040008000100000000000".replace(/[018]/g, (e11) => (e11 ^ (15 & t10()) >> e11 / 4).toString(16));
      }
      function iz() {
        return Date.now() / 1e3;
      }
      function iF() {
        return (a ?? (a = function() {
          let { performance: e10 } = iD;
          if (!e10?.now || !e10.timeOrigin) return iz;
          let t10 = e10.timeOrigin;
          return () => (t10 + e10.now()) / 1e3;
        }()))();
      }
      let iB = {};
      function iW(e10, ...t10) {
      }
      let iV = Object.prototype.toString;
      function iH(e10, t10) {
        return iV.call(e10) === `[object ${t10}]`;
      }
      function iK(e10) {
        return !!(e10?.then && "function" == typeof e10.then);
      }
      function iX() {
        return iU().substring(16);
      }
      function iG(e10, t10, r10) {
        try {
          Object.defineProperty(e10, t10, { value: r10, writable: true, configurable: true });
        } catch {
        }
      }
      let iY = "_sentrySpan";
      function iJ(e10, t10) {
        t10 ? iG(e10, iY, t10) : delete e10[iY];
      }
      class iQ {
        constructor() {
          this._notifyingListeners = false, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = { traceId: iU(), sampleRand: Math.random() };
        }
        clone() {
          let e10 = new iQ();
          return e10._breadcrumbs = [...this._breadcrumbs], e10._tags = { ...this._tags }, e10._extra = { ...this._extra }, e10._contexts = { ...this._contexts }, this._contexts.flags && (e10._contexts.flags = { values: [...this._contexts.flags.values] }), e10._user = this._user, e10._level = this._level, e10._session = this._session, e10._transactionName = this._transactionName, e10._fingerprint = this._fingerprint, e10._eventProcessors = [...this._eventProcessors], e10._attachments = [...this._attachments], e10._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }, e10._propagationContext = { ...this._propagationContext }, e10._client = this._client, e10._lastEventId = this._lastEventId, iJ(e10, this[iY]), e10;
        }
        setClient(e10) {
          this._client = e10;
        }
        setLastEventId(e10) {
          this._lastEventId = e10;
        }
        getClient() {
          return this._client;
        }
        lastEventId() {
          return this._lastEventId;
        }
        addScopeListener(e10) {
          this._scopeListeners.push(e10);
        }
        addEventProcessor(e10) {
          return this._eventProcessors.push(e10), this;
        }
        setUser(e10) {
          return this._user = e10 || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }, this._session && function(e11, t10 = {}) {
            if (t10.user && (!e11.ipAddress && t10.user.ip_address && (e11.ipAddress = t10.user.ip_address), e11.did || t10.did || (e11.did = t10.user.id || t10.user.email || t10.user.username)), e11.timestamp = t10.timestamp || iF(), t10.abnormal_mechanism && (e11.abnormal_mechanism = t10.abnormal_mechanism), t10.ignoreDuration && (e11.ignoreDuration = t10.ignoreDuration), t10.sid && (e11.sid = 32 === t10.sid.length ? t10.sid : iU()), void 0 !== t10.init && (e11.init = t10.init), !e11.did && t10.did && (e11.did = `${t10.did}`), "number" == typeof t10.started && (e11.started = t10.started), e11.ignoreDuration) e11.duration = void 0;
            else if ("number" == typeof t10.duration) e11.duration = t10.duration;
            else {
              let t11 = e11.timestamp - e11.started;
              e11.duration = t11 >= 0 ? t11 : 0;
            }
            t10.release && (e11.release = t10.release), t10.environment && (e11.environment = t10.environment), !e11.ipAddress && t10.ipAddress && (e11.ipAddress = t10.ipAddress), !e11.userAgent && t10.userAgent && (e11.userAgent = t10.userAgent), "number" == typeof t10.errors && (e11.errors = t10.errors), t10.status && (e11.status = t10.status);
          }(this._session, { user: e10 }), this._notifyScopeListeners(), this;
        }
        getUser() {
          return this._user;
        }
        setTags(e10) {
          return this._tags = { ...this._tags, ...e10 }, this._notifyScopeListeners(), this;
        }
        setTag(e10, t10) {
          return this._tags = { ...this._tags, [e10]: t10 }, this._notifyScopeListeners(), this;
        }
        setExtras(e10) {
          return this._extra = { ...this._extra, ...e10 }, this._notifyScopeListeners(), this;
        }
        setExtra(e10, t10) {
          return this._extra = { ...this._extra, [e10]: t10 }, this._notifyScopeListeners(), this;
        }
        setFingerprint(e10) {
          return this._fingerprint = e10, this._notifyScopeListeners(), this;
        }
        setLevel(e10) {
          return this._level = e10, this._notifyScopeListeners(), this;
        }
        setTransactionName(e10) {
          return this._transactionName = e10, this._notifyScopeListeners(), this;
        }
        setContext(e10, t10) {
          return null === t10 ? delete this._contexts[e10] : this._contexts[e10] = t10, this._notifyScopeListeners(), this;
        }
        setSession(e10) {
          return e10 ? this._session = e10 : delete this._session, this._notifyScopeListeners(), this;
        }
        getSession() {
          return this._session;
        }
        update(e10) {
          if (!e10) return this;
          let t10 = "function" == typeof e10 ? e10(this) : e10, { tags: r10, extra: n10, user: i10, contexts: a2, level: s2, fingerprint: o2 = [], propagationContext: l2 } = (t10 instanceof iQ ? t10.getScopeData() : iH(t10, "Object") ? e10 : void 0) || {};
          return this._tags = { ...this._tags, ...r10 }, this._extra = { ...this._extra, ...n10 }, this._contexts = { ...this._contexts, ...a2 }, i10 && Object.keys(i10).length && (this._user = i10), s2 && (this._level = s2), o2.length && (this._fingerprint = o2), l2 && (this._propagationContext = l2), this;
        }
        clear() {
          return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._session = void 0, iJ(this, void 0), this._attachments = [], this.setPropagationContext({ traceId: iU(), sampleRand: Math.random() }), this._notifyScopeListeners(), this;
        }
        addBreadcrumb(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : 100;
          if (r10 <= 0) return this;
          let n10 = { timestamp: iz(), ...e10, message: e10.message ? function(e11, t11 = 0) {
            return "string" != typeof e11 || 0 === t11 || e11.length <= t11 ? e11 : `${e11.slice(0, t11)}...`;
          }(e10.message, 2048) : e10.message };
          return this._breadcrumbs.push(n10), this._breadcrumbs.length > r10 && (this._breadcrumbs = this._breadcrumbs.slice(-r10), this._client?.recordDroppedEvent("buffer_overflow", "log_item")), this._notifyScopeListeners(), this;
        }
        getLastBreadcrumb() {
          return this._breadcrumbs[this._breadcrumbs.length - 1];
        }
        clearBreadcrumbs() {
          return this._breadcrumbs = [], this._notifyScopeListeners(), this;
        }
        addAttachment(e10) {
          return this._attachments.push(e10), this;
        }
        clearAttachments() {
          return this._attachments = [], this;
        }
        getScopeData() {
          return { breadcrumbs: this._breadcrumbs, attachments: this._attachments, contexts: this._contexts, tags: this._tags, extra: this._extra, user: this._user, level: this._level, fingerprint: this._fingerprint || [], eventProcessors: this._eventProcessors, propagationContext: this._propagationContext, sdkProcessingMetadata: this._sdkProcessingMetadata, transactionName: this._transactionName, span: this[iY] };
        }
        setSDKProcessingMetadata(e10) {
          return this._sdkProcessingMetadata = function e11(t10, r10, n10 = 2) {
            if (!r10 || "object" != typeof r10 || n10 <= 0) return r10;
            if (t10 && 0 === Object.keys(r10).length) return t10;
            let i10 = { ...t10 };
            for (let t11 in r10) Object.prototype.hasOwnProperty.call(r10, t11) && (i10[t11] = e11(i10[t11], r10[t11], n10 - 1));
            return i10;
          }(this._sdkProcessingMetadata, e10, 2), this;
        }
        setPropagationContext(e10) {
          return this._propagationContext = e10, this;
        }
        getPropagationContext() {
          return this._propagationContext;
        }
        captureException(e10, t10) {
          let r10 = t10?.event_id || iU();
          if (!this._client) return r10;
          let n10 = Error("Sentry syntheticException");
          return this._client.captureException(e10, { originalException: e10, syntheticException: n10, ...t10, event_id: r10 }, this), r10;
        }
        captureMessage(e10, t10, r10) {
          let n10 = r10?.event_id || iU();
          if (!this._client) return n10;
          let i10 = Error(e10);
          return this._client.captureMessage(e10, t10, { originalException: e10, syntheticException: i10, ...r10, event_id: n10 }, this), n10;
        }
        captureEvent(e10, t10) {
          let r10 = t10?.event_id || iU();
          return this._client && this._client.captureEvent(e10, { ...t10, event_id: r10 }, this), r10;
        }
        _notifyScopeListeners() {
          this._notifyingListeners || (this._notifyingListeners = true, this._scopeListeners.forEach((e10) => {
            e10(this);
          }), this._notifyingListeners = false);
        }
      }
      class i0 {
        constructor(e10, t10) {
          let r10, n10;
          r10 = e10 || new iQ(), n10 = t10 || new iQ(), this._stack = [{ scope: r10 }], this._isolationScope = n10;
        }
        withScope(e10) {
          let t10, r10 = this._pushScope();
          try {
            t10 = e10(r10);
          } catch (e11) {
            throw this._popScope(), e11;
          }
          return iK(t10) ? t10.then((e11) => (this._popScope(), e11), (e11) => {
            throw this._popScope(), e11;
          }) : (this._popScope(), t10);
        }
        getClient() {
          return this.getStackTop().client;
        }
        getScope() {
          return this.getStackTop().scope;
        }
        getIsolationScope() {
          return this._isolationScope;
        }
        getStackTop() {
          return this._stack[this._stack.length - 1];
        }
        _pushScope() {
          let e10 = this.getScope().clone();
          return this._stack.push({ client: this.getClient(), scope: e10 }), e10;
        }
        _popScope() {
          return !(this._stack.length <= 1) && !!this._stack.pop();
        }
      }
      function i1() {
        let e10 = iZ(i$());
        return e10.stack = e10.stack || new i0(iq("defaultCurrentScope", () => new iQ()), iq("defaultIsolationScope", () => new iQ()));
      }
      function i2(e10) {
        return i1().withScope(e10);
      }
      function i4(e10, t10) {
        let r10 = i1();
        return r10.withScope(() => (r10.getStackTop().scope = e10, t10(e10)));
      }
      function i3(e10) {
        return i1().withScope(() => e10(i1().getIsolationScope()));
      }
      function i9(e10) {
        let t10 = iZ(e10);
        return t10.acs ? t10.acs : { withIsolationScope: i3, withScope: i2, withSetScope: i4, withSetIsolationScope: (e11, t11) => i3(t11), getCurrentScope: () => i1().getScope(), getIsolationScope: () => i1().getIsolationScope() };
      }
      function i5() {
        return i9(i$()).getCurrentScope();
      }
      function i6(...e10) {
        let t10 = i9(i$());
        if (2 === e10.length) {
          let [r10, n10] = e10;
          return r10 ? t10.withSetScope(r10, n10) : t10.withScope(n10);
        }
        return t10.withScope(e10[0]);
      }
      function i7() {
        return i5().getClient();
      }
      let i8 = "sentry.source", ae = "sentry.sample_rate", at = "sentry.op", ar = "sentry.origin", an = "sentry.custom_span_name", ai = false;
      function aa(e10) {
        return e10 && e10.length > 0 ? e10.map(({ context: { spanId: e11, traceId: t10, traceFlags: r10, ...n10 }, attributes: i10 }) => ({ span_id: e11, trace_id: t10, sampled: 1 === r10, attributes: i10, ...n10 })) : void 0;
      }
      function as(e10) {
        return "number" == typeof e10 ? ao(e10) : Array.isArray(e10) ? e10[0] + e10[1] / 1e9 : e10 instanceof Date ? ao(e10.getTime()) : iF();
      }
      function ao(e10) {
        return e10 > 9999999999 ? e10 / 1e3 : e10;
      }
      function al(e10) {
        var t10;
        if ("function" == typeof e10.getSpanJSON) return e10.getSpanJSON();
        let { spanId: r10, traceId: n10 } = e10.spanContext();
        if ((t10 = e10).attributes && t10.startTime && t10.name && t10.endTime && t10.status) {
          let { attributes: t11, startTime: i10, name: a2, endTime: s2, status: o2, links: l2 } = e10;
          return { span_id: r10, trace_id: n10, data: t11, description: a2, parent_span_id: "parentSpanId" in e10 ? e10.parentSpanId : "parentSpanContext" in e10 ? e10.parentSpanContext?.spanId : void 0, start_timestamp: as(i10), timestamp: as(s2) || void 0, status: ad(o2), op: t11[at], origin: t11[ar], links: aa(l2) };
        }
        return { span_id: r10, trace_id: n10, start_timestamp: 0, data: {} };
      }
      function au(e10) {
        let { traceFlags: t10 } = e10.spanContext();
        return 1 === t10;
      }
      function ad(e10) {
        if (e10 && 0 !== e10.code) return 1 === e10.code ? "ok" : e10.message || "unknown_error";
      }
      let ac = "_sentryChildSpans", ap = "_sentryRootSpan";
      function ah(e10, t10) {
        let r10 = e10[ap] || e10;
        iG(t10, ap, r10), e10[ac] ? e10[ac].add(t10) : iG(e10, ac, /* @__PURE__ */ new Set([t10]));
      }
      function am(e10) {
        return e10[ap] || e10;
      }
      let af = "_sentryScope", ag = "_sentryIsolationScope";
      function ay(e10, t10, r10) {
        e10 && (iG(e10, ag, r10), iG(e10, af, t10));
      }
      function av(e10) {
        return { scope: e10[af], isolationScope: e10[ag] };
      }
      function a_(e10, t10, r10 = () => {
      }) {
        var n10, i10, a2;
        let s2;
        try {
          s2 = e10();
        } catch (e11) {
          throw t10(e11), r10(), e11;
        }
        return n10 = s2, i10 = t10, a2 = r10, iK(n10) ? n10.then((e11) => (a2(), e11), (e11) => {
          throw i10(e11), a2(), e11;
        }) : (a2(), n10);
      }
      function ab(e10) {
        if ("boolean" == typeof __SENTRY_TRACING__ && !__SENTRY_TRACING__) return false;
        let t10 = e10 || i7()?.getOptions();
        return !!t10 && (null != t10.tracesSampleRate || !!t10.tracesSampler);
      }
      function aw(e10) {
        if ("boolean" == typeof e10) return Number(e10);
        let t10 = "string" == typeof e10 ? parseFloat(e10) : e10;
        if (!("number" != typeof t10 || isNaN(t10)) && !(t10 < 0) && !(t10 > 1)) return t10;
      }
      let ax = /^sentry-/;
      function aS(e10) {
        return e10.split(",").map((e11) => e11.split("=").map((e12) => {
          try {
            return decodeURIComponent(e12.trim());
          } catch {
            return;
          }
        })).reduce((e11, [t10, r10]) => (t10 && r10 && (e11[t10] = r10), e11), {});
      }
      let ak = /^o(\d+)\./, aT = "_frozenDsc";
      function aE(e10) {
        let t10 = i7();
        if (!t10) return {};
        let r10 = am(e10), n10 = al(r10), i10 = n10.data, a2 = r10.spanContext().traceState, s2 = a2?.get("sentry.sample_rate") ?? i10[ae] ?? i10["sentry.previous_trace_sample_rate"];
        function o2(e11) {
          return ("number" == typeof s2 || "string" == typeof s2) && (e11.sample_rate = `${s2}`), e11;
        }
        let l2 = r10[aT];
        if (l2) return o2(l2);
        let u2 = a2?.get("sentry.dsc"), d2 = u2 && function(e11) {
          let t11 = function(e12) {
            if (e12 && (iH(e12, "String") || Array.isArray(e12))) return Array.isArray(e12) ? e12.reduce((e13, t12) => (Object.entries(aS(t12)).forEach(([t13, r12]) => {
              e13[t13] = r12;
            }), e13), {}) : aS(e12);
          }(e11);
          if (!t11) return;
          let r11 = Object.entries(t11).reduce((e12, [t12, r12]) => (t12.match(ax) && (e12[t12.slice(7)] = r12), e12), {});
          return Object.keys(r11).length > 0 ? r11 : void 0;
        }(u2);
        if (d2) return o2(d2);
        let c2 = function(e11, t11) {
          let r11, n11 = t11.getOptions(), { publicKey: i11, host: a3 } = t11.getDsn() || {};
          n11.orgId ? r11 = String(n11.orgId) : a3 && (r11 = function(e12) {
            let t12 = e12.match(ak);
            return t12?.[1];
          }(a3));
          let s3 = { environment: n11.environment || "production", release: n11.release, public_key: i11, trace_id: e11, org_id: r11 };
          return t11.emit("createDsc", s3), s3;
        }(e10.spanContext().traceId, t10), p2 = i10[i8], h2 = n10.description;
        return "url" !== p2 && h2 && (c2.transaction = h2), ab() && (c2.sampled = String(au(r10)), c2.sample_rand = a2?.get("sentry.sample_rand") ?? av(r10).scope?.getPropagationContext().sampleRand.toString()), o2(c2), t10.emit("createDsc", c2, r10), c2;
      }
      class aR {
        constructor(e10 = {}) {
          this._traceId = e10.traceId || iU(), this._spanId = e10.spanId || iX();
        }
        spanContext() {
          return { spanId: this._spanId, traceId: this._traceId, traceFlags: 0 };
        }
        end(e10) {
        }
        setAttribute(e10, t10) {
          return this;
        }
        setAttributes(e10) {
          return this;
        }
        setStatus(e10) {
          return this;
        }
        updateName(e10) {
          return this;
        }
        isRecording() {
          return false;
        }
        addEvent(e10, t10, r10) {
          return this;
        }
        addLink(e10) {
          return this;
        }
        addLinks(e10) {
          return this;
        }
        recordException(e10, t10) {
        }
      }
      function aC(e10) {
        if (!e10 || 0 === e10.length) return;
        let t10 = {};
        return e10.forEach((e11) => {
          let r10 = e11.attributes || {}, n10 = r10["sentry.measurement_unit"], i10 = r10["sentry.measurement_value"];
          "string" == typeof n10 && "number" == typeof i10 && (t10[e11.name] = { value: i10, unit: n10 });
        }), t10;
      }
      class aO {
        constructor(e10 = {}) {
          this._traceId = e10.traceId || iU(), this._spanId = e10.spanId || iX(), this._startTime = e10.startTimestamp || iF(), this._links = e10.links, this._attributes = {}, this.setAttributes({ [ar]: "manual", [at]: e10.op, ...e10.attributes }), this._name = e10.name, e10.parentSpanId && (this._parentSpanId = e10.parentSpanId), "sampled" in e10 && (this._sampled = e10.sampled), e10.endTimestamp && (this._endTime = e10.endTimestamp), this._events = [], this._isStandaloneSpan = e10.isStandalone, this._endTime && this._onSpanEnded();
        }
        addLink(e10) {
          return this._links ? this._links.push(e10) : this._links = [e10], this;
        }
        addLinks(e10) {
          return this._links ? this._links.push(...e10) : this._links = e10, this;
        }
        recordException(e10, t10) {
        }
        spanContext() {
          let { _spanId: e10, _traceId: t10, _sampled: r10 } = this;
          return { spanId: e10, traceId: t10, traceFlags: +!!r10 };
        }
        setAttribute(e10, t10) {
          return void 0 === t10 ? delete this._attributes[e10] : this._attributes[e10] = t10, this;
        }
        setAttributes(e10) {
          return Object.keys(e10).forEach((t10) => this.setAttribute(t10, e10[t10])), this;
        }
        updateStartTime(e10) {
          this._startTime = as(e10);
        }
        setStatus(e10) {
          return this._status = e10, this;
        }
        updateName(e10) {
          return this._name = e10, this.setAttribute(i8, "custom"), this;
        }
        end(e10) {
          var t10;
          this._endTime || (this._endTime = as(e10), t10 = 0, this._onSpanEnded());
        }
        getSpanJSON() {
          return { data: this._attributes, description: this._name, op: this._attributes[at], parent_span_id: this._parentSpanId, span_id: this._spanId, start_timestamp: this._startTime, status: ad(this._status), timestamp: this._endTime, trace_id: this._traceId, origin: this._attributes[ar], profile_id: this._attributes["sentry.profile_id"], exclusive_time: this._attributes["sentry.exclusive_time"], measurements: aC(this._events), is_segment: this._isStandaloneSpan && am(this) === this || void 0, segment_id: this._isStandaloneSpan ? am(this).spanContext().spanId : void 0, links: aa(this._links) };
        }
        isRecording() {
          return !this._endTime && !!this._sampled;
        }
        addEvent(e10, t10, r10) {
          let n10 = aI(t10) ? t10 : r10 || iF(), i10 = aI(t10) ? {} : t10 || {}, a2 = { name: e10, time: as(n10), attributes: i10 };
          return this._events.push(a2), this;
        }
        isStandaloneSpan() {
          return !!this._isStandaloneSpan;
        }
        _onSpanEnded() {
          let e10 = i7();
          if (e10 && e10.emit("spanEnd", this), !(this._isStandaloneSpan || this === am(this))) return;
          if (this._isStandaloneSpan) return void (this._sampled ? function(e11) {
            let t11 = i7();
            if (!t11) return;
            let r10 = e11[1];
            if (!r10 || 0 === r10.length) return t11.recordDroppedEvent("before_send", "span");
            t11.sendEnvelope(e11);
          }(function(e11, t11) {
            let r10 = aE(e11[0]), n10 = t11?.getDsn(), i10 = t11?.getOptions().tunnel, a2 = { sent_at: (/* @__PURE__ */ new Date()).toISOString(), ...!!r10.trace_id && !!r10.public_key && { trace: r10 }, ...!!i10 && n10 && { dsn: function(e12, t12 = false) {
              let { host: r11, path: n11, pass: i11, port: a3, projectId: s3, protocol: o3, publicKey: l3 } = e12;
              return `${o3}://${l3}${t12 && i11 ? `:${i11}` : ""}@${r11}${a3 ? `:${a3}` : ""}/${n11 ? `${n11}/` : n11}${s3}`;
            }(n10) } }, s2 = t11?.getOptions().beforeSendSpan, o2 = s2 ? (e12) => {
              let t12 = al(e12), r11 = s2(t12);
              return r11 || (ai || (function(e13) {
                if (!("console" in iD)) return e13();
                let t13 = iD.console, r12 = {}, n11 = Object.keys(iB);
                n11.forEach((e14) => {
                  let n12 = iB[e14];
                  r12[e14] = t13[e14], t13[e14] = n12;
                });
                try {
                  return e13();
                } finally {
                  n11.forEach((e14) => {
                    t13[e14] = r12[e14];
                  });
                }
              }(() => {
                console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly.");
              }), ai = true), t12);
            } : al, l2 = [];
            for (let t12 of e11) {
              let e12 = o2(t12);
              e12 && l2.push([{ type: "span" }, e12]);
            }
            return /* @__PURE__ */ function(e12, t12 = []) {
              return [e12, t12];
            }(a2, l2);
          }([this], e10)) : e10 && e10.recordDroppedEvent("sample_rate", "span"));
          let t10 = this._convertSpanToTransaction();
          t10 && (av(this).scope || i5()).captureEvent(t10);
        }
        _convertSpanToTransaction() {
          if (!aA(al(this))) return;
          this._name || (this._name = "<unlabeled transaction>");
          let { scope: e10, isolationScope: t10 } = av(this), r10 = e10?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
          if (true !== this._sampled) return;
          let n10 = function(e11) {
            let t11 = /* @__PURE__ */ new Set();
            return !function e12(r11) {
              if (!t11.has(r11) && au(r11)) for (let n11 of (t11.add(r11), r11[ac] ? Array.from(r11[ac]) : [])) e12(n11);
            }(e11), Array.from(t11);
          }(this).filter((e11) => {
            var t11;
            return e11 !== this && !((t11 = e11) instanceof aO && t11.isStandaloneSpan());
          }).map((e11) => al(e11)).filter(aA), i10 = this._attributes[i8];
          delete this._attributes[an], n10.forEach((e11) => {
            delete e11.data[an];
          });
          let a2 = { contexts: { trace: function(e11) {
            let { spanId: t11, traceId: r11 } = e11.spanContext(), { data: n11, op: i11, parent_span_id: a3, status: s3, origin: o2, links: l2 } = al(e11);
            return { parent_span_id: a3, span_id: t11, trace_id: r11, data: n11, op: i11, status: s3, origin: o2, links: l2 };
          }(this) }, spans: n10.length > 1e3 ? n10.sort((e11, t11) => e11.start_timestamp - t11.start_timestamp).slice(0, 1e3) : n10, start_timestamp: this._startTime, timestamp: this._endTime, transaction: this._name, type: "transaction", sdkProcessingMetadata: { capturedSpanScope: e10, capturedSpanIsolationScope: t10, dynamicSamplingContext: aE(this) }, request: r10, ...i10 && { transaction_info: { source: i10 } } }, s2 = aC(this._events);
          return s2 && Object.keys(s2).length && (a2.measurements = s2), a2;
        }
      }
      function aI(e10) {
        return e10 && "number" == typeof e10 || e10 instanceof Date || Array.isArray(e10);
      }
      function aA(e10) {
        return !!e10.start_timestamp && !!e10.timestamp && !!e10.span_id && !!e10.trace_id;
      }
      let aP = "__SENTRY_SUPPRESS_TRACING__";
      function aN() {
        return i9(i$());
      }
      function aj(e10, t10, r10) {
        let n10 = i7(), i10 = n10?.getOptions() || {}, { name: a2 = "" } = e10, s2 = { spanAttributes: { ...e10.attributes }, spanName: a2, parentSampled: r10 };
        n10?.emit("beforeSampling", s2, { decision: false });
        let o2 = s2.parentSampled ?? r10, l2 = s2.spanAttributes, u2 = t10.getPropagationContext(), [d2, c2, p2] = t10.getScopeData().sdkProcessingMetadata[aP] ? [false] : function(e11, t11, r11) {
          let n11, i11;
          if (!ab(e11)) return [false];
          "function" == typeof e11.tracesSampler ? (n11 = e11.tracesSampler({ ...t11, inheritOrSampleWith: (e12) => "number" == typeof t11.parentSampleRate ? t11.parentSampleRate : "boolean" == typeof t11.parentSampled ? Number(t11.parentSampled) : e12 }), i11 = true) : void 0 !== t11.parentSampled ? n11 = t11.parentSampled : void 0 !== e11.tracesSampleRate && (n11 = e11.tracesSampleRate, i11 = true);
          let a3 = aw(n11);
          if (void 0 === a3) return [false];
          if (!a3) return [false, a3, i11];
          let s3 = r11 < a3;
          return [s3, a3, i11];
        }(i10, { name: a2, parentSampled: o2, attributes: l2, parentSampleRate: aw(u2.dsc?.sample_rate) }, u2.sampleRand), h2 = new aO({ ...e10, attributes: { [i8]: "custom", [ae]: void 0 !== c2 && p2 ? c2 : void 0, ...l2 }, sampled: d2 });
        return !d2 && n10 && n10.recordDroppedEvent("sample_rate", "transaction"), n10 && n10.emit("spanStart", h2), h2;
      }
      let aM = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];
      async function aL(e10) {
        let t10 = i7();
        return t10 ? t10.flush(e10) : Promise.resolve(false);
      }
      async function aD() {
        try {
          await aL(2e3);
        } catch (e10) {
        }
      }
      function a$(e10) {
        return new Proxy(e10, { apply: async (e11, t10, r10) => {
          let n10 = "_sentryRewritesTunnelPath" in globalThis ? globalThis._sentryRewritesTunnelPath : void 0;
          if (n10 && "string" == typeof n10) {
            let e12 = r10[0];
            if (e12 instanceof Request && new URL(e12.url).pathname.startsWith(n10)) return new Response(null, { status: 200, headers: { "x-middleware-next": "1" } });
          }
          return function(...e12) {
            let t11 = i9(i$());
            if (2 === e12.length) {
              let [r11, n11] = e12;
              return r11 ? t11.withSetIsolationScope(r11, n11) : t11.withIsolationScope(n11);
            }
            return t11.withIsolationScope(e12[0]);
          }((n11) => {
            let i10, a2, s2 = r10[0], o2 = i5();
            s2 instanceof Request ? (n11.setSDKProcessingMetadata({ normalizedRequest: function(e12) {
              let t11 = function(e13) {
                let t12 = {};
                try {
                  e13.forEach((e14, r11) => {
                    "string" == typeof e14 && (t12[r11] = e14);
                  });
                } catch {
                }
                return t12;
              }(e12.headers);
              return { method: e12.method, url: e12.url, query_string: function(e13) {
                if (e13) try {
                  let t12 = new URL(e13, "http://s.io").search.slice(1);
                  return t12.length ? t12 : void 0;
                } catch {
                  return;
                }
              }(e12.url), headers: t11 };
            }(s2) }), i10 = `middleware ${s2.method} ${new URL(s2.url).pathname}`, a2 = "url") : (i10 = "middleware", a2 = "component"), o2.setTransactionName(i10);
            let l2 = function() {
              let e12 = i9(i$());
              return e12.getActiveSpan ? e12.getActiveSpan() : i5()[iY];
            }();
            if (l2) {
              i10 = "middleware", a2 = "component";
              let e12 = am(l2);
              e12 && ay(e12, o2, n11);
            }
            return function(e12, t11) {
              let r11 = i9(i$());
              if (r11.startSpan) return r11.startSpan(e12, t11);
              let n12 = function(e13) {
                let t12 = { isStandalone: (e13.experimental || {}).standalone, ...e13 };
                if (e13.startTime) {
                  let r12 = { ...t12 };
                  return r12.startTimestamp = as(e13.startTime), delete r12.startTime, r12;
                }
                return t12;
              }(e12), { forceTransaction: i11, parentSpan: a3, scope: s3 } = e12;
              return i6(s3?.clone(), () => {
                var r12;
                return (void 0 !== (r12 = a3) ? (e13) => function(e14, t12) {
                  let r13 = function() {
                    return i9(i$());
                  }();
                  return r13.withActiveSpan ? r13.withActiveSpan(e14, t12) : i6((r14) => (iJ(r14, e14 || void 0), t12(r14)));
                }(r12, e13) : (e13) => e13())(() => {
                  let r13 = i5(), s4 = function(e13, t12) {
                    if (t12) return t12;
                    if (null === t12) return;
                    let r14 = e13[iY];
                    if (!r14) return;
                    let n13 = i7();
                    return (n13 ? n13.getOptions() : {}).parentSpanIsAlwaysRootSpan ? am(r14) : r14;
                  }(r13, a3), o3 = e12.onlyIfParent && !s4 ? new aR() : function({ parentSpan: e13, spanArguments: t12, forceTransaction: r14, scope: n13 }) {
                    var i12, a4, s5;
                    let o4;
                    if (!ab()) {
                      let n14 = new aR();
                      if (r14 || !e13) {
                        let e14 = { sampled: "false", sample_rate: "0", transaction: t12.name, ...aE(n14) };
                        iG(n14, aT, e14);
                      }
                      return n14;
                    }
                    let l3 = i9(i$()).getIsolationScope();
                    if (e13 && !r14) o4 = function(e14, t13, r15) {
                      let { spanId: n14, traceId: i13 } = e14.spanContext(), a5 = !t13.getScopeData().sdkProcessingMetadata[aP] && au(e14), s6 = a5 ? new aO({ ...r15, parentSpanId: n14, traceId: i13, sampled: a5 }) : new aR({ traceId: i13 });
                      ah(e14, s6);
                      let o5 = i7();
                      return o5 && (o5.emit("spanStart", s6), r15.endTimestamp && o5.emit("spanEnd", s6)), s6;
                    }(e13, n13, t12), ah(e13, o4);
                    else if (e13) {
                      let r15 = aE(e13), { traceId: i13, spanId: a5 } = e13.spanContext(), s6 = au(e13);
                      iG(o4 = aj({ traceId: i13, parentSpanId: a5, ...t12 }, n13, s6), aT, r15);
                    } else {
                      let { traceId: e14, dsc: r15, parentSpanId: i13, sampled: a5 } = { ...l3.getPropagationContext(), ...n13.getPropagationContext() };
                      o4 = aj({ traceId: e14, parentSpanId: i13, ...t12 }, n13, a5), r15 && iG(o4, aT, r15);
                    }
                    return s5 = 0, ay(o4, n13, l3), o4;
                  }({ parentSpan: s4, spanArguments: n12, forceTransaction: i11, scope: r13 });
                  return iJ(r13, o3), a_(() => t11(o3), () => {
                    let { status: e13 } = al(o3);
                    o3.isRecording() && (!e13 || "ok" === e13) && o3.setStatus({ code: 2, message: "internal_error" });
                  }, () => {
                    o3.end();
                  });
                });
              });
            }({ name: i10, op: "http.server.middleware", attributes: { [i8]: a2, [ar]: "auto.function.nextjs.wrapMiddlewareWithSentry" } }, () => a_(() => e11.apply(t10, r10), (e12) => {
              i5().captureException(e12, function(e13) {
                if (e13) {
                  var t11;
                  return (t11 = e13) instanceof iQ || "function" == typeof t11 || Object.keys(e13).some((e14) => aM.includes(e14)) ? { captureContext: e13 } : e13;
                }
              }({ mechanism: { type: "instrument", handled: false } }));
            }, () => {
              var e12 = aD();
              let t11 = iD[Symbol.for("@vercel/request-context")], r11 = t11?.get?.();
              r11?.waitUntil && r11.waitUntil(e12);
            }));
          });
        } });
      }
      let aZ = { matcher: ["/((?!_next/static|_next/image|images|icon.png|monitoring|opengraph-image.png|ingest|api|login|api/emails).*)"] };
      var aq = Object.freeze({ __proto__: null, config: aZ, default: async function(e10) {
        console.debug("[MIDDLEWARE] === MIDDLEWARE START ===");
        let t10 = new URL(e10.url);
        console.debug("[MIDDLEWARE] Path:", t10.pathname), console.debug("[MIDDLEWARE] Method:", e10.method);
        let r10 = iP(e10);
        if (console.debug("[MIDDLEWARE] Session cookie exists:", !!r10), ["/login"].includes(t10.pathname)) return console.debug("[MIDDLEWARE] Public path, allowing access"), Q.next();
        if (!r10) return console.debug("[MIDDLEWARE] No session cookie and not on public path, redirecting to /login"), Q.redirect(new URL("/login", e10.url));
        if ("/waitlist" !== t10.pathname) {
          let t11 = await ik("@get/waitlist/status", { headers: { Authorization: `Bearer ${r10}` } });
          if (console.debug("[MIDDLEWARE] Waitlist status:", t11.data), t11.data && !t11.data.accessGranted) return Q.redirect(new URL("/waitlist", e10.url));
        }
        return console.debug("[MIDDLEWARE] Passing through to next handler"), console.debug("[MIDDLEWARE] === MIDDLEWARE END ==="), Q.next();
      } });
      "middleware" in aq && "function" == typeof aq.middleware ? o = aq.middleware : "default" in aq && "function" == typeof aq.default ? l = aq.default : "function" == typeof aq && (l = aq);
      let aU = o ? a$(o) : void 0, az = l ? a$(l) : void 0, aF = (Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 }), { ...m }), aB = aF.middleware || aF.default, aW = "/middleware";
      if ("function" != typeof aB) throw Object.defineProperty(Error(`The Middleware "${aW}" must export a \`middleware\` or a \`default\` function`), "__NEXT_ERROR_CODE", { value: "E120", enumerable: false, configurable: true });
      function aV(e10) {
        return tm({ ...e10, page: aW, handler: async (...e11) => {
          try {
            return await aB(...e11);
          } catch (i10) {
            let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
            throw await v(i10, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/middleware", routeType: "middleware", revalidateReason: void 0 }), i10;
          }
        } });
      }
    }, 633: (e, t, r) => {
      "use strict";
      e.exports = r(457);
    }, 670: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return s;
      }, withRequest: function() {
        return a;
      } });
      let n = new (r(521)).AsyncLocalStorage();
      function i(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function a(e2, t2, r2) {
        let a2 = i(e2, t2);
        return a2 ? n.run(a2, r2) : r2();
      }
      function s(e2, t2) {
        let r2 = n.getStore();
        return r2 || (e2 && t2 ? i(e2, t2) : void 0);
      }
    }, 681: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, i = Object.prototype.hasOwnProperty, a = {};
      function s(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function o(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = o(e2), { domain: i2, expires: a2, httponly: s2, maxage: l2, path: c2, samesite: p2, secure: h, partitioned: m, priority: f } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var g, y, v = { name: t2, value: decodeURIComponent(r2), domain: i2, ...a2 && { expires: new Date(a2) }, ...s2 && { httpOnly: true }, ..."string" == typeof l2 && { maxAge: Number(l2) }, path: c2, ...p2 && { sameSite: u.includes(g = (g = p2).toLowerCase()) ? g : void 0 }, ...h && { secure: true }, ...f && { priority: d.includes(y = (y = f).toLowerCase()) ? y : void 0 }, ...m && { partitioned: true } };
          let e3 = {};
          for (let t3 in v) v[t3] && (e3[t3] = v[t3]);
          return e3;
        }
      }
      ((e2, r2) => {
        for (var n2 in r2) t(e2, n2, { get: r2[n2], enumerable: true });
      })(a, { RequestCookies: () => c, ResponseCookies: () => p, parseCookie: () => o, parseSetCookie: () => l, stringifyCookie: () => s }), e.exports = ((e2, a2, s2, o2) => {
        if (a2 && "object" == typeof a2 || "function" == typeof a2) for (let l2 of n(a2)) i.call(e2, l2) || l2 === s2 || t(e2, l2, { get: () => a2[l2], enumerable: !(o2 = r(a2, l2)) || o2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), a);
      var u = ["strict", "lax", "none"], d = ["low", "medium", "high"], c = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of o(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => s(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => s(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, p = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, a2, s2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, a2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (a2 = true, o2 = i3, s2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!a2 || o2 >= e4.length) && s2.push(e4.substring(t3, e4.length));
            }
            return s2;
          }(i2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = s(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(s).join("; ");
        }
      };
    }, 711: (e, t, r) => {
      "use strict";
      var n = r(356).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return o;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return a;
      } });
      let i = r(670), a = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function s(e2, t2) {
        let { url: r2, method: i2, headers: a2, body: s2, cache: o2, credentials: l2, integrity: u, mode: d, redirect: c, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(a2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: s2 ? n.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u, mode: d, redirect: c, referrer: p, referrerPolicy: h } };
      }
      async function o(e2, t2) {
        let r2 = (0, i.getTestReqInfo)(t2, a);
        if (!r2) return e2(t2);
        let { testData: o2, proxyPort: l2 } = r2, u = await s(o2, t2), d = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!d.ok) throw Object.defineProperty(Error(`Proxy request failed: ${d.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let c = await d.json(), { api: p } = c;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
        }
        let { status: h, headers: m, body: f } = c.response;
        return new Response(f ? n.from(f, "base64") : null, { status: h, headers: new Headers(m) });
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? e2(t2, r2) : o(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 879: (e) => {
      (() => {
        "use strict";
        var t = { 993: (e2) => {
          var t2 = Object.prototype.hasOwnProperty, r2 = "~";
          function n2() {
          }
          function i2(e3, t3, r3) {
            this.fn = e3, this.context = t3, this.once = r3 || false;
          }
          function a(e3, t3, n3, a2, s2) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o2 = new i2(n3, a2 || e3, s2), l = r2 ? r2 + t3 : t3;
            return e3._events[l] ? e3._events[l].fn ? e3._events[l] = [e3._events[l], o2] : e3._events[l].push(o2) : (e3._events[l] = o2, e3._eventsCount++), e3;
          }
          function s(e3, t3) {
            0 == --e3._eventsCount ? e3._events = new n2() : delete e3._events[t3];
          }
          function o() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r2 = false)), o.prototype.eventNames = function() {
            var e3, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e3 = this._events) t2.call(e3, n3) && i3.push(r2 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e3)) : i3;
          }, o.prototype.listeners = function(e3) {
            var t3 = r2 ? r2 + e3 : e3, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, a2 = n3.length, s2 = Array(a2); i3 < a2; i3++) s2[i3] = n3[i3].fn;
            return s2;
          }, o.prototype.listenerCount = function(e3) {
            var t3 = r2 ? r2 + e3 : e3, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o.prototype.emit = function(e3, t3, n3, i3, a2, s2) {
            var o2 = r2 ? r2 + e3 : e3;
            if (!this._events[o2]) return false;
            var l, u, d = this._events[o2], c = arguments.length;
            if (d.fn) {
              switch (d.once && this.removeListener(e3, d.fn, void 0, true), c) {
                case 1:
                  return d.fn.call(d.context), true;
                case 2:
                  return d.fn.call(d.context, t3), true;
                case 3:
                  return d.fn.call(d.context, t3, n3), true;
                case 4:
                  return d.fn.call(d.context, t3, n3, i3), true;
                case 5:
                  return d.fn.call(d.context, t3, n3, i3, a2), true;
                case 6:
                  return d.fn.call(d.context, t3, n3, i3, a2, s2), true;
              }
              for (u = 1, l = Array(c - 1); u < c; u++) l[u - 1] = arguments[u];
              d.fn.apply(d.context, l);
            } else {
              var p, h = d.length;
              for (u = 0; u < h; u++) switch (d[u].once && this.removeListener(e3, d[u].fn, void 0, true), c) {
                case 1:
                  d[u].fn.call(d[u].context);
                  break;
                case 2:
                  d[u].fn.call(d[u].context, t3);
                  break;
                case 3:
                  d[u].fn.call(d[u].context, t3, n3);
                  break;
                case 4:
                  d[u].fn.call(d[u].context, t3, n3, i3);
                  break;
                default:
                  if (!l) for (p = 1, l = Array(c - 1); p < c; p++) l[p - 1] = arguments[p];
                  d[u].fn.apply(d[u].context, l);
              }
            }
            return true;
          }, o.prototype.on = function(e3, t3, r3) {
            return a(this, e3, t3, r3, false);
          }, o.prototype.once = function(e3, t3, r3) {
            return a(this, e3, t3, r3, true);
          }, o.prototype.removeListener = function(e3, t3, n3, i3) {
            var a2 = r2 ? r2 + e3 : e3;
            if (!this._events[a2]) return this;
            if (!t3) return s(this, a2), this;
            var o2 = this._events[a2];
            if (o2.fn) o2.fn !== t3 || i3 && !o2.once || n3 && o2.context !== n3 || s(this, a2);
            else {
              for (var l = 0, u = [], d = o2.length; l < d; l++) (o2[l].fn !== t3 || i3 && !o2[l].once || n3 && o2[l].context !== n3) && u.push(o2[l]);
              u.length ? this._events[a2] = 1 === u.length ? u[0] : u : s(this, a2);
            }
            return this;
          }, o.prototype.removeAllListeners = function(e3) {
            var t3;
            return e3 ? (t3 = r2 ? r2 + e3 : e3, this._events[t3] && s(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = r2, o.EventEmitter = o, e2.exports = o;
        }, 213: (e2) => {
          e2.exports = (e3, t2) => (t2 = t2 || (() => {
          }), e3.then((e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => e4), (e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => {
            throw e4;
          })));
        }, 574: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e3, t3, r2) {
            let n2 = 0, i2 = e3.length;
            for (; i2 > 0; ) {
              let a = i2 / 2 | 0, s = n2 + a;
              0 >= r2(e3[s], t3) ? (n2 = ++s, i2 -= a + 1) : i2 = a;
            }
            return n2;
          };
        }, 821: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r2(574);
          class i2 {
            constructor() {
              this._queue = [];
            }
            enqueue(e3, t3) {
              let r3 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e3 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r3);
              let i3 = n2.default(this._queue, r3, (e4, t4) => t4.priority - e4.priority);
              this._queue.splice(i3, 0, r3);
            }
            dequeue() {
              let e3 = this._queue.shift();
              return null == e3 ? void 0 : e3.run;
            }
            filter(e3) {
              return this._queue.filter((t3) => t3.priority === e3.priority).map((e4) => e4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          t2.default = i2;
        }, 816: (e2, t2, r2) => {
          let n2 = r2(213);
          class i2 extends Error {
            constructor(e3) {
              super(e3), this.name = "TimeoutError";
            }
          }
          let a = (e3, t3, r3) => new Promise((a2, s) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void a2(e3);
            let o = setTimeout(() => {
              if ("function" == typeof r3) {
                try {
                  a2(r3());
                } catch (e4) {
                  s(e4);
                }
                return;
              }
              let n3 = "string" == typeof r3 ? r3 : `Promise timed out after ${t3} milliseconds`, o2 = r3 instanceof Error ? r3 : new i2(n3);
              "function" == typeof e3.cancel && e3.cancel(), s(o2);
            }, t3);
            n2(e3.then(a2, s), () => {
              clearTimeout(o);
            });
          });
          e2.exports = a, e2.exports.default = a, e2.exports.TimeoutError = i2;
        } }, r = {};
        function n(e2) {
          var i2 = r[e2];
          if (void 0 !== i2) return i2.exports;
          var a = r[e2] = { exports: {} }, s = true;
          try {
            t[e2](a, a.exports, n), s = false;
          } finally {
            s && delete r[e2];
          }
          return a.exports;
        }
        n.ab = "//";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true });
          let e2 = n(993), t2 = n(816), r2 = n(821), a = () => {
          }, s = new t2.TimeoutError();
          class o extends e2 {
            constructor(e3) {
              var t3, n2, i2, s2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = a, this._resolveIdle = a, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: r2.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (n2 = null == (t3 = e3.intervalCap) ? void 0 : t3.toString()) ? n2 : ""}\` (${typeof e3.intervalCap})`);
              if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (s2 = null == (i2 = e3.interval) ? void 0 : i2.toString()) ? s2 : ""}\` (${typeof e3.interval})`);
              this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = a, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = a, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let e3 = Date.now();
              if (void 0 === this._intervalId) {
                let t3 = this._intervalEnd - e3;
                if (!(t3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, t3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let e3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let t3 = this._queue.dequeue();
                  return !!t3 && (this.emit("active"), t3(), e3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(e3) {
              if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
              this._concurrency = e3, this._processQueue();
            }
            async add(e3, r3 = {}) {
              return new Promise((n2, i2) => {
                let a2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let a3 = void 0 === this._timeout && void 0 === r3.timeout ? e3() : t2.default(Promise.resolve(e3()), void 0 === r3.timeout ? this._timeout : r3.timeout, () => {
                      (void 0 === r3.throwOnTimeout ? this._throwOnTimeout : r3.throwOnTimeout) && i2(s);
                    });
                    n2(await a3);
                  } catch (e4) {
                    i2(e4);
                  }
                  this._next();
                };
                this._queue.enqueue(a2, r3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(e3, t3) {
              return Promise.all(e3.map(async (e4) => this.add(e4, t3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((e3) => {
                let t3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  t3(), e3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
                let t3 = this._resolveIdle;
                this._resolveIdle = () => {
                  t3(), e3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(e3) {
              return this._queue.filter(e3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(e3) {
              this._timeout = e3;
            }
          }
          i.default = o;
        })(), e.exports = i;
      })();
    }, 980: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { DiagConsoleLogger: () => j, DiagLogLevel: () => n, INVALID_SPANID: () => ec, INVALID_SPAN_CONTEXT: () => eh, INVALID_TRACEID: () => ep, ProxyTracer: () => eA, ProxyTracerProvider: () => eN, ROOT_CONTEXT: () => P, SamplingDecision: () => s, SpanKind: () => o, SpanStatusCode: () => l, TraceFlags: () => a, ValueType: () => i, baggageEntryMetadataFromString: () => I, context: () => eq, createContextKey: () => A, createNoopMeter: () => ee, createTraceState: () => eZ, default: () => e2, defaultTextMapGetter: () => et, defaultTextMapSetter: () => er, diag: () => eU, isSpanContextValid: () => eE, isValidSpanId: () => eT, isValidTraceId: () => ek, metrics: () => eB, propagation: () => eQ, trace: () => e1 });
      var n, i, a, s, o, l, u = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof r.g ? r.g : {}, d = "1.9.0", c = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, p = function(e3) {
        var t2 = /* @__PURE__ */ new Set([e3]), r2 = /* @__PURE__ */ new Set(), n2 = e3.match(c);
        if (!n2) return function() {
          return false;
        };
        var i2 = { major: +n2[1], minor: +n2[2], patch: +n2[3], prerelease: n2[4] };
        if (null != i2.prerelease) return function(t3) {
          return t3 === e3;
        };
        function a2(e4) {
          return r2.add(e4), false;
        }
        return function(e4) {
          if (t2.has(e4)) return true;
          if (r2.has(e4)) return false;
          var n3 = e4.match(c);
          if (!n3) return a2(e4);
          var s2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
          if (null != s2.prerelease || i2.major !== s2.major) return a2(e4);
          if (0 === i2.major) return i2.minor === s2.minor && i2.patch <= s2.patch ? (t2.add(e4), true) : a2(e4);
          return i2.minor <= s2.minor ? (t2.add(e4), true) : a2(e4);
        };
      }(d), h = Symbol.for("opentelemetry.js.api." + d.split(".")[0]);
      function m(e3, t2, r2, n2) {
        void 0 === n2 && (n2 = false);
        var i2, a2 = u[h] = null != (i2 = u[h]) ? i2 : { version: d };
        if (!n2 && a2[e3]) {
          var s2 = Error("@opentelemetry/api: Attempted duplicate registration of API: " + e3);
          return r2.error(s2.stack || s2.message), false;
        }
        if (a2.version !== d) {
          var s2 = Error("@opentelemetry/api: Registration of version v" + a2.version + " for " + e3 + " does not match previously registered API v" + d);
          return r2.error(s2.stack || s2.message), false;
        }
        return a2[e3] = t2, r2.debug("@opentelemetry/api: Registered a global for " + e3 + " v" + d + "."), true;
      }
      function f(e3) {
        var t2, r2, n2 = null == (t2 = u[h]) ? void 0 : t2.version;
        if (n2 && p(n2)) return null == (r2 = u[h]) ? void 0 : r2[e3];
      }
      function g(e3, t2) {
        t2.debug("@opentelemetry/api: Unregistering a global for " + e3 + " v" + d + ".");
        var r2 = u[h];
        r2 && delete r2[e3];
      }
      var y = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, i2, a2 = r2.call(e3), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = a2.next()).done; ) s2.push(n2.value);
        } catch (e4) {
          i2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = a2.return) && r2.call(a2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return s2;
      }, v = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, a2 = t2.length; i2 < a2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, _ = function() {
        function e3(e4) {
          this._namespace = e4.namespace || "DiagComponentLogger";
        }
        return e3.prototype.debug = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return b("debug", this._namespace, e4);
        }, e3.prototype.error = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return b("error", this._namespace, e4);
        }, e3.prototype.info = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return b("info", this._namespace, e4);
        }, e3.prototype.warn = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return b("warn", this._namespace, e4);
        }, e3.prototype.verbose = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return b("verbose", this._namespace, e4);
        }, e3;
      }();
      function b(e3, t2, r2) {
        var n2 = f("diag");
        if (n2) return r2.unshift(t2), n2[e3].apply(n2, v([], y(r2), false));
      }
      !function(e3) {
        e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
      }(n || (n = {}));
      var w = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, i2, a2 = r2.call(e3), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = a2.next()).done; ) s2.push(n2.value);
        } catch (e4) {
          i2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = a2.return) && r2.call(a2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return s2;
      }, x = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, a2 = t2.length; i2 < a2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, S = function() {
        function e3() {
          function e4(e5) {
            return function() {
              for (var t3 = [], r2 = 0; r2 < arguments.length; r2++) t3[r2] = arguments[r2];
              var n2 = f("diag");
              if (n2) return n2[e5].apply(n2, x([], w(t3), false));
            };
          }
          var t2 = this;
          t2.setLogger = function(e5, r2) {
            if (void 0 === r2 && (r2 = { logLevel: n.INFO }), e5 === t2) {
              var i2, a2, s2, o2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return t2.error(null != (i2 = o2.stack) ? i2 : o2.message), false;
            }
            "number" == typeof r2 && (r2 = { logLevel: r2 });
            var l2 = f("diag"), u2 = function(e6, t3) {
              function r3(r4, n2) {
                var i3 = t3[r4];
                return "function" == typeof i3 && e6 >= n2 ? i3.bind(t3) : function() {
                };
              }
              return e6 < n.NONE ? e6 = n.NONE : e6 > n.ALL && (e6 = n.ALL), t3 = t3 || {}, { error: r3("error", n.ERROR), warn: r3("warn", n.WARN), info: r3("info", n.INFO), debug: r3("debug", n.DEBUG), verbose: r3("verbose", n.VERBOSE) };
            }(null != (a2 = r2.logLevel) ? a2 : n.INFO, e5);
            if (l2 && !r2.suppressOverrideMessage) {
              var d2 = null != (s2 = Error().stack) ? s2 : "<failed to generate stacktrace>";
              l2.warn("Current logger will be overwritten from " + d2), u2.warn("Current logger will overwrite one already registered from " + d2);
            }
            return m("diag", u2, t2, true);
          }, t2.disable = function() {
            g("diag", t2);
          }, t2.createComponentLogger = function(e5) {
            return new _(e5);
          }, t2.verbose = e4("verbose"), t2.debug = e4("debug"), t2.info = e4("info"), t2.warn = e4("warn"), t2.error = e4("error");
        }
        return e3.instance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3;
      }(), k = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, i2, a2 = r2.call(e3), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = a2.next()).done; ) s2.push(n2.value);
        } catch (e4) {
          i2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = a2.return) && r2.call(a2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return s2;
      }, T = function(e3) {
        var t2 = "function" == typeof Symbol && Symbol.iterator, r2 = t2 && e3[t2], n2 = 0;
        if (r2) return r2.call(e3);
        if (e3 && "number" == typeof e3.length) return { next: function() {
          return e3 && n2 >= e3.length && (e3 = void 0), { value: e3 && e3[n2++], done: !e3 };
        } };
        throw TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, E = function() {
        function e3(e4) {
          this._entries = e4 ? new Map(e4) : /* @__PURE__ */ new Map();
        }
        return e3.prototype.getEntry = function(e4) {
          var t2 = this._entries.get(e4);
          if (t2) return Object.assign({}, t2);
        }, e3.prototype.getAllEntries = function() {
          return Array.from(this._entries.entries()).map(function(e4) {
            var t2 = k(e4, 2);
            return [t2[0], t2[1]];
          });
        }, e3.prototype.setEntry = function(t2, r2) {
          var n2 = new e3(this._entries);
          return n2._entries.set(t2, r2), n2;
        }, e3.prototype.removeEntry = function(t2) {
          var r2 = new e3(this._entries);
          return r2._entries.delete(t2), r2;
        }, e3.prototype.removeEntries = function() {
          for (var t2, r2, n2 = [], i2 = 0; i2 < arguments.length; i2++) n2[i2] = arguments[i2];
          var a2 = new e3(this._entries);
          try {
            for (var s2 = T(n2), o2 = s2.next(); !o2.done; o2 = s2.next()) {
              var l2 = o2.value;
              a2._entries.delete(l2);
            }
          } catch (e4) {
            t2 = { error: e4 };
          } finally {
            try {
              o2 && !o2.done && (r2 = s2.return) && r2.call(s2);
            } finally {
              if (t2) throw t2.error;
            }
          }
          return a2;
        }, e3.prototype.clear = function() {
          return new e3();
        }, e3;
      }(), R = Symbol("BaggageEntryMetadata"), C = S.instance();
      function O(e3) {
        return void 0 === e3 && (e3 = {}), new E(new Map(Object.entries(e3)));
      }
      function I(e3) {
        return "string" != typeof e3 && (C.error("Cannot create baggage metadata from unknown type: " + typeof e3), e3 = ""), { __TYPE__: R, toString: function() {
          return e3;
        } };
      }
      function A(e3) {
        return Symbol.for(e3);
      }
      var P = new function e3(t2) {
        var r2 = this;
        r2._currentContext = t2 ? new Map(t2) : /* @__PURE__ */ new Map(), r2.getValue = function(e4) {
          return r2._currentContext.get(e4);
        }, r2.setValue = function(t3, n2) {
          var i2 = new e3(r2._currentContext);
          return i2._currentContext.set(t3, n2), i2;
        }, r2.deleteValue = function(t3) {
          var n2 = new e3(r2._currentContext);
          return n2._currentContext.delete(t3), n2;
        };
      }(), N = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], j = function() {
        for (var e3 = 0; e3 < N.length; e3++) this[N[e3].n] = /* @__PURE__ */ function(e4) {
          return function() {
            for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
            if (console) {
              var n2 = console[e4];
              if ("function" != typeof n2 && (n2 = console.log), "function" == typeof n2) return n2.apply(console, t2);
            }
          };
        }(N[e3].c);
      }, M = /* @__PURE__ */ function() {
        var e3 = function(t2, r2) {
          return (e3 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e4, t3) {
            e4.__proto__ = t3;
          } || function(e4, t3) {
            for (var r3 in t3) Object.prototype.hasOwnProperty.call(t3, r3) && (e4[r3] = t3[r3]);
          })(t2, r2);
        };
        return function(t2, r2) {
          if ("function" != typeof r2 && null !== r2) throw TypeError("Class extends value " + String(r2) + " is not a constructor or null");
          function n2() {
            this.constructor = t2;
          }
          e3(t2, r2), t2.prototype = null === r2 ? Object.create(r2) : (n2.prototype = r2.prototype, new n2());
        };
      }(), L = function() {
        function e3() {
        }
        return e3.prototype.createGauge = function(e4, t2) {
          return K;
        }, e3.prototype.createHistogram = function(e4, t2) {
          return X;
        }, e3.prototype.createCounter = function(e4, t2) {
          return H;
        }, e3.prototype.createUpDownCounter = function(e4, t2) {
          return G;
        }, e3.prototype.createObservableGauge = function(e4, t2) {
          return J;
        }, e3.prototype.createObservableCounter = function(e4, t2) {
          return Y;
        }, e3.prototype.createObservableUpDownCounter = function(e4, t2) {
          return Q;
        }, e3.prototype.addBatchObservableCallback = function(e4, t2) {
        }, e3.prototype.removeBatchObservableCallback = function(e4) {
        }, e3;
      }(), D = function() {
      }, $ = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.add = function(e4, t3) {
        }, t2;
      }(D), Z = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.add = function(e4, t3) {
        }, t2;
      }(D), q = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.record = function(e4, t3) {
        }, t2;
      }(D), U = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.record = function(e4, t3) {
        }, t2;
      }(D), z = function() {
        function e3() {
        }
        return e3.prototype.addCallback = function(e4) {
        }, e3.prototype.removeCallback = function(e4) {
        }, e3;
      }(), F = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }(z), B = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }(z), W = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }(z), V = new L(), H = new $(), K = new q(), X = new U(), G = new Z(), Y = new F(), J = new B(), Q = new W();
      function ee() {
        return V;
      }
      !function(e3) {
        e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
      }(i || (i = {}));
      var et = { get: function(e3, t2) {
        if (null != e3) return e3[t2];
      }, keys: function(e3) {
        return null == e3 ? [] : Object.keys(e3);
      } }, er = { set: function(e3, t2, r2) {
        null != e3 && (e3[t2] = r2);
      } }, en = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, i2, a2 = r2.call(e3), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = a2.next()).done; ) s2.push(n2.value);
        } catch (e4) {
          i2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = a2.return) && r2.call(a2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return s2;
      }, ei = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, a2 = t2.length; i2 < a2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, ea = function() {
        function e3() {
        }
        return e3.prototype.active = function() {
          return P;
        }, e3.prototype.with = function(e4, t2, r2) {
          for (var n2 = [], i2 = 3; i2 < arguments.length; i2++) n2[i2 - 3] = arguments[i2];
          return t2.call.apply(t2, ei([r2], en(n2), false));
        }, e3.prototype.bind = function(e4, t2) {
          return t2;
        }, e3.prototype.enable = function() {
          return this;
        }, e3.prototype.disable = function() {
          return this;
        }, e3;
      }(), es = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, i2, a2 = r2.call(e3), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = a2.next()).done; ) s2.push(n2.value);
        } catch (e4) {
          i2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = a2.return) && r2.call(a2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return s2;
      }, eo = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, a2 = t2.length; i2 < a2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, el = "context", eu = new ea(), ed = function() {
        function e3() {
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalContextManager = function(e4) {
          return m(el, e4, S.instance());
        }, e3.prototype.active = function() {
          return this._getContextManager().active();
        }, e3.prototype.with = function(e4, t2, r2) {
          for (var n2, i2 = [], a2 = 3; a2 < arguments.length; a2++) i2[a2 - 3] = arguments[a2];
          return (n2 = this._getContextManager()).with.apply(n2, eo([e4, t2, r2], es(i2), false));
        }, e3.prototype.bind = function(e4, t2) {
          return this._getContextManager().bind(e4, t2);
        }, e3.prototype._getContextManager = function() {
          return f(el) || eu;
        }, e3.prototype.disable = function() {
          this._getContextManager().disable(), g(el, S.instance());
        }, e3;
      }();
      !function(e3) {
        e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
      }(a || (a = {}));
      var ec = "0000000000000000", ep = "00000000000000000000000000000000", eh = { traceId: ep, spanId: ec, traceFlags: a.NONE }, em = function() {
        function e3(e4) {
          void 0 === e4 && (e4 = eh), this._spanContext = e4;
        }
        return e3.prototype.spanContext = function() {
          return this._spanContext;
        }, e3.prototype.setAttribute = function(e4, t2) {
          return this;
        }, e3.prototype.setAttributes = function(e4) {
          return this;
        }, e3.prototype.addEvent = function(e4, t2) {
          return this;
        }, e3.prototype.addLink = function(e4) {
          return this;
        }, e3.prototype.addLinks = function(e4) {
          return this;
        }, e3.prototype.setStatus = function(e4) {
          return this;
        }, e3.prototype.updateName = function(e4) {
          return this;
        }, e3.prototype.end = function(e4) {
        }, e3.prototype.isRecording = function() {
          return false;
        }, e3.prototype.recordException = function(e4, t2) {
        }, e3;
      }(), ef = A("OpenTelemetry Context Key SPAN");
      function eg(e3) {
        return e3.getValue(ef) || void 0;
      }
      function ey() {
        return eg(ed.getInstance().active());
      }
      function ev(e3, t2) {
        return e3.setValue(ef, t2);
      }
      function e_(e3) {
        return e3.deleteValue(ef);
      }
      function eb(e3, t2) {
        return ev(e3, new em(t2));
      }
      function ew(e3) {
        var t2;
        return null == (t2 = eg(e3)) ? void 0 : t2.spanContext();
      }
      var ex = /^([0-9a-f]{32})$/i, eS = /^[0-9a-f]{16}$/i;
      function ek(e3) {
        return ex.test(e3) && e3 !== ep;
      }
      function eT(e3) {
        return eS.test(e3) && e3 !== ec;
      }
      function eE(e3) {
        return ek(e3.traceId) && eT(e3.spanId);
      }
      function eR(e3) {
        return new em(e3);
      }
      var eC = ed.getInstance(), eO = function() {
        function e3() {
        }
        return e3.prototype.startSpan = function(e4, t2, r2) {
          if (void 0 === r2 && (r2 = eC.active()), null == t2 ? void 0 : t2.root) return new em();
          var n2, i2 = r2 && ew(r2);
          return "object" == typeof (n2 = i2) && "string" == typeof n2.spanId && "string" == typeof n2.traceId && "number" == typeof n2.traceFlags && eE(i2) ? new em(i2) : new em();
        }, e3.prototype.startActiveSpan = function(e4, t2, r2, n2) {
          if (!(arguments.length < 2)) {
            2 == arguments.length ? s2 = t2 : 3 == arguments.length ? (i2 = t2, s2 = r2) : (i2 = t2, a2 = r2, s2 = n2);
            var i2, a2, s2, o2 = null != a2 ? a2 : eC.active(), l2 = this.startSpan(e4, i2, o2), u2 = ev(o2, l2);
            return eC.with(u2, s2, void 0, l2);
          }
        }, e3;
      }(), eI = new eO(), eA = function() {
        function e3(e4, t2, r2, n2) {
          this._provider = e4, this.name = t2, this.version = r2, this.options = n2;
        }
        return e3.prototype.startSpan = function(e4, t2, r2) {
          return this._getTracer().startSpan(e4, t2, r2);
        }, e3.prototype.startActiveSpan = function(e4, t2, r2, n2) {
          var i2 = this._getTracer();
          return Reflect.apply(i2.startActiveSpan, i2, arguments);
        }, e3.prototype._getTracer = function() {
          if (this._delegate) return this._delegate;
          var e4 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e4 ? (this._delegate = e4, this._delegate) : eI;
        }, e3;
      }(), eP = new (function() {
        function e3() {
        }
        return e3.prototype.getTracer = function(e4, t2, r2) {
          return new eO();
        }, e3;
      }())(), eN = function() {
        function e3() {
        }
        return e3.prototype.getTracer = function(e4, t2, r2) {
          var n2;
          return null != (n2 = this.getDelegateTracer(e4, t2, r2)) ? n2 : new eA(this, e4, t2, r2);
        }, e3.prototype.getDelegate = function() {
          var e4;
          return null != (e4 = this._delegate) ? e4 : eP;
        }, e3.prototype.setDelegate = function(e4) {
          this._delegate = e4;
        }, e3.prototype.getDelegateTracer = function(e4, t2, r2) {
          var n2;
          return null == (n2 = this._delegate) ? void 0 : n2.getTracer(e4, t2, r2);
        }, e3;
      }();
      !function(e3) {
        e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      }(s || (s = {})), function(e3) {
        e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
      }(o || (o = {})), function(e3) {
        e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
      }(l || (l = {}));
      var ej = "[_0-9a-z-*/]", eM = RegExp("^(?:[a-z]" + ej + "{0,255}|" + ("[a-z0-9]" + ej + "{0,240}@[a-z]") + ej + "{0,13})$"), eL = /^[ -~]{0,255}[!-~]$/, eD = /,|=/, e$ = function() {
        function e3(e4) {
          this._internalState = /* @__PURE__ */ new Map(), e4 && this._parse(e4);
        }
        return e3.prototype.set = function(e4, t2) {
          var r2 = this._clone();
          return r2._internalState.has(e4) && r2._internalState.delete(e4), r2._internalState.set(e4, t2), r2;
        }, e3.prototype.unset = function(e4) {
          var t2 = this._clone();
          return t2._internalState.delete(e4), t2;
        }, e3.prototype.get = function(e4) {
          return this._internalState.get(e4);
        }, e3.prototype.serialize = function() {
          var e4 = this;
          return this._keys().reduce(function(t2, r2) {
            return t2.push(r2 + "=" + e4.get(r2)), t2;
          }, []).join(",");
        }, e3.prototype._parse = function(e4) {
          !(e4.length > 512) && (this._internalState = e4.split(",").reverse().reduce(function(e5, t2) {
            var r2 = t2.trim(), n2 = r2.indexOf("=");
            if (-1 !== n2) {
              var i2 = r2.slice(0, n2), a2 = r2.slice(n2 + 1, t2.length);
              eM.test(i2) && eL.test(a2) && !eD.test(a2) && e5.set(i2, a2);
            }
            return e5;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }, e3.prototype._keys = function() {
          return Array.from(this._internalState.keys()).reverse();
        }, e3.prototype._clone = function() {
          var t2 = new e3();
          return t2._internalState = new Map(this._internalState), t2;
        }, e3;
      }();
      function eZ(e3) {
        return new e$(e3);
      }
      var eq = ed.getInstance(), eU = S.instance(), ez = new (function() {
        function e3() {
        }
        return e3.prototype.getMeter = function(e4, t2, r2) {
          return V;
        }, e3;
      }())(), eF = "metrics", eB = function() {
        function e3() {
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalMeterProvider = function(e4) {
          return m(eF, e4, S.instance());
        }, e3.prototype.getMeterProvider = function() {
          return f(eF) || ez;
        }, e3.prototype.getMeter = function(e4, t2, r2) {
          return this.getMeterProvider().getMeter(e4, t2, r2);
        }, e3.prototype.disable = function() {
          g(eF, S.instance());
        }, e3;
      }().getInstance(), eW = function() {
        function e3() {
        }
        return e3.prototype.inject = function(e4, t2) {
        }, e3.prototype.extract = function(e4, t2) {
          return e4;
        }, e3.prototype.fields = function() {
          return [];
        }, e3;
      }(), eV = A("OpenTelemetry Baggage Key");
      function eH(e3) {
        return e3.getValue(eV) || void 0;
      }
      function eK() {
        return eH(ed.getInstance().active());
      }
      function eX(e3, t2) {
        return e3.setValue(eV, t2);
      }
      function eG(e3) {
        return e3.deleteValue(eV);
      }
      var eY = "propagation", eJ = new eW(), eQ = function() {
        function e3() {
          this.createBaggage = O, this.getBaggage = eH, this.getActiveBaggage = eK, this.setBaggage = eX, this.deleteBaggage = eG;
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalPropagator = function(e4) {
          return m(eY, e4, S.instance());
        }, e3.prototype.inject = function(e4, t2, r2) {
          return void 0 === r2 && (r2 = er), this._getGlobalPropagator().inject(e4, t2, r2);
        }, e3.prototype.extract = function(e4, t2, r2) {
          return void 0 === r2 && (r2 = et), this._getGlobalPropagator().extract(e4, t2, r2);
        }, e3.prototype.fields = function() {
          return this._getGlobalPropagator().fields();
        }, e3.prototype.disable = function() {
          g(eY, S.instance());
        }, e3.prototype._getGlobalPropagator = function() {
          return f(eY) || eJ;
        }, e3;
      }().getInstance(), e0 = "trace", e1 = function() {
        function e3() {
          this._proxyTracerProvider = new eN(), this.wrapSpanContext = eR, this.isSpanContextValid = eE, this.deleteSpan = e_, this.getSpan = eg, this.getActiveSpan = ey, this.getSpanContext = ew, this.setSpan = ev, this.setSpanContext = eb;
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalTracerProvider = function(e4) {
          var t2 = m(e0, this._proxyTracerProvider, S.instance());
          return t2 && this._proxyTracerProvider.setDelegate(e4), t2;
        }, e3.prototype.getTracerProvider = function() {
          return f(e0) || this._proxyTracerProvider;
        }, e3.prototype.getTracer = function(e4, t2) {
          return this.getTracerProvider().getTracer(e4, t2);
        }, e3.prototype.disable = function() {
          g(e0, S.instance()), this._proxyTracerProvider = new eN();
        }, e3;
      }().getInstance();
      let e2 = { context: eq, diag: eU, metrics: eB, propagation: eQ, trace: e1 };
    } }, (e) => {
      var t = e(e.s = 586);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES).middleware_middleware = t;
    }]);
  }
});

// ../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|images|icon.png|monitoring|opengraph-image.png|ingest|api|login|api\\/emails).*))(\\.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";
import { Readable as Readable2 } from "node:stream";

// ../../node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": { "_sentryRewriteFramesDistDir": ".next", "_sentryRewriteFramesAssetPrefixPath": "", "_sentryRewritesTunnelPath": "/monitoring", "_sentryRelease": "d996402d1399d257b333c8899bc1de90f1c167a6" }, "eslint": { "ignoreDuringBuilds": true }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": false, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "remotePatterns": [], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/root/repo", "experimental": { "nodeMiddleware": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 0, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 4294967294 } }, "cacheHandlers": {}, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientSegmentCache": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 1, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedRoutes": false, "typedEnv": false, "clientTraceMetadata": ["baggage", "sentry-trace"], "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "useEarlyImport": false, "viewTransition": true, "routerBFCache": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactCompiler": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "dynamicIO": false, "inlineCss": false, "useCache": false, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-squlite-node", "@effect/sql-squlite-bun", "@effect/sql-squlite-wasm", "@effect/sql-squlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "skipTrailingSlashRedirect": true, "serverExternalPackages": ["amqplib", "connect", "dataloader", "express", "generic-pool", "graphql", "@hapi/hapi", "ioredis", "kafkajs", "koa", "lru-memoizer", "mongodb", "mongoose", "mysql", "mysql2", "knex", "pg", "pg-pool", "@node-redis/client", "@redis/client", "redis", "tedious"], "turbopack": { "root": "/root/repo" }, "_originalRewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/monitoring(/?)", "has": [{ "type": "query", "key": "o", "value": "(?<orgid>\\d*)" }, { "type": "query", "key": "p", "value": "(?<projectid>\\d*)" }, { "type": "query", "key": "r", "value": "(?<region>[a-z]{2})" }], "destination": "https://o:orgid.ingest.:region.sentry.io/api/:projectid/envelope/?hsts=0" }, { "source": "/monitoring(/?)", "has": [{ "type": "query", "key": "o", "value": "(?<orgid>\\d*)" }, { "type": "query", "key": "p", "value": "(?<projectid>\\d*)" }], "destination": "https://o:orgid.ingest.sentry.io/api/:projectid/envelope/?hsts=0" }, { "source": "/ingest/static/:path*", "destination": "https://us-assets.i.posthog.com/static/:path*" }, { "source": "/ingest/:path*", "destination": "https://us.i.posthog.com/:path*" }], "fallback": [] } };
var BuildId = "iH2y0DRHkXRfVPzZ0n2vm";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/monitoring(/?)", "has": [{ "type": "query", "key": "o", "value": "(?<orgid>\\d*)" }, { "type": "query", "key": "p", "value": "(?<projectid>\\d*)" }, { "type": "query", "key": "r", "value": "(?<region>[a-z]{2})" }], "destination": "https://o:orgid.ingest.:region.sentry.io/api/:projectid/envelope/?hsts=0", "regex": "^/monitoring(/?)(?:/)?$" }, { "source": "/monitoring(/?)", "has": [{ "type": "query", "key": "o", "value": "(?<orgid>\\d*)" }, { "type": "query", "key": "p", "value": "(?<projectid>\\d*)" }], "destination": "https://o:orgid.ingest.sentry.io/api/:projectid/envelope/?hsts=0", "regex": "^/monitoring(/?)(?:/)?$" }, { "source": "/ingest/static/:path*", "destination": "https://us-assets.i.posthog.com/static/:path*", "regex": "^/ingest/static(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }, { "source": "/ingest/:path*", "destination": "https://us.i.posthog.com/:path*", "regex": "^/ingest(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }], "fallback": [] }, "redirects": [], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/icon.png", "regex": "^/icon\\.png(?:/)?$", "routeKeys": {}, "namedRegex": "^/icon\\.png(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/manifest.webmanifest", "regex": "^/manifest\\.webmanifest(?:/)?$", "routeKeys": {}, "namedRegex": "^/manifest\\.webmanifest(?:/)?$" }, { "page": "/opengraph-image.png", "regex": "^/opengraph\\-image\\.png(?:/)?$", "routeKeys": {}, "namedRegex": "^/opengraph\\-image\\.png(?:/)?$" }, { "page": "/ref", "regex": "^/ref(?:/)?$", "routeKeys": {}, "namedRegex": "^/ref(?:/)?$" }, { "page": "/waitlist", "regex": "^/waitlist(?:/)?$", "routeKeys": {}, "namedRegex": "^/waitlist(?:/)?$" }], "dynamic": [{ "page": "/ref/[code]", "regex": "^/ref/([^/]+?)(?:/)?$", "routeKeys": { "nxtPcode": "nxtPcode" }, "namedRegex": "^/ref/(?<nxtPcode>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/icon.png": { "initialHeaders": { "cache-control": "public, immutable, no-transform, max-age=31536000", "content-type": "image/png", "x-next-cache-tags": "_N_T_/layout,_N_T_/icon.png/layout,_N_T_/icon.png/route,_N_T_/icon.png" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/icon.png", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/manifest.webmanifest": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/manifest+json", "x-next-cache-tags": "_N_T_/layout,_N_T_/manifest.webmanifest/layout,_N_T_/manifest.webmanifest/route,_N_T_/manifest.webmanifest" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/manifest.webmanifest", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/opengraph-image.png": { "initialHeaders": { "cache-control": "public, immutable, no-transform, max-age=31536000", "content-type": "image/png", "x-next-cache-tags": "_N_T_/layout,_N_T_/opengraph-image.png/layout,_N_T_/opengraph-image.png/route,_N_T_/opengraph-image.png" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/opengraph-image.png", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/login": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/login", "dataRoute": "/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/ref": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/ref", "dataRoute": "/ref.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/waitlist": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/waitlist", "dataRoute": "/waitlist.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "b7f17740f767fd1939319ee48a559f6e", "previewModeSigningKey": "d4d374df98e44d317bd1db3617d4a6ca4dcc82034c2f03c51c5a0ac97a8f5d76", "previewModeEncryptionKey": "af56212a168301e426d9330a72dceb9aa0333bced93701cb2e928d8d8003b32d" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/middleware.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|images|icon.png|monitoring|opengraph-image.png|ingest|api|login|api\\/emails).*))(\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|images|icon.png|monitoring|opengraph-image.png|ingest|api|login|api/emails).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iH2y0DRHkXRfVPzZ0n2vm", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "qTzYc27HXlyV228p3xqkvOkjy96P6v0sD/x6Wl7EEpI=", "__NEXT_PREVIEW_MODE_ID": "b7f17740f767fd1939319ee48a559f6e", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "af56212a168301e426d9330a72dceb9aa0333bced93701cb2e928d8d8003b32d", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "d4d374df98e44d317bd1db3617d4a6ca4dcc82034c2f03c51c5a0ac97a8f5d76" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/api/emails/welcome/route": "/api/emails/welcome", "/icon.png/route": "/icon.png", "/manifest.webmanifest/route": "/manifest.webmanifest", "/opengraph-image.png/route": "/opengraph-image.png", "/_not-found/page": "/_not-found", "/(auth)/login/page": "/login", "/page": "/", "/ref/[code]/page": "/ref/[code]", "/ref/page": "/ref", "/waitlist/page": "/waitlist" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;

// ../../node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
  return readable;
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// ../../node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    return value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
  } catch (e) {
    return [];
  }
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  switch (cachedValue.type) {
    case "app":
      isDataRequest = Boolean(event.headers.rsc);
      body = isDataRequest ? cachedValue.rsc : cachedValue.html;
      type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
      break;
    case "page":
      isDataRequest = Boolean(event.query.__nextDataReq);
      body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
      type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
      break;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    statusCode: cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// ../../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// ../../node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => route.startsWith("/api/") || route === "/api" && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: statusCode
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    headers = {
      ...middlewareEventOrResult.responseHeaders,
      ...headers
    };
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
