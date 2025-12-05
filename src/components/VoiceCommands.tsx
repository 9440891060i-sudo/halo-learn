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
    <section className="py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium mb-6">
            <span>🔊</span>
            <span>Voice Commands</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Just say it.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          {commands.map((command, index) => (
            <motion.div
              key={command}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-4 rounded-2xl border border-border bg-card subtle-shadow hover:hover-shadow transition-all duration-300 cursor-default"
            >
              <span className="text-lg font-medium">"{command}"</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground mt-12 tracking-widest text-sm uppercase"
        >
          Minimal. Fast. Private.
        </motion.p>
      </div>
    </section>
  );
};

export default VoiceCommands;
