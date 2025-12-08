import { motion } from "framer-motion";
import { Bluetooth, Wifi, Battery, Signal, ChevronRight } from "lucide-react";

const AppPreview = () => {
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
            <span className="block text-muted-foreground">Learn through glasses.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Realistic Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone Shadow */}
              <div className="absolute inset-0 bg-foreground/10 rounded-[3rem] blur-3xl scale-90 translate-y-8" />
              
              {/* Phone Frame */}
              <div className="relative w-[300px] bg-foreground rounded-[3rem] p-[3px] shadow-2xl">
                {/* Inner bezel */}
                <div className="bg-[#1a1a1a] rounded-[2.8rem] p-[10px]">
                  {/* Screen */}
                  <div className="bg-background rounded-[2.4rem] overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="flex justify-center pt-3 pb-2">
                      <div className="w-28 h-7 bg-foreground rounded-full flex items-center justify-center gap-2 px-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />
                        <div className="w-2 h-2 rounded-full bg-[#333]" />
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-8 py-1 text-[10px]">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-3.5 h-3.5" strokeWidth={2} />
                        <Wifi className="w-3.5 h-3.5" strokeWidth={2} />
                        <Battery className="w-4 h-4" strokeWidth={2} />
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="px-5 pt-4 pb-8 min-h-[520px]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Good morning</p>
                          <h3 className="text-xl font-light">Study AI</h3>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                      </div>

                      {/* Connection Card */}
                      <div className="bg-foreground text-background rounded-2xl p-4 mb-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-background/20 rounded-xl flex items-center justify-center">
                              <Bluetooth className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Glasses Connected</p>
                              <p className="text-xs text-background/60">Ready to learn</p>
                            </div>
                          </div>
                          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                        </div>
                      </div>

                      {/* Section Title */}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">Your Library</p>
                        <p className="text-xs text-muted-foreground">3 files</p>
                      </div>

                      {/* Document List */}
                      <div className="space-y-2.5">
                        <div className="bg-foreground/[0.03] border border-border/50 rounded-xl p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-[10px] font-medium text-red-500">PDF</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light truncate">Physics — Motion</p>
                            <p className="text-[10px] text-muted-foreground">24 pages • Ready</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        
                        <div className="bg-foreground/[0.03] border border-border/50 rounded-xl p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-[10px] font-medium text-blue-500">PDF</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light truncate">Organic Chemistry</p>
                            <p className="text-[10px] text-muted-foreground">42 pages • Ready</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        
                        <div className="bg-foreground/[0.03] border border-border/50 rounded-xl p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-[10px] font-medium text-amber-500">TXT</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light truncate">History Notes</p>
                            <p className="text-[10px] text-muted-foreground">8 pages • Ready</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Add Button */}
                      <div className="mt-5 border-2 border-dashed border-border/50 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground">+ Add study material</p>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="flex justify-center pb-2">
                      <div className="w-32 h-1 bg-foreground/20 rounded-full" />
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
                  <h3 className="text-lg font-light mb-1">Connect your glasses via Bluetooth</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    One-tap pairing. Your glasses become your personal audio interface.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Ask questions out loud</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    The glasses capture your voice and send it to the app for processing.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-light">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Hear instant answers</h3>
                  <p className="text-muted-foreground font-extralight text-sm">
                    Responses play through the open-ear speakers. Hands-free, eyes-free.
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