import { NextResponse, type NextRequest } from "next/server"

const freshPagePaths = [
  "/",
  "/learn",
  "/news",
  "/community",
  "/models",
  "/growth",
  "/choose-tool",
  "/search",
  "/login",
]

function shouldUseFreshHeaders(pathname: string) {
  return freshPagePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (shouldUseFreshHeaders(request.nextUrl.pathname)) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
  }

  return response
}

export const config = {
  matcher: [
    "/",
    "/learn/:path*",
    "/news/:path*",
    "/community/:path*",
    "/models/:path*",
    "/growth/:path*",
    "/choose-tool/:path*",
    "/search/:path*",
    "/login/:path*",
  ],
}
