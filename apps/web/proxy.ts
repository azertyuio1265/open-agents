import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

function wantsSharedMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) {
    return false;
  }
  const accept = acceptHeader.toLowerCase();
  return accept.includes("text/markdown") || accept.includes("text/plain");
}

const clerk = clerkMiddleware();

export async function proxy(request: NextRequest, event: any) {
  if (request.method === "GET") {
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split("/").filter(Boolean);
    if (
      segments.length === 2 &&
      segments[0] === "shared" &&
      wantsSharedMarkdown(request.headers.get("accept"))
    ) {
      const rewrittenUrl = request.nextUrl.clone();
      rewrittenUrl.pathname = `/api/shared/${segments[1]}/markdown`;
      return NextResponse.rewrite(rewrittenUrl);
    }
  }

  return clerk(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/shared/:path*',
  ],
};
