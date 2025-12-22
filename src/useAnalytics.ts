import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-H9VLTJWQB6";

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    const pagePath = location.pathname + location.search + location.hash;

    window.gtag("config", GA_ID, {
      page_path: pagePath,
    });
  }, [location]);
}
