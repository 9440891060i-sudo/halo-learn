import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Does tricher AI use internet or network signal to respond?",
      answer:
        "No. Tricher AI works completely offline which cannot be jammed by signal jammers nor low signal areas.",
    },
    {
      question: "Do I need to press any buttons to talk to the AI?",
      answer:
        "No. Tricher AI has been fine tuned to respond completely through voice commands, whater you need you can use the given magic words for it to do set commands and continue asking it questions.",
    },
    {
      question: "Can I use tricher glasses as normal bluetooth glasses?",
      answer:
        "Yes, apart from the AI mode you can even use the glasses for everyday stuff like taking calls, listining to music, etc.",
    },
    {
      question:
        'Calling it the "World\'s first offline voice ai agent" is this real?',
      answer:
        "Yes, there isn't a publically available app that runs locally and takes all commands through voice without internet except Tricher AI.",
    },
    {
      question:
        'Calling it the "Thinnest smartglasses in the market" is this real?',
      answer:
        "Yes, you wouldn't find another pair of smart glasses that has a thinner frame that nobody can recognise except for Tricher glasses v2.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left group"
              >
                <div className="p-6 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/50 hover:border-border transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-light text-foreground group-hover:text-foreground transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Answer */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={
                      openIndex === index
                        ? { opacity: 1, height: "auto" }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm sm:text-base text-muted-foreground font-light mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
