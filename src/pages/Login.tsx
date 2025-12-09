import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Star, ArrowRight } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Get updated user to determine redirect
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const redirectPath =
          user.role === "admin"
            ? "/admin"
            : user.role === "store_owner"
            ? "/owner"
            : "/user";
        navigate(redirectPath);
      }
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Star className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">StoreRate</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium text-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@storerating.com / Admin@123</p>
              <p><strong>Owner:</strong> owner@storerating.com / Owner@123</p>
              <p><strong>User:</strong> user@storerating.com / User@1234</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-primary-foreground"
        >
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
            <Star className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Store Rating Platform</h2>
          <p className="text-primary-foreground/80 max-w-md">
            Rate and discover the best stores in your area. Share your experiences and help others make informed decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
