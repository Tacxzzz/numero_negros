import React, { useRef } from "react";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, Copy } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageData: string | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onOpenChange,
  imageData,
}) => {
  // Ref for the content to be captured (excluding header)
  const captureContentRef = useRef<HTMLDivElement>(null);
  // Ref for the Share Screenshot button
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const handleShare = (platform: string) => {
    // In a real app, you would implement actual sharing functionality
    // This is a simplified example
    console.log(`Sharing to ${platform}`);
    
    if (imageData) {
      // For demonstration purposes - in a real app you'd use the Web Share API
      // or platform-specific sharing APIs
      
      // Example for Facebook (simplified):
      if (platform === "facebook") {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
      }
      
      // Example for Twitter (simplified):
      if (platform === "twitter") {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank');
      }
      
      // In a real implementation, you would need to upload the image to a server
      // and then share the URL to that image
    }
    
    onOpenChange(false);
  };

  const copyToClipboard = async () => {
    if (imageData) {
      try {
        // For modern browsers that support the Clipboard API with images
        const blob = await (await fetch(imageData)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        alert("Image copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy image: ", err);
        // Fallback - copy the URL if available
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    }
    onOpenChange(false);
  };

  // Capture and share only the ticket content, excluding the header
  const shareScreenshot = async () => {
    try {
      if (!captureContentRef.current) return;

      // Hide the share button before screenshot
      if (shareButtonRef.current) {
        shareButtonRef.current.style.display = "none";
      }

      // Wait a tick to ensure the button is hidden
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(captureContentRef.current);

      // Restore the button after screenshot
      if (shareButtonRef.current) {
        shareButtonRef.current.style.display = "";
      }
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob))
      );
      if (!blob) {
        alert("Failed to capture the modal as an image.");
        return;
      }
      const file = new File([blob], "ShareModal.png", { type: "image/png" });
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Lottery Ticket Modal",
          text: "Here is my lottery ticket modal!",
          files: [file],
        });
        onOpenChange(false);
      } else {
        alert("File sharing is not supported on this device or browser.");
      }
    } catch (error) {
      console.error("Error sharing screenshot:", error);
      alert("An error occurred while trying to share the screenshot.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preview Bet Receipt</DialogTitle>
          <DialogDescription>
            Share your Bet Receipt
          </DialogDescription>
        </DialogHeader>
        
        <div ref={captureContentRef}>
          {imageData && (
            <div className="flex justify-center my-4">
              <img 
                src={imageData} 
                alt="Lottery Ticket" 
                className="max-w-full max-h-60 object-contain border rounded-md"
              />
            </div>
          )}
        </div>
        
        {/* <div className="grid grid-cols-4 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-6 w-6 text-blue-600" />
            <span className="mt-1 text-xs">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-6 w-6 text-blue-400" />
            <span className="mt-1 text-xs">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleShare("instagram")}
          >
            <Instagram className="h-6 w-6 text-pink-600" />
            <span className="mt-1 text-xs">Instagram</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleShare("linkedin")}
          >
            <Linkedin className="h-6 w-6 text-blue-800" />
            <span className="mt-1 text-xs">LinkedIn</span>
          </Button>
        </div> */}
        
        <DialogFooter className="sm:justify-start flex flex-col gap-2">
          {/* <Button
            type="button"
            variant="secondary"
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Image
          </Button> */}
          <Button
            type="button"
            variant="default"
            onClick={shareScreenshot}
            className="gap-2"
            ref={shareButtonRef}
          >
            <Copy className="h-4 w-4" />
            Share Screenshot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
