import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface RejectEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string
  onReject: (reason: string) => void
}

export function RejectEventDialog({
  open,
  onOpenChange,
  eventName,
  onReject,
}: RejectEventDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("")

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason)
      setRejectionReason("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setRejectionReason("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            Reject Event
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting <span className="text-[#071437] font-medium dark:text-[#FFFFFF]">"{eventName}"</span>. This will be shared with the business owner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Rejection Reason</h3>
            <Textarea
              placeholder="Explain why this event is being rejected (violation of community guidelines, incomplete information etc)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            
          </div>
        </div>
            <hr className="border-border space-y-1"/>
        

        <DialogFooter className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-11 flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            className="h-11 flex-1"
          >
            Reject Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}