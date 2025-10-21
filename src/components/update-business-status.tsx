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

type BackendStatus = "PENDING" | "APPROVED" | "REJECTED";

type FrontendStatus = Business["status"];

export function BusinessStatusDialog({
  business,
  isOpen,
  onClose,
  onStatusUpdate,
  loading,
}: BusinessStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<BackendStatus>("APPROVED");

  useEffect(() => {
    if (business) {
      const backendStatus = mapFrontendToBackendStatus(business.status);
      setSelectedStatus(backendStatus);
    }
  }, [business]);

  const mapFrontendToBackendStatus = (frontendStatus: FrontendStatus): BackendStatus => {
    const statusMap: Record<FrontendStatus, BackendStatus> = {
      PENDING: "PENDING", 
      APPROVED: "APPROVED", 
      REJECTED: "REJECTED", 
      // suspended: "reject",
    };
    return statusMap[frontendStatus] || "APPROVED";
  };

  // Map backend status to frontend status
  const mapBackendToFrontendStatus = (backendStatus: BackendStatus): FrontendStatus => {
    const statusMap: Record<BackendStatus, FrontendStatus> = {
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      REJECTED: "REJECTED", // or "suspended" depending on your business logic
    };
    return statusMap[backendStatus];
  };

  const handleStatusUpdate = () => {
    if (business) {
      // Convert backend status to frontend status before passing up
      const frontendStatus = mapBackendToFrontendStatus(selectedStatus);
      onStatusUpdate(business.id, frontendStatus);
      onClose();
    }
  };

  const statusConfig = {
    PENDING: {
      label: "Pending",
      description: "This business is waiting approval to join platform"
    },
    APPROVED: {
      label: "Approve",
      description: "Approve this business to join the platform"
    },
    REJECTED: {
      label: "Reject",
      description: "Reject this business application"
    },
  };

  if (!business) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-2xl">
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
                Current Status
              </label>
              <p className="text-sm font-medium capitalize">{business.status}</p>
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
              Update Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: BackendStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger className="min-h-11 w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {statusConfig[selectedStatus].label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(["APPROVED", "REJECTED"] as const).map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {statusConfig[status].label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {statusConfig[status].description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Status change preview */}
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              Changing from <span className="font-medium capitalize">{business.status}</span> to{" "}
              <span className="font-medium">{mapBackendToFrontendStatus(selectedStatus)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex-row flex justify-between w-full gap-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-11 w-full flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              className="h-11 w-full flex-1 bg-[#5014D0] hover:bg-[#5014D0]/80 text-white"
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