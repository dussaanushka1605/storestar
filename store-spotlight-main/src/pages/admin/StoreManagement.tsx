import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { addStoreSchema, AddStoreFormData } from "@/lib/validations";
import { useData } from "@/contexts/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type SortField = "name" | "address" | "rating" | "createdAt";
type SortOrder = "asc" | "desc";

export default function StoreManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { stores, users, addStore, getStoreAverageRating } = useData();
  const { toast } = useToast();

  const storeOwners = users.filter((u) => u.role === "store_owner");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddStoreFormData>({
    resolver: zodResolver(addStoreSchema),
  });

  const storesWithRatings = useMemo(() => {
    return stores.map((store) => ({
      ...store,
      owner: users.find((u) => u.id === store.ownerId),
      averageRating: getStoreAverageRating(store.id),
    }));
  }, [stores, users, getStoreAverageRating]);

  const filteredStores = useMemo(() => {
    let result = [...storesWithRatings];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(term) ||
          store.address.toLowerCase().includes(term) ||
          store.owner?.email.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === "rating") {
        aValue = a.averageRating;
        bValue = b.averageRating;
      } else {
        aValue = a[sortField] as string;
        bValue = b[sortField] as string;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [storesWithRatings, searchTerm, sortField, sortOrder]);

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStores.slice(start, start + itemsPerPage);
  }, [filteredStores, currentPage]);

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const onSubmit = async (data: AddStoreFormData) => {
    addStore({
      name: data.name,
      address: data.address,
      ownerId: data.ownerId,
    });

    toast({
      title: "Store created",
      description: `${data.name} has been added successfully.`,
    });

    reset();
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Store Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all stores on the platform
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>
                  Create a new store and assign an owner
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter store name (20-60 characters)"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter store address (max 400 characters)"
                    {...register("address")}
                    className="resize-none"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Store Owner</Label>
                  <Select onValueChange={(value) => setValue("ownerId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeOwners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ownerId && (
                    <p className="text-sm text-destructive">{errors.ownerId.message}</p>
                  )}
                  {storeOwners.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No store owners available. Create a store owner first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary text-primary-foreground"
                    disabled={isSubmitting || storeOwners.length === 0}
                  >
                    {isSubmitting ? "Creating..." : "Create Store"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name, address, or owner email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Owner Email</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <button
                      onClick={() => handleSort("address")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Address
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("rating")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Rating
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {store.owner?.email || "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {store.address}
                    </TableCell>
                    <TableCell>
                      {store.averageRating > 0 ? (
                        <StarRating rating={store.averageRating} size="sm" showValue />
                      ) : (
                        <span className="text-sm text-muted-foreground">No ratings</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredStores.length)} of{" "}
                {filteredStores.length} stores
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
