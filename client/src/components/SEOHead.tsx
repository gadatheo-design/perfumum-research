import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

/**
 * SEOHead component for dynamic Open Graph meta tags
 * Updates document head with SEO metadata for social sharing
 */
export function SEOHead({ 
  title, 
  description, 
  image = "https://perfumum.manus.space/og-default.png",
  url,
  type = "website"
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | PERFUMUM`;

    // Helper function to set or update meta tag
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? "name" : "property";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("description", description, true);

    // Open Graph tags
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:image", image);
    setMetaTag("og:type", type);
    
    if (url) {
      setMetaTag("og:url", url);
    }

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", image, true);

  }, [title, description, image, url, type]);

  return null; // This component doesn't render anything
}
