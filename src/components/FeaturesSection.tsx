import { motion } from "framer-motion";
import { Upload, Mic, Volume2, RotateCcw, WifiOff } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Everything",
    description: "PDFs, notes, books — directly into the app",
  },
  {
    icon: Mic,
    title: "Ask Any Question",
    description: "Use your voice, get instant answers",
  },
  {
    icon: Volume2,
    title: "Hear Through Glasses",
    description: "Hidden open-ear speakers deliver responses",
  },
  {
    icon: RotateCcw,
    title: "Full Control",
    description: "Pause, rewind, skip, repeat — hands-free",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "No SIM. No WiFi. Complete privacy.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const FeaturesSection = () => {
  return (
    <section className="py-32 lg:py-40 section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Study without looking
            <br />
            <span className="text-muted-foreground">at your phone.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group p-8 lg:p-10 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors duration-300 ${
                index === 4 ? "sm:col-span-2 lg:col-span-1 lg:col-start-2" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center mb-6">
                <feature.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-xl text-muted-foreground font-light mt-20"
        >
          Your AI. Your Notes. Your Study Glasses.
        </motion.p>
      </div>
    </section>
  );
};

export default FeaturesSection;