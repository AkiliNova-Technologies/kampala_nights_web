import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, XIcon } from "lucide-react";
import type { Transaction } from "@/types/transaction";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadInvoice?: (transaction: Transaction) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
  onDownloadInvoice,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "mobile_money":
        return "Mobile Money";
      case "bank_transfer":
        return "Bank Transfer";
      case "card":
        return "Card";
      default:
        return method;
    }
  };

  const businessReceives = transaction.totalAmount - transaction.commission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6 rounded-t-lg -mx-6 -mt-6">
          <DialogTitle className="flex items-center justify-between text-white">
            <span>Transaction Details</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-white/20 text-white hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <p className="text-sm text-white/80 mt-2">
            View detailed information about this revenue transaction
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="text-xl font-bold">
                {transaction.transactionNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(transaction.date)}
              </p>
            </div>
            <Badge
              className={`px-3 py-1 text-sm ${
                transaction.status === "paid"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
            >
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </Badge>
          </div>

          {/* Event and Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Event Name
                </h4>
                <p className="text-base">{transaction.event}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Business
                </h4>
                <p className="text-base">
                  {transaction.business || "Nightlife Central"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Customer Name
                </h4>
                <p className="text-base">{transaction.customer}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Phone Number
                </h4>
                <p className="text-base">{transaction.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Invoice Number
              </h4>
              <p className="text-base">
                {transaction.invoiceNumber ||
                  `INV-${transaction.transactionNumber}`}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Payment Method
              </h4>
              <p className="text-base">
                {getPaymentMethodText(transaction.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Transaction Amount:
              </span>
              <span className="font-semibold">
                {formatCurrency(transaction.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Commission Rate:
              </span>
              <span className="font-semibold">15%</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-muted-foreground">
                Platform Revenue:
              </span>
              <span className="font-semibold text-[#5014D0]">
                {formatCurrency(transaction.commission)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Business Receives:
              </span>
              <span className="font-semibold">
                {formatCurrency(businessReceives)}
              </span>
            </div>
          </div>

          {/* Note Section */}
          {transaction.note && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Note
              </h4>
              <p className="text-base p-3 bg-muted/50 rounded-lg">
                {transaction.note}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none h-11 w-[150px]"
            >
              Close
            </Button>
            <Button
              onClick={() => onDownloadInvoice?.(transaction)}
              className="flex-1 sm:flex-none gap-2 bg-[#5014D0] text-white h-11 min-w-2xs"
            >
              <DownloadIcon className="h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
