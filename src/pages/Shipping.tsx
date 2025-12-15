import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Shipping = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const handlecontactSupport = () => {
    navigate('/support');
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">Back</button>
          {/* <span className="mx-auto text-sm font-light tracking-widest">SHIPPING</span> */}
          <div className="w-16" />
        </div>
      </header>

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6">
            <h1 className="text-2xl font-extralight">Shipping Update</h1>
            <p className="text-muted-foreground">Your order has been forwarded to our delivery partners. Check your mail or contact support for tracking id.</p>

            <div className="pt-4">
              <Button size="lg" onClick={() => handlecontactSupport()}>
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Shipping;
