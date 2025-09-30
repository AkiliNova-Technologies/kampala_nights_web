import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Business } from "@/types/business";
// import { Trash2 } from "lucide-react"


interface DeleteBusinessDialogProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (businessId: number) => void;
}

export function DeleteBusinessDialog({
  business,
  isOpen,
  onClose,
  onDelete,
}: DeleteBusinessDialogProps) {
  const handleDelete = () => {
    if (business) {
      onDelete(business.id)
      onClose()
    }
  }

  if (!business) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {/* <div className="rounded-full bg-red-100 p-2">
              <Trash2 className="size-5 text-red-600" />
            </div> */}
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{business.business}</strong>? 
            This action cannot be undone. This will permanently delete the business 
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
          >
            Delete Business
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}