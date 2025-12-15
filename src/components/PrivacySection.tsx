import { motion } from "framer-motion";
import { Lock, Smartphone, ShieldOff } from "lucide-react";

const PrivacySection = () => {
  return (
    <section className="py-32 lg:py-40 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background/10 text-sm font-light tracking-wide mb-10">
            <Lock className="w-4 h-4" strokeWidth={1.5} />
            <span>Privacy First</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-8">
            No Jamming. No tracking.
            <br />
            <span className="text-background/40">100% offline answers.</span>
          </h2>

          <div className="flex justify-center gap-8 lg:gap-12 mt-14 mb-10 flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <ShieldOff className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-background/60 font-light">Jam-Proof</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-background/60 font-light">On Device</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <Lock className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-background/60 font-light">Private</span>
            </motion.div>
          </div>

          <p className="text-background/50 text-lg font-light max-w-md mx-auto leading-relaxed">
            Your notes stay on your phone.
            <br />
            Your voice never leaves your device.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacySection;