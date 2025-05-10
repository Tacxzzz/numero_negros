import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, MessageCircle, Mail, Send } from "lucide-react";

interface SendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageData: string | null;
}

export const SendModal: React.FC<SendModalProps> = ({
  open,
  onOpenChange,
  imageData,
}) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (platform: string) => {
    // In a real app, you would implement actual sending functionality
    console.log(`Sending via ${platform} to ${recipient}`);
    console.log(`Message: ${message}`);
    
    if (imageData) {
      // For demonstration purposes - in a real app you'd use the appropriate APIs
      
      // Example for WhatsApp (simplified):
      if (platform === "whatsapp") {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${recipient}?text=${encodedMessage}`, '_blank');
      }
      
      // Example for Email (simplified):
      if (platform === "email") {
        const subject = encodeURIComponent("My Lottery Ticket");
        const body = encodeURIComponent(message);
        window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
      }
      
      // In a real implementation, you would need to upload the image to a server
      // and then include the URL to that image in your message
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-full sm:max-w-md p-2 sm:p-2">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Send Lottery Ticket</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Send your lottery ticket as a message
          </DialogDescription>
        </DialogHeader>
        
        {imageData && (
          <div className="flex justify-center  sm:my-2">
            <img 
              src={imageData} 
              alt="Lottery Ticket" 
              className="max-w-full max-h-40 sm:max-h-60 object-contain border rounded-md"
            />
          </div>
        )}
        
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="recipient" className="text-xs sm:text-sm">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Phone number or email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="text-sm px-2 py-1 sm:px-3 sm:py-2"
            />
          </div>
          
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="message" className="text-xs sm:text-sm">Message</Label>
            <Textarea
              id="message"
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[60px] sm:min-h-[80px] text-sm px-2 py-1 sm:px-3 sm:py-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-2">
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleSend("whatsapp")}
          >
            <MessageSquare className="h-6 w-6 text-green-600" />
            <span className="mt-1 text-xs">WhatsApp</span>
          </Button>
          
          
          <Button
            variant="outline"
            className="flex flex-col items-center"
            onClick={() => handleSend("email")}
          >
            <Mail className="h-6 w-6 text-red-500" />
            <span className="mt-1 text-xs">Email</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={() => handleSend("default")}
            className="gap-2 w-full sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
