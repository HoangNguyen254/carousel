import { CarouselProvider } from "./providers/CarouselProvider";
import CarouselContainer from "./carousel-container";
import { useMemo } from "react";

interface CarouselProps {
  children: React.ReactNode[];
  gap?: number;
}
export default function Carousel({ children, gap = 10 }: CarouselProps) {
  const { cloneEnd, cloneStart, offset } = useMemo(() => {
    if (children.length < 3) return { cloneEnd: [], cloneStart: [], offset: 0 };
    const cloneStart = children.slice(0, 3);
    const cloneEnd = children.slice(-2);
    return {
      cloneStart,
      cloneEnd,
      offset: cloneEnd.length * 300 + gap * cloneEnd.length,
    };
  }, []);
  return (
    <CarouselProvider offset={offset} total={children.length} gap={gap}>
      <CarouselContainer gap={gap} offset={offset}>
        {cloneEnd}
        {children}
        {cloneStart}
      </CarouselContainer>
    </CarouselProvider>
  );
}
