import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

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
          {/* Brand */}
          <div className="text-xl font-light tracking-tight">Tricher AI</div>

          <p className="text-muted-foreground font-light text-sm">
            Hands-Free Offline AI Learning
          </p>

          {/* Links */}
          <div className="flex justify-center gap-10 text-sm text-muted-foreground font-light">
            <button
              onClick={() => navigate("/shipping")}
              className="hover:text-foreground transition-colors duration-200"
            >
              Shipping
            </button>
            <button
              onClick={() => navigate("/support")}
              className="hover:text-foreground transition-colors duration-200"
            >
              Support
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 pt-4 text-muted-foreground">
            <a
              href="https://www.instagram.com/tricher.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://youtube.com/@tricherin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
              aria-label="YouTube"
            >
              <FaYoutube size={18} />
            </a>

            <a
              href="https://x.com/tricherai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
              aria-label="X"
            >
              <FaXTwitter size={18} />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-10 text-xs text-muted-foreground/60 font-light">
            © {new Date().getFullYear()} Tricher AI. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
