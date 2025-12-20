import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import mockup from "@/assets/mockup1.png";
import { useEffect, useState } from "react";

const DOWNLOAD_LAUNCH_AT = new Date("2025-12-22T20:00:00+05:30");

const AppPreview = () => {
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

  const openVideo = () => {
    window.open(
      "https://youtu.be/7MDeKxuZfQg?si=SgqA1K5ydh6Wyl24",
      "_blank",
      "noopener,noreferrer"
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

      <section className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight">
              Upload on phone.
              <span className="block text-muted-foreground">
                Speak through glasses.
              </span>
            </h2>

            <div className="mt-6">
              <Button
                variant="heroOutline"
                size="sm"
                onClick={openVideo}
                className="inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Product Video
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col items-center">
              <img
                src={mockup}
                alt="App mockup"
                className="w-[400px] rounded-[3rem]"
              />

              <button
                onClick={handleDownloadClick}
                className="mt-6 text-sm text-muted-foreground group"
              >
                Download App
                <span className="block mt-2 w-12 scale-x-0 group-hover:scale-x-100 transition-transform border-b border-foreground/40" />
              </button>
            </div>

            <div className="text-muted-foreground font-extralight text-center lg:text-left max-w-sm mx-auto lg:mx-0">
  All AI processing happens on your phone.
  <br />
  No internet needed while studying.
</div>

          </div>
        </div>
      </section>
    </>
  );
};

export default AppPreview;
