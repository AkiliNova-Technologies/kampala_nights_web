import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, XIcon } from "lucide-react";
import type { Invoice } from "@/types/invoice";

interface InvoiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceDetailsDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-US");
  };

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      paid: {
        label: "Paid",
        dotColor: "bg-green-500",
        variant: "default" as const,
      },
      cancelled: {
        label: "Cancelled",
        dotColor: "bg-red-500",
        variant: "destructive" as const,
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.paid
    );
  };

  const statusConfig = getStatusConfig(invoice.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Invoice Details
            <p className="text-sm text-muted-foreground font-normal">
              View and manage invoice information
            </p>
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>

              <Badge
                variant={statusConfig.variant}
                className="flex items-center gap-2"
              >
                <div
                  className={`size-2 rounded-full ${statusConfig.dotColor}`}
                />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {invoice.dueDate}
            </p>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#737373]">Name</span>
              <span className="font-medium text-[#737373]">Phone Number</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{invoice.customer}</span>
              </div>
              <span className="font-medium">+256 700 123456</span>
            </div>
          </div>

          {/* Event and Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#737373]">Event</span>
              <span className="font-medium text-[#737373]">Bill (UGX)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{invoice.event}</span>
              <span className="font-semibold">
                {formatAmount(invoice.amount)}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-[#737373]">Note</h4>
            <p className="text-sm bg-input p-3 rounded-md">
              Payment received via {invoice.paymentMethod}
            </p>
          </div>

          {/* Download Button */}
          <Button className="w-full gap-2 h-11 bg-[#5041D0] text-white">
            <DownloadIcon className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
