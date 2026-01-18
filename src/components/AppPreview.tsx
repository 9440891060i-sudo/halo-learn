import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import mockup from "@/assets/mockup2.png";
import { useEffect, useState } from "react";

const DOWNLOAD_LAUNCH_AT = new Date("2025-12-24T20:00:00+17:30");

const AppPreview = () => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);

  // Countdown logic
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
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(2, "0")}`
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
//render
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

      {/* Main Section */}
      <section className="py-32 px-6 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
              Upload on phone.
              <span className="block"><span className="rainbow-text font-thin">Magic</span> on glasses.</span>
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
          </motion.div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <img
                src={mockup}
                alt="App mockup"
                className="w-[400px]"
              />

              <button
                onClick={handleDownloadClick}
                className="mt-6 text-sm text-muted-foreground group"
              >
                Download App
                <span className="block mt-2 w-12 scale-x-0 group-hover:scale-x-100 transition-transform border-b border-foreground/40" />
              </button>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="space-y-8">
                {[
                  {
                    title: "Upload your study materials",
                    desc: "Add PDFs, notes, or textbooks. The AI processes everything locally.",
                  },
                  {
                    title: "Talk to your virtual friend",
                    desc: "Study anywhere, even in signal-jammed environments.",
                  },
                  {
                    title: "Ask questions naturally",
                    desc: "Voice-optimized microphones capture every word.",
                  },
                  {
                    title: "Hear crystal-clear answers",
                    desc: "Directional speakers deliver responses only you can hear.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-light mb-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground font-extralight text-sm">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/30 text-sm text-muted-foreground font-extralight">
                All AI processing happens on your phone.
                <br />
                No internet needed while studying.
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppPreview;
