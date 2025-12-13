import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type UserType = "active" | "expired" | "new" | null;
type Step = "input" | "result";

const Subscribe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("input");
  const [inputValue, setInputValue] = useState("");
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedPlan, setSelectedPlan] = useState<"quarterly" | "yearly" | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue) {
      toast({
        title: "Input required",
        description: "Please enter 1, 2, or 3",
        variant: "destructive",
      });
      return;
    }

    if (inputValue === "1") {
      setUserType("active");
      setStep("result");
    } else if (inputValue === "2") {
      setUserType("expired");
      setStep("result");
    } else if (inputValue === "3") {
      setUserType("new");
      setStep("result");
    } else {
      toast({
        title: "Invalid input",
        description: "Enter 1 for active, 2 for expired, 3 for new user",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = (plan: "quarterly" | "yearly") => {
    setSelectedPlan(plan);
    toast({
      title: "Subscription Started!",
      description: `You've subscribed to the ${plan} plan`,
    });
  };

  const handleResume = () => {
    toast({
      title: "Subscription Resumed!",
      description: "Your subscription is now active again",
    });
    setUserType("active");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-light">Back</span>
          </button>
          <span className="mx-auto text-sm font-light tracking-widest">SUBSCRIBE</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extralight mb-3">AI Subscription</h1>
            <p className="text-muted-foreground font-light">Manage your subscription</p>
          </motion.div>

          {/* Input Step */}
          {step === "input" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleCheck} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userInput" className="text-sm font-light">Enter User ID</Label>
                  <Input
                    id="userInput"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="1, 2, or 3"
                    className="bg-transparent border-border rounded-lg h-12"
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Demo: 1 = Active, 2 = Expired, 3 = New User
                </p>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                >
                  Check Status
                </Button>
              </form>
            </motion.div>
          )}

          {/* Active Subscription */}
          {step === "result" && userType === "active" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-foreground" strokeWidth={1} />
              </div>

              <div>
                <h2 className="text-2xl font-extralight mb-3">Subscription Active</h2>
                <p className="text-muted-foreground font-light">
                  Your AI subscription is currently active
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-foreground/5">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Plan</span>
                    <span className="text-sm font-light">Quarterly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <span className="text-sm font-light text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Renews</span>
                    <span className="text-sm font-light">March 15, 2025</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setStep("input");
                  setInputValue("");
                  setUserType(null);
                }}
                variant="heroOutline"
                size="lg"
                className="w-full"
              >
                Check Another Account
              </Button>
            </motion.div>
          )}

          {/* Expired Subscription */}
          {step === "result" && userType === "expired" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground" strokeWidth={1} />
              </div>

              <div>
                <h2 className="text-2xl font-extralight mb-3">Subscription Expired</h2>
                <p className="text-muted-foreground font-light">
                  Your subscription has expired. Resume to continue using AI features.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-foreground/5">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Last Plan</span>
                    <span className="text-sm font-light">Quarterly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <span className="text-sm font-light text-red-500">Expired</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Expired on</span>
                    <span className="text-sm font-light">December 1, 2024</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleResume}
                variant="hero"
                size="xl"
                className="w-full"
              >
                Resume Subscription — ₹1,999
              </Button>

              <button
                onClick={() => {
                  setStep("input");
                  setInputValue("");
                  setUserType(null);
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Check another account
              </button>
            </motion.div>
          )}

          {/* New User - Subscription Options */}
          {step === "result" && userType === "new" && !selectedPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-foreground" strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-extralight mb-3">Choose Your Plan</h2>
                <p className="text-muted-foreground font-light">
                  Select a subscription to get started
                </p>
              </div>

              <div className="space-y-4">
                {/* Quarterly Plan */}
                <div className="p-6 rounded-xl border border-border hover:border-foreground/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-light">Quarterly</h3>
                      <p className="text-muted-foreground text-sm font-light">3 months access</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extralight">₹1,999</div>
                      <p className="text-muted-foreground text-xs">/quarter</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSubscribe("quarterly")}
                    variant="heroOutline"
                    size="lg"
                    className="w-full"
                  >
                    Subscribe Quarterly
                  </Button>
                </div>

                {/* Yearly Plan */}
                <div className="p-6 rounded-xl border border-foreground bg-foreground text-background relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs">
                    Best Value
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-light">Yearly</h3>
                      <p className="text-background/60 text-sm font-light">12 months access</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extralight">₹4,999</div>
                      <p className="text-background/60 text-xs">/year</p>
                    </div>
                  </div>
                  <p className="text-background/60 text-sm font-light mb-4">
                    Save ₹2,997 compared to quarterly
                  </p>
                  <Button
                    onClick={() => handleSubscribe("yearly")}
                    variant="hero"
                    size="lg"
                    className="w-full bg-background text-foreground hover:bg-background/90"
                  >
                    Subscribe Yearly
                  </Button>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep("input");
                  setInputValue("");
                  setUserType(null);
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Go back
              </button>
            </motion.div>
          )}

          {/* New User - Success after selecting plan */}
          {step === "result" && userType === "new" && selectedPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-foreground" strokeWidth={1} />
              </div>

              <div>
                <h2 className="text-2xl font-extralight mb-3">Welcome to Tricher!</h2>
                <p className="text-muted-foreground font-light">
                  Your subscription is now active
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-foreground/5">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Plan</span>
                    <span className="text-sm font-light capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Amount</span>
                    <span className="text-sm font-light">
                      {selectedPlan === "quarterly" ? "₹1,999" : "₹4,999"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <span className="text-sm font-light text-green-600">Active</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/")}
                variant="heroOutline"
                size="lg"
                className="w-full"
              >
                Back to Home
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
