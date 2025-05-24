import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PisoGameViewCardProps {
  url: string;
  title?: string;
  height?: string; // e.g., "400px"
}

const PisoGameViewCard: React.FC<PisoGameViewCardProps> = ({ url, title, height = "200px" }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-none bg-white-400 overflow-hidden">
      {title && <div className="bg-white-400 px-4 py-2 text-lg font-bold text-blue-800">{title}</div>}
      <CardContent className="p-0 relative">
        <iframe
        src={url}
        title={title}
        style={{ width: '100%', height: height, border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        />
        <div className="absolute bottom-2 right-2">
          <Button size="sm" className="bg-blue-400 text-white font-bold rounded-none" 
          onClick={() => window.open(url, "_blank")}>
            Sign Up & Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PisoGameViewCard;