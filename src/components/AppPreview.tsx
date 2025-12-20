import { motion } from "framer-motion";
import { Bluetooth, Wifi, Battery, Signal, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import mockup from "@/assets/mockup.png";
import { toast } from "sonner";

const AppPreview = () => {
  const openDownloadRoute = () => {
    const url = `${window.location.origin}/#/download`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const openVideo = () => {
  window.open(
    "https://youtu.be/7MDeKxuZfQg?si=SgqA1K5ydh6Wyl24",
    "_blank",
    "noopener,noreferrer"
  );
};
  return (
    <section className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
            <span className="block text-muted-foreground">Speak through glasses.</span>
          </h2>

          <div className="mt-6">
  <Button
    variant="heroOutline"
    size="sm"
    onClick={openVideo}
    className="inline-flex items-center gap-2 transform translate-y-3"
  >
    <Play className="w-4 h-4" />
    Watch Product Video
  </Button>
</div>
        </motion.div>
        

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Phone mockup replaced with image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative flex flex-col items-center">
              <img src={mockup} alt="App mockup" className="w-[400px] rounded-[3rem]" />

              <button
                type="button"
                onClick={() => openDownloadRoute()}
                className="mt-4 text-sm text-muted-foreground group flex flex-col items-center"
              >
                <span>Download APP</span>
                <span className="mt-2 w-full max-w-[60px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left border-b border-foreground/40" />
              </button>

            </div>
            
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
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Upload your study materials</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    Add PDFs, notes, or textbooks. The AI processes everything locally.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Talk to your virtual friend</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    Helps you to study anywhere, even in signal jammed environment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Ask questions naturally</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    Voice-optimized microphones capture every word with precision.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Hear crystal-clear answers</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    Directional speakers deliver responses only you can hear.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground font-extralight">
                All AI processing happens on your phone. No internet needed while studying.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;