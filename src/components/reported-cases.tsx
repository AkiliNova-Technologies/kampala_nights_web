import { useState } from "react";
import { Badge } from "./ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface ReportedCase {
  id: string;
  title: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  description: string;
  event: string;
  reporter: string;
  reportedDate: string;
  reportedTime: string;
}

interface ReportedCasesProps {
  cases: ReportedCase[];
  onStatusChange?: (caseId: string, newStatus: ReportedCase["status"]) => void;
}

export function ReportedCases({ cases, onStatusChange }: ReportedCasesProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, ReportedCase["status"]>>({});
  const [updatingCaseId, setUpdatingCaseId] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-600/20 text-red-800 border-1 border-red-600";
      case "INVESTIGATING":
        return "bg-orange-600/20 text-orange-800 border-1 border-orange-600";
      case "RESOLVED":
        return "bg-green-600/20 text-green-800 border-1 border-green-600";
      case "CLOSED":
        return "bg-gray-600/20 text-gray-800 border-1 border-gray-600";
      default:
        return "bg-gray-600/20 text-gray-800 border-1 border-gray-600";
    }
  };

  const handleStatusSelect = (caseId: string, status: ReportedCase["status"]) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [caseId]: status
    }));
  };

  const handleUpdateStatus = async (caseId: string) => {
    const newStatus = selectedStatuses[caseId];
    if (!newStatus) return;

    setUpdatingCaseId(caseId);
    
    try {
      // Call the parent component's handler to update the status
      await onStatusChange?.(caseId, newStatus);
      
      // Clear the selected status for this case after successful update
      setSelectedStatuses(prev => {
        const updated = { ...prev };
        delete updated[caseId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingCaseId(null);
    }
  };

  const hasStatusChanged = (caseItem: ReportedCase) => {
    return selectedStatuses[caseItem.id] && selectedStatuses[caseItem.id] !== caseItem.status;
  };

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{caseItem.title}</h4>
              <Badge
                variant={"secondary"}
                className={`text-xs rounded-sm font-medium ${getStatusStyles(
                  caseItem.status
                )}`}
              >
                {caseItem.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Status Select */}
              <Select
                value={selectedStatuses[caseItem.id] || caseItem.status}
                onValueChange={(value: ReportedCase["status"]) => 
                  handleStatusSelect(caseItem.id, value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Update Button - Only show when status has changed */}
              {hasStatusChanged(caseItem) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUpdateStatus(caseItem.id)}
                  disabled={updatingCaseId === caseItem.id}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>
          <div className="text-xs text-gray-500 flex space-x-2">
            <div>
              <span className="font-medium">Event:</span> {caseItem.event}
            </div>
            <div>
              <span className="font-medium">Reporter:</span> {caseItem.reporter}
            </div>
            <div>
              <span className="font-medium">Reported:</span>{" "}
              <span className="text-xs text-gray-500">
                {caseItem.reportedDate} {caseItem.reportedTime}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}