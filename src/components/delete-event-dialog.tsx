import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Event } from "@/types/event";

interface DeleteEventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (eventId: string) => void;
}

export function DeleteEventDialog({
  event,
  isOpen,
  onClose,
  onDelete,
}: DeleteEventDialogProps) {
  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!event) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Delete Event
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>"{event.title}"</strong>?
            <br />
            <br />
            This action cannot be undone and will remove all associated data
            including attendee information and revenue records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-3">
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 h-11 flex-1"
          >
            Delete Event
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0 sm:mt-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 flex-1">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
