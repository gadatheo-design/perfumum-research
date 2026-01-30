import { useEffect } from "react";
import { useLocation } from "wouter";

interface RedirectConfig {
  oldPath: string;
  newPath: string;
  tab?: string;
}

/**
 * LegacyRedirect - Handles automatic redirects from old URLs to new hub routes
 * Usage: <Route path="/old-path/:id?" component={() => <LegacyRedirect config={config} />} />
 */
export function LegacyRedirect({ config }: { config: RedirectConfig }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const newUrl = config.tab 
      ? `${config.newPath}?tab=${config.tab}`
      : config.newPath;
    setLocation(newUrl, { replace: true });
  }, [config, setLocation]);

  return null;
}

/**
 * Redirect component for simple path redirects
 */
export function SimpleRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to, { replace: true });
  }, [to, setLocation]);

  return null;
}
