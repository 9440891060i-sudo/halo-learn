import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import cheetahGlasses from "@/assets/cheetah-glasses.jpeg";
import { toast } from "sonner";

const HeroSection = () => {
  return (
    <section className="relative md:min-h-screen hero-gradient overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="container flex items-center justify-between h-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <span className="text-base font-normal tracking-tight">Tricher AI</span>
            
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Button
  variant="hero"
  size="sm"
  className="h-8 px-4 text-sm"
  onClick={() =>
    toast("Releasing shortly", {
      description: "Stay tuned. Something exciting is coming 👀",
    })
  }
>
  Download App
</Button>

          </motion.div>
        </div>
      </nav>

      <div className="container pt-28 pb-0 flex flex-col items-center md:min-h-screen">
        {/* Centered Content */}
        <div className="text-center space-y-3 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.02] tracking-tight">
              Stay on Call
              <br />
              <span className="text-muted-foreground">with AI.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-muted-foreground font-extralight"
          >
            100% offline. No internet needed. Ever.
          </motion.p>
        </div>

        {/* Product Image - Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-0 md:mt-auto pt-4"
        >
          <img
            src={cheetahGlasses}
            alt="Cheetah wearing Tricher Glasses - AI-powered smart glasses"
            className="w-full max-w-lg mx-auto rounded-t-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
