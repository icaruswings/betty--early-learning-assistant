import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import posthog from "posthog-js";

function PosthogInit() {
  useEffect(() => {
    posthog.init("phc_zRHIsY2KmCmCY3tWqEGT4rVw68SfBbTfOvLubk8Iir1", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
  }, []);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  );
});
