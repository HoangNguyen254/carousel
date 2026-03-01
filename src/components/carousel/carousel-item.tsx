import { useRef, type PropsWithChildren } from "react";
import { useCarousel } from "./providers/CarouselProvider";
import { CAROUSEL_IMAGE_WIDTH } from "./constants";

interface CarouselItemProps {
  onClick?: VoidFunction;
}
export default function CarouselItem({
  children,
  onClick,
}: PropsWithChildren<CarouselItemProps>) {
  const {
    containerRef,
    currentPosX,
    total,
    offset,
    gap = 10,
    currentIndex,
    boundingLeft,
    currentPointerId,
    setCurrentIndex,
    setCurrentPointerId,
    setCurrentPosX,
  } = useCarousel();
  const startPosX = useRef<number>(null);
  const isDragging = useRef(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    const pointerId = e.pointerId;
    if (currentPointerId && currentPointerId !== pointerId) return;
    e.currentTarget.setPointerCapture(pointerId);
    setCurrentPointerId(pointerId);
    startPosX.current = e.clientX;
    isDragging.current = true;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    const pointerId = e.pointerId;
    const x = e.clientX;
    if (startPosX.current === null || !isDragging.current) {
      e.currentTarget.releasePointerCapture(pointerId);
      return;
    }
    if (
      boundingLeft !== undefined &&
      (x < boundingLeft || x > boundingLeft + containerRef.current!.clientWidth)
    ) {
      e.currentTarget.releasePointerCapture(pointerId);
      handlePointerUp(e);
      return;
      //   const newPosX = startPosX.current! - e.clientX;
      //   setCurrentPosX(currentPosX - newPosX);
      //   setCurrentPointerId(undefined);
      //   startPosX.current = null;
      //   return;
    }
    if (currentPointerId && currentPointerId !== pointerId) return;
    const newPosX = startPosX.current! - x;
    containerRef.current!.style.transform = `translate3d(${currentPosX - newPosX}px,0,0)`;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    const newPosX = Math.abs(startPosX.current! - e.clientX);
    if (newPosX <= 5) {
      onClick?.();
      return;
    }
    const imageWidth = CAROUSEL_IMAGE_WIDTH;
    if (newPosX < 40 && newPosX > 5) {
      containerRef.current!.style.transition = `transform 500ms`;
      containerRef.current!.style.transform = `translate3d(${currentPosX}px,0,0)`;
    } else if (newPosX >= 40) {
      if (startPosX.current! > e.clientX) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        setCurrentPosX(currentPosX - (imageWidth + gap));
        containerRef.current!.style.transition = `transform 500ms`;
        containerRef.current!.style.transform = `translate3d(${currentPosX - (imageWidth + gap)}px,0,0)`;
      } else {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        setCurrentPosX(currentPosX + (imageWidth + gap));
        containerRef.current!.style.transition = `transform 500ms`;
        containerRef.current!.style.transform = `translate3d(${currentPosX + (imageWidth + gap)}px,0,0)`;
      }
    }
    setTimeout(() => {
      containerRef.current!.style.transition = "";
      if (currentIndex - 1 === -2) {
        const newPosx = -offset - (total - 2) * imageWidth - (total - 2) * gap;
        containerRef.current!.style.transform = `translate3d(${newPosx}px,0,0)`;
        setCurrentIndex(total - 2);
        setCurrentPosX(newPosx);
      } else if (currentIndex + 1 - total === 0) {
        const newPosx = -offset;
        containerRef.current!.style.transform = `translate3d(${newPosx}px,0,0)`;
        setCurrentIndex(0);
        setCurrentPosX(newPosx);
      }
    }, 500);
    setCurrentPointerId(undefined);
    startPosX.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  return (
    <span
      style={{
        width: 300,
        flex: "none",
        height: 300,
        position: "relative",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {children}
    </span>
  );
}
