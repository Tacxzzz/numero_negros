import React from "react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Lottery Ticket</DialogTitle>
          <DialogDescription>
            Share your lottery ticket to social media
          </DialogDescription>
        </DialogHeader>
        
        {imageData && (
          <div className="flex justify-center my-4">
            <img 
              src={imageData} 
              alt="Lottery Ticket" 
              className="max-w-full max-h-60 object-contain border rounded-md"
            />
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-4 py-4">
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
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};