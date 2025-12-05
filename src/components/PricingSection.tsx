import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-32 lg:py-40 section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-5">
            Simple Pricing
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Choose what works for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Glasses Only */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 lg:p-10 rounded-2xl bg-background border border-border/50"
          >
            <h3 className="text-lg mb-6">Smart Study Glasses</h3>
            <div className="text-5xl font-extralight mb-8 tracking-tight">₹2,999</div>
            <ul className="space-y-4 mb-10 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Comfortable, light design</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Bluetooth connection</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Hidden open-ear speakers</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Works with our AI app</span>
              </li>
            </ul>
            <Button variant="heroOutline" size="lg" className="w-full">
              Buy Glasses
            </Button>
          </motion.div>

          {/* Bundle - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 lg:p-10 rounded-2xl bg-foreground text-background relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background text-foreground text-xs font-normal tracking-wide">
              Most Popular
            </div>
            <h3 className="text-lg mb-6">Bundle Offer</h3>
            <div className="text-5xl font-extralight mb-2 tracking-tight">₹3,998</div>
            <div className="text-background/35 text-sm mb-8 line-through font-light">₹4,996</div>
            <ul className="space-y-4 mb-10 text-background/70 font-light">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Everything in Glasses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>3-Month AI subscription</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Save ₹999</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-background flex-shrink-0" strokeWidth={1.5} />
                <span>Priority support</span>
              </li>
            </ul>
            <Button
              variant="hero"
              size="lg"
              className="w-full bg-background text-foreground hover:bg-background/90"
            >
              Get the Bundle
            </Button>
          </motion.div>

          {/* AI Only */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 lg:p-10 rounded-2xl bg-background border border-border/50"
          >
            <h3 className="text-lg mb-6">AI Study Assistant</h3>
            <div className="text-5xl font-extralight tracking-tight">₹999</div>
            <div className="text-muted-foreground text-sm mb-8 font-light">/month</div>
            <ul className="space-y-4 mb-10 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Voice answers from your notes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Works offline</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>Upload any PDF</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1 text-foreground flex-shrink-0" strokeWidth={1.5} />
                <span>24/7 private learning</span>
              </li>
            </ul>
            <Button variant="heroOutline" size="lg" className="w-full">
              Subscribe Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;