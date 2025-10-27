import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon, SendIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { ReportedCase, CaseStatus } from "@/types/reported-case";

interface ReportedCaseDialogProps {
  case: ReportedCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendReply?: (reportedCase: ReportedCase, response: string) => void;
  onStatusChange?: (reportedCase: ReportedCase, newStatus: CaseStatus) => void;
}

export function ReportedCaseDialog({
  case: reportedCase,
  open,
  onOpenChange,
  onSendReply,
  onStatusChange,
}: ReportedCaseDialogProps) {
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>("open");

  // Initialize selectedStatus with the case's current status when the case changes
  useEffect(() => {
    if (reportedCase) {
      setSelectedStatus(reportedCase.status);
    }
  }, [reportedCase]);

  if (!reportedCase) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: CaseStatus) => {
    const config = {
      open: {
        label: "Open",
        dotColor: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
      },
      in_progress: {
        label: "In Progress",
        dotColor: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
      },
      resolved: {
        label: "Resolved",
        dotColor: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
      },
      pending: {
        label: "Pending",
        dotColor: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
      },
    };
    return config[status] || config.open;
  };

  const handleSendReply = () => {
    if (responseText.trim() && onSendReply) {
      onSendReply(reportedCase, responseText);
      setResponseText("");
    }
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(reportedCase, newStatus);
    }
  };

  const currentStatusConfig = getStatusConfig(selectedStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Gradient Header */}
        <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6 rounded-t-lg">
          <DialogTitle className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-[24px] font-bold">
                Case Details - {reportedCase.caseNumber}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-white/20 text-white hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Case Information */}
          <div>
            <div className="flex flex-row justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Case Information</h3>
                <p className="text-sm text-white/80 mt-1">
                  Created: {formatDate(reportedCase.createdAt)}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`flex flex-row items-center w-28 gap-2 ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor}`}
              >
                <div
                  className={`size-2 rounded-full ${currentStatusConfig.dotColor}`}
                />
                {currentStatusConfig.label}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Description Section */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Description:
                </h4>
                <p className="text-base p-4 bg-muted/50 rounded-lg">
                  {reportedCase.description ||
                    "Multiple reports of inadequate lighting and security issues in the company parking garage, creating unsafe conditions."}
                </p>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    User
                  </h4>
                  <p className="text-base font-medium">{reportedCase.user}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    Phone Number
                  </h4>
                  <p className="text-base font-medium">
                    {reportedCase.phone || "+256 752191970"}
                  </p>
                </div>
              </div>

              {/* Assigned To Section */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Assigned To:
                </h4>
                <p className="text-base font-medium">
                  {reportedCase.assignedTo || "Not Assigned Yet"}
                </p>
              </div>

              {/* Status Change Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Change Status
                </h4>
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedStatus}
                    onValueChange={(value: CaseStatus) =>
                      handleStatusChange(value)
                    }
                  >
                    <SelectTrigger className="flex-1 min-h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Response Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Response Note:
                </h4>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleSendReply}
              disabled={!responseText.trim()}
              className="flex-1 gap-2 bg-gradient-to-r from-[#5014D0] to-[#38119F] hover:from-[#4512B8] hover:to-[#2E0F8A] text-white h-11"
            >
              <SendIcon className="h-4 w-4" />
              Send Reply
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
