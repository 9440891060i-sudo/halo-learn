import { motion } from "framer-motion";
import { Upload, Mic, Volume2, Smartphone } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Materials",
    description: "PDFs, notes, textbooks — add them to the app"
  },
  {
    icon: Smartphone,
    title: "AI Processes Everything",
    description: "Our AI learns your content instantly"
  },
  {
    icon: Mic,
    title: "Ask Through Glasses",
    description: "Speak your questions hands-free"
  },
  {
    icon: Volume2,
    title: "Hear Instant Answers",
    description: "Get audio responses from your study material"
  }
];

const AppPreview = () => {
  return (
    <section className="py-32 px-6 bg-background">
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
            Phone + Glasses.
            <span className="block text-muted-foreground">That's all you need.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[280px] h-[580px] bg-foreground/5 rounded-[3rem] p-3 border border-border/30">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-24 h-6 bg-foreground/10 rounded-full" />
                  </div>
                  
                  {/* App Content */}
                  <div className="px-6 py-4 space-y-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground tracking-widest uppercase">Study AI</p>
                      <h3 className="text-lg font-light mt-1">Your Library</h3>
                    </div>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" strokeWidth={1} />
                      <p className="text-xs text-muted-foreground">Upload PDFs & Notes</p>
                    </div>
                    
                    {/* Document List */}
                    <div className="space-y-3">
                      <div className="bg-foreground/5 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs">PDF</span>
                        </div>
                        <div>
                          <p className="text-sm font-light">Physics Chapter 5</p>
                          <p className="text-xs text-muted-foreground">12 pages · Ready</p>
                        </div>
                      </div>
                      <div className="bg-foreground/5 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs">PDF</span>
                        </div>
                        <div>
                          <p className="text-sm font-light">Organic Chemistry</p>
                          <p className="text-xs text-muted-foreground">28 pages · Ready</p>
                        </div>
                      </div>
                      <div className="bg-foreground/5 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs">TXT</span>
                        </div>
                        <div>
                          <p className="text-sm font-light">History Notes</p>
                          <p className="text-xs text-muted-foreground">5 pages · Ready</p>
                        </div>
                      </div>
                    </div>

                    {/* Connection Status */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Glasses Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-border/30">
                  <step.icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-muted-foreground/50 font-light">0{index + 1}</span>
                    <h3 className="text-lg font-light">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-extralight">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="pt-6 border-t border-border/20"
            >
              <p className="text-sm text-muted-foreground font-extralight">
                The glasses are your audio interface. All the AI magic happens on your phone — no internet required while studying.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
