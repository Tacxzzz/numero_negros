import { Button } from '@/components/ui/button';

type LiveStreamProps = {
  stream: {
    id: number;
    title: string;
    live: boolean;
    viewers: number;
    streamer: string;
    image: string;
  };
};

export function LiveStream({ stream }: LiveStreamProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
      <iframe
        src={stream.image}
        title={stream.title}
        className="w-full h-48 object-cover"
        allowFullScreen
      ></iframe>
        
        {stream.live && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
          LIVE
        </div>)}
        
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
          {stream.viewers.toLocaleString()} {stream.live ? "viewers" : "watched this"}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-bold text-white text-lg">{stream.title}</h3>
          <p className="text-white/80 text-sm">by {stream.streamer}</p>
        </div>
      </div>
      
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            {stream.streamer.charAt(0)}
          </div>
          <span className="ml-2 text-sm font-medium">{stream.streamer}</span>
        </div>
        
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          Watch
        </Button>
      </div>
    </div>
  );
}