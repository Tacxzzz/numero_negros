import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Send, FileDown } from "lucide-react";
import { ShareModal } from "@/components/ShareModal";
import { SendModal } from "@/components/SendModal";
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { addLog, getBetByID, getReceiptByID, getSavedBetByID, getSaveReceiptByID } from "@/lib/apiCalls";
import { formatPeso, getTransCode } from "@/lib/utils";
import Barcode from 'react-barcode';
import { useUser } from "./UserContext";

// Import html2canvas and jsPDF dynamically to avoid SSR issues
let html2canvas: any = null;
let jsPDF: any = null;

const TicketReceipt: React.FC = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const receiptID = location.state?.receiptID;
  const fromPage = location.state?.from;
  const isSavedBet = location.state?.isSavedBet;
  const ticketRef = useRef<HTMLDivElement>(null);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [sendModalOpen, setSendModalOpen] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const { setUserID,userID,deviceID } = useUser();

    useEffect(() => {
        const handleUpdate = async () => {
          if (!isSavedBet) {
            const gameBetData = await getReceiptByID(receiptID);
            console.log(gameBetData);
            setTicketData(gameBetData);
          }
          else {
            console.log(receiptID);
            const gameBetData = await getSaveReceiptByID(receiptID);
            console.log(gameBetData);
            setTicketData(gameBetData);
          }

          const addViewLog = await addLog(userID, "visited Bet Receipt");
          console.log(addViewLog.authenticated);
          };
          handleUpdate();
      }, [receiptID]);


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
      {ticketData.length > 0 ? (
        <div ref={ticketRef}>
          <Card className="w-full max-w-sm shadow-lg mt-4">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="font-bold text-xl text-center items-center justify-center">
                <div className="mb-1">{ticketData[0].game_name}</div>
                <div className="flex items-center justify-center text-xs font-bold bg-black text-white text-align-center font-bold">
                  LOTTO
                </div>
              </div>

              <div className="w-full grid">
                {ticketData.map((bet) => (
                  <React.Fragment key={bet.id}>
                    <div className="flex justify-between items-start w-full font-bold text-xl">
                      <span>{bet.bets}</span>
                      <span>{formatPeso(bet.bet)}</span>
                    </div>
                    <div className="flex justify-between items-start w-full text-l font-bold mb-1">
                      <span>Winnings: </span>
                      <span>{bet.bet_status === "success" ? formatPeso(bet.jackpot) : "S/O"}</span>
                    </div>
                  </React.Fragment>
                ))}

                <div className="flex justify-between items-start w-full text-l font-bold">
                  <span>Created: </span>
                  <span>
                    {ticketData[0].created_date} {ticketData[0].created_time}
                  </span>
                </div>
                <div className="flex justify-between items-start w-full text-l font-bold">
                  <span>Draw: </span>
                  <span>
                    {ticketData[0].draw_date} {ticketData[0].draw_time}
                  </span>
                </div>

                <div className="flex flex-col items-center mt-2 text-xl font-bold">
                  {getTransCode(
                    ticketData[0].created_date + " " + ticketData[0].created_time
                  ) + ticketData[0].receipt_id}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">Loading receipt...</div>
      )}

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