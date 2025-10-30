import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { ImageUploadField } from "./image-upload-field";

interface Contestant {
  id: string;
  name: string;
  username: string;
  description: string;
  imageUrl?: string;
}

interface NominateContestantsModalProps {
  title?: string;
  onAddContestant: (contestant: Contestant) => void;
}

export function NominateContestantsDialog({
  onAddContestant,
  title,
}: NominateContestantsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: null as string | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl,
    }));
  };

  const handleAddContestant = () => {
    if (formData.name.trim() && formData.description.trim()) {
      const newContestant: Contestant = {
        id: Date.now().toString(), // Generate unique ID
        name: formData.name,
        username: `@${formData.name.toLowerCase().replace(/\s+/g, "")}`,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
      };

      onAddContestant(newContestant);
      setIsOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: null,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const isFormValid =
    formData.name.trim() !== "" && formData.description.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-11 bg-[#5014D0] hover:bg-[#5014D0]/90 text-white hover:text-white"
        >
          Nominate Contestants
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nominate Contestants
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Nominate Contestants for a specific category
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Category Info */}
          <div className="bg-muted/60 p-3 rounded-lg">
            <h3 className="font-medium text-lg">
              {title || "No Contest Name"}
            </h3>
          </div>

          {/* Contestant Addition Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contestant-name" className="text-sm font-medium">
                Contestant Full Names
              </Label>
              <Input
                id="contestant-name"
                placeholder="e.g Olivia Nalugya"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contestant-description"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="contestant-description"
                placeholder="e.g Effortless charm and free-spirited style"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <ImageUploadField
              label="Category Image"
              recommendedSize="1920×1080px"
              formats="JPEG or PNG"
              maxSize={10}
              onImageUpload={handleImageChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddContestant}
              disabled={!isFormValid}
              className="flex-1 h-11 bg-[#5014D0] hover:bg-[#5014D0]/90 text-white"
            >
              Add Contestant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
