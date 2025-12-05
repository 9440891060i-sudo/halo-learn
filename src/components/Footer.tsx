import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="text-xl font-light tracking-wide">Smart Study Glasses</div>
          <p className="text-muted-foreground font-light">
            Hands-Free AI Learning
          </p>

          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href="#shipping" className="hover:text-foreground transition-colors">
              📦 Shipping
            </a>
            <a href="#privacy" className="hover:text-foreground transition-colors">
              🔐 Privacy Policy
            </a>
            <a href="#support" className="hover:text-foreground transition-colors">
              💬 Support
            </a>
          </div>

          <div className="pt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Smart Study Glasses. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
