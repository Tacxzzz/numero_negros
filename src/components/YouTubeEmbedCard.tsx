import { Button } from '@/components/ui/button';

type YouTubeEmbedCardProps = {
  videoId: string;
  title: string;
};

export function YouTubeEmbedCard({ videoId, title }: YouTubeEmbedCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="w-full h-48 object-cover"
          allowFullScreen
        ></iframe>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-bold text-white text-lg">{title}</h3>
        </div>
      </div>
      <div className="p-3 flex justify-end">
        <Button
          size="sm"
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          asChild
        >
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch
          </a>
        </Button>
      </div>
    </div>
  );
}

export default YouTubeEmbedCard;