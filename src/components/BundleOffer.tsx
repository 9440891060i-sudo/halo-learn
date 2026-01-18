import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react"
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useCarousel } from "@/contexts/CarouselContext";

const BundleOffer = () => {
  const navigate = useNavigate();
  const { currentIndex, setCurrentIndex, totalImages } = useCarousel();
  
  return (
    <section className="py-6 lg:py-12 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/10 text-xs font-extralight tracking-[0.15em] uppercase text-white">
            Limited Time
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl">
            Unlock 6 months of Tricher AI for free today
          </h2>


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
                className="text-white transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BundleOffer;
