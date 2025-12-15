import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="py-20 bg-background border-t border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="text-xl font-light tracking-tight">Tricher AI</div>
          <p className="text-muted-foreground font-light text-sm">
            Hands-Free Offline AI Learning
          </p>

          <div className="flex justify-center gap-10 text-sm text-muted-foreground font-light">
            <button onClick={() => navigate('/shipping')} className="hover:text-foreground transition-colors duration-200">
              Shipping
            </button>
            <button onClick={() => navigate('/support')} className="hover:text-foreground transition-colors duration-200">
              Support
            </button>
          </div>

          <div className="pt-10 text-xs text-muted-foreground/60 font-light">
            © {new Date().getFullYear()} Tricher AI. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;