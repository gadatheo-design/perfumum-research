import type { CookieOptions, Request } from "express";
import { isStandalonePlatform } from "./platform";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  // const hostname = req.hostname;
  // const shouldSetDomain =
  //   hostname &&
  //   !LOCAL_HOSTS.has(hostname) &&
  //   !isIpAddress(hostname) &&
  //   hostname !== "127.0.0.1" &&
  //   hostname !== "::1";

  // const domain =
  //   shouldSetDomain && !hostname.startsWith(".")
  //     ? `.${hostname}`
  //     : shouldSetDomain
  //       ? hostname
  //       : undefined;

  // En mode standalone, la connexion se fait sur la même origine que le site :
  // `lax` suffit et protège des requêtes inter-sites (CSRF). `none` n'était
  // imposé que par le flux OAuth externe du mode "manus" — et pose un problème
  // concret en développement local, les navigateurs refusant `SameSite=None`
  // sans `Secure`, donc sans HTTPS.
  const sameSite: "none" | "lax" = isStandalonePlatform ? "lax" : "none";

  return {
    httpOnly: true,
    path: "/",
    sameSite,
    secure: isSecureRequest(req),
  };
}
