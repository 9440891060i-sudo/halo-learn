import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  timeLeft: string;
  onClose: () => void;
}

const LaunchTimerModal = ({ open, timeLeft, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-background rounded-3xl p-10 max-w-md w-full text-center border border-border"
          >
            <h2 className="text-3xl font-light mb-4">
              Downloads Unlock In
            </h2>

            <div className="text-4xl font-mono tracking-widest text-foreground mb-6">
              {timeLeft}
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              Tricher AI is launching very soon.  
              Stay ready.
            </p>

            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchTimerModal;
