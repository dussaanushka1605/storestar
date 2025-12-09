import { motion } from "framer-motion";
import { Users, Store, Star, TrendingUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statCards = [
  {
    title: "Total Users",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Total Stores",
    icon: Store,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Total Ratings",
    icon: Star,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export default function AdminDashboard() {
  const { stats, users, stores, ratings } = useData();

  const statValues = [stats.totalUsers, stats.totalStores, stats.totalRatings];

  const recentUsers = users.slice(-5).reverse();
  const recentRatings = ratings.slice(-5).reverse();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your store rating platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {statValues[index]}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : user.role === "store_owner"
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-warning" />
                  Recent Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRatings.map((rating) => {
                    const user = users.find((u) => u.id === rating.userId);
                    const store = stores.find((s) => s.id === rating.storeId);
                    return (
                      <div
                        key={rating.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {store?.name || "Unknown Store"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {user?.name || "Unknown User"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium text-foreground">
                            {rating.rating}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
