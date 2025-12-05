import { motion } from "framer-motion";

const commands = [
  "Explain this page.",
  "Next question.",
  "Repeat the last answer.",
  "Give me short notes.",
  "Pause.",
];

const VoiceCommands = () => {
  return (
    <section className="py-32 lg:py-40 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-secondary text-sm font-light tracking-wide mb-8">
            Voice Commands
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl">
            Just say it.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {commands.map((command, index) => (
            <motion.div
              key={command}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="px-6 py-4 rounded-full border border-border/60 bg-background hover:border-border transition-colors duration-300 cursor-default"
            >
              <span className="text-base font-light">"{command}"</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center text-muted-foreground mt-16 tracking-[0.25em] text-xs uppercase font-light"
        >
          Minimal · Fast · Private
        </motion.p>
      </div>
    </section>
  );
};

export default VoiceCommands;