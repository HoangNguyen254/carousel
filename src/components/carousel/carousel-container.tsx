import { type PropsWithChildren } from "react";
import { useCarousel } from "./providers/CarouselProvider";
interface CarouselContainerProps {
  gap: number;
  offset: number;
}
export default function CarouselContainer({
  children,
  offset,
  gap,
}: PropsWithChildren<CarouselContainerProps>) {
  const { containerRef, wrapperRef, onMouseEnter, onMouseOut } = useCarousel();
  return (
    <div
      ref={wrapperRef}
      style={{
        maxWidth: "min(750px,100vw)",
        height: 300,
        width: "auto",
        overflow: "hidden",
      }}
      onMouseLeave={onMouseOut}
      onMouseEnter={onMouseEnter}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          transitionTimingFunction: "linear",
          transform: `translate3d(${-offset}px,0,0)`,
          gap: gap,
        }}
      >
        {children}
      </div>
    </div>
  );
}
