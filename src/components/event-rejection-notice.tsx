import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface EventRejectionNoticeProps {
  rejectionDate: string;
  rejectionReason: string;
  onEditEvent: () => void;
  onResubmit?: () => void;
}

export function EventRejectionNotice({ 
  rejectionDate, 
  rejectionReason, 
  onEditEvent,
}: EventRejectionNoticeProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#D81A48] bg-[#FDE9ED]">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#D81A48]">
            Event Rejected by Admin
          </h3>
        </div>

        <div className="text-sm text-gray-600">
          <span className="text-black">Date:</span> {rejectionDate}
        </div>

        <div className="bg-white border-l-4 border-l-[#D81A48] rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            "{rejectionReason}"
          </p>
        </div>

        <Button 
          onClick={onEditEvent}
          className="bg-[#5014D0] hover:bg-[#4512B8] text-white h-11 w-full sm:w-auto"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Event & Resubmit
        </Button>
      </div>
    </Card>
  );
}