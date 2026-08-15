import { useMemo, useState } from "react";

const safeImageUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

const iconCandidates = (faviconUrl, websiteUrl) => {
  const candidates = [safeImageUrl(faviconUrl)];

  try {
    const origin = new URL(websiteUrl).origin;

    candidates.push(`${origin}/favicon.ico`);
    // This resolves the icon declared by the site, including sites that do
    // not publish it at the conventional /favicon.ico location.
    candidates.push(
      `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(
        origin
      )}&sz=64`
    );
  } catch {
    // Old records without a valid URL fall through to the letter avatar.
  }

  return [...new Set(candidates.filter(Boolean))];
};

export default function WebsiteIcon({
  faviconUrl,
  websiteUrl,
  websiteName,
  className = "h-9 w-9",
}) {
  const sources = useMemo(
    () => iconCandidates(faviconUrl, websiteUrl),
    [faviconUrl, websiteUrl]
  );
  const signature = sources.join("|");
  const [attempt, setAttempt] = useState({ signature: "", index: 0 });
  const activeIndex = attempt.signature === signature ? attempt.index : 0;
  const source = sources[activeIndex];

  if (source) {
    return (
      <img
        src={source}
        alt=""
        aria-hidden="true"
        className={`${className} shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm`}
        referrerPolicy="no-referrer"
        onError={() =>
          setAttempt({ signature, index: activeIndex + 1 })
        }
      />
    );
  }

  const initial = String(websiteName || websiteUrl || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm`}
    >
      {initial || "?"}
    </span>
  );
}
