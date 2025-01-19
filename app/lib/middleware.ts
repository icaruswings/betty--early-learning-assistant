import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { MethodNotAllowed, Unauthorized } from "./responses";

export function ensureHttpMethodAllowed(request: Request, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    throw MethodNotAllowed();
  }
}

export async function ensureSessionExists(args: LoaderFunctionArgs | ActionFunctionArgs) {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    throw Unauthorized();
  }
}
