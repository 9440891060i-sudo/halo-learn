import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BundleOffer = () => {
  return (
    <section className="py-32 lg:py-40 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background/10 text-sm font-light tracking-wide">
            Limited Time Offer
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Bundle & Save.
            <br />
            <span className="text-background/40">Learn Faster.</span>
          </h2>

          <p className="text-xl text-background/60 font-light">
            AI Glasses + 3-Month Voice Assistant Subscription
          </p>

          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-6xl sm:text-7xl font-extralight tracking-tight">₹3,998</div>
            <div className="flex items-center gap-4">
              <span className="text-background/30 line-through font-light">₹4,996</span>
              <span className="text-sm text-background/50 font-light">Save ₹999</span>
            </div>
          </div>

          <p className="text-background/50 text-lg font-light max-w-lg mx-auto">
            Ask questions, revise chapters, search PDFs — just by speaking.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="bg-background text-foreground hover:bg-background/90"
            >
              Get the Bundle
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BundleOffer;