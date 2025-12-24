import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Subscribe from "./pages/Subscribe";
import Shipping from "./pages/Shipping";
import Support from "./pages/Support";
import Download from "./pages/Download";
import NotFound from "./pages/NotFound";
// import MeanWhile from "./pages/Meanwhile";
import useAnalytics from "./useAnalytics";
import MeanWhile from "./pages/MeanWhile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <HashRouter>
        {/* 👇 analytics MUST be here */}
        <AnalyticsWrapper />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/download" element={<MeanWhile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

/* small helper component */
const AnalyticsWrapper = () => {
  useAnalytics();
  return null;
};
