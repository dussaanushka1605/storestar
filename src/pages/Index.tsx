import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Users, Store, ArrowRight, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">StoreRate</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by thousands of users
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Discover & Rate the
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}Best Stores
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of shoppers and store owners. Share your experiences, 
              discover highly-rated stores, and help others make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 px-8">
                  Start Rating Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform for rating stores, managing businesses, and discovering the best places.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "For Shoppers",
                description:
                  "Browse stores, read reviews, and share your own experiences to help the community.",
              },
              {
                icon: Store,
                title: "For Store Owners",
                description:
                  "Monitor your ratings, understand customer feedback, and improve your business.",
              },
              {
                icon: Shield,
                title: "For Administrators",
                description:
                  "Manage users, stores, and maintain a healthy platform ecosystem.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500+", label: "Stores Listed" },
              { value: "50K+", label: "Ratings Given" },
              { value: "4.8", label: "Avg. Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="gradient-primary rounded-2xl p-8 sm:p-12 text-center text-primary-foreground"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
              Join thousands of users who are already rating and discovering the best stores.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">StoreRate</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StoreRate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
