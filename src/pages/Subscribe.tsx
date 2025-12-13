import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "email" | "verify" | "success";

const Subscribe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const DUMMY_OTP = "123456";

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    toast({
      title: "Code Sent!",
      description: `Verification code sent to ${email}`,
    });
    setStep("verify");
  };

  const handleVerifyCode = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (otp === DUMMY_OTP) {
      setStep("success");
      toast({
        title: "Verified!",
        description: "Your subscription is now active",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect. Try 123456",
        variant: "destructive",
      });
    }
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
            <p className="text-muted-foreground font-light">₹1,999/quarterly</p>
          </motion.div>

          {/* Email Step */}
          {step === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-light">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="bg-transparent border-border rounded-lg h-12 pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Verify Step */}
          {step === "verify" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-muted-foreground font-light mb-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-light">{email}</p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Demo code: 123456
              </p>

              <Button
                onClick={handleVerifyCode}
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Subscribe"
                )}
              </Button>

              <button
                onClick={() => setStep("email")}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Use a different email
              </button>
            </motion.div>
          )}

          {/* Success Step */}
          {step === "success" && (
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
                  Your AI subscription is now active
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-foreground/5">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Plan</span>
                    <span className="text-sm font-light">Quarterly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Amount</span>
                    <span className="text-sm font-light">₹1,999</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <span className="text-sm font-light text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Email</span>
                    <span className="text-sm font-light">{email}</span>
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
