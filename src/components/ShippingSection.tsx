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
    <section className="py-24 lg:py-32 bg-background border-y border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-3">
            All-India Shipping
          </h2>
          <p className="text-muted-foreground font-light">
            Safe. Tested. Student-Friendly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-12 lg:gap-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <feature.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-light text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-muted-foreground mt-14 font-light"
        >
          Order anywhere in India.
        </motion.p>
      </div>
    </section>
  );
};

export default ShippingSection;