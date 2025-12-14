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

      <div className="container pt-32 pb-0 flex flex-col items-center min-h-screen">
        {/* Centered Content */}
        <div className="text-center space-y-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 px-6 py-2.5 rounded-full text-sm font-light tracking-wide
              bg-white/10 backdrop-blur-xl border border-white/20
              shadow-[0_8px_32px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]
              hover:bg-white/15 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]
              transition-all duration-300 cursor-pointer"
          >
            Watch Video
          </motion.button>
        </div>

        {/* Product Image - Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-auto pt-8"
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
