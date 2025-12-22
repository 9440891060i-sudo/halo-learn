import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import cheetahGlasses from "@/assets/cheetah-glasses.png";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

const DOWNLOAD_LAUNCH_AT = new Date("2025-12-24T20:00:00+17:30");

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = DOWNLOAD_LAUNCH_AT.getTime() - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadClick = () => {
    if (timeLeft === null) {
      window.open(`${window.location.origin}/#/download`, "_blank");
    } else {
      setShowTimer(true);
    }
  };

  return (
    <>
      {/* Countdown Modal */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-background border border-border rounded-3xl p-10 max-w-md w-full text-center"
            >
              <h2 className="text-3xl font-light mb-4">
                Downloads Unlock In
              </h2>

              <div className="text-4xl font-mono tracking-widest mb-6">
                {timeLeft}
              </div>

              <p className="text-sm text-muted-foreground mb-8">
                Tricher AI is launching very soon.
              </p>

              <button
                onClick={() => setShowTimer(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative md:min-h-screen hero-gradient overflow-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
          <div className="container flex items-center justify-between h-14">
            <span className="text-base font-normal tracking-tight">
              Tricher AI
            </span>

            <Button
              variant="hero"
              size="sm"
              className="h-8 px-4 text-sm"
              onClick={handleDownloadClick}
            >
              Download App
            </Button>
          </div>
        </nav>

        <div className="container pt-28 flex flex-col items-center md:min-h-screen">
          <div className="text-center space-y-3 max-w-4xl">
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.02] tracking-tight">
              World’s first offline
              <br />
              <span className="text-muted-foreground">voice ai</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground font-extralight">
              100% offline. Voice controlled.
            </p>
          </div>

          <img
            src={cheetahGlasses}
            alt="Tricher Glasses"
            className="mt-10 w-full max-w-lg mx-auto rounded-t-2xl"
          />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
