import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Business } from "@/types/business";


interface BusinessStatusDialogProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (businessId: string, newStatus: Business["status"]) => void;
  loading?: boolean; 
}

export function BusinessStatusDialog({
  business,
  isOpen,
  onClose,
  onStatusUpdate,
  loading,
}: BusinessStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<Business["status"]>("pending");

  // Reset selected status when business changes using useEffect
  useEffect(() => {
    if (business) {
      setSelectedStatus(business.status);
    }
  }, [business]);

  const handleStatusUpdate = () => {
    if (business) {
      onStatusUpdate(business.id, selectedStatus);
      onClose();
    }
  };

  const statusConfig = {
    pending: {
      label: "Pending",
    },
    approved: {
      label: "Approved",
    },
    cancelled: {
      label: "Cancelled",
    },
    suspended: {
      label: "Suspended",
    },
  };

  if (!business) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Business Details & Status Management</DialogTitle>
          <DialogDescription>
            Update the status of {business.business}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Business Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Business Name
              </label>
              <p className="text-sm font-medium">{business.business}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Business Type
              </label>
              <p className="text-sm font-medium">Club</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Manager
              </label>
              <p className="text-sm font-medium">{business.owner}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Location
              </label>
              <p className="text-sm font-medium">
                {business.address?.split(",")[0] || "N/A"}
              </p>
            </div>
          </div>

          {/* Status Management */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Status Management
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: Business["status"]) =>
                setSelectedStatus(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {statusConfig[selectedStatus].label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(["pending", "approved", "cancelled", "suspended"] as const).map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        {statusConfig[status].label}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <div className="flex-row flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-12 w-45"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              className="h-12 w-45 bg-blue-800 hover:bg-blue-800/80 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
