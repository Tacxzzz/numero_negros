import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScatterViewCardProps {
  url: string;
  img: string;
  title?: string;
  height?: string; // e.g., "400px"
}

const ScatterViewCard: React.FC<ScatterViewCardProps> = ({ url, img, title, height = "200px" }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-none bg-gray-800 overflow-hidden">
      {title && <div className="bg-gray-800 px-4 py-2 text-lg font-bold text-yellow-400">{title}</div>}
      <CardContent className="p-0 relative">
        <img
          src={img}
          alt={title || "Card Image"}
          className="w-full h-full object-fit"
          style={{ height }}
        />
        <div className="absolute bottom-2 right-2">
          <Button size="sm" className="bg-gray-800 text-yellow-400 font-bold rounded-none" 
          onClick={() => window.open(url, "_blank")}>
            Sign Up & Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScatterViewCard;