"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import { CAROUSEL_IMAGE_WIDTH } from "../constants";
import { debounce } from "lodash-es";

interface CarouselContextType {
  containerRef: RefObject<HTMLDivElement | null>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  currentPosX: number;
  currentIndex: number;
  offset: number;
  total: number;
  isSliding: boolean;
  cursorMode: CursorMode;
  boundingLeft?: number;
  gap?: number;
  currentPointerId?: number;
  setCursorMode: (status: CursorMode) => void;
  setCurrentPosX: (posX: number) => void;
  onMouseEnter: () => void;
  onMouseOut: () => void;
  setCurrentPointerId: (id?: number) => void;
  setCurrentIndex: (index: number) => void;
}
type CursorMode = "grabbing" | "grab";
const CarouselContext = createContext<CarouselContextType>({
  containerRef: { current: null },
  wrapperRef: { current: null },
  cursorMode: "grab",
  offset: 0,
  isSliding: false,
  currentPosX: 0,
  total: 0,
  currentIndex: 0,
  setCurrentPosX: () => {},
  setCursorMode: () => {},
  onMouseOut: () => {},
  onMouseEnter: () => {},
  setCurrentPointerId: () => {},
  setCurrentIndex: () => {},
});

export const useCarousel = () => useContext(CarouselContext);

interface CarouselProviderProps {
  offset: number;
  total: number;
  gap: number;
}

export const CarouselProvider = ({
  children,
  total,
  offset,
  gap,
}: PropsWithChildren<CarouselProviderProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorMode, setCursorMode] = useState<CursorMode>("grab");
  const [boundingLeft, setBoundingLeft] = useState(0);
  const [pointerId, setPointerId] = useState<number>();
  const [currentPosX, setCurrentPosX] = useState(-offset);
  const indexRef = useRef(0);
  const currentPosXRef = useRef<number>(-offset);
  const intervalId = useRef<number>(undefined);
  const handleSetCurrentPosX = (posX: number) => {
    setCurrentPosX(posX);
  };
  const handleSetCurrentIndex = (index: number) => {
    setCurrentIndex(index);
  };
  const handleSetPointerId = (id?: number) => {
    setPointerId(id);
  };
  const handleMouseEnter = () => {
    if (intervalId.current === undefined) return;
    clearInterval(intervalId.current);
    intervalId.current = undefined;
  };
  const handleMouseOut = () => {
    if (intervalId.current !== undefined) return;
    // clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      handleAutoNextSlide();
    }, 3000);
  };
  const handleAutoNextSlide = () => {
    setIsSliding(true);
    const imageWidth = CAROUSEL_IMAGE_WIDTH;
    const newIndex = indexRef.current + 1;
    setCurrentIndex(newIndex);
    setCurrentPosX(currentPosXRef.current - (imageWidth + gap));
    containerRef.current!.style.transition = `transform 500ms`;
    containerRef.current!.style.transform = `translate3d(${currentPosXRef.current - (imageWidth + gap)}px,0,0)`;
    setTimeout(() => {
      containerRef.current!.style.transition = "";
      if (indexRef.current - total === 0) {
        const newPosx = -offset;
        containerRef.current!.style.transform = `translate3d(${newPosx}px,0,0)`;
        setCurrentIndex(0);
        setCurrentPosX(newPosx);
      }
      setIsSliding(false);
    }, 500);
  };
  const handleWindowResize = () => {
    if (!wrapperRef.current) return;
    const { x } = wrapperRef.current.getBoundingClientRect();
    setBoundingLeft(x);
  };
  const handleSetCursorMode = (status: CursorMode) => {
    setCursorMode(status);
  };
  useEffect(() => {
    indexRef.current = currentIndex;
    currentPosXRef.current = currentPosX;
  }, [currentIndex, currentPosX]);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const { x } = wrapperRef.current.getBoundingClientRect();
    setBoundingLeft(x);
  }, []);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const { x } = wrapperRef.current.getBoundingClientRect();
    setBoundingLeft(x);
    window.addEventListener("resize", debounce(handleWindowResize, 100));
    intervalId.current = setInterval(() => {
      handleAutoNextSlide();
    }, 3000);
    return () => {
      clearInterval(intervalId.current);
      window.removeEventListener("resize", debounce(handleWindowResize, 100));
    };
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        containerRef,
        currentIndex,
        isSliding,
        total,
        cursorMode,
        gap,
        offset,
        wrapperRef,
        currentPointerId: pointerId,
        currentPosX: currentPosX,
        boundingLeft: boundingLeft,
        setCurrentPosX: handleSetCurrentPosX,
        setCursorMode: handleSetCursorMode,
        onMouseEnter: handleMouseEnter,
        onMouseOut: handleMouseOut,
        setCurrentPointerId: handleSetPointerId,
        setCurrentIndex: handleSetCurrentIndex,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
