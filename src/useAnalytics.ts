import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    const rawHash = window.location.hash; // "#/download"
    const pagePath = rawHash.startsWith("#/")
      ? rawHash.replace("#", "")
      : "/";

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);
}
