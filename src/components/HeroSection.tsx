import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroGlasses from "@/assets/hero-glasses.jpg";

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
            StudyGlasses
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

      <div className="container pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[85vh]">
          {/* Left Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-[clamp(2.5rem,5vw,5rem)] leading-[1.05]">
                <span className="block whitespace-nowrap">The Smarter Way</span>
                <span className="block">to Study.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-light">
                AI Glasses for Hands-Free Learning.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-md font-light leading-relaxed"
            >
              Looks like normal glasses.
              <br />
              Works like your personal offline AI teacher.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button variant="hero" size="xl">
                Buy Glasses — ₹2,999
              </Button>
              <Button variant="heroOutline" size="xl">
                Get Bundle
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm text-muted-foreground font-light"
            >
              ₹999/month for AI · Free shipping across India
            </motion.p>
          </div>

          {/* Right Content - Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-xl">
              <img
                src={heroGlasses}
                alt="Smart Study Glasses - AI-powered hands-free learning device"
                className="relative w-full h-auto rounded-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="text-[11px] tracking-[0.2em] uppercase font-light">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;