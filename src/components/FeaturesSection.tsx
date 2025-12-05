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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const FeaturesSection = () => {
  return (
    <section className="py-32 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] mb-6">
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group p-8 rounded-2xl bg-background subtle-shadow hover:hover-shadow transition-all duration-300 ${
                index === 4 ? "lg:col-start-2" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-normal mb-2">{feature.title}</h3>
              <p className="text-muted-foreground font-light">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-xl text-muted-foreground mt-16"
        >
          Your AI. Your Notes. Your Study Glasses.
        </motion.p>
      </div>
    </section>
  );
};

export default FeaturesSection;
