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

      <div className="container pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-6xl">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] tracking-tight">
                Stay on Call
                <br />
                <span className="text-muted-foreground">with AI.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground font-extralight"
            >
              100% offline. No internet needed. Ever.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base text-muted-foreground/80 font-extralight max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Upload your notes. Connect your glasses.
              <span className="block">Ask questions anytime, get answers instantly.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Button variant="hero" size="xl">
                Buy Glasses — ₹4,499
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm text-muted-foreground/60 font-extralight"
            >
              Includes 3 months free AI subscription · Free shipping
            </motion.p>
          </div>

          {/* Right - Cheetah Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <img
              src={cheetahGlasses}
              alt="Cheetah wearing Tricher Glasses - AI-powered smart glasses"
              className="w-full max-w-sm lg:max-w-md xl:max-w-lg object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
          <span className="text-[10px] tracking-[0.25em] uppercase font-extralight">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
