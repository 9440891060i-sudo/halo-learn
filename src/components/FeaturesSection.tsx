import { motion } from "framer-motion";
import { Upload, Mic, Volume2, RotateCcw, WifiOff } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload to App",
    description: "PDFs, notes, books — all in our AI app on your phone",
  },
  {
    icon: Mic,
    title: "Speak Through Glasses",
    description: "Ask questions using the built-in microphone",
  },
  {
    icon: Volume2,
    title: "Listen Instantly",
    description: "Open-ear speakers deliver AI answers from your phone",
  },
  {
    icon: RotateCcw,
    title: "Full Voice Control",
    description: "Pause, rewind, skip, repeat — completely hands-free",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "AI runs locally on your phone. No internet needed.",
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
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground/60 font-extralight mb-6">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            AI in your pocket.
            <br />
            <span className="text-muted-foreground">Sound in your ears.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-extralight max-w-xl mx-auto">
            The glasses connect to your phone via Bluetooth. 
            All the AI magic happens in our app.
          </p>
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
              className={`group p-8 lg:p-10 rounded-2xl bg-background border border-border/30 hover:border-border/60 transition-colors duration-300 ${
                index === 4 ? "sm:col-span-2 lg:col-span-1 lg:col-start-2" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mb-6">
                <feature.icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-normal mb-2">{feature.title}</h3>
              <p className="text-muted-foreground font-extralight text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-lg text-muted-foreground/60 font-extralight mt-20"
        >
          Phone + Glasses = Your personal study assistant.
        </motion.p>
      </div>
    </section>
  );
};

export default FeaturesSection;
