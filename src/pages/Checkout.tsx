import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Banknote, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMode, setPaymentMode] = useState<"cod" | "online" | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  const basePrice = 3999;
  const discountAmount = discountApplied ? 500 : 0;
  const finalPrice = basePrice - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "TRICHER500") {
      setDiscountApplied(true);
      toast({
        title: "Discount Applied!",
        description: "₹500 off on your order",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid discount code",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMode) {
      toast({
        title: "Select payment method",
        description: "Please choose Cash on Delivery or Pay Online",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed!",
      description: paymentMode === "cod" 
        ? "Your order has been placed. Pay on delivery." 
        : "Redirecting to payment gateway...",
    });
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
          <span className="mx-auto text-sm font-light tracking-widest">CHECKOUT</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Order Summary */}
            <div className="mb-8 pb-6 border-b border-border">
              <h2 className="text-sm text-muted-foreground mb-4 tracking-wide">ORDER SUMMARY</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-light">Tricher Glasses</p>
                  <p className="text-sm text-muted-foreground">+ 3 months AI subscription</p>
                </div>
                <p className="text-2xl font-light">₹{basePrice.toLocaleString()}</p>
              </div>
              {discountApplied && (
                <div className="flex justify-between items-center mt-3 text-green-600">
                  <p className="text-sm">Discount (TRICHER500)</p>
                  <p className="text-sm">-₹{discountAmount}</p>
                </div>
              )}
            </div>

            {/* Discount Code */}
            <div className="mb-8 pb-6 border-b border-border">
              <h2 className="text-sm text-muted-foreground mb-4 tracking-wide">DISCOUNT CODE</h2>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter code"
                    className="bg-transparent border-border rounded-lg h-12 pl-10"
                    disabled={discountApplied}
                  />
                </div>
                <Button
                  type="button"
                  variant="heroOutline"
                  onClick={handleApplyDiscount}
                  disabled={discountApplied || !discountCode}
                  className="h-12 px-6"
                >
                  {discountApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm text-muted-foreground tracking-wide">CONTACT</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-light">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-transparent border-border rounded-lg h-12"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-light">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-transparent border-border rounded-lg h-12"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-light">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="bg-transparent border-border rounded-lg h-12"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <h2 className="text-sm text-muted-foreground tracking-wide">SHIPPING ADDRESS</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-light">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-transparent border-border rounded-lg h-12"
                    placeholder="House/Flat No., Street, Landmark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-light">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-transparent border-border rounded-lg h-12"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-light">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="bg-transparent border-border rounded-lg h-12"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="space-y-4 pt-6">
                <h2 className="text-sm text-muted-foreground tracking-wide">PAYMENT METHOD</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("cod")}
                    className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${
                      paymentMode === "cod"
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="text-sm font-light">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("online")}
                    className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${
                      paymentMode === "online"
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-light">Pay Online</span>
                  </button>
                </div>
              </div>

              {/* Total & Place Order */}
              <div className="pt-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                  <span className="text-lg font-light">Total</span>
                  <span className="text-2xl font-light">₹{finalPrice.toLocaleString()}</span>
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                >
                  Place Order
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Free shipping across India
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
