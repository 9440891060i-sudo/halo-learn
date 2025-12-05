import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BundleOffer = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 text-sm font-medium">
            <span>🎁</span>
            <span>Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Bundle & Save.
            <br />
            <span className="text-background/60">Learn Faster.</span>
          </h2>

          <p className="text-xl text-background/70">
            AI Glasses + 3-Month Voice Assistant Subscription
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl md:text-6xl font-bold">₹3,998</div>
            <div className="text-background/50 line-through">₹4,996</div>
            <div className="text-sm text-background/70">Save ₹999</div>
          </div>

          <p className="text-background/60 text-lg max-w-xl mx-auto">
            Ask questions, revise chapters, search PDFs — just by speaking.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="bg-background text-foreground hover:bg-background/90"
            >
              🛒 Get the Bundle
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BundleOffer;
