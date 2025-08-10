import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation, useGetCategoriesQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  X,
  Upload,
  Package,
  DollarSign,
  FileText,
  Tag,
  Boxes,
} from "lucide-react";

function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    shortDescription: "",
    detailedDescription: "",
    categoryId: "",
    images: [""],
    stock: "",
    specifications: {
      brand: "",
      model: "",
      weight: "",
      dimensions: "",
      warranty: "",
      connectivity: "",
      batteryLife: "",
      features: [],
    },
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addFeature = () => {
    if (
      newFeature.trim() &&
      !formData.specifications.features.includes(newFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          features: [...prev.specifications.features, newFeature.trim()],
        },
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        features: prev.specifications.features.filter(
          (feature) => feature !== featureToRemove
        ),
      },
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.push("Valid price is required");
    if (!formData.shortDescription.trim())
      errors.push("Short description is required");
    if (!formData.detailedDescription.trim())
      errors.push("Detailed description is required");
    if (!formData.categoryId) errors.push("Category selection is required");

    // Validate images
    const validImages = formData.images.filter((img) => img.trim());
    if (validImages.length === 0) {
      errors.push("At least one image URL is required");
    } else {
      // Check if each image is a valid URL or relative path
      validImages.forEach((img, index) => {
        const isValidUrl = (() => {
          try {
            new URL(img);
            return true;
          } catch {
            return (
              img.startsWith("/") ||
              img.startsWith("./") ||
              img.startsWith("../")
            );
          }
        })();

        if (!isValidUrl) {
          errors.push(
            `Image ${index + 1}: Please enter a valid URL or relative path`
          );
        }
      });
    }

    if (!formData.stock || parseInt(formData.stock) < 0)
      errors.push("Valid stock quantity is required");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter((img) => img.trim()),
        specifications: {
          ...formData.specifications,
          features: formData.specifications.features.filter((f) => f.trim()),
        },
      };

      await createProduct(productData).unwrap();
      toast.success("Product created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

  return (
    <main className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create New Product
        </h1>
        <p className="text-gray-600">
          Add a new product to your catalog with detailed information and
          specifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Package className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential product details that customers will see first
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Apple iPhone 15 Pro"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex gap-2 items-center">
                  <DollarSign className="w-4 h-4" />
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="999.99"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleInputChange("categoryId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="flex gap-2 items-center">
                  <Boxes className="w-4 h-4" />
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="100"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="shortDescription"
                className="flex gap-2 items-center"
              >
                <FileText className="w-4 h-4" />
                Short Description *
              </Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                placeholder="Brief product summary (max 200 characters)"
                maxLength={200}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">
                Detailed Description *
              </Label>
              <textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) =>
                  handleInputChange("detailedDescription", e.target.value)
                }
                placeholder="Comprehensive product description with features, benefits, and specifications..."
                rows={4}
                className="px-3 py-2 w-full rounded-md border resize-none border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Upload className="w-5 h-5" />
              Product Images
            </CardTitle>
            <CardDescription>
              Add high-quality images to showcase your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg or /assets/image.jpg"
                  className="flex-1"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeImageField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageField}
              className="w-full"
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Another Image
            </Button>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>
              Detailed technical information about the product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.specifications.brand}
                  onChange={(e) =>
                    handleSpecificationChange("brand", e.target.value)
                  }
                  placeholder="Apple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.specifications.model}
                  onChange={(e) =>
                    handleSpecificationChange("model", e.target.value)
                  }
                  placeholder="iPhone 15 Pro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.specifications.weight}
                  onChange={(e) =>
                    handleSpecificationChange("weight", e.target.value)
                  }
                  placeholder="187g"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.specifications.dimensions}
                  onChange={(e) =>
                    handleSpecificationChange("dimensions", e.target.value)
                  }
                  placeholder="159.9 x 76.7 x 8.25 mm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={formData.specifications.warranty}
                  onChange={(e) =>
                    handleSpecificationChange("warranty", e.target.value)
                  }
                  placeholder="1 Year Limited Warranty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="connectivity">Connectivity</Label>
                <Input
                  id="connectivity"
                  value={formData.specifications.connectivity}
                  onChange={(e) =>
                    handleSpecificationChange("connectivity", e.target.value)
                  }
                  placeholder="5G, Wi-Fi 6E, Bluetooth 5.3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batteryLife">Battery Life</Label>
              <Input
                id="batteryLife"
                value={formData.specifications.batteryLife}
                onChange={(e) =>
                  handleSpecificationChange("batteryLife", e.target.value)
                }
                placeholder="Up to 23 hours video playback"
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              <Label>Key Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a key feature"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.specifications.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.specifications.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex gap-1 items-center"
                    >
                      {feature}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Tag className="w-5 h-5" />
              Product Tags
            </CardTitle>
            <CardDescription>
              Add tags to help customers find this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., premium, wireless, gaming)"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex gap-1 items-center"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating} className="min-w-[150px]">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default AdminProductCreatePage;
