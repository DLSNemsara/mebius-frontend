import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Package,
  Save,
} from "lucide-react";

function AdminCategoriesManagePage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const { data: products = [] } = useGetProductsQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Get product count for each category
  const getCategoryProductCount = (categoryId) => {
    return products.filter((product) => product.categoryId === categoryId)
      .length;
  };

  // Reset form when dialogs close
  useEffect(() => {
    if (!isCreateDialogOpen && !editingCategory) {
      setFormData({ name: "" });
    }
  }, [isCreateDialogOpen, editingCategory]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory({ name: formData.name.trim() }).unwrap();
      toast.success("Category created successfully!");
      setIsCreateDialogOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory({
        categoryId: editingCategory._id,
        name: formData.name.trim(),
      }).unwrap();
      toast.success("Category updated successfully!");
      setEditingCategory(null);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const productCount = getCategoryProductCount(categoryId);

    if (productCount > 0) {
      toast.error(
        `Cannot delete category "${categoryName}" because it has ${productCount} product(s). Please move or delete the products first.`
      );
      return;
    }

    try {
      await deleteCategory(categoryId).unwrap();
      toast.success(`Category "${categoryName}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  return (
    <main className="container px-4 py-8 mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex gap-4 items-center mb-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Manage Categories
        </h1>
        <p className="text-gray-600">
          Create, edit, and organize product categories
        </p>
      </div>

      {/* Action Bar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <FolderOpen className="w-5 h-5" />
              Categories Overview
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateCategory}>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new category to organize your products
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Category Name *</Label>
                      <Input
                        id="create-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Electronics, Clothing, Books"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Category"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Total Categories:{" "}
            <span className="font-semibold">{categories.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No categories yet
            </h3>
            <p className="mb-4 text-gray-600">
              Create your first category to start organizing products
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 w-4 h-4" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const productCount = getCategoryProductCount(category._id);
            return (
              <Card key={category._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex gap-2 items-center text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        {productCount} product{productCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <Badge variant={productCount > 0 ? "default" : "secondary"}>
                      {productCount > 0 ? "Active" : "Empty"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Dialog
                      open={editingCategory?._id === category._id}
                      onOpenChange={(open) => {
                        if (!open) setEditingCategory(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleUpdateCategory}>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Update the category name
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Category Name *</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Electronics, Clothing, Books"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditingCategory(null)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                              {isUpdating ? (
                                <>
                                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 w-4 h-4" />
                                  Update Category
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            {productCount > 0 ? (
                              <>
                                Cannot delete &quot;{category.name}&quot;
                                because it contains {productCount} product
                                {productCount !== 1 ? "s" : ""}. Please move or
                                delete the products first.
                              </>
                            ) : (
                              <>
                                Are you sure you want to delete &quot;
                                {category.name}&quot;? This action cannot be
                                undone.
                              </>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          {productCount === 0 && (
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteCategory(
                                  category._id,
                                  category.name
                                )
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Category
                            </AlertDialogAction>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default AdminCategoriesManagePage;
