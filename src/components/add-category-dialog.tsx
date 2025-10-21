import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { ImageUploadField } from "@/components/image-upload-field";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (categoryData: CategoryFormData) => void;
}

export interface CategoryFormData {
  categoryType: "fashion" | "nightlife";
  categoryName: string;
  description: string;
  categoryImage: File | null;
  countdownDuration: number;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryType: "fashion",
    categoryName: "",
    description: "",
    categoryImage: null,
    countdownDuration: 24,
  });

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | number | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (url: string | null) => {
    handleInputChange("categoryImage", url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      categoryType: "fashion",
      categoryName: "",
      description: "",
      categoryImage: null,
      countdownDuration: 24,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form on close
    setFormData({
      categoryType: "fashion",
      categoryName: "",
      description: "",
      categoryImage: null,
      countdownDuration: 24,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Gradient Header */}
        <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6 rounded-t-lg">
          <DialogTitle className="flex items-center justify-between text-white">
            <h2 className="text-[24px]">Create New Category</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-white/20 text-white hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <p className="text-sm text-white/80 mt-1">
            Add a new category for Fashion or Nightlife
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Category Type Selection */}
          <div className="space-y-4 p-4 border-1 rounded-md items-center">
            <RadioGroup
              defaultValue="fashion"
              value={formData.categoryType}
              onValueChange={(value: "fashion" | "nightlife") =>
                handleInputChange("categoryType", value)
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fashion" id="fashion" />
                <Label htmlFor="fashion">
                  <span className="text-md font-medium">Fashion</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nightlife" id="nightlife" />
                <Label htmlFor="nightlife">
                  <span className="text-md font-medium">Nightlife</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm font-medium">
              Category
            </Label>
            <Input
              id="categoryName"
              placeholder="e.g Vintage Fashion, Street Style, Best DJ"
              value={formData.categoryName}
              onChange={(e) =>
                handleInputChange("categoryName", e.target.value)
              }
              required
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g Best description of the category that will be shown to users"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
              className="resize-none"
            />
          </div>

          {/* Category Image Upload using your custom component */}
          <ImageUploadField
            label="Category Image"
            description="Category image. Used for category poster."
            recommendedSize="1920×1080px"
            formats="JPEG or PNG"
            maxSize={10}
            onImageUpload={handleImageChange}
          />

          {/* Countdown Duration */}
          <div className="space-y-2">
            <Label htmlFor="countdownDuration" className="text-sm font-medium">
              Countdown Duration
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="countdownDuration"
                type="number"
                min="1"
                max="168"
                value={formData.countdownDuration}
                onChange={(e) =>
                  handleInputChange(
                    "countdownDuration",
                    parseInt(e.target.value) || 1
                  )
                }
                className="w-full flex-1 h-11"
              />
              <span className="text-sm text-muted-foreground">Hours</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
            >
              Create Category
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
