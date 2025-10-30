import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUploadField } from "@/components/image-upload-field";
import { NominateContestantsDialog } from "@/components/nominate-contestants-dialog";
import { useReduxHotOrNot } from "@/hooks/useReduxHotOrNot";
import { toast } from "sonner";

interface Contestant {
  id: string;
  name: string;
  username: string;
  description: string;
  imageUrl?: string;
}

interface FormData {
  categoryName: string;
  description: string;
  theme: "FASHION" | "NIGHTLIFE";
  status: string;
  countdownDuration: number | undefined;
  startDate: Date | undefined;
  categoryImage: string | null;
  selectedContestants: Contestant[];
}

export function HotorNotAddCategoryPage() {
  const navigate = useNavigate();
  const { theme } = useParams<{ theme: string }>();

  // Use the theme from URL params, default to "FASHION" if not provided
  const currentTheme =
    (theme?.toUpperCase() as "FASHION" | "NIGHTLIFE") || "FASHION";

  const { createContest, error } = useReduxHotOrNot({ mode: "admin" });

  const [formData, setFormData] = useState<FormData>({
    categoryName: "",
    description: "",
    theme: currentTheme,
    status: "",
    countdownDuration: undefined,
    startDate: undefined,
    categoryImage: null,
    selectedContestants: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (imageUrl: string | null) => {
    handleInputChange("categoryImage", imageUrl);
  };

  const addContestant = (contestant: Contestant) => {
    if (!formData.selectedContestants.find((c) => c.id === contestant.id)) {
      handleInputChange("selectedContestants", [
        ...formData.selectedContestants,
        contestant,
      ]);
    }
  };

  const removeContestant = (contestantId: string) => {
    handleInputChange(
      "selectedContestants",
      formData.selectedContestants.filter((c) => c.id !== contestantId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormSubmittable) return;

    setIsSubmitting(true);

    try {
      const now = new Date();
      const startTime = formData.startDate || new Date();
      const hasMinimumContestants = formData.selectedContestants.length >= 2;

      let status: "DRAFT" | "ACTIVE" = "DRAFT";

      if (startTime <= now && hasMinimumContestants) {
        status = "ACTIVE";
      }

      // Prepare contest data in the correct format for the API
      const contestData = {
        name: formData.categoryName,
        description: formData.description,
        theme: currentTheme,
        status: status, // Dynamic status
        category: formData.categoryName,
        durationHours: formData.countdownDuration || 24,
        startTime: startTime.toISOString(),
        coverImageUrl: formData.categoryImage,

        nominees: formData.selectedContestants.map((contestant) => ({
          name: contestant.name,
          description: contestant.description,
          imageUrl: contestant.imageUrl,
        })),
      };

      console.log("Creating contest with status:", status, {
        hasMinimumContestants,
        startTime: startTime.toISOString(),
        now: now.toISOString(),
        isPastOrPresent: startTime <= now,
      });

      const result = await createContest(contestData);

      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          `${currentTheme} campaign created successfully as ${status}!`
        );
        navigate(-1);
      } else {
        throw new Error(result.payload || "Failed to create campaign");
      }
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast.error(
        error.message || "Failed to create campaign. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isFormSubmittable =
    formData.categoryName.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.selectedContestants.length > 0;

  // Calculate current status for display
  // const calculateCurrentStatus = () => {
  //   const now = new Date();
  //   const startTime = formData.startDate || new Date();
  //   const hasMinimumContestants = formData.selectedContestants.length >= 2;

  //   if (startTime <= now && hasMinimumContestants) {
  //     return "ACTIVE";
  //   }
  //   return "DRAFT";
  // };

  // const currentStatus = calculateCurrentStatus();

  return (
    <div className="min-h-screen">
      <SiteHeader label={`Hot or Not`} />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-5 items-center">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                <ArrowLeft />
              </Button>
              <div>
                <p className="font-semibold">
                  Add {currentTheme.toLowerCase()} campaign
                </p>
                <p className="text-sm text-muted-foreground">
                  Add category details and nominate contestants
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Status Preview */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Campaign Status</h3>
                <p className="text-sm text-blue-700">
                  This campaign will be created as: <strong>{currentStatus}</strong>
                </p>
                {currentStatus === "DRAFT" && (
                  <div className="text-xs text-blue-600 mt-1">
                    {formData.selectedContestants.length < 2 ? (
                      "• Need at least 2 contestants to activate"
                    ) : (
                      "• Start date is in the future"
                    )}
                  </div>
                )}
                {currentStatus === "ACTIVE" && (
                  <div className="text-xs text-green-600 mt-1">
                    • Ready to launch immediately
                  </div>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentStatus === "ACTIVE" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {currentStatus}
              </div>
            </div>
          </div> */}

          <Card className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-sm font-medium">
                    Campaign Name
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
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g Best description of the campaign that will be shown to users"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  required
                  className="resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Category Image Upload */}
              <ImageUploadField
                label="Campaign Image"
                description="Campaign image. Used for campaign poster."
                recommendedSize="1920×1080px"
                formats="JPEG or PNG"
                maxSize={10}
                onImageUpload={handleImageChange}
                existingImageUrl={formData.categoryImage}
              />

              {/* Countdown Duration */}
              <div className="flex flex-row gap-12">
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="countdownDuration"
                    className="text-sm font-medium"
                  >
                    Countdown Duration
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="countdownDuration"
                      type="number"
                      min="1"
                      max="168"
                      placeholder="eg. 24"
                      value={formData.countdownDuration}
                      onChange={(e) =>
                        handleInputChange(
                          "countdownDuration",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full flex-1 h-11"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-muted-foreground">Hours</span>
                  </div>
                </div>

                {/* Schedule Start Date */}
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-medium">
                    Schedule Start Date
                  </Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={formData.startDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("startDate", new Date(e.target.value))
                    }
                    className="h-11"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-6" />

              {/* Manage Contestants Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Manage Contestants
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add or remove users from this category
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 2 contestants required for active campaigns
                    </p>
                  </div>
                  <NominateContestantsDialog
                    title={formData.categoryName}
                    onAddContestant={addContestant}
                  />
                </div>

                {/* Selected Contestants */}
                <div className="items-center grid grid-cols-4 gap-6">
                  {formData.selectedContestants.map((contestant) => (
                    <div
                      key={contestant.id}
                      className="flex flex-col items-center justify-between p-0 border rounded-lg w-2xs relative"
                    >
                      <div className="flex flex-col items-start gap-3 w-full">
                        <Image
                          src={contestant.imageUrl || "/api/placeholder/40/40"}
                          alt={contestant.name}
                          fit="cover"
                          className="w-full h-50 rounded-t-md"
                        />
                        <div className="px-6 pb-6">
                          <p className="font-medium mb-2">{contestant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contestant.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContestant(contestant.id)}
                        className="absolute -top-5 -right-5 rounded-full bg-input"
                        disabled={isSubmitting}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}

                  {formData.selectedContestants.length === 0 && (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">
                        No contestants added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="bg-[#5014D0] hover:bg-[#5014D0]/90 h-11 flex-1 text-white"
                  disabled={!isFormSubmittable || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    `Create Campaign`
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
