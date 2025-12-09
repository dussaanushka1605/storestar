import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function UserStoreList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [pendingRating, setPendingRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const {
    stores,
    users,
    getStoreAverageRating,
    getUserRating,
    addRating,
    updateRating,
  } = useData();
  const { toast } = useToast();

  const storesWithData = useMemo(() => {
    return stores.map((store) => {
      const owner = users.find((u) => u.id === store.ownerId);
      const averageRating = getStoreAverageRating(store.id);
      const userRating = user ? getUserRating(user.id, store.id) : undefined;
      return {
        ...store,
        owner,
        averageRating,
        userRating,
      };
    });
  }, [stores, users, getStoreAverageRating, getUserRating, user]);

  const filteredStores = useMemo(() => {
    if (!searchTerm) return storesWithData;
    const term = searchTerm.toLowerCase();
    return storesWithData.filter(
      (store) =>
        store.name.toLowerCase().includes(term) ||
        store.address.toLowerCase().includes(term)
    );
  }, [storesWithData, searchTerm]);

  const openRatingDialog = (storeId: string, currentRating?: number) => {
    setSelectedStoreId(storeId);
    setPendingRating(currentRating || 0);
    setIsEditing(!!currentRating);
    setIsRatingDialogOpen(true);
  };

  const handleSubmitRating = () => {
    if (!user || !selectedStoreId || pendingRating === 0) return;

    const existingRating = getUserRating(user.id, selectedStoreId);

    if (existingRating) {
      updateRating(existingRating.id, pendingRating);
      toast({
        title: "Rating updated",
        description: "Your rating has been updated successfully.",
      });
    } else {
      addRating({
        userId: user.id,
        storeId: selectedStoreId,
        rating: pendingRating,
      });
      toast({
        title: "Rating submitted",
        description: "Thank you for your rating!",
      });
    }

    setIsRatingDialogOpen(false);
    setPendingRating(0);
    setSelectedStoreId(null);
  };

  const selectedStore = selectedStoreId
    ? storesWithData.find((s) => s.id === selectedStoreId)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discover Stores</h1>
          <p className="text-muted-foreground mt-1">
            Browse and rate stores in your area
          </p>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Store Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="text-sm line-clamp-2">{store.address}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Rating</span>
                      {store.averageRating > 0 ? (
                        <StarRating rating={store.averageRating} size="sm" showValue />
                      ) : (
                        <span className="text-sm text-muted-foreground">No ratings yet</span>
                      )}
                    </div>

                    {store.userRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Your Rating</span>
                        <StarRating rating={store.userRating.rating} size="sm" />
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    {store.userRating ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          openRatingDialog(store.id, store.userRating?.rating)
                        }
                      >
                        Edit Rating
                      </Button>
                    ) : (
                      <Button
                        className="w-full gradient-primary text-primary-foreground hover:opacity-90"
                        onClick={() => openRatingDialog(store.id)}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Rate Store
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No stores found matching your search.</p>
          </div>
        )}

        {/* Rating Dialog */}
        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Your Rating" : "Rate This Store"}
              </DialogTitle>
              <DialogDescription>
                {selectedStore?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  How would you rate this store?
                </p>
                <StarRating
                  rating={pendingRating}
                  size="lg"
                  interactive
                  onRatingChange={setPendingRating}
                />
                {pendingRating > 0 && (
                  <p className="text-lg font-medium text-foreground">
                    {pendingRating} / 5
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRatingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-primary text-primary-foreground"
                  onClick={handleSubmitRating}
                  disabled={pendingRating === 0}
                >
                  {isEditing ? "Update Rating" : "Submit Rating"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
