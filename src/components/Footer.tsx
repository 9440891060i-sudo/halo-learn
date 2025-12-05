import { motion } from "framer-motion";

const Footer = () => {
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
          <div className="text-xl font-light tracking-tight">Smart Study Glasses</div>
          <p className="text-muted-foreground font-light text-sm">
            Hands-Free AI Learning
          </p>

          <div className="flex justify-center gap-10 text-sm text-muted-foreground font-light">
            <a href="#shipping" className="hover:text-foreground transition-colors duration-200">
              Shipping
            </a>
            <a href="#privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy
            </a>
            <a href="#support" className="hover:text-foreground transition-colors duration-200">
              Support
            </a>
          </div>

          <div className="pt-10 text-xs text-muted-foreground/60 font-light">
            © {new Date().getFullYear()} Smart Study Glasses. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;