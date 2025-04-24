import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { LiveStream } from "./LiveStream";
import { VideoAdPlayer } from "./VideoAdPlayer";
import { YouTubeEmbed } from "./YouTubeEmbed";

type CarouselSlide =
  | { type: "live"; stream: any }
  | { type: "ad"; adContent?: React.ReactNode };

interface DashboardCarouselProps {
  slides: CarouselSlide[];
}

export function DashboardCarousel({ slides }: DashboardCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <div>
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, idx) => (
          <div className="keen-slider__slide" key={idx}>
            {slide.type === "live" && <LiveStream stream={slide.stream} />}
            {slide.type === "ad" && 
              (slide.adContent ? slide.adContent : <VideoAdPlayer />)}
          </div>
        ))}
      </div>
      {/* Dot indicators based on actual slide count */}
      <div className="flex justify-center mt-2 space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => {
              if (instanceRef.current) {
                instanceRef.current.moveToIdx(idx);
              }
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
