import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-H9VLTJWQB6";

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    const pagePath =
      location.hash.replace("#", "") || "/";

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);
}
