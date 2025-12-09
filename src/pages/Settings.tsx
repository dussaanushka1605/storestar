import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Check } from "lucide-react";
import { passwordSchema } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const newPassword = watch("newPassword", "");

  const passwordRequirements = [
    { label: "8-16 characters", met: newPassword.length >= 8 && newPassword.length <= 16 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "1 special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const onSubmit = async (data: UpdatePasswordFormData) => {
    const result = await updatePassword(data.newPassword);

    if (result.success) {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      reset();
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Info */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-sm">Name</Label>
                <p className="font-medium text-foreground">{user?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="font-medium text-foreground">{user?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Role</Label>
                <p className="font-medium text-foreground capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Address</Label>
                <p className="font-medium text-foreground">{user?.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Password */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
            <CardDescription>Change your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    {...register("currentPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {passwordRequirements.map((req) => (
                    <span
                      key={req.label}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        req.met
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {req.met && <Check className="h-3 w-3" />}
                      {req.label}
                    </span>
                  ))}
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="gradient-primary text-primary-foreground hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
