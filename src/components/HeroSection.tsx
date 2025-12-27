import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import cheetahGlasses from "@/assets/cheetah-glasses.png";
import { useEffect, useState, type TouchEvent } from "react";
import one from "@/assets/1.jpg";
import two from "@/assets/2.jpg";
import tre from "@/assets/3.jpg";
import four from "@/assets/4.jpg";
import { useCarousel } from "@/contexts/CarouselContext"; 
const DOWNLOAD_LAUNCH_AT = new Date("2025-12-24T20:00:00+05:30");

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const { currentIndex, setCurrentIndex } = useCarousel();

  const images = [cheetahGlasses, one, two, tre, four];

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = DOWNLOAD_LAUNCH_AT.getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Autoplay effect: advance to next image every 3 seconds unless paused
  useEffect(() => {
    if (isAutoplayPaused) return;

    const autoplayTimer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(autoplayTimer);
  }, [isAutoplayPaused, images.length, setCurrentIndex]);

  const handleDownloadClick = () => {
    if (timeLeft === null) {
      window.open(`${window.location.origin}/#/download`, "_blank");
    } else {
      setShowTimer(true);
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
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
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="bg-background border border-border rounded-3xl p-10 max-w-md w-full text-center"
            >
              <h2 className="text-3xl font-light mb-4">
                Downloads Unlock In
              </h2>

              <div className="text-4xl font-mono tracking-widest mb-6">
                {timeLeft}
              </div>

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
        {/* Nav */}
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

        <div className="container pt-28 flex flex-col items-center">
          {/* Text */}
          <div className="text-center space-y-3 max-w-4xl">
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.08] tracking-tight">
              Worlds first offline
              <span className="block">
                <span className="rainbow-text font-thin">AI</span> glasses
              </span>
            </h1>

            <p className="text-xl text-muted-foreground font-extralight">
              All questions answered. 100% offline.
            </p>
          </div>

          {/* HERO IMAGE CAROUSEL - Clean & Minimal */}
          <div className="mt-12 w-full max-w-5xl px-4 md:px-0">
            <div
              className="relative w-full bg-gradient-to-b from-transparent via-muted/5 to-transparent rounded-3xl overflow-hidden group"
              onTouchStart={(e: TouchEvent) => {
                setTouchStart(e.touches[0].clientX);
                setIsAutoplayPaused(true);
              }}
              onTouchMove={(e: TouchEvent) => {
                if (touchStart === null) return;
                const current = e.touches[0].clientX;
                const diff = touchStart - current;
                if (diff > 30) {
                  nextImage();
                  setTouchStart(null);
                } else if (diff < -30) {
                  prevImage();
                  setTouchStart(null);
                }
              }}
              onTouchEnd={() => {
                setTouchStart(null);
                setIsAutoplayPaused(false);
              }}
            >
              {/* Main Image Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <img
                    src={images[currentIndex]}
                    alt={`Product view ${currentIndex + 1}`}
                    className={`w-full h-auto object-contain ${
                      currentIndex === 0
                        ? 'max-h-[600px]'
                        : 'md:max-h-[600px] max-h-[800px]'
                    }`}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left Arrow - Desktop Only */}
              <button
                onClick={prevImage}
                aria-label="Previous"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 text-xl text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                ‹
              </button>

              {/* Right Arrow - Desktop Only */}
              <button
                onClick={nextImage}
                aria-label="Next"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 text-xl text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel state for next section */}
      <div id="carousel-state" data-current={currentIndex} data-images={images.length} style={{ display: 'none' }}></div>
    </>
  );
};

export default HeroSection;
