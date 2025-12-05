import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-32 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extralight tracking-[-0.03em] mb-4">
            Simple Pricing
          </h2>
          <p className="text-muted-foreground text-lg font-light tracking-wide">
            Choose what works for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Glasses Only */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-2xl bg-background subtle-shadow"
          >
            <div className="text-4xl mb-4">🕶</div>
            <h3 className="text-lg font-normal mb-2">Smart Study Glasses</h3>
            <div className="text-4xl font-light mb-4">₹2,999</div>
            <ul className="space-y-3 mb-8 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Comfortable, light design
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Bluetooth connection
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Hidden open-ear speakers
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Works with our AI app
              </li>
            </ul>
            <Button variant="heroOutline" size="lg" className="w-full">
              Buy Glasses
            </Button>
          </motion.div>

          {/* Bundle - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl bg-foreground text-background glow-shadow relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs font-normal tracking-wide flex items-center gap-1">
              <Star className="w-3 h-3" />
              Most Popular
            </div>
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-lg font-normal mb-2">Bundle Offer</h3>
            <div className="text-4xl font-light mb-1">₹3,998</div>
            <div className="text-background/40 text-sm mb-4 line-through font-light">₹4,996</div>
            <ul className="space-y-3 mb-8 text-background/80">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-background" />
                Everything in Glasses
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-background" />
                3-Month AI subscription
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-background" />
                Save ₹999
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-background" />
                Priority support
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-background subtle-shadow"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-normal mb-2">AI Study Assistant</h3>
            <div className="text-4xl font-light mb-4">₹999<span className="text-lg font-light text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Voice answers from your notes
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Works offline
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                Upload any PDF
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-foreground" />
                24/7 private learning
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
