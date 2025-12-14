import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import cheetahGlasses from "@/assets/cheetah-glasses.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="container flex items-center justify-between h-14">
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-base font-normal tracking-tight"
          >
            Tricher tools
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Button variant="hero" size="sm" className="h-8 px-4 text-sm">
              Buy Now
            </Button>
          </motion.div>
        </div>
      </nav>

      <div className="container pt-28 pb-0 flex flex-col items-center min-h-screen">
        {/* Centered Content */}
        <div className="text-center space-y-3 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70 font-light"
          >
            World's First Offline AI to Stay on Call
          </motion.p>

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

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-2 px-8 py-3 rounded-full text-sm font-light tracking-wide
              bg-gradient-to-b from-white/20 to-white/5
              backdrop-blur-2xl
              border border-white/30
              shadow-[0_4px_24px_rgba(0,0,0,0.1),0_1px_2px_rgba(255,255,255,0.2)_inset,0_-1px_2px_rgba(0,0,0,0.1)_inset]
              hover:from-white/25 hover:to-white/10 hover:border-white/40
              hover:shadow-[0_8px_32px_rgba(0,0,0,0.15),0_1px_2px_rgba(255,255,255,0.3)_inset]
              transition-all duration-300 cursor-pointer
              text-foreground/90"
          >
            Watch Video
          </motion.button>
        </div>

        {/* Product Image - Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-auto pt-4"
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
