import type * as SentryNext from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

type CaptureRequestErrorArgs = Parameters<typeof SentryNext.captureRequestError>;

export const onRequestError = async (
  ...args: CaptureRequestErrorArgs
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  return captureRequestError(...args);
};
