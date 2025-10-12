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
import { useState } from "react";
import type { Ticket } from "@/types/ticket";

interface HelpdeskTicketDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendReply?: (ticket: Ticket, response: string) => void;
  onStatusChange?: (ticket: Ticket, newStatus: Ticket["status"]) => void;
}

export function HelpdeskTicketDialog({
  ticket,
  open,
  onOpenChange,
  onSendReply,
  onStatusChange,
}: HelpdeskTicketDialogProps) {
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<Ticket["status"]>("open");

  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: Ticket["status"]) => {
    const config = {
      open: {
        label: "Open",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      in_progress: {
        label: "In Progress",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      resolved: {
        label: "Resolved",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      pending: {
        label: "Pending",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
    };
    return config[status];
  };

  const handleSendReply = () => {
    if (responseText.trim() && onSendReply) {
      onSendReply(ticket, responseText);
      setResponseText("");
    }
  };

  const handleStatusChange = (newStatus: Ticket["status"]) => {
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(ticket, newStatus);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Gradient Header */}
        <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6 rounded-t-lg ">
          <DialogTitle className="flex items-center justify-between text-white">
            <h2 className="text-[24px]">Ticket Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-white/20 text-white hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <p className="text-sm text-white/80 mt-1">
            Manage and respond to support ticket
          </p>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="text-2xl font-bold">{ticket.ticketNumber}</h3>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(ticket.createdAt)}
              </p>
            </div>
            <Badge
              className={`px-3 py-1 text-sm border ${
                getStatusConfig(ticket.status).color
              }`}
            >
              {getStatusConfig(ticket.status).label}
            </Badge>
          </div>

          {/* Subject Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Subject</h4>
            <p className="text-base p-3 bg-muted/50 rounded-lg">
              {ticket.subject}
            </p>
          </div>

          {/* User and Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  User
                </h4>
                <p className="text-base font-medium">{ticket.user}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Business
                </h4>
                <p className="text-base font-medium">{ticket.business}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Phone Number
                </h4>
                <p className="text-base font-medium">
                  {ticket.phone || "+256 752191970"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Last Updated
                </h4>
                <p className="text-base font-medium">
                  {formatDateTime(ticket.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Change Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-4">Change Status</h4>
            <div className="flex items-center gap-4">
              <Select
                value={selectedStatus}
                onValueChange={(value: Ticket["status"]) =>
                  handleStatusChange(value)
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Badge
                className={`px-3 py-1 ${getStatusConfig(selectedStatus).color}`}
              >
                {getStatusConfig(selectedStatus).label}
              </Badge>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Description:</h4>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-base whitespace-pre-wrap">
                {ticket.description ||
                  "I tried to book an event but my payment failed. The money was deducted from my account but I didn't receive confirmation."}
              </p>
            </div>
          </div>

          {/* Response Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-4">Response Note:</h4>
            <Textarea
              placeholder="Type your response here..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-32 mb-4 resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
