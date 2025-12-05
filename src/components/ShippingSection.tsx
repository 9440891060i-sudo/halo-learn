import { motion } from "framer-motion";
import { Truck, RefreshCw, Shield, Package } from "lucide-react";

const features = [
  { icon: Truck, label: "Fast Delivery" },
  { icon: RefreshCw, label: "7-Day Replacement" },
  { icon: Shield, label: "1-Year Warranty" },
  { icon: Package, label: "All-India Shipping" },
];

const ShippingSection = () => {
  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            🌍 All-India Shipping
          </h2>
          <p className="text-muted-foreground">
            Safe. Tested. Student-Friendly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <feature.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-muted-foreground mt-10"
        >
          📦 Order anywhere in India.
        </motion.p>
      </div>
    </section>
  );
};

export default ShippingSection;
