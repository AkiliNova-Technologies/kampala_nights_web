import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Contestant } from "@/types/contestant";
import type { Campaign } from "@/types/campaign";


interface NominationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContestants: Contestant[];
  onNominate: (contestantIds: string[], campaignId: string) => void;
  campaigns: Campaign[];
  loading?: boolean;
}

export function NominationDialog({
  open,
  onOpenChange,
  selectedContestants,
  onNominate,
  campaigns,
  loading = false,
}: NominationDialogProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");

  // Reset selected campaign when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedCampaign("");
    }
  }, [open]);

  const handleNominate = () => {
    if (selectedCampaign) {
      const contestantIds = selectedContestants.map(
        (contestant) => contestant.id
      );
      onNominate(contestantIds, selectedCampaign);
    }
  };

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active"
  );

  // Get the selected campaign name for display
  const selectedCampaignName = selectedCampaign
    ? activeCampaigns.find((campaign) => campaign.id === selectedCampaign)?.title
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md min-w-2xl">
        <DialogHeader>
          <DialogTitle>Nominate Contestants</DialogTitle>
          <DialogDescription>
            Nominate contestants for a specific campaign
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Contestants */}
          {selectedContestants.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Selected Contestants ({selectedContestants.length})
              </h4>
              <div className="flex flex-wrap gap-2 min-h-11 max-h-32 overflow-y-auto p-2 border rounded-md">
                {selectedContestants.map((contestant) => (
                  <Badge
                    key={contestant.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {contestant.username}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Selection */}
          <div className="space-y-3">
            <label htmlFor="campaign-select" className="text-sm font-medium">
              Select Campaign
            </label>
            <Select
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger id="campaign-select" className="w-full min-h-11">
                <SelectValue placeholder="Select campaign to nominate for...">
                  {selectedCampaignName || "Select campaign to nominate for..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeCampaigns.length > 0 ? (
                  activeCampaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{campaign.title}</span>
                        {campaign.description && (
                          <span className="text-xs text-muted-foreground">
                            {campaign.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-campaigns" disabled>
                    No active campaigns available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <div className="rounded-md bg-[#DBEAFE] p-3">
              <p className="text-[#1D4ED8]">
                Contestants will be notified about their nomination and will
                appear in the selected category for users to vote on.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleNominate}
            disabled={!selectedCampaign || loading}
            className="bg-[#5014D0] hover:bg-[#5014D0]/90 text-white h-11 flex-1"
          >
            {loading ? "Nominating..." : "Nominate Contestants"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
