import { NextResponse } from "next/server";
import BLOCKED_URLS from "./src/config/dmca-blocked.json";

export function middleware(request) {
  const url = new URL(request.url);

  const isBlocked = BLOCKED_URLS.some((item) => {
    if (url.pathname !== item.pathname) return false;

    // If specific query rules are defined, verify every single one matches
    if (item.query) {
      return Object.entries(item.query).every(
        ([key, value]) => url.searchParams.get(key) === value,
      );
    }

    return true;
  });

  if (isBlocked) {
    return new NextResponse("Gone - Content removed pursuant to DMCA", {
      status: 410,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...new Set(BLOCKED_URLS.map((item) => item.pathname))],
};
