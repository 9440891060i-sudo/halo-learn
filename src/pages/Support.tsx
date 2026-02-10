import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  const supportEmail = "support@tricher.app";
  const supportMobile = "+91 79897 82046";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">Back</button>
          {/* <span className="mx-auto text-sm font-light tracking-widest">Contact Support</span> */}
          <div className="w-16" />
        </div>
      </header>

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6">
            {/* <h1 className="text-2xl font-extralight">Contact Support</h1> */}
            <p className="text-muted-foreground">You can reach us directly at the contact below.</p>

            <div className="mt-8  flex flex-col items-center">
              <div className="text-center">
                <div className="text-sm font-medium">Email</div>
                <div className="text-muted-foreground text-sm">{supportEmail}</div>
                <a href={`mailto:${supportEmail}`} className="inline-block mt-3">
                  {/* <Button size="sm">Email Us</Button> */}
                </a>
              </div>

              <div className="text-center">
                <div className="text-sm font-medium">Mobile</div>
                <div className="text-muted-foreground text-sm">{supportMobile}</div>
                <a href={`tel:${supportMobile.replace(/\s+/g, "")}`} className="inline-block mt-3">
                  {/* <Button size="sm">Call Us</Button> */}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Support;
