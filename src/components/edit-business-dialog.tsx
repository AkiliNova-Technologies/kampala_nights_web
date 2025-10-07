import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Building, User, Mail } from "lucide-react";

interface BusinessData {
  name: string;
  status: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  joinedDate: string;
  category: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
}

interface EditBusinessDialogProps {
  businessData: BusinessData;
  onSave: (updatedData: Partial<BusinessData>) => void;
}

export function EditBusinessDialog({
  businessData,
  onSave,
}: EditBusinessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(businessData.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({ status });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update business:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   const getStatusColor = (status: string) => {
  //     switch (status) {
  //       case "Active":
  //         return "bg-green-500 hover:bg-green-600";
  //       case "Inactive":
  //         return "bg-gray-500 hover:bg-gray-600";
  //       case "Suspended":
  //         return "bg-red-500 hover:bg-red-600";
  //       default:
  //         return "bg-blue-500 hover:bg-blue-600";
  //     }
  //   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5014D0] hover:bg-[#5014D0]/70 text-white">
          <Edit className="h-4 w-4 mr-2" />
          Edit Business
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
          <DialogDescription>
            Update business information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Business Status Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="status" className="text-lg font-semibold">
                Business Status
              </Label>
            </div>
            <Select
              value={status}
              onValueChange={(
                value: "pending" | "approved" | "cancelled" | "suspended"
              ) => setStatus(value)}
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Read-only Business Information */}
          <div className="space-y-6">
            {/* Business Name & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4" />
                  Business Name
                </Label>
                <Input
                  value={businessData.name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Input
                  value={businessData.category}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Owner & Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Owner
                </Label>
                <Input
                  value={businessData.accountName}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  value={businessData.email}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={businessData.description}
                readOnly
                className="bg-gray-50 min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="h-10 w-full sm:w-auto sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#5014D0] hover:bg-[#5014D0]/70 text-white h-10 w-full sm:w-auto sm:flex-1"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
