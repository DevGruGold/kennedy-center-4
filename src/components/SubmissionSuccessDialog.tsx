import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SubmissionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  onDownload: () => void;
}

export const SubmissionSuccessDialog = ({
  open,
  onOpenChange,
  imageUrl,
  onDownload,
}: SubmissionSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your artwork is ready!</DialogTitle>
          <DialogDescription>
            Your artwork has been uploaded successfully. You can download it now or view it in our gallery.
          </DialogDescription>
        </DialogHeader>
        {imageUrl && (
          <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg">
            <img src={imageUrl} alt="Your artwork" className="w-full h-full object-cover" />
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onDownload}>
            Download Artwork
          </Button>
          <Button onClick={() => window.location.href = "/gallery"}>
            View in Gallery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};