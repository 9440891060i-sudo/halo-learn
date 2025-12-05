import { motion } from "framer-motion";
import { Lock, CloudOff, Smartphone } from "lucide-react";

const PrivacySection = () => {
  return (
    <section className="py-32 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 text-sm font-medium mb-8">
            <Lock className="w-4 h-4" />
            <span>Privacy First</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] mb-6">
            No cloud. No tracking.
            <br />
            <span className="text-background/50">100% offline answers.</span>
          </h2>

          <div className="flex justify-center gap-8 mt-12 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <CloudOff className="w-7 h-7" />
              </div>
              <span className="text-sm text-background/70">No Cloud</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>
              <span className="text-sm text-background/70">On Device</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <span className="text-sm text-background/70">Private</span>
            </motion.div>
          </div>

          <p className="text-background/60 text-lg max-w-md mx-auto">
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
