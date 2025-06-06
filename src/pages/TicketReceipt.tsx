import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Send, FileDown } from "lucide-react";
import { ShareModal } from "@/components/ShareModal";
import { SendModal } from "@/components/SendModal";
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { getBetByID } from "@/lib/apiCalls";
import { formatPeso, getTransCode } from "@/lib/utils";
import Barcode from 'react-barcode';

// Import html2canvas and jsPDF dynamically to avoid SSR issues
let html2canvas: any = null;
let jsPDF: any = null;

const TicketReceipt: React.FC = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const betID = location.state?.betID;
  const fromPage = location.state?.from;
  const ticketRef = useRef<HTMLDivElement>(null);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [sendModalOpen, setSendModalOpen] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [ticketData, setTicketData] = useState<any[]>([]);

    useEffect(() => {
        const handleUpdate = async () => {
          const gameBetData = await getBetByID(betID);
          console.log(gameBetData);
          setTicketData(gameBetData);
          };
          handleUpdate();
      }, [betID]);


  // Load dependencies dynamically after component mounts
  useEffect(() => {
    setIsClient(true);
    const loadDependencies = async () => {
      try {
        html2canvas = (await import('html2canvas')).default;
        const jspdfModule = await import('jspdf');
        jsPDF = jspdfModule.default;
      } catch (error) {
        console.error("Failed to load dependencies:", error);
      }
    };
    
    loadDependencies();
  }, []);



  const captureTicket = async () => {
    if (!ticketRef.current || !html2canvas) {
      console.error("Cannot capture ticket: Missing ref or html2canvas");
      return null;
    }
    
    try {
      const canvas = await html2canvas(ticketRef.current);
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing ticket:", error);
      return null;
    }
  };

  const handleShare = async () => {
    if (!isClient) return;
    
    try {
      const imageData = await captureTicket();
      setCapturedImage(imageData);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Error in handleShare:", error);
    }
  };

  const handleSend = async () => {
    if (!isClient) return;
    
    try {
      const imageData = await captureTicket();
      setCapturedImage(imageData);
      setSendModalOpen(true);
    } catch (error) {
      console.error("Error in handleSend:", error);
    }
  };

  const generatePDF = async () => {
    if (!isClient || !ticketRef.current || !html2canvas || !jsPDF) {
      console.error("Cannot generate PDF: Missing dependencies");
      return;
    }
    
    try {
      const canvas = await html2canvas(ticketRef.current);
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297] // A4 size
      });
      
      // Calculate the width and height to fit the PDF while maintaining aspect ratio
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`lottery-ticket-${getTransCode(ticketData[0][0].created_date+" "+ticketData[0][0].created_time)+ticketData[0][0].id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            { fromPage === "My Bets" ? "Back to My Bets" : "Back to Game"}
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">My Bet Receipt</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Ticket Card */}
      <div ref={ticketRef}>
        {ticketData.map((bet) => (
        <Card className="w-full max-w-sm shadow-lg mt-4">
          <CardContent className="p-6 flex flex-col items-center">
            {/* Logo */}
            <div className="mb-6 mt-4">
              {/* <div className="font-bold text-4xl text-center">
                {bet.game_name}
                <div className="text-xs font-bold bg-black text-white px-2 text-center">LOTTO</div>
              </div> */}
              
              <div className="font-bold text-3xl text-center items-center justify-center ">
                <div className="mb-3">{bet.game_name}</div>
                
                <div className="flex items-center justify-center text-xs font-bold bg-black text-white text-align-center px-2 py-2 font-bold mt-2">LOTTO</div>
                
              </div>

              
            </div>

            {/* Ticket Details */}
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex">
                  <span>{bet.bets}</span>
                </div>
                <div className="flex justify-between items-start w-full text-sm">
                  <span className="mr-2">Ticket Price:</span>
                  <span>{formatPeso(bet.bet)}</span>
                </div>
                <div className="text-sm">
                  {bet.created_date} {bet.created_time}
                </div>
                {/* <div className="text-sm">{getTransCode(bet.created_date + " " + bet.created_time) + bet.id}</div> */}
              </div>
              <div className="space-y-1 text-right">
                <div>{bet.game_type_name} {formatPeso(bet.bet)}</div>
                <div> </div>
                <div className="text-sm">
                    {bet.draw_date} {bet.draw_time}
                </div>
                <div className="text-sm font-bold">
                    {bet.bakas_full_name}
                </div>
              </div>
            </div>

           {/* Barcode */}
            <div className="w-full my-4 flex flex-col items-center">
                 <Barcode value={getTransCode(bet.created_date + " " + bet.created_time) + bet.id} />
                {/* <div className="text-sm mt-2">
                  {getTransCode(bet.created_date + " " + bet.created_time) + bet.id}
                </div> */}
              </div>


          </CardContent>
        </Card>
        ))}



      </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 max-w-sm">
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={handleShare}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={handleSend}
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={generatePDF}
        >
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>

      {/* Action Buttons */}
      {/* <div className="w-full grid grid-cols-3 gap-2 mt-4 max-w-sm">
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={handleShare}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={handleSend}
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="default"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={generatePDF}
        >
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div> */}

      {/* Modals */}
      {isClient && (
        <>
          <ShareModal 
            open={shareModalOpen} 
            onOpenChange={setShareModalOpen} 
            imageData={capturedImage} 
          />
          
          <SendModal 
            open={sendModalOpen} 
            onOpenChange={setSendModalOpen} 
            imageData={capturedImage} 
          />
        </>
      )}
      <br/>
    </div>
  );
};

export default TicketReceipt;