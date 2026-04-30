import type { NextConfig } from "next";

function getCdnRemotePattern():
  | {
    protocol: "https" | "http";
    hostname: string;
    port?: string;
  }
  | null {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL?.trim();
  if (!cdnUrl) return null;

  try {
    const parsed = new URL(cdnUrl);
    const protocol = parsed.protocol.replace(":", "");
    if (protocol !== "https" && protocol !== "http") return null;

    return {
      protocol,
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    };
  } catch {
    return null;
  }
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "d3du1kxieyd1np.cloudfront.net",
  },
  {
    protocol: "https",
    hostname: "img.youtube.com",
    pathname: "/vi/**",
  },
];

const cdnRemotePattern = getCdnRemotePattern();
if (cdnRemotePattern) {
  const exists = remotePatterns.some(
    (pattern) =>
      pattern.protocol === cdnRemotePattern.protocol
      && pattern.hostname === cdnRemotePattern.hostname
      && (pattern.port ?? "") === (cdnRemotePattern.port ?? ""),
  );
  if (!exists) remotePatterns.push(cdnRemotePattern);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
