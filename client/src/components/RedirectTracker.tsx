import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * RedirectTracker - Tracks legacy URL redirections for analytics
 * This component logs when users are redirected from old URLs to new ones
 */
interface RedirectTrackerProps {
  fromPath: string;
  toPath: string;
  tabParam?: string;
}

export function RedirectTracker({ fromPath, toPath, tabParam }: RedirectTrackerProps) {
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  useEffect(() => {
    // Track the redirection event
    trackEvent.mutate({
      eventType: 'search_query', // Using search_query as a generic event type for tracking
      entityType: 'redirection',
      metadata: {
        fromPath,
        toPath,
        tabParam,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      },
    });
  }, [fromPath, toPath, tabParam, trackEvent]);

  return null;
}

/**
 * Enhanced SimpleRedirect with tracking
 */
export function SimpleRedirectWithTracking({ 
  from, 
  to 
}: { 
  from: string; 
  to: string; 
}) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Track the redirection
    const trackEvent = trpc.analytics.trackEvent.useMutation();
    trackEvent.mutate({
      eventType: 'search_query',
      entityType: 'redirection',
      metadata: {
        fromPath: from,
        toPath: to,
        timestamp: new Date().toISOString(),
      },
    });

    // Perform the redirect
    setLocation(to, { replace: true });
  }, [from, to, setLocation]);

  return null;
}
