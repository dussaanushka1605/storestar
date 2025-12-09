import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { addUserSchema, AddUserFormData } from "@/lib/validations";
import { useData } from "@/contexts/DataContext";
import { User } from "@/types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type SortField = "name" | "email" | "role" | "createdAt";
type SortOrder = "asc" | "desc";

export default function UserManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { users, addUser, getStoresByOwner, getStoreAverageRating } = useData();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
  });

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.address.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, roleFilter, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const onSubmit = async (data: AddUserFormData) => {
    addUser({
      name: data.name,
      email: data.email,
      address: data.address,
      role: data.role,
    });

    toast({
      title: "User created",
      description: `${data.name} has been added successfully.`,
    });

    reset();
    setIsAddDialogOpen(false);
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const getOwnerStoreRating = (userId: string) => {
    const stores = getStoresByOwner(userId);
    if (stores.length === 0) return null;
    const totalRating = stores.reduce(
      (acc, store) => acc + getStoreAverageRating(store.id),
      0
    );
    return totalRating / stores.length;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all users on the platform
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with a specific role
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter name (20-60 characters)"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter address (max 400 characters)"
                    {...register("address")}
                    className="resize-none"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select onValueChange={(value) => setValue("role", value as AddUserFormData["role"])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="normal_user">Normal User</SelectItem>
                      <SelectItem value="store_owner">Store Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="normal_user">Normal User</SelectItem>
                  <SelectItem value="store_owner">Store Owner</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Email
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("role")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Role
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {user.address}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : user.role === "store_owner"
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewUserDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-sm">Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-sm">Address</Label>
                  <p className="font-medium">{selectedUser.address}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-sm">Role</Label>
                  <p className="font-medium capitalize">
                    {selectedUser.role.replace("_", " ")}
                  </p>
                </div>
                {selectedUser.role === "store_owner" && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">
                      Average Store Rating
                    </Label>
                    <div className="flex items-center gap-2">
                      {getOwnerStoreRating(selectedUser.id) ? (
                        <StarRating
                          rating={getOwnerStoreRating(selectedUser.id)!}
                          showValue
                        />
                      ) : (
                        <span className="text-muted-foreground">No ratings yet</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-sm">Member Since</Label>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
