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
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background/10 text-xs font-extralight tracking-[0.15em] uppercase">
            Limited Time
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Bundle & Save.
          </h2>

          <p className="text-lg text-background/50 font-extralight">
            Glasses + 3-Month AI App Subscription
          </p>

          <div className="flex flex-col items-center gap-3 py-6">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-thin tracking-tight">₹3,998</div>
            <div className="flex items-center gap-4">
              <span className="text-background/25 line-through font-extralight">₹4,996</span>
              <span className="text-xs text-background/40 font-extralight tracking-wide">Save ₹999</span>
            </div>
          </div>

          <p className="text-background/40 font-extralight max-w-md mx-auto">
            Upload your study material to the app. Connect the glasses.
            Start learning hands-free.
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
