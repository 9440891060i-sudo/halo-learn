  import { useState } from "react";
  import { motion } from "framer-motion";
  import { ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useNavigate } from "react-router-dom";
  import { useToast } from "@/hooks/use-toast";
  import React from "react";

  type UserType = "active" | "expired" | "new" | null;
  type Step = "input" | "result";

  type MeResponse = {
    user: {
      name?: string;
      email: string;
    };
    plan: {
      name: string;
      description: string;
      price: number;
      expiresAt: string | null;
    } | null;
  };

  const Subscribe = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState<Step>("input");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [otpSent, setOtpSent] = useState(false);
    const [userType, setUserType] = useState<UserType>(null);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);
    const [meData, setMeData] = useState<MeResponse | null>(null);
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

    // Helper functions
    const formatDate = (d?: string | null) => {
      if (!d) return "Never";
      return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const planLabel = (name?: string) => {
    if (name === "basic") return "Monthly";
    if (name === "pro") return "Yearly";
    };

    const handleCheck = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !email.includes("@")) {
        toast({
          title: "Valid email required",
          description: "Please enter the linked email",
          variant: "destructive",
        });
        return;
      }

      const otpString = otp.join('');
      if (otpString.length !== 6) {
        toast({ title: 'Enter OTP', description: 'Please enter the 6-digit OTP', variant: 'destructive' });
        return;
      }

      try {
        const resp = await fetch(`${API_BASE}/api/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otpString }),
        });

        let data = null;
        try {
          data = await resp.json();
        } catch (parseErr) {
          data = null;
        }

        if (!resp.ok) {
          let msg = resp.statusText || 'OTP verification failed';
          if (data && data.error) msg = data.error;
          else if (data && Object.keys(data).length) msg = JSON.stringify(data);
          else if (data === null) {
            try {
              msg = await resp.text();
            } catch (_) {}
          }
          throw new Error(msg || 'OTP verification failed');
        }

      // Fetch user data after successful OTP verification for active/expired users
  if (data?.userType === "active" || data?.userType === "expired") {
    try {
      const meRes = await fetch(
        `${API_BASE}/api/me?email=${encodeURIComponent(email)}`
      );

      if (!meRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const meJson = await meRes.json();
      setMeData(meJson);
    } catch (meErr) {
      console.error("❌ /api/me failed:", meErr);

      toast({
        title: "Unable to load subscription",
        description: "Please try again later",
        variant: "destructive",
      });

      setMeData(null);
    }
  }


        if (data?.userType === 'active') {
          setUserType('active');
          setStep('result');
        } else if (data?.userType === 'expired') {
          setUserType('expired');
          setStep('result');
        } else {
          setUserType('new');
          setStep('result');
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: String(err), variant: 'destructive' });
      }
    };

    // OTP helpers
    const otpRefs: React.MutableRefObject<HTMLInputElement[]> = React.useRef([]);

    const handleOtpChange = (index: number, value: string) => {
      if (!/^[0-9]?$/.test(value)) return;
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
      const key = e.key;
      if (key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    };

const handleSubscribe = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    // map plan to amount and product id
    const amount = plan === 'monthly' ? 399 : 4999;
    const productId = plan === 'monthly' ? 'basic' : 'pro';
      // navigate to checkout with preset plan and amount
      navigate('/checkout', { state: { presetPlan: plan, amount, productId, email } });
      toast({
        title: "Proceed to Checkout",
        description: `Redirecting to checkout for ${plan} plan`,
      });
    };

    const handleResume = () => {
      // Redirect user to the plans view so they can choose a subscription
      setUserType("new");
      setSelectedPlan(null);
      setStep("result");
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
            {/* <span className="mx-auto text-sm font-light tracking-widest">SUBSCRIBE</span> */}
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
              <h1 className="text-3xl font-extralight mb-3">Tricher AI</h1>
              {/* <p className="text-muted-foreground font-light">Manage your subscription</p> */}
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
                    <Label htmlFor="emailInput" className="text-sm font-light">Enter Active email</Label>
                    
                    <Input
                      id="emailInput"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="bg-transparent border-border rounded-lg h-12"
                    />
                  </div>

                  {/* Get OTP button shown before OTP is sent */}
                  {!otpSent && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email || !email.includes("@")) {
                            toast({
                              title: "Enter valid email",
                              description: "Please enter the linked email before requesting OTP",
                              variant: "destructive",
                            });
                            return;
                          }

                          try {
                            const resp = await fetch(`${API_BASE}/api/send-otp`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email }),
                            });

                            let data = null;
                            try {
                              data = await resp.json();
                            } catch (parseErr) {
                              data = null;
                            }

                            if (!resp.ok) {
                              let msg = resp.statusText || 'Failed to send OTP';
                              if (data && data.error) msg = data.error;
                              else if (data && Object.keys(data).length) msg = JSON.stringify(data);
                              else if (data === null) {
                                try { msg = await resp.text(); } catch (_) {}
                              }
                              
                              toast({
                                title: resp.status === 404 ? 'Email Not Registered' : 'Error',
                                description: msg,
                                variant: 'destructive',
                              });
                              return;
                            }

                            // mark otp sent
                            setOtp(Array(6).fill(''));
                            setOtpSent(true);
                            toast({ title: 'OTP sent', description: `OTP sent to ${email}` });
                            setTimeout(() => otpRefs.current[0]?.focus(), 50);

                            // Do not auto-advance here — require the user to enter OTP and verify it.
                          } catch (err) {
                            console.error(err);
                            toast({ title: 'Error', description: String(err), variant: 'destructive' });
                          }
                        }}
                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-background/5 text-sm"
                      >
                        Get OTP
                      </button>
                    </div>
                  )}

                  {/* OTP inputs shown after OTP is sent */}
                  {otpSent && (
                    <div>
                      <Label className="text-sm font-light">Enter OTP</Label>
                      <div className="mt-2  flex items-center gap-2">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => (otpRefs.current[i] = el as HTMLInputElement)}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value.replace(/[^0-9]/g, ""))}
                            onKeyDown={(e) => handleOtpKeyDown(e, i)}
                          className="w-12 h-12 bg-transparent border-[0.5px] border-black/30 rounded-lg text-center text-lg"


                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={!otpSent || !email || otp.join("").length !== 6}
                  >
                    Check Status
                  </Button>
                  <p
  style={{
    marginTop: '6px',
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
    width: '100%'
  }}
>
  Email should be the same as the one used for purchasing glasses
</p>

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
                      <span className="text-sm font-light">
                        {planLabel(meData?.plan?.name)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Status</span>
                      <span className="text-sm font-light text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Renews</span>
                      <span className="text-sm font-light">
                        {formatDate(meData?.plan?.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                
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
                </div>

                <div className="p-6 rounded-xl border border-border bg-foreground/5">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Last Plan</span>
                      <span className="text-sm font-light">
                        {planLabel(meData?.plan?.name)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Status</span>
                      <span className="text-sm font-light text-red-500">Expired</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Expired on</span>
                      <span className="text-sm font-light">
                        {formatDate(meData?.plan?.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleResume}
                  variant="hero"
                  size="xl"
                  className="w-full"
                >
                  Resume Subscription
                </Button>

              
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
                  {/* <h2 className="text-2xl font-extralight mb-3">Choose Your Plan</h2> */}
                  <p className="text-muted-foreground font-light">
                    Select a subscription to get started
                  </p>
                </div>

                <div className="space-y-4">
                {/* Monthly Plan */}
                <div className="p-6 rounded-xl border border-border hover:border-foreground/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-light">Monthly</h3>
                      <p className="text-muted-foreground text-sm font-light">1 month access</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extralight">₹399</div>
                      <p className="text-muted-foreground text-xs">/month</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSubscribe("monthly")}
                    variant="heroOutline"
                    size="lg"
                    className="w-full"
                  >
                    Subscribe Monthly
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
                        <div className="text-2xl font-extralight">₹4999</div>
                        <p className="text-background/60 text-xs">/year</p>
                      </div>
                    </div>
                    <p className="text-background/60 text-sm font-light mb-4">
                    Save ₹1,789 compared to monthly
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
                    setEmail("");
                    setUserType(null);
                    setMeData(null);
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
                        {selectedPlan === "monthly" ? "₹399" : "₹4,999"}
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