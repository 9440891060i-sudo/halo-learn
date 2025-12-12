import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import glassesModel from "@/assets/glasses-model.png";

interface Spec {
  id: string;
  label: string;
  value: string;
  position: { top: string; left: string };
  mobilePosition: { top: string; left: string };
}

const specs: Spec[] = [
  {
    id: "weight",
    label: "Weight",
    value: "28g",
    position: { top: "25%", left: "15%" },
    mobilePosition: { top: "20%", left: "10%" },
  },
  {
    id: "whisper",
    label: "Whisper Detection",
    value: "35dB",
    position: { top: "45%", left: "8%" },
    mobilePosition: { top: "40%", left: "8%" },
  },
  {
    id: "design",
    label: "Frame Thickness",
    value: "4.2mm",
    position: { top: "65%", left: "12%" },
    mobilePosition: { top: "60%", left: "10%" },
  },
  {
    id: "battery",
    label: "Battery Life",
    value: "8 hours",
    position: { top: "35%", left: "85%" },
    mobilePosition: { top: "25%", left: "85%" },
  },
  {
    id: "bluetooth",
    label: "Connectivity",
    value: "Bluetooth 5.3",
    position: { top: "55%", left: "88%" },
    mobilePosition: { top: "50%", left: "85%" },
  },
];

const GlassesSpecs = () => {
  const [activeSpec, setActiveSpec] = useState<string | null>(null);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-extralight tracking-tight mb-4">
            Engineered for <span className="text-muted-foreground">Comfort</span>
          </h2>
          <p className="text-muted-foreground font-extralight text-lg">
            Precision design. Featherlight feel.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <img
              src={glassesModel}
              alt="Person wearing StudyGlasses - side profile view"
              className="w-full rounded-2xl"
            />

            {/* Desktop Spec Labels */}
            {specs.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="absolute hidden lg:flex items-center gap-3"
                style={{ top: spec.position.top, left: spec.position.left }}
              >
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-extralight">
                    {spec.label}
                  </span>
                  <span className="text-xl font-light tracking-tight">
                    {spec.value}
                  </span>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
              </motion.div>
            ))}

            {/* Mobile Interactive Dots */}
            {specs.map((spec, index) => (
              <motion.button
                key={`mobile-${spec.id}`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="absolute lg:hidden"
                style={{
                  top: spec.mobilePosition.top,
                  left: spec.mobilePosition.left,
                }}
                onClick={() =>
                  setActiveSpec(activeSpec === spec.id ? null : spec.id)
                }
              >
                <div
                  className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                    activeSpec === spec.id
                      ? "bg-foreground border-foreground scale-125"
                      : "bg-background/50 border-muted-foreground/50 backdrop-blur-sm"
                  }`}
                />
                <div
                  className={`absolute w-8 h-8 rounded-full border border-muted-foreground/20 -inset-2.5 transition-opacity duration-300 ${
                    activeSpec === spec.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Spec Display */}
          <AnimatePresence mode="wait">
            {activeSpec && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-6 text-center"
              >
                {specs
                  .filter((s) => s.id === activeSpec)
                  .map((spec) => (
                    <div key={spec.id} className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-extralight">
                        {spec.label}
                      </p>
                      <p className="text-2xl font-light tracking-tight">
                        {spec.value}
                      </p>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="lg:hidden text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-extralight"
          >
            Tap dots to explore
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default GlassesSpecs;
