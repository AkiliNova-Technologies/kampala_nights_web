import type { Profile } from "@/types/profile";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

interface DeleteDialogProps {
  openDisable: boolean;
  onOpenDisableChange: (open: boolean) => void;
  profile: Profile | null;
  title?: string;
  description?: string;
  onDisable: (profileId: string) => void;
}


export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  openDisable,
  onOpenDisableChange,
  title,
  description,
  profile,
  onDisable,
}) => {
  const handleDisable = () => {
    if (profile) {
      onDisable(profile.id);
      onOpenDisableChange(false);
    }
  };

  return (
    <Dialog open={openDisable} onOpenChange={onOpenDisableChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-left">
                {title || "Disable DJ Profile"}
              </DialogTitle>
              <DialogDescription className="text-md text-left mt-1">
                {description || "Are you sure you want to disable this DJ profile?"}
              </DialogDescription>
            </div>
            <Button
              variant={"ghost"}
              onClick={() => onOpenDisableChange(false)}
            >
              <X />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-md text-muted-foreground">
            When {" "}
            <span className="font-semibold text-foreground">
              {profile?.name}
            </span>'s{" "}
            profile is deleted, it will be hidden and inaccessible to users on
            the mobile app.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-5">
          <Button
            type="button"
            onClick={handleDisable}
            className="w-full flex-1 h-11 bg-[#D81A48] hover:bg-[#D81A48]/80 text-white"
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenDisableChange(false)}
            className="w-full flex-1 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};