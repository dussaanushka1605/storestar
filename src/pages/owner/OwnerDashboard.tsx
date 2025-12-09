import { useMemo } from "react";
import { motion } from "framer-motion";
import { Store, Star, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { getStoresByOwner, getStoreRatings, getStoreAverageRating } = useData();

  const ownerStores = useMemo(() => {
    if (!user) return [];
    return getStoresByOwner(user.id);
  }, [user, getStoresByOwner]);

  const storeData = useMemo(() => {
    return ownerStores.map((store) => {
      const ratings = getStoreRatings(store.id);
      const averageRating = getStoreAverageRating(store.id);
      return {
        ...store,
        ratings,
        averageRating,
        totalRatings: ratings.length,
      };
    });
  }, [ownerStores, getStoreRatings, getStoreAverageRating]);

  const totalRatings = storeData.reduce((acc, store) => acc + store.totalRatings, 0);
  const overallAverage =
    storeData.length > 0
      ? storeData.reduce((acc, store) => acc + store.averageRating, 0) /
        storeData.length
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Store Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your stores and ratings
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Stores
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {storeData.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ratings
                </CardTitle>
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Users className="h-4 w-4 text-chart-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {totalRatings}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="sm:col-span-2"
          >
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
                <div className="p-2 rounded-lg bg-warning/10">
                  <TrendingUp className="h-4 w-4 text-warning" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    {overallAverage.toFixed(1)}
                  </span>
                  <StarRating rating={overallAverage} size="md" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stores */}
        {storeData.map((store, storeIndex) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + storeIndex * 0.1 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      {store.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {store.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Average Rating</p>
                      <p className="text-xl font-bold text-foreground">
                        {store.averageRating.toFixed(1)}
                      </p>
                    </div>
                    <StarRating rating={store.averageRating} size="sm" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium text-foreground mb-4">
                  User Ratings ({store.totalRatings})
                </h4>
                {store.ratings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {store.ratings.map((rating) => (
                          <TableRow key={rating.id}>
                            <TableCell className="font-medium">
                              {rating.user?.name || "Unknown"}
                            </TableCell>
                            <TableCell>{rating.user?.email || "N/A"}</TableCell>
                            <TableCell>
                              <StarRating rating={rating.rating} size="sm" />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No ratings yet for this store.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {storeData.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Store className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No Stores Found
              </p>
              <p className="text-muted-foreground">
                You don't have any stores assigned to your account yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
