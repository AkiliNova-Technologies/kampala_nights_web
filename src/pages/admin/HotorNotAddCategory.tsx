import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUploadField } from "@/components/image-upload-field";
import contest1 from "@/assets/images/contestant1.jpg";
import contest2 from "@/assets/images/contestant2.jpg";
import contest3 from "@/assets/images/contestant3.jpg";
import contest4 from "@/assets/images/contestant4.jpg";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  countdownDuration: number | undefined;
  startDate: Date | undefined;
  categoryImage: string | null;
  selectedContestants: Contestant[];
}

export function HotorNotAddCategoryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    categoryName: "",
    description: "",
    countdownDuration: undefined,
    startDate: new Date(2025, 9, 24), // October 24, 2025
    categoryImage: null,
    selectedContestants: [],
  });

  // Mock data for available contestants
  const availableContestants: Contestant[] = [
    {
      id: "1",
      name: "Olivia Nalugya",
      username: "olivia_nalugya",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest1,
    },
    {
      id: "2",
      name: "Hanifa Nalugya",
      username: "hanifa_nalugya",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest2,
    },
    {
      id: "3",
      name: "Sarah Nakato",
      username: "sarah_nakato",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest3,
    },
    {
      id: "4",
      name: "Grace Auma",
      username: "grace_auma",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest4,
    },
    {
      id: "5",
      name: "Olivia Nalugya",
      username: "olivia_nalugya",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest1,
    },
    {
      id: "6",
      name: "Hanifa Nalugya",
      username: "hanifa_nalugya",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest2,
    },
    {
      id: "7",
      name: "Sarah Nakato",
      username: "sarah_nakato",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest3,
    },
    {
      id: "8",
      name: "Grace Auma",
      username: "grace_auma",
      description: "Effortless charm and free-spirited style",
      imageUrl: contest4,
    },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isFormSubmittable =
    formData.categoryName.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.selectedContestants.length > 0;

  return (
    <div className="min-h-screen">
      <SiteHeader label="Hot or Not Management" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-5 items-center">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => navigate(-1)}
              >
                <ArrowLeft />
              </Button>
              <div>
                <p className="font-semibold">Add Campaign</p>
                <p className="text-sm text-muted-foreground">
                  Add category details and nominate contestants
                </p>
              </div>
            </div>
          </div>
          <Card className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
              <div className="grid grid-cols-2 gap-6">
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
                  />
                </div>
                {/* Campaign category */}
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-sm font-medium">
                    Campaign Category
                  </Label>
                  <RadioGroup
                    value={formData.categoryName}
                    onValueChange={(value) =>
                      handleInputChange("categoryName", value)
                    }
                    className="flex gap-12 pt-2"
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Nightlife" id="nightlife" />
                      <Label
                        htmlFor="nightlife"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Nightlife
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fashion" id="fashion" />
                      <Label
                        htmlFor="fashion"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Fashion
                      </Label>
                    </div>
                  </RadioGroup>
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
                    // value={formData.eventDate}
                    // onChange={(e) =>
                    //   handleInputChange("eventDate", e.target.value)
                    // }
                    className="h-11"
                    required
                    disabled={!isFormSubmittable}
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
                  </div>
                  {/* <Button type="button" variant="outline" size="sm">
                    <Plus className="size-4 mr-2" />
                    Nominate Contestants
                  </Button> */}
                </div>

                {/* Selected Contestants */}
                <div className="items-center grid grid-cols-4 gap-6">
                  {formData.selectedContestants.map((contestant) => (
                    <div
                      key={contestant.id}
                      className="flex flex-col items-center justify-between p-0 border rounded-lg w-2xs relative"
                    >
                      <div className="flex flex-col items-center gap-3 w-full">
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

                {/* Available Contestants */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Available Contestants
                  </h3>
                  {availableContestants
                    .filter(
                      (contestant) =>
                        !formData.selectedContestants.find(
                          (c) => c.id === contestant.id
                        )
                    )
                    .map((contestant) => (
                      <div
                        key={contestant.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => addContestant(contestant)}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              contestant.imageUrl || "/api/placeholder/40/40"
                            }
                            alt={contestant.name}
                            size="sm"
                            radius="full"
                            fit="cover"
                          />
                          <div>
                            <p className="font-medium">{contestant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contestant.description}
                            </p>
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
                  disabled={!isFormSubmittable}
                >
                  Create Campaign
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
