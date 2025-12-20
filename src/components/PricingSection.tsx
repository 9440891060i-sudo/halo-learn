import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="pricing" className="py-32 lg:py-40 section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight mb-5">
            Pricing
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Two simple options
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Smart Glasses + Free Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-10 lg:p-12 rounded-2xl bg-foreground text-background relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background text-foreground text-xs tracking-wide">
              Best Value
            </div>
            <h3 className="text-lg font-light mb-8">Tricher Glasses</h3>
            <div className="text-5xl font-extralight mb-3 tracking-tight">₹4499</div>
            <p className="text-background/50 text-sm font-light mb-10">One-time purchase</p>
            <ul className="space-y-4 mb-12 text-background/70 font-light">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>AI-optimized directional speakers</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Comes with 3 months Tricher ai</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Voice-tuned microphone array</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Instant pairing with Tricher App</span>
              </li>
            </ul>
            <Button
              variant="hero"
              size="lg"
              className="w-full bg-background text-foreground hover:bg-background/90"
              onClick={() => navigate("/checkout")}
            >
              Buy Now
            </Button>
          </motion.div>

          {/* AI Subscription Only */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-10 lg:p-12 rounded-2xl bg-background border border-border/50"
          >
            <h3 className="text-lg font-light mb-8">Tricher AI</h3>
            <div className="text-5xl font-extralight tracking-tight">₹1799</div>
            <p className="text-muted-foreground text-sm font-light mb-10 mt-3">/quarterly</p>
            <ul className="space-y-4 mb-12 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Custom voice commands</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Works completely offline</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Upload unlimited PDFs</span>
              </li>
              
            </ul>
            <Button
              variant="heroOutline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/subscribe")}
            >
              Renew
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;