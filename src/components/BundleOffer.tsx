import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react"
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowRight } from "react-icons/md";

const BundleOffer = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-8 lg:py-20 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/10 text-xs font-extralight tracking-[0.15em] uppercase text-orange-300">
            Limited Time
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Glasses & Tricher AI .
          </h2>

          <div className="flex flex-col items-center gap-2 py-4">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-thin tracking-tight">₹4499</div>
            <div className="flex items-center gap-3">
              <span className="text-background/40 line-through font-extralight">₹6299</span>
              <span className="text-xs text-background/60 font-extralight tracking-wide">Save ₹1799</span>
            </div>
          </div>


          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="hero"
              size="sm"
              onClick={() => {
                const el = document.getElementById("pricing");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="group [&>svg]:w-7 [&>svg]:h-7"
            >
              <MdKeyboardDoubleArrowDown
                className="text-orange-300 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BundleOffer;
